import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-constants-service',
  templateUrl: './constants-service.component.html',
  styleUrls: ['./constants-service.component.css']
})
export class ConstantsServiceComponent implements OnInit {

  readonly baseAppUrl: string = 'https://localhost:44388/';
  //readonly baseAppUrl: string = 'https://at-api-webapp.azurewebsites.net/';

  constructor() { }

  ngOnInit() {
  }

}
