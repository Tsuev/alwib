import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { VpnModule } from './vpn/vpn.module';

@Module({
  imports: [AuthModule, VpnModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
