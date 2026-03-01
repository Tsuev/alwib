import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class RequestDownloadDto {
  @ApiProperty({
    description: 'Ссылка на контент для скачивания',
    example: 'https://www.instagram.com/reel/ABC123/',
  })
  @IsString()
  @IsUrl(
    {
      require_protocol: true,
    },
    { message: 'Некорректная ссылка для скачивания' },
  )
  url: string;
}
