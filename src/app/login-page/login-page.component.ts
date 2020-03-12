import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { HttpClient, HttpParams  } from "@angular/common/http";
import { ConstantsServiceComponent } from '../constants-service/constants-service.component';
import { Router } from '@angular/router';
import { DataServiceComponent } from '../data-service/data-service.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(private http: HttpClient,
              private constant: ConstantsServiceComponent, 
              private router: Router, 
              private data: DataServiceComponent)
              { }

  baseAppUrl:string;
  username:string = "admin@at.com";
  password:string = "Password";
  token:string = null;
  
  ngOnInit() {
    this.baseAppUrl = this.constant.baseAppUrl;
  }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

 Signin(){
  const params = this.GetParams();
  this.http.get(this.baseAppUrl + "login/", { params }).subscribe(async (data: string)=> {
    this.token = data;
    this.data.changeMessage(this.token);
    await this.router.navigate(['main']);
  });  
}

GetParams(){
  return new HttpParams().set('password', this.password)
                          .set('username', this.username);
  }
}
