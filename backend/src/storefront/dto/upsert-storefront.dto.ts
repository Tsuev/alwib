import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpsertStorefrontDto {
  @ApiPropertyOptional({ maxLength: 10, description: 'Название магазина' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  name?: string;

  @ApiPropertyOptional({ description: 'URL логотипа' })
  @IsOptional()
  @IsString()
  logoUrl?: string;
}
