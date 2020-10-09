import { AfServiceService } from './../../shared/services/af-service.service';

import {Category} from './../../shared/models/category.model';
import {ICategory} from './../../shared/interfaces/category.interface';
import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Observable, Subscription} from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  arr: any[] = [];


  public categoryForm = new FormGroup({
    categoryNameENG: new FormControl('', Validators.required),
    categoryNameUrl: new FormControl('', Validators.required),
    categoryDescr: new FormControl('', Validators.required)
  });


  uploadProgress: Observable<number>;
  cloudCategories: Array<any> = [];
  categoryNameUrl: string = '';
  categoryNameENG: string = '';
  categoryDescr: string;
  categoryID: string;
  deletedID: string;
  isEdited: boolean = false;
  catImage: string;
  modalRef: BsModalRef;
  dataSource = new MatTableDataSource(this.cloudCategories);
  displayedColumns: string[] = ['name', 'nameUrl', 'description', 'image', 'edit', 'delete'];
  fileName: string = '';
  subscription: Subscription;

  constructor(
    private afstorage: AngularFireStorage,
    private modalService: BsModalService,
    private snackBar: MatSnackBar,
    private categoriesService: AfServiceService,
    private firestore: AngularFirestore
  ) {
  }

  ngOnInit(): void {
 

  }

  ngOnDestroy(): void {
  
  }


}
