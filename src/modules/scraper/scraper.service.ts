import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import {
  IScapedProduct,
  IScrapperPayloadProduct,
} from 'src/common/types/product.types';
import { IProductDoc } from 'src/modules/product/entities/product.entity';

@Injectable()
export class ScraperService {
  private readonly ebayApi: AxiosInstance;
  private readonly costcoApi: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.ebayApi = axios.create({
      baseURL: this.configService.get('scraper.ebayUrl'),
    });
    this.costcoApi = axios.create({
      baseURL: this.configService.get('scraper.costcoUrl'),
    });
  }

  private async getEbayProducts(
    payload: IScrapperPayloadProduct[],
  ): Promise<IScapedProduct[]> {
    try {
      console.log('payload', payload);

      const { data } = await this.ebayApi.post<IScapedProduct[]>('', {
        products: payload,
      });

      return data;
    } catch (e) {
      console.error('Error fetching Ebay products:', e);
      return [];
    }
  }

  private async getCostcoProducts(
    payload: IScrapperPayloadProduct[],
  ): Promise<IScapedProduct[]> {
    try {
      console.log('payload', payload);

      const { data } = await this.costcoApi.post<IScapedProduct[]>('', {
        products: payload,
      });

      return data;
    } catch (e) {
      console.error('Error fetching Costco products:', e);
      return [];
    }
  }

  private async scrapeInChunks(
    products: IScrapperPayloadProduct[],
    chunkSize: number,
    callback: (
      products: IScrapperPayloadProduct[],
    ) => Promise<IScapedProduct[]>,
  ) {
    const chunkedProducts = [];
    for (let i = 0; i < products.length; i += chunkSize) {
      chunkedProducts.push(products.slice(i, i + chunkSize));
    }

    const results = await Promise.all(
      chunkedProducts.map((chunk) => {
        return callback(chunk);
      }),
    );

    return results.flat();
  }

  private getResultsById(
    results: IScapedProduct[],
    id: string,
  ): IScapedProduct[] {
    return results.filter((result) => result.id === id);
  }

  private getBestResult(results: IScapedProduct[]): IScapedProduct {
    return results.reduce((bestResult, result) => {
      if (!bestResult || result.price < bestResult.price) {
        return result;
      }

      return bestResult;
    }, null);
  }

  private filterBestResults(results: IScapedProduct[]): IScapedProduct[] {
    const resultIds = new Set<string>(results.map((result) => result.id));
    let bestResults: IScapedProduct[] = [];

    console.log('resultIds', resultIds);

    for (const id of resultIds) {
      const resultsById = this.getResultsById(results, id);
      const bestResult = this.getBestResult(resultsById);
      if (bestResult) {
        bestResults.push(bestResult);
      }
    }

    return bestResults;
  }

  async scrapeProduct(product: IProductDoc): Promise<IScapedProduct> {
    const results = await this.scrapeProducts([product]);

    return results[0];
  }

  async scrapeProducts(products: IProductDoc[]): Promise<IScapedProduct[]> {
    const ebayProducts: IScrapperPayloadProduct[] = [];
    const costcoProducts: IScrapperPayloadProduct[] = [];

    for (const product of products) {
      for (const url of product.scrapperUrls) {
        if (url.includes('ebay')) {
          ebayProducts.push({
            url,
            id: product._id.toString(),
          });
        } else if (url.includes('costco')) {
          costcoProducts.push({
            url,
            id: product._id.toString(),
          });
        }
      }
    }

    const [ebayResults, costcoResults] = await Promise.all([
      this.scrapeInChunks(ebayProducts, 10, (products) => {
        return this.getEbayProducts(products);
      }),
      this.scrapeInChunks(costcoProducts, 10, (products) => {
        return this.getCostcoProducts(products);
      }),
    ]);

    const filteredResults = this.filterBestResults([
      ...ebayResults,
      ...costcoResults,
    ]);

    console.log('Number of filtered results:', filteredResults.length);

    return filteredResults;
  }
}
