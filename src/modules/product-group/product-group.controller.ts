import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { StoreGuard } from 'src/common/guards/store.guard';
import { ITokenPayload } from 'src/common/utils/token';

import { CreateProductGroupDto } from './dtos/create-product-group.dto';
import { CancelGroupScheduleInterceptor } from './interceptors/cancelGroupSchedule.interceptor';
import { CreateProductGroupInterceptor } from './interceptors/createProductGroup.interceptor';
import { DeleteProductGroupInterceptor } from './interceptors/deleteProductGroup.interceptor';
import { GetProductGroupInterceptor } from './interceptors/getProductGroup.interceptor';
import { GetProductGroupsInterceptor } from './interceptors/getProductGroups.interceptor';
import { ScrapeProductGroupInterceptor } from './interceptors/scrapeProductGroup.interceptor';
import { UpdateProductGroupInterceptor } from './interceptors/updateProductGroup.interceptor';
import { ProductGroupService } from './product-group.service';

@Controller('product-groups')
export class ProductGroupController {
  constructor(private readonly productGroupService: ProductGroupService) {}

  @UseInterceptors(GetProductGroupsInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get()
  @UseGuards(StoreGuard)
  async getProductGroups(
    @User() user: ITokenPayload,
    @Query('store') storeId: string,
  ) {
    return this.productGroupService.getProductGroups(storeId, user.id);
  }

  @UseInterceptors(GetProductGroupInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  @UseGuards(StoreGuard)
  async getProductGroup(
    @Param('id') id: string,
    @Query('store') storeId: string,
  ) {
    return this.productGroupService.getProductGroup(storeId, id);
  }

  @UseInterceptors(ScrapeProductGroupInterceptor)
  @HttpCode(HttpStatus.OK)
  @Patch('/scrape/:id')
  @UseGuards(StoreGuard)
  async scrapeProductGroup(
    @Param('id') id: string,
    @Query('store') storeId: string,
  ) {
    return this.productGroupService.scrapeProductGroup(storeId, id);
  }

  @UseInterceptors(CreateProductGroupInterceptor)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(StoreGuard)
  async createProductGroup(
    @User() user: ITokenPayload,
    @Body() payload: CreateProductGroupDto,
    @Query('store') storeId: string,
  ) {
    return this.productGroupService.createProductGroup(
      user.id,
      storeId,
      payload,
    );
  }

  @UseInterceptors(UpdateProductGroupInterceptor)
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  @UseGuards(StoreGuard)
  async updateProductGroup(
    @Body() payload: CreateProductGroupDto,
    @Param('id') id: string,
  ) {
    return this.productGroupService.updateProductGroup(id, payload);
  }

  @UseInterceptors(CancelGroupScheduleInterceptor)
  @HttpCode(HttpStatus.OK)
  @Patch('/:id/schedule/cancel')
  @UseGuards(StoreGuard)
  async cancelProductGroupSchedule(
    @Param('id') id: string,
    @Query('store') storeId: string,
  ) {
    return this.productGroupService.cancelProductGroupSchedule(storeId, id);
  }

  @UseInterceptors(DeleteProductGroupInterceptor)
  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  @UseGuards(StoreGuard)
  async deleteProductGroup(
    @Param('id') id: string,
    @Query('store') storeId: string,
  ) {
    return this.productGroupService.deleteProductGroup(storeId, id);
  }
}
