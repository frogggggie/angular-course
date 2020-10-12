import { AfServiceService } from './../../shared/services/af-service.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user = {
    email: '',
    password: ''
  };
  hide = true;
  loginStatus: boolean = false;
  loginError: string = '';
  

  constructor(
    private auth: AfServiceService
  ) {
  }

  ngOnInit(): void {
  }



  signIn(): void {
    this.auth.signIn(this.user.email, this.user.password);
    this.auth.authStatus.subscribe(
      error=> {
        if(error.code === 'auth/wrong-password'){ 
        this.loginError = 'Seems you entered a wrong password';
        this.loginStatus = true;
        }
        else if(error.code === 'auth/user-not-found') {
        this.loginError = "There's no user with such email";
        this.loginStatus = true;
      }
       else {
         console.log(error)
       }
      }
     
    )
  }

}
