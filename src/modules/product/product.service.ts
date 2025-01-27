import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProduct } from 'src/common/types/product.types';

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

  async getProducts(): Promise<IProductDoc[]> {
    const products = await this.productModel.find();

    return products;
  }

  async syncProducts() {
    const shopifyProducts = await this.shopifyService.getProducts();

    const products: IProduct[] = [];

    for (const product of shopifyProducts) {
      const tags = product.tags
        ? product.tags.split(',').map((tag) => tag.trim())
        : [];
      for (const variant of product.variants) {
        const productData: IProduct = {
          shopifyProductId: variant.product_id,
          title: `${product.title} - ${variant.title}`,
          bodyHtml: product.body_html,
          productType: product.product_type,
          vendor: product.vendor,
          tags,
          status: product.status,
          image: product.images.find((image) => image.id === variant.image_id)
            ?.src,
          sku: variant.sku,
          price: Number(variant.price),
          inventoryQuantity: variant.inventory_quantity,
          scrapperUrls: [],
          createdAt: new Date(variant.created_at),
          updatedAt: new Date(variant.updated_at),
        };

        products.push(productData);
      }
    }

    const allTags = products.flatMap((product) => product.tags);
    const tags = [...new Set(allTags)];

    for (const tag of tags) {
      await this.tagModel.findOneAndUpdate(
        { name: tag },
        { name: tag },
        { upsert: true, new: true },
      );
    }

    await this.tagModel.deleteMany({
      name: { $nin: tags },
    });

    for (const product of products) {
      await this.productModel.findOneAndUpdate({ sku: product.sku }, product, {
        upsert: true,
        new: true,
      });
    }

    await this.productModel.deleteMany({
      shopifyProductId: { $nin: shopifyProducts.map((product) => product.id) },
    });
  }

  // tags
  async getProductsByTags(tags: string[]): Promise<IProductDoc[]> {
    const products = await this.productModel.find({ tags: { $in: tags } });

    return products;
  }

  async getTags(): Promise<ITagDoc[]> {
    const tags = await this.tagModel.find();

    return tags;
  }

  async findTagByName(name: string): Promise<ITagDoc | null> {
    const tag = await this.tagModel.findOne({ name });

    return tag;
  }

  async findTagsByNames(names: string[]): Promise<ITagDoc[]> {
    const tags = await this.tagModel.find({ name: { $in: names } });

    return tags;
  }
}
