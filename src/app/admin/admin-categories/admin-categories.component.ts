import {AfServiceService } from './../../shared/services/af-service.service';
import {Category} from './../../shared/models/category.model';
import {ICategory} from './../../shared/interfaces/category.interface';
import {Component, OnInit, TemplateRef} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {NgForm} from '@angular/forms';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.scss']
})
export class AdminCategoriesComponent implements OnInit {

  category = {
    nameENG: '',
    nameUrl:  '',
    description: ''
  };
  uploadProgress: Observable<number>;
  cloudCategories: Array<ICategory> = [];
  categoryID: string;
  deletedCategory: ICategory;
  isEdited: boolean = false;
  modalRef: BsModalRef;
  subscription: Subscription;
  imageStatus: boolean = false;
  categoryImages: Array<string> = [];

  constructor(
    private afstorage: AngularFireStorage,
    private modalService: BsModalService,
    private snackBar: MatSnackBar,
    private service: AfServiceService
  ) { }

   
  ngOnInit(): void {
    this.getCategories();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openModal(template: TemplateRef<any>, category?: ICategory) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    if (category) {
      this.category.nameUrl = category.nameUrl;
      this.category.nameENG= category.nameENG;
      this.category.description = category.description;
      this.categoryImages = category.images;
      this.categoryID = category.id;
      this.isEdited = true;
    }
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = `images/${this.uuid()}.${file.type.split('/')[1]}`;
    const task = this.afstorage.upload(filePath, file);
    this.uploadProgress = task.percentageChanges();
    task.then(e => {
      this.afstorage.ref(`images/${e.metadata.name}`)
        .getDownloadURL()
        .subscribe(url => {
          this.categoryImages.push(url);
        });
    });
  }

  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  getCategories() {
    this.subscription = this.service.getCategories().subscribe(data => {
      this.cloudCategories = data.map(
        category => {
          const data = category.payload.doc.data() as ICategory;
          return data;
        }
      );
    });
  }

  addCategory(form: NgForm) {
    const category: ICategory = new Category(
      this.uuid(),
      this.category.nameENG,
      this.category.nameUrl,
      this.category.description,
      this.categoryImages);
    if (this.isEdited) {
      category.id = this.categoryID;
      this.service.updateCategory(category).then(
        () => {
          this.isEdited = false;
          this.resetForm(form);
          this.getCategories();
        }
      );
    } else {
      this.service.addCategory(category).then(
        () => {
          this.resetForm(form);
          this.getCategories();
        }
      );
    }
  }


resetForm(form: NgForm): void {
  form.reset();
  this.categoryImages = [];
  this.modalRef.hide();
}

  confirmDeleting() {
    this.service.deleteCategory(this.deletedCategory)
      .then(
        () => {
          this.openSnackBar('Category was successfully deleted😊', 'close', 'snackbar');
          this.getCategories();
        }
      )
      .catch(
        error => console.log(error)
      );
    this.modalRef.hide();
  }



  deleteCategory(modal: TemplateRef<any>, category: ICategory): void {
    this.modalRef = this.modalService.show(modal, {class: 'modal-sm'});
    this.deletedCategory = category;
  }



  deleteEditedImage(index: number) {
    this.categoryImages.splice(index, 1);
  }
  

  openSnackBar(message: string, action: string, className: string) {
    let config = new MatSnackBarConfig();
    config.panelClass = ['snackbar'];
    this.snackBar.open(message, action ? 'close' : undefined, config);
  }




}
