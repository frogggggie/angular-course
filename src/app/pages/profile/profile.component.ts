import { IOrder } from './../../shared/interfaces/order.interface';
import { Subscription } from 'rxjs';
import { AfServiceService } from './../../shared/services/af-service.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: any;
  userEmail: string;
  userInfo: any;
  ordersSubscription: Subscription;
  userSubscription: Subscription;
  orders: IOrder[] = [];

  constructor(
    private service: AfServiceService,
    private db: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.getLocalUser();
    this.getFireUser();
  }


  ngOnDestroy(): void {
  this.userSubscription.unsubscribe();
  this.ordersSubscription.unsubscribe();
  }

  getLocalUser(): void {
   this.user = JSON.parse(localStorage.getItem('user'));
   this.userEmail = this.user.userEmail;
  }


  
getFireUser(): void {
  this.userSubscription = this.service.getUser(this.userEmail).subscribe(
    data => {
      this.userInfo = data; 
      this.getFireUserOrders();
    }
  )
}


getFireUserOrders(): void {
  this.ordersSubscription = this.service.getUserOrders()
    .subscribe( data => {
      this.orders = data.map(
      order => {
        const data = order.payload.doc.data() as IOrder;
         return data;
      })
    })
}




  

}
