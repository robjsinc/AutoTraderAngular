import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders  } from "@angular/common/http";
import { DataServiceComponent } from '../data-service/data-service.component';
import { Router, NavigationEnd } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ConstantsServiceComponent } from '../constants-service/constants-service.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})

export class MainPageComponent implements OnInit {

  constructor(private http: HttpClient, 
              private data: DataServiceComponent,
              private router: Router,
              private constant: ConstantsServiceComponent) { }

  [x: string]: any;
  vehicles = [];
  filteredvehicles: any [];
  fourvehicles: Vehicle[];
  vehiclecount:number;
  distinctmakes:string[];
  distinctmodels:string[];
  selectedmake:string = "";
  selectedmodel:string = "";
  selectedminprice = 0;
  minpossibleprice = 0;
  selectedmaxprice = 65000;
  maxpossibleprice = 65000;
  selectminprices = [
    'From £10,000',
    'From £15,000',
    'From £20,000',
    'From £25,000',
    'From £30,000',
    'From £35,000',
    'From £40,000',
    'From £45,000',
    'From £50,000',
    'From £55,000'
  ];
  selectmaxprices = [
    'To £15,000',
    'To £20,000',
    'To £25,000',
    'To £30,000',
    'To £35,000',
    'To £40,000',
    'To £45,000',
    'To £50,000',
    'To £55,000',
    'To £60,000'
  ];
  // selectnational = [
  //   "Within 20 miles",
  //   "Within 40 miles",
  //   "Within 60 miles",
  //   "Within 80 miles",
  //   "Within 100 miles",
  //   "Within 120 miles",
  //   "Within 140 miles",
  //   "Within 160 miles",
  //   "Within 180 miles",
  //   "National"
  // ];
  selectmodeltitle:string = "Model (any)";
  postcode:string = "Post Code";
  distance:string = "National";
  formGroup:FormGroup;
  message:string;
  baseAppUrl:string;

   @ViewChild('modelselect', {static: false}) modelselect: MainPageComponent;

  ngOnInit() {
    this.baseAppUrl = this.constant.baseAppUrl;

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
  });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token'
      })
    };
    this.http.get(this.baseAppUrl + "vehicle", httpOptions).subscribe((data: Vehicle[])=> {
      this.GetFourVehicles(data);
      this.GetVehicleCount(data);
      this.GetDistinctMakes(data);
      this.ManipulatePrices(this.fourvehicles);
      this.RemoveWhiteSpaceForImg(this.fourvehicles);
      this.vehicles = data;
    });
    this.data.currentMessage.subscribe(message => this.message = message)
  }

  MessageToSearchPage() {
    if(this.selectedmake == undefined || this.selectedmake == "") {
      this.selectedmake = "null";
    }
    if(this.selectedmodel == undefined || this.selectedmodel == "") {
      this.selectedmodel = "null";
    }
    this.data.changeMessage(this.selectedmake + " " + this.selectedmodel + " " +
                            this.selectedminprice + " " + this.selectedmaxprice + 
                            " " + "null" + " " + "null" + " " + this.CheckPostCodeValue());
  }

  CheckPostCodeValue(){
    if(this.postcode === "Post Code"){
      this.postcode = "null";
    }
    return this.postcode.replace(" ","");
  }

  MessageToVehiclePage(){
    this.data.changeMessage("main-page");
  }

  SelectMake(event: any){
    if(this.selectedmake != "") {
      this.distinctmodels = []; 
    }
    this.selectedmake = event.value;
    this.selectedmodel = "";
    var data = [];
    for(var i = 0; i < this.vehicles.length; i++){
      if(this.vehicles[i].make == event.value){
        data.push(this.vehicles[i]);
      }
    }
    if(this.selectedminprice === this.minpossibleprice && this.selectedmaxprice === this.maxpossibleprice) { 
      this.GetDistinctMakes(this.vehicles);
      this.GetDistinctModels(data);
      this.selectedmodel = "";
      this.GetVehicleCount(data)
      this.filteredvehicles = data; 
    }else {
      this.GetVehiclesFilteredByMinAndMaxPrice(data);
      this.GetDistinctMakes(this.vehicles);
      this.GetDistinctModels(this.filteredvehicles);
      this.selectedmodel = "";
      this.GetVehicleCount(this.filteredvehicles);
      this.filteredvehicles = data; 
    }
  }

  SelectModel(event: any){
    this.selectedmodel = event.value;
    var data = [];
    for(var i = 0; i < this.vehicles.length; i++){
      if(this.vehicles[i].model == event.value){
        data.push(this.vehicles[i]);
      }
    }
    if(this.selectedminprice === this.minpossibleprice && this.selectedmaxprice === this.maxpossibleprice) {
      this.GetVehiclesFilteredByMinAndMaxPrice(data);
      this.GetDistinctMakes(this.vehicles);
      this.GetDistinctModelsByMake(this.selectedmake);    
      this.GetVehicleCount(this.filteredvehicles)
    }else {
      this.GetVehiclesFilteredByMinAndMaxPrice(data);
      this.GetDistinctMakes(this.vehicles);
      this.GetDistinctModelsByMake(this.selectedmake);
      this.GetVehicleCount(this.filteredvehicles);
    }
  }

  SelectMinPrice(event: any){
    this.selectedminprice = this.GetMinPriceFromString(event.value);
    if(this.selectedmake === "" && this.selectedmodel === ""){
      this.GetVehiclesFilteredByMinAndMaxPrice(this.vehicles);
    }
    if(this.selectedmake != "" && this.selectedmodel === ""){
      var data = [];
      for(var i = 0; i < this.vehicles.length; i++){
        if(this.vehicles[i].make == this.selectedmake){
          data.push(this.vehicles[i]);
        }
      }
      this.GetVehiclesFilteredByMinAndMaxPrice(data);
    }
    if(this.selectedmake != "" && this.selectedmodel != ""){
      var data = [];
      var datatwo = [];
      for(var i = 0; i < this.vehicles.length; i++){
        if(this.vehicles[i].make == this.selectedmake){
          data.push(this.vehicles[i]);
        }
      }      
      for(var i = 0; i < data.length; i++){
        if(data[i].model == this.selectedmodel){
          datatwo.push(data[i]);
        }
      }
      this.GetVehiclesFilteredByMinAndMaxPrice(datatwo);
    }
    this.GetDistinctMakes(this.vehicles);
    this.GetDistinctModels(this.filteredvehicles)
    this.GetVehicleCount(this.filteredvehicles);
  }

  SelectMaxPrice(event: any){
    this.selectedmaxprice = this.GetMaxPriceFromString(event.value);
    if(this.selectedmake === "" && this.selectedmodel === ""){
      this.GetVehiclesFilteredByMinAndMaxPrice(this.vehicles);
    }
    if(this.selectedmake != "" && this.selectedmodel === ""){
      var data = [];
      for(var i = 0; i < this.vehicles.length; i++){
        if(this.vehicles[i].make == this.selectedmake){
          data.push(this.vehicles[i]);
        }
      }
      this.GetVehiclesFilteredByMinAndMaxPrice(data);
    }
    if(this.selectedmake != "" && this.selectedmodel != ""){
      var data = [];
      var datatwo = [];
      for(var i = 0; i < this.vehicles.length; i++){
        if(this.vehicles[i].make == this.selectedmake){
          data.push(this.vehicles[i]);
        }
      }
      for(var i = 0; i < data.length; i++){
        if(data[i].model == this.selectedmodel){
          datatwo.push(data[i]);
        }
      }
      this.GetVehiclesFilteredByMinAndMaxPrice(datatwo);
    }
    this.GetDistinctMakes(this.vehicles);
    this.GetDistinctModels(this.filteredvehicles)
    this.GetVehicleCount(this.filteredvehicles);
  }

  GetVehiclesFilteredByMinAndMaxPrice(vehicles: Vehicle[]){
      let data = [];
      for(var i = 0; i < vehicles.length; i++){
        if(this.RemoveCommaFromPrice(vehicles[i].price) > this.selectedminprice && this.RemoveCommaFromPrice(vehicles[i].price) < this.selectedmaxprice){
           data.push(vehicles[i]);
         }
      }
      if(data.length === 0){
        this.modelselect =  undefined;
        this.selectedmodel = "";
      }
      else{
        this.GetDistinctModels(data)
      }
      this.filteredvehicles = data;
  }

  GetDistinctMakes(vehicles: Vehicle[]) {
    this.distinctmakes = [...new Set(vehicles.map(x => x.make))].sort();
  }

  GetDistinctModels(vehicles: Vehicle[]) {
    this.distinctmodels = [...new Set(vehicles.map(x => x.model))].sort();
  } 

  GetDistinctModelsByMake(make: string) {   
    let data = [];
    if(this.selectedminprice === this.minpossibleprice && this.selectedmaxprice === this.maxpossibleprice) {    
    for(var i = 0; i < this.vehicles.length; i++){
      if(this.vehicles[i].make === make){
        data.push(this.vehicles[i])
        }
      } 
    }else {
      for(var i = 0; i < this.vehicles.length; i++){
        if(this.vehicles[i].make === make && this.RemoveCommaFromPrice(this.vehicles[i].price) > this.selectedminprice && 
           this.RemoveCommaFromPrice(this.vehicles[i].price) < this.selectedmaxprice){
          data.push(this.vehicles[i])
          }
      }
    }
    this.GetDistinctModels(data);
  }

  GetMinPriceFromString(minprice){
    let minpriceBeginning = minprice.substring(6,8);
    let minpriceEnd = minprice.substring(9,12);
    return minpriceBeginning + minpriceEnd;
  }

  GetMaxPriceFromString(maxprice){
  var maxpriceBeginning = maxprice.substring(4,6);
  var maxpriceEnd = maxprice.substring(7,10);
  return maxpriceBeginning + maxpriceEnd;
  }

  RemoveCommaFromPrice(price){
      if(price.length > 5) {
      var minpriceBeginning = price.substring(0,2);
      var minpriceEnd = price.substring(3,6);
      return minpriceBeginning + minpriceEnd;
    } else return price;
  }

  GetFourVehicles(vehicles: Vehicle[]){
    const shuffled = vehicles.sort(() => 0.5 - Math.random());
    let data = [];
    for(var i = 0; i < shuffled.length; i++)
    {
      data.push(this.RemoveCommaFromPrice(shuffled[i]))

    }
    this.fourvehicles = data.slice(0, 4);
  }

  ManipulatePrices(data) {
    for (var i = 0; i < data.length; i++) {
      data[i].save =  (data[i].price / 100 * 5) | 0;
      data[i].rrp = data[i].save + data[i].price | 0;
    }
  }

  RemoveWhiteSpaceForImg(fourVehicles: any){
    var result = [];
    for (var i = 0; i < fourVehicles.length; i++) {
      result = fourVehicles[i].version.split(' ').join('');
      fourVehicles[i].imgUrl = result;
    }
  }

  GetVehicleCount(data: Vehicle[]) {
    this.vehiclecount = data.length; 
  }

  RemovePostCodeValue(){
    this.postcode = "";
  }
}

interface Vehicle {
  vehicleID: number;
  make: string;
  model: string;
  year: string;
  price: number;
  roadTax: string;
  insuranceGroup: string;
  bodyType: string;
  engineinfo: EngineInfo;
  standardEquipment: StandardEquipment;
  rrp: string;
  save: string;
  imgUrl: string;
  count: number;
}

interface EngineInfo {
  equipment1: string;
  equipment2: string;
  equipment3: string;
  equipment4: string;
  equipment5: string;
  equipment6: string;
  equipment7: string;
  equipment8: string;
  equipment9: string;
  equipment10: string;
  equipment11: string;
  equipment12: string;
  equipment13: string;
  equipment14: string;
  equipment15: string;
  equipment16: string;
  equipment17: string;
  equipment18: string;
  equipment19: string;
  equipment20: string;
  equipment21: string;
  equipment22: string;
  equipment23: string;
  equipment24: string;
  equipment25: string;
  equipment26: string;
}

interface StandardEquipment {
  engine: string;
  driveTrain: string;  
  power: string;
  milesPerTank: string;
  fuelCapacity: string;
  engineSizeCC: string;
  cylinders: string;
  valves: string;
  gearbox: string;
  fuelType: string;
  transmition: string;
  fuelEconomy: string;
  topSpeed: string;
  zeroToSixty: string;
}