import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Redis from 'ioredis';
import { Model } from 'mongoose';
import { IProduct, ITag } from 'src/common/types/product.types';

import { ShopifyService } from '../shopify/shopify.service';
import { Product } from './entities/product.entity';
import { IProductDoc } from './entities/product.entity';
import { ITagDoc, Tag } from './entities/tag.entity';

@Injectable()
export class ProductService {
  constructor(
    private readonly shopifyService: ShopifyService,
    @InjectModel(Product.name) private productModel: Model<IProductDoc>,
    @InjectModel(Tag.name) private tagModel: Model<ITagDoc>,
  ) {}

  async getProducts(): Promise<IProduct[]> {
    const products = await this.productModel.find();

    return products;
  }

  async getTags(): Promise<ITag[]> {
    const tags = await this.tagModel.find();

    return tags;
  }

  async syncProducts() {
    const shopifyProducts = await this.shopifyService.getProducts();

    const products: IProduct[] = shopifyProducts.map((product) => {
      return {
        shopifyProductId: product.id,
        title: product.title,
        bodyHtml: product.body_html,
        productType: product.product_type,
        vendor: product.vendor,
        tags: product.tags.split(','),
        status: product.status,
        image: product.image.src,
        images: product.images.map((image) => image.src),
        sku: product.variants[0].sku,
        price: Number(product.variants[0].price),
        inventoryQuantity: product.variants[0].inventory_quantity,
        scrapperUrls: [],
        createdAt: new Date(product.created_at),
        updatedAt: new Date(product.updated_at),
      };
    });

    const allTags = products.flatMap((product) => product.tags);

    const tags = [...new Set(allTags)];

    for (const tag of tags) {
      await this.tagModel.findOneAndUpdate(
        { name: tag },
        { name: tag },
        { upsert: true, new: true },
      );
    }

    for (const product of products) {
      await this.productModel.findOneAndUpdate(
        { shopifyProductId: product.shopifyProductId },
        product,
        {
          upsert: true,
          new: true,
        },
      );
    }
  }
}
