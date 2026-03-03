import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AI_AGENT_VALUES } from '../ai.constants';
import { AiMessageDto } from './ai-message.dto';

export class SavePinnedChatDto {
  @ApiProperty({
    enum: AI_AGENT_VALUES,
    description: 'Роль ассистента для закрепленного чата',
    example: 'marketing',
  })
  @IsString()
  @IsIn(AI_AGENT_VALUES)
  agent: (typeof AI_AGENT_VALUES)[number];

  @ApiProperty({
    description: 'Флаг блокировки выбора роли после первого сообщения',
    example: true,
  })
  @IsBoolean()
  roleLocked: boolean;

  @ApiProperty({
    description: 'Сообщения закрепленного чата',
    type: [AiMessageDto],
  })
  @IsArray()
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => AiMessageDto)
  messages: AiMessageDto[];

  @ApiProperty({
    description: 'Текущее значение поля ввода чата',
    example: '',
    maxLength: 1000,
  })
  @IsString()
  @MaxLength(1000)
  input: string;
}
