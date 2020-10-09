import { IOrder } from './../interfaces/order.interface';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ICategory } from '../interfaces/category.interface';
import { IProduct } from '../interfaces/product.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AfServiceService {

  basket: Subject<any> = new Subject<any>();
  currentUser: any;
  userStatus: Subject<any> = new Subject;
  userID: string = '';
  
  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) { }




  ///////// CATEGORY

  addCategory(category: ICategory) {
    return this.firestore.collection('categories').doc(category.id).set({...category}).then(() => console.log('works'));
  }

  getCategories() {
    return this.firestore.collection('categories').snapshotChanges();
  }

  deleteCategory(category: ICategory) {
    return this.firestore.collection('categories').doc(category.id).delete();
  }

  updateCategory(category: ICategory) {
    return this.firestore.firestore.collection('categories').doc(category.id).update({...category});
  }


  /////// PRODUCT

  addProduct(product: IProduct) {
    return this.firestore.firestore.collection('products').doc(product.id.toString()).set({...product}).then(() => console.log('works'));
  }

  getProducts() {
    return this.firestore.collection('products').snapshotChanges();
  }

  deleteProduct(product: IProduct) {
    return this.firestore.collection('products').doc(product.id.toString()).delete();
  }

  updateProduct(product: IProduct) {
    return this.firestore.firestore.collection('products').doc(product.id.toString()).update({...product});
  }

  getOneProduct(id: string) {
  return this.firestore.collection('products').doc(id).get().toPromise();
}



//// ORDERS

addOrder(order: IOrder) {
  return this.firestore.collection('orders').doc(order.id.toString()).set({...order})
     .then(
       () => console.log('order is added')
     )
  }


getOrders() {
  return this.firestore.collection('orders').snapshotChanges();
}

deleteOrder(order: IOrder) {
  return this.firestore.collection('orders').doc(order.id).delete()
}


///// AUTENTIFICATION


signUp(newUser) {
  this.auth.createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(
      userResponse => {
        const user = {
          userEmail: userResponse.user.email,
          id: userResponse.user.uid,
          role: 'user',
          fname: newUser.fname,
          lname: newUser.lname,
          orders: []
        };
        this.firestore.collection('users')
        .add(user)
          .then(
            data => {
              data.get()
              .then(
                newUserInfo => {
                  let newUser = newUserInfo.data();
                  localStorage.setItem('user', JSON.stringify(newUser));
                  if(newUser.role !== 'admin') {
                    this.userStatus.next('user');
                    this.router.navigateByUrl('profile');
                  }
                })
            })
            .catch( error => console.log(error));
         })
         .catch( error => console.log(error));
 }




signIn(email: string, password: string) {
  this.auth.signInWithEmailAndPassword(email, password)
    .then(
      user => {
        this.firestore.collection('users')
          .ref
          .where('id', '==', user.user.uid)
          .onSnapshot(
            users => {
              users.forEach(
                usersRef => {
                  this.currentUser = usersRef.data();
                  localStorage.setItem('user', JSON.stringify(this.currentUser));
                  if(this.currentUser.role !== 'admin') {
                    this.userStatus.next('user');
                    this.router.navigateByUrl('profile');
                  } else {
                    this.userStatus.next('admin');
                    this.router.navigateByUrl('admin');
                  }
                })
            })
         })
       .catch( error => console.log(error))
}


logOut(): void {
  this.auth.signOut()
  .then(
     () => {
       localStorage.removeItem('user');
       this.userStatus.next('');
       this.router.navigateByUrl('/')
     })
     .catch (
       error => console.log(error)
     )
}


getUser(email: string) {
  return this.firestore.collection<any>
  ('users', ref => ref.where('userEmail', '==', email))
    .snapshotChanges()
    .pipe(
      map(
        actions => actions.map(
        a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          this.userID = id;
          return data;
        })
    ))
}



updateOrderInfo(order) {
  return this.firestore.collection('users').doc(this.userID).collection('orders').doc(order.id).set({...order})
}


getUserOrders() {
  return this.firestore.collection('users').doc(this.userID).collection('orders').snapshotChanges();
}





}
