import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpsertStoreDto {
  @ApiPropertyOptional({ maxLength: 10, description: 'Название магазина' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  name?: string;

  @ApiPropertyOptional({ description: 'URL логотипа' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({
    description: 'Номер WhatsApp (без +, например 79001234567)',
  })
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiPropertyOptional({
    description: 'Telegram username (без @, например myshop)',
  })
  @IsOptional()
  @IsString()
  telegram?: string;
}
