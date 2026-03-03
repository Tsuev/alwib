import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { DownloaderModule } from './downloader/downloader.module';
import { VpnModule } from './vpn/vpn.module';

@Module({
  imports: [AuthModule, VpnModule, DownloaderModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
