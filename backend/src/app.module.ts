import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { DownloaderModule } from './downloader/downloader.module';
import { VpnModule } from './vpn/vpn.module';
import { IpCheckModule } from './ip-check/ip-check.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 60,
      },
    ]),
    AuthModule,
    VpnModule,
    DownloaderModule,
    AiModule,
    IpCheckModule,
    StoreModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
