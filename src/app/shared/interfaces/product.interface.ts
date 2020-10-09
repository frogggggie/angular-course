import {ICategory} from './category.interface';

export interface IProduct {
  id: number;
  category: ICategory;
  name: string;
  nameUrl: string;
  smell: string;
  price: number;
  description: string;
  details: string;
  count: number;
  images?: Array<string>;
}
