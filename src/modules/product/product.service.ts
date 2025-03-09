import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProduct } from 'src/common/types/product.types';

import { ShopifyService } from '../shopify/shopify.service';
import { UpdateProductDto } from './dtos/getProduct.dto';
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

  async getProductById(id: string): Promise<IProductDoc | null> {
    try {
      const product = await this.productModel
        .findById(id)
        .populate('tags')
        .exec();

      return product;
    } catch (err) {
      console.log(err);
      throw new NotFoundException(err.message || 'Product not found');
    }
  }

  private containesDuplicateUrls(urls: string[]): boolean {
    const uniqueUrls = new Set(urls);

    return urls.length !== uniqueUrls.size;
  }

  async updateProduct(
    id: string,
    payload: UpdateProductDto,
  ): Promise<IProductDoc> {
    const existingProduct = await this.getProductById(id);

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    const { urls, profitMargin } = payload;

    if (urls && this.containesDuplicateUrls(urls)) {
      throw new NotAcceptableException('Duplicate urls are not allowed');
    }

    if (urls) {
      existingProduct.scrapperUrls = urls;
    }

    if (profitMargin) {
      existingProduct.profitMargin = profitMargin;
    }

    existingProduct.updatedAt = new Date();
    await existingProduct.save();

    return existingProduct;
  }

  async syncProducts() {
    const shopifyProducts = await this.shopifyService.getProducts();

    const products: Partial<IProduct>[] = [];

    for (const product of shopifyProducts) {
      const tags = product.tags
        ? product.tags.split(',').map((tag) => tag.trim())
        : [];
      for (const variant of product.variants) {
        const productData: Partial<IProduct> = {
          shopifyProductId: product.id,
          shopifyVariantId: variant.id,
          title: `${product.title} - ${variant.title}`,
          bodyHtml: product.body_html,
          productType: product.product_type,
          vendor: product.vendor,
          tags,
          status: product.status,
          image:
            product.images.find((image) => image.id === variant.image_id)
              ?.src || product.image?.src,
          sku: variant.sku,
          price: Number(variant.price),
          inventoryQuantity: variant.inventory_quantity,
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
      console.log('Syncing products', products.length);
      await this.productModel.findOneAndUpdate(
        { shopifyVariantId: product.shopifyVariantId },
        product,
        {
          upsert: true,
          new: true,
        },
      );
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
