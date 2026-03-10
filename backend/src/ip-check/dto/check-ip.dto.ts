import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CheckIpDto {
  @ApiProperty({
    description: 'IP-адрес или доменное имя для проверки',
    example: '9.9.9.9',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(253)
  query: string;
}
