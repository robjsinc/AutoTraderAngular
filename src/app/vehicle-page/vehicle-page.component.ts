import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient  } from "@angular/common/http";
import { VehicleModel } from '../models/vehicle.model';
import { DataServiceComponent } from '../data-service/data-service.component';
import { ConstantsServiceComponent } from '../constants-service/constants-service.component';

@Component({
  selector: 'app-vehicle-page',
  templateUrl: './vehicle-page.component.html',
  styleUrls: ['./vehicle-page.component.css']
})

  export class VehiclePageComponent implements OnInit {

  constructor(private route: ActivatedRoute,
                      private http: HttpClient,
                      public vehicle: VehicleModel,
                      private data: DataServiceComponent,
                      private constant: ConstantsServiceComponent) { }

  private storageName: string = "Settings";
  vehicleID: string;
  backto:string;
  selectedmake:string;
  selectedmodel:string;
  selectedminprice:string;
  selectedmaxprice:string;
  selectedbodytype:string;
  selectedinsurancegroup:string;
  messagearray:string[];
  message:string;
  mainimg:string;
  postcode:string;
  baseAppUrl:string;

  async ngOnInit() {
    this.baseAppUrl = this.constant.baseAppUrl;

            await this.route.paramMap.subscribe(params => { this.vehicleID = params.get('vehicleID'); });
            await this.http.get(this.baseAppUrl + "vehicle/" + this.vehicleID).subscribe(async (data: VehicleModel) => { 
            await this.RemoveWhiteSpaceForImg(data);
            await this.ManipulatePrices(data);
            await this.RemoveNullFromStandardEquipmentList(data);
            this.vehicle = data;
            await this.GetMainImg();    
            
            this.data.currentMessage.subscribe(message => this.message = message);
            if(this.message.includes("(")){
              this.AddTimeAndDistanceToVehicleModel(this.message);
            }
            if(this.message.startsWith("main-page")) {
              this.backto = "main";
            } else {
              this.backto = "search";
            }
            if(this.message != "default message"){      
              this.SetSettings(this.message);
              this.message = this.GetUserSettings();
            } else {
              this.message = this.GetUserSettings();  
                this.AddTimeAndDistanceToVehicleModel(this.message);
            };
          });
  }

  AddTimeAndDistanceToVehicleModel(message){
    if(this.message.includes("null")){
      this.vehicle.distanceFromCustomerPostCode = undefined;
      this.vehicle.timeFromCustomerPostCode = undefined;
    }else{
      this.vehicle.distanceFromCustomerPostCode = message.split("(")[1].slice(0, -2) + "les";
      this.vehicle.timeFromCustomerPostCode = message.split("(")[2].slice(0, -1);
    }
  }
  SetSettings(data: any) {
    localStorage.setItem(this.storageName, JSON.stringify(data));
  }

  GetUserSettings() {
    let data = localStorage.getItem(this.storageName);
    return JSON.parse(data);
  }

  ChangeImg(imgurl) {
    this.mainimg = imgurl;
  }  

  GetMainImg(){
    this.mainimg = "./assets/" + this.vehicle.imgUrl + ".jpg"; 
  }

  RemoveWhiteSpaceForImg(data: VehicleModel) {
      var result = "";
      result = data.version.split(' ').join('');
      data.imgUrls = [];
      data.imgUrl = result;
      for (var j = 1; j < 4; j++) {
        data.imgUrls.push(result + "-" + j);
      }
  }

  ManipulatePrices(data) {
    data.save =  (data.price / 100 * 5) | 0;
    data.rrp = data.save + data.price | 0;
  }

  RemoveNullFromStandardEquipmentList(data){
    data.standardEquipmentList.pop();
  }
}