import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ maxLength: 30, description: 'Название товара' })
  @IsString()
  @MaxLength(30)
  name: string;

  @ApiPropertyOptional({ maxLength: 100, description: 'Описание товара' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  description?: string;

  @ApiProperty({ description: 'Цена в рублях', minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'URL изображения товара' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'ID статуса' })
  @IsOptional()
  @IsInt()
  statusId?: number;
}
