import { IProduct } from './../interfaces/product.interface';
import { IOrder } from './../interfaces/order.interface';

export class Order implements IOrder {
    constructor(
        public id: string,
        public userName: string,
        public userPhone: string,
        public userCity: string,
        public userStreet: string,
        public userHouse: string,
        public ordersDetails: IProduct[],
        public totalPayment: string,
        public date: number,
        public userComment?: string
    ){}
}