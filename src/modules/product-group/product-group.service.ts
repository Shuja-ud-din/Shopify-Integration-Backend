import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IScapedProduct } from 'src/common/types/product.types';

import { IProductDoc } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { ScraperService } from '../scraper/scraper.service';
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
    private scraperService: ScraperService,
  ) {}

  private async updateProductsData(
    storeId: string,
    products: IScapedProduct[],
  ) {
    for (const product of products) {
      try {
        const updatedProduct =
          await this.productService.updateScrappedProduct(product);

        if (!updatedProduct.shopifyUpdateBlocked) {
          await this.productService.updateProductToShopify(
            storeId,
            product.id,
            {
              productId: updatedProduct.shopifyVariantId,
              variantId: updatedProduct.shopifyVariantId,
              price: product.price,
              inventory_quantity: product.stockQty,
            },
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  async getProductGroups(): Promise<IProductGroupDoc[]> {
    return this.productGroupModel.find().populate('products');
  }

  async getProductGroup(id: string): Promise<IProductGroupDoc> {
    try {
      const productGroup = await this.productGroupModel
        .findById(id)
        .populate('products');

      if (!productGroup) {
        throw new NotFoundException('Product Group not found');
      }

      return productGroup;
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Product Group not found', err);
    }
  }

  async scrapeProductGroup(storeId: string, id: string) {
    try {
      const productGroup = await this.productGroupModel
        .findById(id)
        .populate('products');

      if (!productGroup) {
        throw new NotFoundException('Product Group not found');
      }

      productGroup.isScraping = true;
      await productGroup.save();

      this.scraperService
        .scrapeProducts(productGroup.products as IProductDoc[])
        .then(async (products) => {
          await this.updateProductsData(storeId, products);
          productGroup.isScraping = false;
          await productGroup.save();
        });

      return productGroup;
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Product Group not found', err);
    }
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

  async updateProductGroup(
    id: string,
    createProductGroupDto: CreateProductGroupDto,
  ): Promise<IProductGroupDoc> {
    const { name, description, tags } = createProductGroupDto;

    const productGroup = await this.productGroupModel.findById(id);
    if (!productGroup) {
      throw new BadRequestException('Group not found');
    }

    const nameFound = await this.productGroupModel.findOne({ name });
    if (nameFound && nameFound._id.toString() !== id) {
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

    productGroup.name = name;
    productGroup.description = description;
    productGroup.tags = tags;
    productGroup.products = productIds as mongoose.Types.ObjectId[];

    return productGroup.save();
  }

  async deleteProductGroup(id: string): Promise<boolean> {
    const productGroup = await this.productGroupModel.findById(id);
    if (!productGroup) {
      throw new BadRequestException('Group not found');
    }

    await productGroup.deleteOne();
    return true;
  }
}
