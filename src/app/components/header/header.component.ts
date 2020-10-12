import {AfServiceService} from './../../shared/services/af-service.service';
import {IProduct} from './../../shared/interfaces/product.interface';
import {Component, OnInit, TemplateRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {ICategory} from 'src/app/shared/interfaces/category.interface';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isTriggered: boolean = false;
  isToggled: boolean = false;
  cloudCategories: Array<ICategory> = [];
  basketSubscription: Subscription;
  productSubscription: Subscription;
  userSubscripton: Subscription;
  count: number = 0;
  localOrders: Array<IProduct> = [];
  userUrl: string;
  statusLogin: boolean;
  modalRef: BsModalRef;

  constructor(
    private service: AfServiceService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.checkLocalUser();
    this.checkUser();
    this.productLength();
    this.basketFromLocal();
    this.getCategories();
  }

  ngOnDestroy(): void {
    this.basketSubscription.unsubscribe();
    this.productSubscription.unsubscribe();
    this.userSubscripton.unsubscribe();
  }


  triggerBurger(): void {
    this.isTriggered = !this.isTriggered;
  }


  private getCategories() {
    this.basketSubscription = this.service.getCategories()
    .subscribe(data => {
      this.cloudCategories = data.map(
        cat => {
          const data = cat.payload.doc.data() as ICategory;
          const id = cat.payload.doc.id;
          data.id = id;
          return data;
        }
      );
    });
  }



productLength(): void {
  this.productSubscription = this.service.basket.subscribe(() => {
      this.basketFromLocal();
  })
}
 

private basketFromLocal(): void {
  if(localStorage.length > 0 && localStorage.getItem('basket')) {
    this.localOrders = JSON.parse(localStorage.getItem('basket'));
    const count = this.localOrders.reduce((total, accum) => total + accum.count, 0)
    this.count = count;
  }
}


private checkUser(): void {
 this.userSubscripton =  this.service.userStatus.subscribe(
    () => {
      this.checkLocalUser();
    }
  )
}


checkLocalUser(): void {
  const user = JSON.parse(localStorage.getItem('user'));
  if(user) {
    if (user.role === 'admin') {
      this.userUrl = 'admin';
    } else {
      this.userUrl = 'profile';
    }
    this.statusLogin = true;
  }  else {
    this.statusLogin = false;
    this.userUrl = '';
  }
}



signOut(): void {
  this.service.logOut();
  this.modalRef.hide();
}

openModal(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template);
}


}


