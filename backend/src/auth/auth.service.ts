import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { MailerService } from './mailer.service';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';

const SUPERUSER_EMAIL = 'tsuev@alwib.ru';
const SUPERUSER_PASSWORD = '0000';
const SUPERUSER_OTP = '0000';
const OTP_EXPIRATION_MINUTES = 10;

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async onModuleInit() {
    await this.ensureSuperUser();
  }

  private async ensureSuperUser() {
    const existing = await this.prisma.user.findUnique({
      where: { email: SUPERUSER_EMAIL },
    });

    if (existing) {
      return;
    }

    const hashedPassword = await bcrypt.hash(SUPERUSER_PASSWORD, 10);

    await this.prisma.user.create({
      data: {
        email: SUPERUSER_EMAIL,
        password: hashedPassword,
        role: 'superuser',
        emailVerified: true,
      },
    });
  }

  private async generateAndSendOtp(userId: number, email: string) {
    const code = email === SUPERUSER_EMAIL ? SUPERUSER_OTP : this.generateOtpCode();
    const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000);

    await this.prisma.emailOtp.create({
      data: {
        userId,
        code,
        expiresAt,
      },
    });

    await this.mailerService.sendOtpEmail(email, code);
  }

  private generateOtpCode() {
    return String(randomInt(100000, 999999));
  }

  private signToken(user: { id: number; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // Проверяем, существует ли пользователь
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
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
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
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
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
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

    if (email === SUPERUSER_EMAIL && code === SUPERUSER_OTP) {
      const token = this.signToken(user);
      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        token,
      };
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
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async validateGoogleUser(userData: { email: string; googleId: string; name: string }) {
    const { email, googleId, name } = userData;

    if (!email) {
      throw new UnauthorizedException('Google не вернул email');
    }

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const tempPassword = await bcrypt.hash(String(randomInt(100000, 999999)), 10);
      user = await this.prisma.user.create({
        data: {
          email,
          password: tempPassword,
          googleId,
          name,
          emailVerified: true,
        },
      });
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

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
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
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
