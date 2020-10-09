import {ICategory} from './../interfaces/category.interface';

export class Category implements ICategory {
  constructor(
    public id: string,
    public nameENG: string,
    public nameUrl: string,
    public description: string,
    public images: string[]
  ) {
  }
}
