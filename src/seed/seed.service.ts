import { Injectable } from '@nestjs/common';

import { ProductsService } from 'src/products/products.service';
import { initialData } from './seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productsServices: ProductsService) {}
  async runSeed() {
    await this.insertProducts();
    return `Seed EXECUTED`;
  }

  private async insertProducts() {
    await this.productsServices.deletedAllProdutcs();

    const data = initialData.products;
    const insertPromises = [];
    data.forEach((product) => {
      insertPromises.push(this.productsServices.create(product));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
