import { Module } from '@nestjs/common';
import { IpCheckController } from './ip-check.controller';
import { IpCheckService } from './ip-check.service';

@Module({
  controllers: [IpCheckController],
  providers: [IpCheckService],
})
export class IpCheckModule {}
