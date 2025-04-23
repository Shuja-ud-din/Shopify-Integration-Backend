import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IFormula, IScapedProduct } from 'src/common/types/product.types';
import { ISchedule } from 'src/common/types/schedule.types';
import { isValidScheduleDate } from 'src/common/utils/dateTime';

import { FormulaService } from '../formula/formula.service';
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
    private formulaService: FormulaService,
  ) {}

  private async updateProductsData(
    storeId: string,
    products: IScapedProduct[],
    formula?: string,
  ) {
    for (const product of products) {
      try {
        const updatedProduct = await this.productService.updateScrappedProduct(
          storeId,
          product,
          formula,
        );

        if (!updatedProduct.shopifyUpdateBlocked) {
          await this.productService.updateProductToShopify(storeId, product.id);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  async getProductGroups(
    storeId: string,
    userId: string,
  ): Promise<IProductGroupDoc[]> {
    return this.productGroupModel
      .find({ store: storeId, user: userId })
      .populate('products');
  }

  async getProductGroup(
    storeId: string,
    id: string,
  ): Promise<IProductGroupDoc> {
    try {
      const productGroup = await this.productGroupModel
        .findOne({ _id: id, store: storeId })
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
        .populate('products')
        .populate('formula');

      if (!productGroup) {
        throw new NotFoundException('Product Group not found');
      }

      productGroup.isScraping = true;
      await productGroup.save();

      this.scraperService
        .scrapeProducts(productGroup.products as IProductDoc[])
        .then(async (products) => {
          await this.updateProductsData(
            storeId,
            products,
            (productGroup.formula as IFormula).formula,
          );
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
    userId: string,
    store: string,
    payload: CreateProductGroupDto,
  ): Promise<IProductGroupDoc> {
    const { name, description, tags, formula, schedule } = payload;

    const nameFound = await this.productGroupModel.findOne({ name, store });
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

    if (schedule) {
      const { startDate, startTime, timezone } = schedule;
      const isValid = isValidScheduleDate(startDate, startTime, timezone);

      if (!isValid) {
        throw new BadRequestException('Invalid schedule date or time');
      }
    }

    const scheduleObject: ISchedule = schedule
      ? {
          startDate: schedule.startDate,
          startTime: schedule.startTime,
          timezone: schedule.timezone,
          repeat: schedule?.repeat,
          end: schedule.end,
          runCount: 0,
        }
      : null;

    const productGroup = new this.productGroupModel({
      name,
      formula,
      description,
      tags,
      products: productIds,
      store: store,
      user: userId,
      isScheduled: !!schedule,
      schedule: scheduleObject,
    });

    // TODO: add queue job to schedule scraping

    return productGroup.save();
  }

  async updateProductGroup(
    id: string,
    createProductGroupDto: CreateProductGroupDto,
  ): Promise<IProductGroupDoc> {
    const { name, description, tags, formula, schedule } =
      createProductGroupDto;

    const productGroup = await this.productGroupModel.findById(id);
    if (!productGroup) {
      throw new BadRequestException('Group not found');
    }

    const nameFound = await this.productGroupModel.findOne({
      name,
      store: productGroup.store,
    });
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

    const formulaFound = await this.formulaService.getFormulaById(
      productGroup.store.toString(),
      formula,
    );
    if (!formulaFound) {
      throw new BadRequestException('Formula not found');
    }

    if (schedule) {
      const { startDate, startTime, timezone } = schedule;
      const isValid = isValidScheduleDate(startDate, startTime, timezone);

      if (!isValid) {
        throw new BadRequestException('Invalid schedule date or time');
      }
    }

    const products = await this.productService.getProductsByTags(tags);
    const productIds = products.map((product) => product._id);

    const scheduleObject: ISchedule = schedule
      ? {
          startDate: schedule.startDate,
          startTime: schedule.startTime,
          timezone: schedule.timezone,
          repeat: schedule?.repeat,
          end: schedule.end,
          runCount: 0,
        }
      : null;

    productGroup.name = name;
    productGroup.description = description;
    productGroup.tags = tags;
    productGroup.products = productIds as mongoose.Types.ObjectId[];
    productGroup.formula = formulaFound._id as mongoose.Types.ObjectId;
    productGroup.isScheduled = !!schedule;
    productGroup.schedule = scheduleObject;
    productGroup.isScraping = false;

    const savedProduct = await productGroup.save();

    // TODO: add queue job to schedule scraping

    return savedProduct;
  }

  async cancelProductGroupSchedule(
    storeId: string,
    id: string,
  ): Promise<IProductGroupDoc> {
    const productGroup = await this.productGroupModel.findOne({
      _id: id,
      store: storeId,
    });

    if (!productGroup) {
      throw new BadRequestException('Group not found');
    }

    productGroup.isScheduled = false;
    productGroup.schedule = null;

    return productGroup.save();
  }

  async deleteProductGroup(storeId: string, id: string): Promise<boolean> {
    const productGroup = await this.productGroupModel.findOne({
      _id: id,
      store: storeId,
    });

    if (!productGroup) {
      throw new BadRequestException('Group not found');
    }

    await productGroup.deleteOne();
    return true;
  }
}
