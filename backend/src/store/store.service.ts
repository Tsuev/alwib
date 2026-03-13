import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertStoreDto } from './dto/upsert-store.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateStatusDto } from './dto/create-status.dto';

const PRODUCT_LIMIT = 50;
const STATUS_LIMIT = 10;

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async getStorefront(userId: number) {
    return this.prisma.store.findUnique({
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

  async upsertStorefront(userId: number, dto: UpsertStoreDto) {
    return this.prisma.store.upsert({
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
    const store = await this.prisma.store.findUnique({
      where: { userId },
    });
    if (!store) {
      throw new NotFoundException('Витрина не найдена');
    }
    return this.prisma.store.update({
      where: { userId },
      data: { isPublished: !store.isPublished },
    });
  }

  // ─── Products ──────────────────────────────────────────────────────────────

  async getProducts(userId: number) {
    const store = await this.ensureStore(userId);
    return this.prisma.product.findMany({
      where: { storeId: store.id },
      include: { status: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createProduct(userId: number, dto: CreateProductDto) {
    const store = await this.ensureStore(userId);
    const count = await this.prisma.product.count({
      where: { storeId: store.id },
    });
    if (count >= PRODUCT_LIMIT) {
      throw new BadRequestException(
        `Превышен лимит товаров (${PRODUCT_LIMIT})`,
      );
    }
    return this.prisma.product.create({
      data: { ...dto, storeId: store.id },
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
    const store = await this.ensureStore(userId);
    return this.prisma.productStatus.findMany({
      where: { storeId: store.id },
      orderBy: { id: 'asc' },
    });
  }

  async createStatus(userId: number, dto: CreateStatusDto) {
    const store = await this.ensureStore(userId);
    const count = await this.prisma.productStatus.count({
      where: { storeId: store.id },
    });
    if (count >= STATUS_LIMIT) {
      throw new BadRequestException(
        `Превышен лимит статусов (${STATUS_LIMIT})`,
      );
    }
    return this.prisma.productStatus.create({
      data: { ...dto, storeId: store.id },
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

  private async ensureStore(userId: number) {
    return this.prisma.store.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  }

  private async ensureProductOwnership(userId: number, productId: number) {
    const store = await this.ensureStore(userId);
    const product = await this.prisma.product.findFirst({
      where: { id: productId, storeId: store.id },
    });
    if (!product) {
      throw new NotFoundException('Товар не найден');
    }
    return product;
  }

  private async ensureStatusOwnership(userId: number, statusId: number) {
    const store = await this.ensureStore(userId);
    const status = await this.prisma.productStatus.findFirst({
      where: { id: statusId, storeId: store.id },
    });
    if (!status) {
      throw new NotFoundException('Статус не найден');
    }
    return status;
  }
}
