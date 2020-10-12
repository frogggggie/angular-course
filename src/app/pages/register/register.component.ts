import { AfServiceService } from './../../shared/services/af-service.service';
import { NgForm } from '@angular/forms';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {


user = {
  fname: '',
  lname: '',
  email: '',
  password: ''
};
hide = true;
registerError: string = '';
errorStatus: boolean = false;


  constructor(
    private auth: AfServiceService
  ) {
  }

  ngOnInit(): void {
  }

  
  signUp(): void {
    this.auth.signUp(this.user);
    this.auth.authStatus.subscribe(
      error => {
        if(error.code === 'auth/email-already-in-use') {
            this.registerError = 'This email is already taken';
            this.errorStatus = true;
        }
        else {
          console.log(error)
        }
      }
    )
    

  }





}
