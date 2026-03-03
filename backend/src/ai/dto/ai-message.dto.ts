import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';
import { AI_MESSAGE_ROLES } from '../ai.constants';

export class AiMessageDto {
  @ApiProperty({
    enum: AI_MESSAGE_ROLES,
    description: 'Роль сообщения в чате',
    example: 'user',
  })
  @IsString()
  @IsIn(AI_MESSAGE_ROLES)
  role: 'user' | 'assistant';

  @ApiProperty({
    description: 'Текст сообщения',
    example: 'Помоги составить план публикаций на неделю',
    maxLength: 4000,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  content: string;
}
