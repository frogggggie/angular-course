import { Subscription } from 'rxjs';
import { AfServiceService } from './../../shared/services/af-service.service';
import { IProduct } from './../../shared/interfaces/product.interface';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  providers: [
    {
      provide: CarouselConfig,
      useValue: { interval: 3000, noPause: false, showIndicators: false },
    },
  ],
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;
  panelOpenState = false;
  status: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private service: AfServiceService
  ) {}

  ngOnInit(): void {
    this.getOneFirebaseProduct();
  }

  getOneFirebaseProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.service.getOneProduct(id).then((data) => {
      this.product = data.data() as IProduct;
      this.status = true;
    });
  }

  backToProducts(): void {
    this.location.back();
  }

  countProduct(product: IProduct, status: boolean) {
    if (status) {
      product.count++;
    } else if (product.count > 1) {
      product.count--;
    }
  }

  addToCart(product: IProduct): void {
    let order: IProduct[] = [];
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      order = JSON.parse(localStorage.getItem('basket'));
      if (order.some((prod) => prod.id === product.id)) {
        const index = order.findIndex((prod) => prod.id === product.id);
        order[index].count += product.count;
      } else {
        order.push(product);
      }
    } else {
      order.push(product);
    }
    localStorage.setItem('basket', JSON.stringify(order));
    product.count = 1;
    this.service.basket.next(order);
  }
}
