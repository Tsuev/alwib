import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertStorefrontDto } from './dto/upsert-storefront.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateStatusDto } from './dto/create-status.dto';

const PRODUCT_LIMIT = 50;
const STATUS_LIMIT = 10;

@Injectable()
export class StorefrontService {
  constructor(private readonly prisma: PrismaService) {}

  async getStorefront(userId: number) {
    return this.prisma.storefront.findUnique({
      where: { userId },
      include: {
        products: {
          include: { status: true },
          orderBy: { createdAt: 'asc' },
        },
        statuses: { orderBy: { id: 'asc' } },
      },
    });
  }

  async upsertStorefront(userId: number, dto: UpsertStorefrontDto) {
    return this.prisma.storefront.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: { ...dto },
      include: {
        products: { include: { status: true }, orderBy: { createdAt: 'asc' } },
        statuses: { orderBy: { id: 'asc' } },
      },
    });
  }

  async togglePublish(userId: number) {
    const storefront = await this.prisma.storefront.findUnique({
      where: { userId },
    });
    if (!storefront) {
      throw new NotFoundException('Витрина не найдена');
    }
    return this.prisma.storefront.update({
      where: { userId },
      data: { isPublished: !storefront.isPublished },
    });
  }

  // ─── Products ──────────────────────────────────────────────────────────────

  async getProducts(userId: number) {
    const storefront = await this.ensureStorefront(userId);
    return this.prisma.product.findMany({
      where: { storefrontId: storefront.id },
      include: { status: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createProduct(userId: number, dto: CreateProductDto) {
    const storefront = await this.ensureStorefront(userId);
    const count = await this.prisma.product.count({
      where: { storefrontId: storefront.id },
    });
    if (count >= PRODUCT_LIMIT) {
      throw new BadRequestException(
        `Превышен лимит товаров (${PRODUCT_LIMIT})`,
      );
    }
    return this.prisma.product.create({
      data: { ...dto, storefrontId: storefront.id },
      include: { status: true },
    });
  }

  async updateProduct(
    userId: number,
    productId: number,
    dto: UpdateProductDto,
  ) {
    await this.ensureProductOwnership(userId, productId);
    return this.prisma.product.update({
      where: { id: productId },
      data: { ...dto },
      include: { status: true },
    });
  }

  async deleteProduct(userId: number, productId: number) {
    await this.ensureProductOwnership(userId, productId);
    await this.prisma.product.delete({ where: { id: productId } });
  }

  // ─── Statuses ──────────────────────────────────────────────────────────────

  async getStatuses(userId: number) {
    const storefront = await this.ensureStorefront(userId);
    return this.prisma.productStatus.findMany({
      where: { storefrontId: storefront.id },
      orderBy: { id: 'asc' },
    });
  }

  async createStatus(userId: number, dto: CreateStatusDto) {
    const storefront = await this.ensureStorefront(userId);
    const count = await this.prisma.productStatus.count({
      where: { storefrontId: storefront.id },
    });
    if (count >= STATUS_LIMIT) {
      throw new BadRequestException(
        `Превышен лимит статусов (${STATUS_LIMIT})`,
      );
    }
    return this.prisma.productStatus.create({
      data: { ...dto, storefrontId: storefront.id },
    });
  }

  async deleteStatus(userId: number, statusId: number) {
    await this.ensureStatusOwnership(userId, statusId);
    // Обнуляем statusId у связанных товаров
    await this.prisma.product.updateMany({
      where: { statusId },
      data: { statusId: null },
    });
    await this.prisma.productStatus.delete({ where: { id: statusId } });
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private async ensureStorefront(userId: number) {
    return this.prisma.storefront.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  }

  private async ensureProductOwnership(userId: number, productId: number) {
    const storefront = await this.ensureStorefront(userId);
    const product = await this.prisma.product.findFirst({
      where: { id: productId, storefrontId: storefront.id },
    });
    if (!product) {
      throw new NotFoundException('Товар не найден');
    }
    return product;
  }

  private async ensureStatusOwnership(userId: number, statusId: number) {
    const storefront = await this.ensureStorefront(userId);
    const status = await this.prisma.productStatus.findFirst({
      where: { id: statusId, storefrontId: storefront.id },
    });
    if (!status) {
      throw new NotFoundException('Статус не найден');
    }
    return status;
  }
}
