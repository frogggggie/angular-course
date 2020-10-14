import { AfServiceService } from './../../shared/services/af-service.service';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { Product } from './../../shared/models/product.model';
import { IProduct } from './../../shared/interfaces/product.interface';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss'],
})
export class AdminProductsComponent implements OnInit {
  page: number = 1;
  product = {
    name: '',
    nameUrl: '',
    smell: '',
    price: null,
    description: '',
    details: '',
  };

  cloudCategories: Array<ICategory> = [];
  cloudProducts: Array<IProduct> = [];
  productSubscription: Subscription;
  categorySubscription: Subscription;
  modalRef: BsModalRef;
  productID: number;
  productCategoryID: string;
  productCategory: ICategory;
  productImages: Array<string> = [];
  deletedProduct: IProduct;
  isEdited: boolean = false;
  editedID: number = null;
  categorySelect: string;

  constructor(
    private afstorage: AngularFireStorage,
    private modalService: BsModalService,
    private snackBar: MatSnackBar,
    private service: AfServiceService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.getFirebaseCategories();
    this.getFirebaseProducts();
  }

  ngOnDestroy(): void {
    this.categorySubscription.unsubscribe();
    this.productSubscription.unsubscribe();
  }

  openModal(template: TemplateRef<any>, product?: IProduct) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    if (product) {
      this.productID = product.id;
      this.product.name = product.name;
      this.product.nameUrl = product.nameUrl;
      this.product.smell = product.smell;
      this.product.price = product.price;
      this.product.description = product.description;
      this.product.details = product.details;
      this.productImages = product.images;
      this.productCategory = product.category;
      this.isEdited = true;
    }
  }

  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
      c
    ) {
      let r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  uploadFile(event): void {
    const file = event.target.files[0];
    const filePath = `images/${this.uuid()}.${file.type.split('/')[1]}`;
    const task = this.afstorage.upload(filePath, file);
    task.then((e) => {
      this.afstorage
        .ref(`images/${e.metadata.name}`)
        .getDownloadURL()
        .subscribe((url) => {
          this.productImages.push(url);
        });
    });
  }

  getFirebaseCategories(): void {
    this.categorySubscription = this.service
      .getCategories()
      .subscribe((data) => {
        this.cloudCategories = data.map((category) => {
          const data = category.payload.doc.data() as ICategory;
          return data;
        });
      });
  }

  addFirebaseProduct(form: NgForm): void {
    this.cloudProducts.sort(function (a, b) {
      return a.id - b.id;
    });
    const product: IProduct = new Product(
      1,
      this.productCategory,
      this.product.name,
      this.product.nameUrl,
      this.product.smell,
      this.product.price,
      this.product.description,
      this.product.details,
      1,
      this.productImages
    );
    if (this.isEdited) {
      product.id = this.productID;
      console.log('works');
      this.service
        .updateProduct(product)
        .then(() => {
          this.resetForm(form);
          this.getFirebaseProducts();
        })
        .catch((error) => console.log(error));
    } else {
      if (this.cloudProducts.length > 0) {
        product.id = this.cloudProducts.slice(-1)[0].id + 1;
      }
      this.service
        .addProduct(product)
        .then(() => {
          this.resetForm(form);
          this.getFirebaseProducts();
        })
        .catch((error) => console.log(error));
    }
  }

  resetForm(form: NgForm): void {
    this.modalRef.hide();
    form.reset();
    this.isEdited = false;
    this.productImages = [];
  }

  getFirebaseProducts(): void {
    this.productSubscription = this.service.getProducts().subscribe((data) => {
      this.cloudProducts = data.map((product) => {
        const data = product.payload.doc.data() as IProduct;
        return data;
      });
    });
  }

  deleteFirebaseProduct(modal: TemplateRef<any>, product: IProduct): void {
    this.modalRef = this.modalService.show(modal, { class: 'modal-sm' });
    this.deletedProduct = product;
  }

  confirmDelete(): void {
    this.service.deleteProduct(this.deletedProduct).then(() => {
      this.getFirebaseProducts();
      this.openSnackBar(
        'product was successfully deleted😊',
        'close',
        'snackbar'
      );
      this.modalRef.hide();
    });
  }

  deleteEditedImg(id: number) {
    this.productImages.splice(id, 1);
  }

  openSnackBar(message: string, action: string, className: string) {
    let config = new MatSnackBarConfig();
    config.panelClass = ['snackbar'];
    this.snackBar.open(message, action ? 'close' : undefined, config);
  }

  filterProducts(event) {
    if (event.value === 'all') {
      this.getFirebaseProducts();
    } else {
      this.firestore.firestore
        .collection('products')
        .where('category.nameENG', '==', event.value)
        .get()
        .then((querySnapshot) => {
          this.cloudProducts = [];
          querySnapshot.forEach((goods) => {
            const product = goods.data() as IProduct;
            this.cloudProducts.push(product);
            return product;
          });
        });
    }
  }
}
