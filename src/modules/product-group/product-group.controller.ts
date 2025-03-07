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
  UseInterceptors,
} from '@nestjs/common';

import { CreateProductGroupDto } from './dtos/create-product-group.dto';
import { CreateProductGroupInterceptor } from './interceptors/createProductGroup.interceptor';
import { DeleteProductGroupInterceptor } from './interceptors/deleteProductGroup.interceptor';
import { GetProductGroupInterceptor } from './interceptors/getProductGroup.interceptor';
import { GetProductGroupsInterceptor } from './interceptors/getProductGroups.interceptor';
import { UpdateProductGroupInterceptor } from './interceptors/updateProductGroup.interceptor';
import { ProductGroupService } from './product-group.service';

@Controller('product-groups')
export class ProductGroupController {
  constructor(private readonly productGroupService: ProductGroupService) {}

  @UseInterceptors(GetProductGroupsInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getProductGroups() {
    return this.productGroupService.getProductGroups();
  }

  @UseInterceptors(GetProductGroupInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getProductGroup(@Param('id') id: string) {
    return this.productGroupService.getProductGroup(id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/scrape/:id')
  async scrapeProductGroup(@Param('id') id: string) {
    return this.productGroupService.scrapeProductGroup(id);
  }

  @UseInterceptors(CreateProductGroupInterceptor)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createProductGroup(
    @Body() createProductGroupDto: CreateProductGroupDto,
  ) {
    return this.productGroupService.createProductGroup(createProductGroupDto);
  }

  @UseInterceptors(UpdateProductGroupInterceptor)
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  async updateProductGroup(
    @Body() updateProductGroupDto: CreateProductGroupDto,
    @Param('id') id: string,
  ) {
    return this.productGroupService.updateProductGroup(
      id,
      updateProductGroupDto,
    );
  }

  @UseInterceptors(DeleteProductGroupInterceptor)
  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  async deleteProductGroup(@Param('id') id: string) {
    return this.productGroupService.deleteProductGroup(id);
  }
}
