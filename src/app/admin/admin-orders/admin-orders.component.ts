import { AfServiceService } from './../../shared/services/af-service.service';
import { Subscription } from 'rxjs';
import { IOrder } from './../../shared/interfaces/order.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss'],
})
export class AdminOrdersComponent implements OnInit {
  page: number = 1;
  cloudOrders: IOrder[] = [];
  subscription: Subscription;

  constructor(private service: AfServiceService) {}

  ngOnInit(): void {
    this.getFirebaseOrders();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getFirebaseOrders(): void {
    this.subscription = this.service.getOrders().subscribe((data) => {
      this.cloudOrders = data.map((order) => {
        const o = order.payload.doc.data() as IOrder;
        return o;
      });
    });
  }

  deleteFirebaseOrder(order: IOrder) {
    this.service.deleteOrder(order).then(() => {
      this.getFirebaseOrders();
    });
  }
}
