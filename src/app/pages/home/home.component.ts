import { AfServiceService } from './../../shared/services/af-service.service';
import { Subscription } from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {CarouselConfig} from 'ngx-bootstrap/carousel';
import AOS from 'aos';
import { ICategory } from 'src/app/shared/interfaces/category.interface';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [
    {provide: CarouselConfig, useValue: {noPause: false, showIndicators: false, interval: 2000}}
  ]

})

export class HomeComponent implements OnInit {

  subscription: Subscription = new Subscription;
  cloudCategories: ICategory[];

  constructor(
    private service: AfServiceService
  ) {}

  ngOnInit(): void {
    AOS.init({
      disable: function() {
        let maxWidth = 1024;
        return window.innerWidth < maxWidth;
      }
    });

    this.getCategories();
  }


  ngOnDestroy(): void {
   this.subscription.unsubscribe();
  }


  getCategories(): void {
    this.subscription = this.service.getCategories()
      .subscribe( data => {
        this.cloudCategories = data.map(
          category => {
            const data = category.payload.doc.data() as ICategory;
            return data;
          }
        )
      })

  }


}


