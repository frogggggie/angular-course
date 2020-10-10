import { AfServiceService } from './../../shared/services/af-service.service';
import { IProduct } from './../../shared/interfaces/product.interface';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  productsArray: Array<IProduct> = [];
  filteredProducts: Array<IProduct> = [];
  subscription: Subscription;
  categoryName: string = '';
  allStatus: boolean = false;
  p: number = 1;
  config = {
    id: 'custom',
    itemsPerPage: 6,
    currentPage: 1,
    totalItems: this.filteredProducts.length
  }

  constructor(
    private service: AfServiceService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd ) {
        let category = this.activatedRoute.snapshot.paramMap.get('category');
        this.getFirebaseProducts(category);
      }
    })
   }


   onPageChange(event){
    this.config.currentPage = event;
  }

  ngOnInit(): void {
    this.getFirebaseProducts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe() 
  }


  getFirebaseProducts(prod?): void {
    prod = prod || this.activatedRoute.snapshot.paramMap.get('category');
    this.subscription = this.service.getProducts()
      .subscribe(data => {
        this.productsArray = data.map(
          product => {
            const data = product.payload.doc.data() as IProduct;
            return data;
          });
          this.filteredProducts = this.productsArray.filter(product => product.category.nameUrl === prod);
          this.allStatus = true;
          if(prod === 'all') {
            this.filteredProducts = this.productsArray;
            this.allStatus = false;
          }
          this.config.totalItems = this.filteredProducts.length;
      });
  }



}

