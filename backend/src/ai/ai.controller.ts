import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';
import { RespondAiDto } from './dto/respond-ai.dto';
import { SavePinnedChatDto } from './dto/save-pinned-chat.dto';

type RequestUser = {
  id: number;
  email: string;
};

@ApiTags('ai')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('pinned-chats')
  @ApiOperation({ summary: 'Получить закрепленные AI-чаты пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Список закрепленных чатов получен',
  })
  getPinnedChats(@Req() req: Request) {
    const user = this.getRequestUser(req);
    return this.aiService.getPinnedChats(user.id);
  }

  @Put('pinned-chats/:chatId')
  @ApiOperation({
    summary: 'Создать или обновить закрепленный чат пользователя',
  })
  @ApiResponse({
    status: 200,
    description: 'Закрепленный чат успешно сохранен',
  })
  savePinnedChat(
    @Req() req: Request,
    @Param('chatId') chatId: string,
    @Body() payload: SavePinnedChatDto,
  ) {
    const user = this.getRequestUser(req);
    return this.aiService.savePinnedChat(user.id, chatId, payload);
  }

  @Delete('pinned-chats/:chatId')
  @ApiOperation({ summary: 'Удалить закрепленный чат пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Закрепленный чат удален (если существовал)',
  })
  deletePinnedChat(@Req() req: Request, @Param('chatId') chatId: string) {
    const user = this.getRequestUser(req);
    return this.aiService.deletePinnedChat(user.id, chatId);
  }

  @Put('respond')
  @ApiOperation({ summary: 'Получить ответ AI-ассистента через DeepSeek' })
  @ApiResponse({
    status: 200,
    description: 'Ответ ассистента успешно получен',
  })
  respond(@Body() payload: RespondAiDto) {
    return this.aiService.respond(payload.agent, payload.messages);
  }

  private getRequestUser(req: Request): RequestUser {
    if (typeof req.user === 'object' && req.user !== null) {
      const user = req.user as Partial<RequestUser>;
      if (typeof user.id === 'number' && typeof user.email === 'string') {
        return {
          id: user.id,
          email: user.email,
        };
      }
    }

    throw new UnauthorizedException('Некорректный авторизованный пользователь');
  }
}
