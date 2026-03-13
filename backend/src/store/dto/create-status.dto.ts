import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, MaxLength } from 'class-validator';

const ALLOWED_SEVERITIES = [
  'success',
  'info',
  'warn',
  'danger',
  'secondary',
  'contrast',
] as const;

export type BadgeSeverity = (typeof ALLOWED_SEVERITIES)[number];

export class CreateStatusDto {
  @ApiProperty({ maxLength: 30, description: 'Название статуса' })
  @IsString()
  @MaxLength(30)
  label: string;

  @ApiProperty({
    enum: ALLOWED_SEVERITIES,
    description: 'Цвет статуса (PrimeVue Badge severity)',
  })
  @IsString()
  @IsIn(ALLOWED_SEVERITIES)
  severity: BadgeSeverity;
}
