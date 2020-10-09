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

  constructor(
    private auth: AfServiceService
  ) {
  }

  ngOnInit(): void {
  }



  signIn(): void {
    this.auth.signIn(this.user.email, this.user.password);
  }

}
