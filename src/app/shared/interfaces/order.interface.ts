import { IProduct } from './../interfaces/product.interface';

export interface IOrder {
  id: string;
  userName: string;
  userPhone: string;
  userCity: string;
  userStreet: string;
  userHouse: string;
  ordersDetails: Array<IProduct>;
  totalPayment: string;
  date: number;
  userComment?: string;
}
