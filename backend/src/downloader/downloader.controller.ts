import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestDownloadDto } from './dto/request-download.dto';
import { DownloaderService } from './downloader.service';

@ApiTags('downloader')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('downloader')
export class DownloaderController {
  constructor(private readonly downloaderService: DownloaderService) {}

  @Post('request')
  @ApiOperation({
    summary: 'Запросить скачивание контента через Media Roller',
  })
  @ApiResponse({
    status: 201,
    description: 'Ссылка для скачивания успешно создана',
  })
  requestDownload(@Body() dto: RequestDownloadDto) {
    return this.downloaderService.requestDownload(dto.url);
  }

  @Get('file/:token')
  @ApiOperation({
    summary: 'Скачать ранее подготовленный файл',
  })
  @ApiResponse({
    status: 200,
    description: 'Файл успешно отдан',
  })
  downloadFile(@Param('token') token: string): StreamableFile {
    const file = this.downloaderService.getDownloadFile(token);
    return new StreamableFile(file.stream, {
      type: file.mimeType,
      disposition: `attachment; filename="${file.fileName}"`,
    });
  }
}
