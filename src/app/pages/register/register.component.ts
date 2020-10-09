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

  constructor(
    private auth: AfServiceService
  ) {
  }

  ngOnInit(): void {
  }



  signUp(form: NgForm): void {
    this.auth.signUp(this.user);
  }





}
