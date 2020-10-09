import {ICategory} from './../interfaces/category.interface';
import {IProduct} from './../interfaces/product.interface';


export class Product implements IProduct {
  constructor(
    public id: number,
    public category: ICategory,
    public name: string,
    public nameUrl: string,
    public smell: string,
    public price: number,
    public description: string,
    public details: string,
    public count: number,
    public images?: Array<string>,
  ) {
  }
}
