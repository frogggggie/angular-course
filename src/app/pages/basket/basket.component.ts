import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AfServiceService } from './../../shared/services/af-service.service';
import { Order } from './../../shared/models/order.model';
import { IOrder } from './../../shared/interfaces/order.interface';
import { NgForm } from '@angular/forms';
import { IProduct } from './../../shared/interfaces/product.interface';
import {Component,  OnInit} from '@angular/core';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
  
export class BasketComponent implements OnInit {

order = {
  payment: '',
  userName: '',
  userPhone: '',
  userComment: '',
  userCity: '',
  userStreet: '',
  userHouse: ''
};
  phoneMask = [ /[0]/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  localProducts: IProduct[] = [];
  totalPrice: number;
  userStatus: boolean = false;
  user: any;
  subscribe: Subscription = new Subscription;

  constructor(
    private service: AfServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getLocalProducts();
    this.getLocalUser();
  }

  ngOnDestroy(): void {
   this.subscribe.unsubscribe();
  }



 uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
   let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
   return v.toString(16);
  });
  }


private getLocalProducts(): void {
  if (localStorage.length > 0 && localStorage.getItem('basket')) {
   this.localProducts = JSON.parse(localStorage.getItem('basket'));
   this.getTotalPrice();
  }
 }



getTotalPrice(): void {
  this.totalPrice = this.localProducts.reduce((total, elem) => { 
    return total + elem.count * elem.price
   }, 0)
}


updateLocalProducts(): void {
  localStorage.setItem('basket', JSON.stringify(this.localProducts));
  this.service.basket.next(this.localProducts)
}


private getLocalUser(): void{
  if(localStorage.length > 0 && localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user'));
   if(user.role === 'user') {
     this.user = user;
     this.subscribe = this.service.getUser(user.userEmail).subscribe(
       () => {
        this.userStatus = true;
        this.order.userName = user.fname + ' ' + user.lname;
       }
     )
   }}
   else {
     this.userStatus = false;
   }
}



removeLocalProduct(product: IProduct): void {
  const index = this.localProducts.findIndex(prod => prod.id === product.id);
  this.localProducts.splice(index, 1);
  this.updateLocalProducts();
  this.getLocalProducts();
}



addOrder(form: NgForm): void {
  const date: number = Date.now();
  const order: IOrder = new Order(
    this.uuid(), this.order.userName,
    this.order.userPhone, this.order.userCity,
    this.order.userStreet, this.order.userHouse, 
    this.localProducts, this.totalPrice.toString(),
    date
  )

  if(this.order.userComment) {
    order.userComment = this.order.userComment;
  }
  if (this.userStatus) {
    this.service.updateOrderInfo(order)
    .then(() => console.log('success'))
    .catch(error => console.log(error))
  }     

  this.localProducts = [];
  localStorage.setItem('basket', JSON.stringify(this.localProducts));
  this.service.basket.next(this.localProducts);
  this.service.addOrder(order).then(
    () => {
      this.router.navigateByUrl('/');
      form.resetForm();
      this.localProducts = [];
      this.updateLocalProducts();
    }
  )
}





}