import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { CreateProductGroupDto } from './dtos/create-product-group.dto';
import { CreateProductGroupInterceptor } from './interceptors/createProductGroup.interceptor';
import { GetProductGroupsInterceptor } from './interceptors/getProductGroups.interceptor';
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

  @UseInterceptors(CreateProductGroupInterceptor)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createProductGroup(
    @Body() createProductGroupDto: CreateProductGroupDto,
  ) {
    return this.productGroupService.createProductGroup(createProductGroupDto);
  }
}
