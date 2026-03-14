import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  RequestOtpDto,
  VerifyOtpDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';

@ApiTags('auth')
@Throttle({ default: { ttl: 60000, limit: 5 } })
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private getOAuthUser(user: unknown): {
    id: number;
    email: string;
    role: string;
  } {
    if (typeof user === 'object' && user !== null) {
      const oauthUser = user as {
        id?: unknown;
        email?: unknown;
        role?: unknown;
      };

      if (
        typeof oauthUser.id === 'number' &&
        typeof oauthUser.email === 'string' &&
        typeof oauthUser.role === 'string'
      ) {
        return {
          id: oauthUser.id,
          email: oauthUser.email,
          role: oauthUser.role,
        };
      }
    }

    throw new UnauthorizedException('Некорректный профиль OAuth пользователя');
  }

  private getAuthCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
  }

  private getClearCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Код подтверждения отправлен на почту',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'user@example.com' },
            role: { type: 'string', example: 'user' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные или пользователь уже существует',
  })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отправить OTP код на почту' })
  @ApiResponse({
    status: 200,
    description: 'Код отправлен',
  })
  @ApiBody({ type: RequestOtpDto })
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.authService.requestOtp(requestOtpDto.email);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Подтвердить OTP код' })
  @ApiResponse({
    status: 200,
    description: 'Код подтвержден, вход выполнен',
  })
  @ApiBody({ type: VerifyOtpDto })
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.verifyOtp(
      verifyOtpDto.email,
      verifyOtpDto.code,
    );

    res.cookie('token', result.token, this.getAuthCookieOptions());

    return {
      message: 'Почта подтверждена',
      user: result.user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({
    status: 200,
    description: 'Вход выполнен успешно',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Вход выполнен успешно' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'user@example.com' },
            role: { type: 'string', example: 'user' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неверные учетные данные',
  })
  @ApiBody({ type: LoginDto })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    res.cookie('token', result.token, this.getAuthCookieOptions());

    return {
      message: 'Вход выполнен успешно',
      user: result.user,
    };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth' })
  googleAuth() {
    return;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const oauthUser = this.getOAuthUser(req.user);
    const result = await this.authService.loginWithUser(oauthUser);

    res.cookie('token', result.token, this.getAuthCookieOptions());

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl =
      process.env.FRONTEND_OAUTH_REDIRECT_URL || `${frontendUrl}/auth`;
    return res.redirect(redirectUrl);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Выход из системы' })
  @ApiResponse({
    status: 200,
    description: 'Выход выполнен успешно',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Выход выполнен успешно' },
      },
    },
  })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', this.getClearCookieOptions());

    return {
      message: 'Выход выполнен успешно',
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Профиль пользователя получен успешно',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'user@example.com' },
            role: { type: 'string', example: 'user' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизованный доступ',
  })
  getProfile(@Req() req: Request) {
    return {
      user: req.user,
    };
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Проверить валидность токена' })
  @ApiResponse({
    status: 200,
    description: 'Токен валиден',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean', example: true },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'user@example.com' },
            role: { type: 'string', example: 'user' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизованный доступ',
  })
  verify(@Req() req: Request) {
    return {
      valid: true,
      user: req.user,
    };
  }
}
