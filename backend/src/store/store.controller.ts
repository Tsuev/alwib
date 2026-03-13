import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpsertStoreDto } from './dto/upsert-store.dto';
import { StoreService } from './store.service';

@ApiTags('store')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @ApiOperation({ summary: 'Получить витрину текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Витрина или null' })
  getStore(@Request() req: { user: { id: number } }) {
    return this.storeService.getStore(req.user.id);
  }

  @Put()
  @ApiOperation({ summary: 'Создать или обновить витрину' })
  @ApiResponse({ status: 200, description: 'Витрина обновлена' })
  upsertStore(
    @Request() req: { user: { id: number } },
    @Body() dto: UpsertStoreDto,
  ) {
    return this.storeService.upsertStore(req.user.id, dto);
  }

  @Post('publish')
  @ApiOperation({ summary: 'Переключить статус публикации витрины' })
  @ApiResponse({ status: 201, description: 'Статус публикации изменён' })
  togglePublish(@Request() req: { user: { id: number } }) {
    return this.storeService.togglePublish(req.user.id);
  }

  // ─── Upload ────────────────────────────────────────────────────────────────

  @Post('upload')
  @ApiOperation({ summary: 'Загрузить изображение (логотип или фото товара)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: '{ url: string }' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'public', 'uploads', 'store'),
        filename: (_req, file, cb) => {
          cb(null, `${uuidv4()}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 6 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Разрешены только изображения'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: { protocol: string; get: (h: string) => string },
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return { url: `${baseUrl}/uploads/store/${file.filename}` };
  }

  // ─── Products ──────────────────────────────────────────────────────────────

  @Get('products')
  @ApiOperation({ summary: 'Список товаров витрины' })
  @ApiResponse({ status: 200 })
  getProducts(@Request() req: { user: { id: number } }) {
    return this.storeService.getProducts(req.user.id);
  }

  @Post('products')
  @ApiOperation({ summary: 'Создать товар' })
  @ApiResponse({ status: 201, description: 'Товар создан' })
  createProduct(
    @Request() req: { user: { id: number } },
    @Body() dto: CreateProductDto,
  ) {
    return this.storeService.createProduct(req.user.id, dto);
  }

  @Patch('products/:id')
  @ApiOperation({ summary: 'Обновить товар' })
  @ApiResponse({ status: 200, description: 'Товар обновлён' })
  updateProduct(
    @Request() req: { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.storeService.updateProduct(req.user.id, id, dto);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Удалить товар' })
  @ApiResponse({ status: 200, description: 'Товар удалён' })
  deleteProduct(
    @Request() req: { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.storeService.deleteProduct(req.user.id, id);
  }

  // ─── Statuses ──────────────────────────────────────────────────────────────

  @Get('statuses')
  @ApiOperation({ summary: 'Список статусов витрины' })
  @ApiResponse({ status: 200 })
  getStatuses(@Request() req: { user: { id: number } }) {
    return this.storeService.getStatuses(req.user.id);
  }

  @Post('statuses')
  @ApiOperation({ summary: 'Создать статус' })
  @ApiResponse({ status: 201, description: 'Статус создан' })
  createStatus(
    @Request() req: { user: { id: number } },
    @Body() dto: CreateStatusDto,
  ) {
    return this.storeService.createStatus(req.user.id, dto);
  }

  @Delete('statuses/:id')
  @ApiOperation({ summary: 'Удалить статус' })
  @ApiResponse({ status: 200, description: 'Статус удалён' })
  deleteStatus(
    @Request() req: { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.storeService.deleteStatus(req.user.id, id);
  }
}
