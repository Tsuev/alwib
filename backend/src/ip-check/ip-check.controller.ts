import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CheckIpDto } from './dto/check-ip.dto';
import { IpCheckService } from './ip-check.service';

@ApiTags('ip-check')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('ip-check')
export class IpCheckController {
  constructor(private readonly ipCheckService: IpCheckService) {}

  @Post('lookup')
  @ApiOperation({ summary: 'Получить информацию по IP-адресу или домену' })
  @ApiResponse({
    status: 201,
    description: 'Информация по IP успешно получена',
  })
  lookup(@Body() dto: CheckIpDto) {
    return this.ipCheckService.lookup(dto.query);
  }
}
