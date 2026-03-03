import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AI_AGENT_VALUES } from '../ai.constants';
import { AiMessageDto } from './ai-message.dto';

export class RespondAiDto {
  @ApiProperty({
    enum: AI_AGENT_VALUES,
    description: 'Выбранная роль ассистента',
    example: 'code',
  })
  @IsString()
  @IsIn(AI_AGENT_VALUES)
  agent: (typeof AI_AGENT_VALUES)[number];

  @ApiProperty({
    description: 'История сообщений для контекста ответа',
    type: [AiMessageDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(80)
  @ValidateNested({ each: true })
  @Type(() => AiMessageDto)
  messages: AiMessageDto[];

  @ApiProperty({
    description: 'Идентификатор чата на клиенте',
    example: 'f8d4a1a3-8f6a-4e6c-b329-8fdb5632a56b',
    maxLength: 120,
  })
  @IsString()
  @MaxLength(120)
  chatId: string;
}
