import { Component, OnInit, Inject } from '@angular/core';
import { DataServiceComponent } from '../data-service/data-service.component';
import { VehicleModel } from '../models/vehicle.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent implements OnInit {
  constructor(private data: DataServiceComponent,
              private vehicle:VehicleModel,
              private matDialogref: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public injectData: any ) { }

  make:string;
  message: string;
  dataArray: string[];
  title: string;  
  params = new URLSearchParams;

  ngOnInit() {
    this.SortInjectData();
  }

  SortInjectData(){
    this.dataArray = this.injectData.split(',');
    this.title = this.dataArray.splice(this.dataArray.length - 1, this.dataArray.length).toString();
    this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);
  }

  DialogClick(event){
      this.matDialogref.close(event);
  }

  DialogClickRemoveFilter(){
    this.matDialogref.close("removefilter");
  }

  CloseDialog(){
      this.matDialogref.close("closedialog");
  }
}
