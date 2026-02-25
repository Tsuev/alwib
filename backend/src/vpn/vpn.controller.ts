import {
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VpnService } from './vpn.service';

type RequestUser = {
  id: number;
  email: string;
};

@ApiTags('vpn')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('vpn')
export class VpnController {
  constructor(private readonly vpnService: VpnService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Получить VPN данные текущего пользователя',
    description:
      'Возвращает VPN ключ, трафик, статус подключения, статус доступа и trial-статус.',
  })
  @ApiResponse({
    status: 200,
    description: 'VPN данные получены успешно',
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизованный доступ',
  })
  getMyVpnData(@Req() req: Request) {
    const user = this.getRequestUser(req);
    return this.vpnService.getOverviewByUserId(user.id);
  }

  @Post('trial')
  @ApiOperation({
    summary: 'Запросить пробный VPN ключ',
    description:
      'Создает пробный ключ на 3 дня для текущего пользователя. Доступно только один раз.',
  })
  @ApiResponse({
    status: 201,
    description: 'Пробный ключ успешно создан или обнаружен существующий ключ',
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизованный доступ',
  })
  @ApiResponse({
    status: 409,
    description: 'Пробный ключ уже был выдан ранее',
  })
  claimTrial(@Req() req: Request) {
    const user = this.getRequestUser(req);
    return this.vpnService.claimTrialByUserId(user.id);
  }

  private getRequestUser(req: Request): RequestUser {
    if (typeof req.user === 'object' && req.user !== null) {
      const user = req.user as Partial<RequestUser>;
      if (typeof user.id === 'number' && typeof user.email === 'string') {
        return {
          id: user.id,
          email: user.email,
        };
      }
    }

    throw new UnauthorizedException('Некорректный авторизованный пользователь');
  }
}
