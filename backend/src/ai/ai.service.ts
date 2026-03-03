import {
  BadGatewayException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AI_SYSTEM_PROMPTS,
  type AiAgentValue,
  type AiMessageRole,
} from './ai.constants';
import { type AiMessageDto } from './dto/ai-message.dto';
import { type SavePinnedChatDto } from './dto/save-pinned-chat.dto';

type DeepSeekMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

type PinnedChatResponse = {
  id: string;
  agent: AiAgentValue;
  roleLocked: boolean;
  input: string;
  pinned: true;
  createdAt: string;
  updatedAt: string;
  messages: Array<{
    id: string;
    role: AiMessageRole;
    content: string;
    createdAt: string;
  }>;
};

@Injectable()
export class AiService {
  private readonly deepSeekApiKey = process.env.DEEPSEEK_API_KEY || '';
  private readonly deepSeekBaseUrl =
    process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
  private readonly deepSeekModel =
    process.env.DEEPSEEK_MODEL || 'deepseek-chat';

  constructor(private readonly prisma: PrismaService) {}

  async getPinnedChats(userId: number): Promise<PinnedChatResponse[]> {
    const chats = await this.prisma.aiPinnedChat.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        },
      },
      orderBy: [{ updatedAt: 'desc' }],
    });

    return chats.map((chat) => ({
      id: chat.id,
      agent: chat.agent as AiAgentValue,
      roleLocked: chat.roleLocked,
      input: chat.input,
      pinned: true,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
      messages: chat.messages.map((message) => ({
        id: message.id,
        role: message.role as AiMessageRole,
        content: message.content,
        createdAt: message.createdAt.toISOString(),
      })),
    }));
  }

  async savePinnedChat(
    userId: number,
    chatId: string,
    payload: SavePinnedChatDto,
  ): Promise<PinnedChatResponse> {
    const existingChat = await this.prisma.aiPinnedChat.findUnique({
      where: { id: chatId },
      select: { userId: true },
    });

    if (existingChat && existingChat.userId !== userId) {
      throw new ForbiddenException('Чат принадлежит другому пользователю');
    }

    const savedChat = await this.prisma.$transaction(async (tx) => {
      const chat = await tx.aiPinnedChat.upsert({
        where: { id: chatId },
        create: {
          id: chatId,
          userId,
          agent: payload.agent,
          roleLocked: payload.roleLocked,
          input: payload.input,
        },
        update: {
          agent: payload.agent,
          roleLocked: payload.roleLocked,
          input: payload.input,
        },
      });

      await tx.aiPinnedMessage.deleteMany({
        where: { chatId },
      });

      if (payload.messages.length > 0) {
        await tx.aiPinnedMessage.createMany({
          data: payload.messages.map((message, index) => ({
            chatId,
            role: message.role,
            content: message.content,
            order: index,
          })),
        });
      }

      return chat;
    });

    const chatWithMessages = await this.prisma.aiPinnedChat.findUnique({
      where: { id: savedChat.id },
      include: {
        messages: {
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        },
      },
    });

    if (!chatWithMessages) {
      throw new InternalServerErrorException(
        'Не удалось сохранить закрепленный чат',
      );
    }

    return {
      id: chatWithMessages.id,
      agent: chatWithMessages.agent as AiAgentValue,
      roleLocked: chatWithMessages.roleLocked,
      input: chatWithMessages.input,
      pinned: true,
      createdAt: chatWithMessages.createdAt.toISOString(),
      updatedAt: chatWithMessages.updatedAt.toISOString(),
      messages: chatWithMessages.messages.map((message) => ({
        id: message.id,
        role: message.role as AiMessageRole,
        content: message.content,
        createdAt: message.createdAt.toISOString(),
      })),
    };
  }

  async deletePinnedChat(
    userId: number,
    chatId: string,
  ): Promise<{ deleted: boolean }> {
    const deleted = await this.prisma.aiPinnedChat.deleteMany({
      where: {
        id: chatId,
        userId,
      },
    });

    return { deleted: deleted.count > 0 };
  }

  async respond(
    agent: AiAgentValue,
    messages: AiMessageDto[],
  ): Promise<{ answer: string }> {
    if (!this.deepSeekApiKey) {
      throw new ServiceUnavailableException(
        'Не настроена переменная DEEPSEEK_API_KEY',
      );
    }

    const systemPrompt = AI_SYSTEM_PROMPTS[agent];
    if (!systemPrompt) {
      throw new BadGatewayException('Неизвестная роль ассистента');
    }

    const historyMessages: DeepSeekMessage[] = messages
      .filter(
        (message) => message.role === 'user' || message.role === 'assistant',
      )
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    if (historyMessages.length === 0) {
      throw new BadGatewayException('Пустая история сообщений');
    }

    const payload = {
      model: this.deepSeekModel,
      messages: [
        {
          role: 'system' as const,
          content: systemPrompt,
        },
        ...historyMessages,
      ],
      temperature: 0.3,
      stream: false,
    };

    const endpoint = new URL(
      '/chat/completions',
      this.deepSeekBaseUrl,
    ).toString();

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.deepSeekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(45_000),
    });

    const data = (await response.json()) as DeepSeekResponse;

    if (!response.ok) {
      throw new BadGatewayException(
        data.error?.message || 'Ошибка при обращении к DeepSeek API',
      );
    }

    const answer = data.choices?.[0]?.message?.content?.trim();
    if (!answer) {
      throw new BadGatewayException('DeepSeek вернул пустой ответ');
    }

    return { answer };
  }
}
