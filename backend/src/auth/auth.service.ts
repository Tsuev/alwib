import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { MailerService } from './mailer.service';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';

const OTP_EXPIRATION_MINUTES = 10;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  private async generateAndSendOtp(userId: number, email: string) {
    const code = this.generateOtpCode();
    const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000);

    await this.prisma.emailOtp.create({
      data: {
        userId,
        code,
        expiresAt,
      },
    });

    try {
      await this.mailerService.sendOtpEmail(email, code);
    } catch {
      throw new ServiceUnavailableException(
        'Не удалось отправить OTP письмо. Проверьте SMTP настройки и попробуйте снова.',
      );
    }
  }

  private generateOtpCode() {
    return String(randomInt(100000, 999999));
  }

  private signToken(user: { id: number; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  private mapUser(user: {
    id: number;
    email: string;
    role: string;
    createdAt: Date;
  }) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // Проверяем, существует ли пользователь
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.emailVerified) {
        throw new ConflictException('Пользователь с таким email уже существует');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedUser = await this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
        },
      });

      await this.prisma.emailOtp.deleteMany({
        where: { userId: existingUser.id },
      });

      await this.generateAndSendOtp(existingUser.id, existingUser.email);

      return {
        message:
          'Аккаунт уже создан, но не подтвержден. Новый код отправлен на почту',
        user: this.mapUser(updatedUser),
      };
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        emailVerified: false,
      },
    });

    await this.generateAndSendOtp(user.id, user.email);

    return {
      message: 'Код подтверждения отправлен на почту',
      user: this.mapUser(user),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Находим пользователя
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    if (!user.emailVerified) {
      throw new ForbiddenException('Подтвердите почту перед входом');
    }

    const token = this.signToken(user);

    return {
      user: this.mapUser(user),
      token,
    };
  }

  async requestOtp(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    await this.generateAndSendOtp(user.id, user.email);

    return {
      message: 'Код подтверждения отправлен на почту',
    };
  }

  async verifyOtp(email: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const latestOtp = await this.prisma.emailOtp.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!latestOtp) {
      throw new UnauthorizedException('Код подтверждения не найден');
    }

    if (latestOtp.expiresAt < new Date()) {
      throw new UnauthorizedException('Код подтверждения истек');
    }

    if (latestOtp.code !== code) {
      throw new UnauthorizedException('Неверный код подтверждения');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    await this.prisma.emailOtp.deleteMany({
      where: { userId: user.id },
    });

    const token = this.signToken(user);

    return {
      user: this.mapUser(user),
      token,
    };
  }

  async validateGoogleUser(userData: {
    email: string;
    googleId: string;
    name: string;
  }) {
    const { email, googleId, name } = userData;

    if (!email) {
      throw new UnauthorizedException('Google не вернул email');
    }

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const tempPassword = await bcrypt.hash(
        String(randomInt(100000, 999999)),
        10,
      );
      user = await this.prisma.user.create({
        data: {
          email,
          password: tempPassword,
          googleId,
          name,
          emailVerified: true,
        },
      });
    } else if (user.googleId && user.googleId !== googleId) {
      throw new UnauthorizedException(
        'Email уже связан с другим Google аккаунтом',
      );
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId, name, emailVerified: true },
      });
    }

    return user;
  }

  async loginWithUser(user: { id: number; email: string; role: string }) {
    const token = this.signToken(user);
    const profile = await this.validateUser(user.id);

    return {
      user: profile,
      token,
    };
  }

  async validateUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    return {
      ...this.mapUser(user),
    };
  }
}
