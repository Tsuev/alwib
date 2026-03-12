import { Module } from '@nestjs/common';
import { StorefrontController } from './storefront.controller';
import { StorefrontService } from './storefront.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [StorefrontController],
  providers: [StorefrontService, PrismaService],
})
export class StorefrontModule {}
