import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ProductService } from '../product/product.service';
import { CreateProductGroupDto } from './dtos/create-product-group.dto';
import {
  IProductGroupDoc,
  ProductGroup,
} from './entities/product-group.entity';

@Injectable()
export class ProductGroupService {
  constructor(
    @InjectModel(ProductGroup.name)
    private productGroupModel: Model<IProductGroupDoc>,
    private productService: ProductService,
  ) {}

  async getProductGroups(): Promise<IProductGroupDoc[]> {
    return this.productGroupModel.find().populate('products');
  }

  async createProductGroup(
    createProductGroupDto: CreateProductGroupDto,
  ): Promise<IProductGroupDoc> {
    const { name, description, tags } = createProductGroupDto;

    const nameFound = await this.productGroupModel.findOne({ name });
    if (nameFound) {
      throw new BadRequestException('Group name already exists');
    }

    if (tags.length === 0) {
      throw new BadRequestException('At least one tag is required');
    }

    const tagsFound = await this.productService.findTagsByNames(tags);
    if (tagsFound.length !== tags.length) {
      throw new BadRequestException('Some tags do not exist');
    }

    const products = await this.productService.getProductsByTags(tags);
    const productIds = products.map((product) => product._id);

    const productGroup = new this.productGroupModel({
      name,
      description,
      tags,
      products: productIds,
    });

    return productGroup.save();
  }
}
