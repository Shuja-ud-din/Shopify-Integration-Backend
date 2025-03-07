import { Injectable } from '@nestjs/common';
import { IProduct } from 'src/common/types/product.types';

@Injectable()
export class ScraperService {
  constructor() {}

  async scrapeProducts(products: IProduct[]) {
    const ebayUrls: string[] = [];
    const costcoUrls: string[] = [];

    for (const product of products) {
      for (const url of product.scrapperUrls) {
        if (url.includes('ebay')) {
          ebayUrls.push(url);
        } else if (url.includes('costco')) {
          costcoUrls.push(url);
        }
      }
    }

    console.log('Ebay URLs: ', ebayUrls);
    console.log('Costco URLs: ', costcoUrls);

    return { ebayUrls, costcoUrls };
  }
}
