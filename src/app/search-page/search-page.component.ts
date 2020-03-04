import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { DataServiceComponent } from '../data-service/data-service.component';
import { HttpClient, HttpParams } from "@angular/common/http";
import { VehicleModel } from '../models/vehicle.model';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { Router, NavigationEnd } from '@angular/router';
import { ConstantsServiceComponent } from '../constants-service/constants-service.component';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})

export class SearchPageComponent implements OnInit   {

  constructor(private data: DataServiceComponent,
              private http:HttpClient,
              public vehicle:VehicleModel,
              public dialog: MatDialog,
              private router: Router,
              private constant: ConstantsServiceComponent) { }
          
  private storageName: string = "Settings";
  dialogRef: any;
  message: string;
  vehicles: VehicleModel[];
  vehicleCount: number;
  minprice:string;
  maxprice:string;
  params = new URLSearchParams;
  minpriceplaceholrder: string;
  maxpriceplaceholrder: string;
  textpreprice: string;
  textminprice: string;
  textmaxprice: string;
  textpricecenter: string;
  selectminprices = [
    '(any)',
    '£10,000',
    '£15,000',
    '£20,000',
    '£25,000',
    '£30,000',
    '£35,000',
    '£40,000',
    '£45,000',
    '£50,000',
    '£55,000'
  ];
  selectmaxprices = [
    '(any)',
    '£15,000',
    '£20,000',
    '£25,000',
    '£30,000',
    '£35,000',
    '£40,000',
    '£45,000',
    '£50,000',
    '£55,000',
    '£60,000'
  ];
  bodytype = "Any";
  insurancegroup = "Any";
  savedmessage:string;
  postcode:string; 
  baseAppUrl: string;

  @ViewChild('makeref', {static: false}) makeref: ElementRef;
  @ViewChild('modelref', {static: false}) modelref: ElementRef;
  @ViewChild('priceref', {static: false}) priceref: ElementRef;
  @ViewChild('bodytyperef', {static: false}) bodytyperef: ElementRef;
  @ViewChild('insurancegroupref', {static: false}) insurancegroupref: ElementRef;

  ngOnInit() {
    this.baseAppUrl = this.constant.baseAppUrl;

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });

    this.data.currentMessage.subscribe(message => this.message = message);
    if(this.message != "default message"){      
      this.SetSettings(this.message);
      this.message = this.GetUserSettings();
    } else {
      this.message = this.GetUserSettings();
    };

    this.PopulateVehicleModel(this.message); 
    this.savedmessage = this.message;
    this.GetVehiclesBySelectedInfo();
  }


  ngAfterViewInit(){
    this.makeref.nativeElement.cells[0].style.color = "#2A65BA";
    this.modelref.nativeElement.cells[0].style.color = "#2A65BA";
    this.priceref.nativeElement.cells[0].style.color = "#2A65BA";
    this.bodytyperef.nativeElement.cells[0].style.color = "#2A65BA";
    this.insurancegroupref.nativeElement.cells[0].style.color = "#2A65BA";
  }

  GetParams(){
    return new HttpParams().set('make',this.vehicle.make)
                                 .set('model',this.vehicle.model)
                                 .set('minprice',this.vehicle.minprice)
                                 .set('maxprice',this.vehicle.maxprice)
                                 .set('bodytype',this.vehicle.bodyType)
                                 .set('insurancegroup',this.vehicle.insuranceGroup)
                                 .set('postcode', this.vehicle.postcode);
}

  GetVehiclesBySelectedInfo(){
      this.ChangeUndefinedValuesToAny();
      const params = this.GetParams();
      this.SetSettings(this.GetVehicleInfo());
      this.http.get(this.baseAppUrl + "vehicle/GetBySelectedInfo", { params }).subscribe((data: VehicleModel[])=> {
      this.RemoveWhiteSpaceForImg(data);
      this.vehicleCount = data.length;
      this.vehicles = data;
    })
  }

  ClickMake(){
    this.http.get(this.baseAppUrl + "vehicle/GetMakes").subscribe(async (data: string[])=>  {
      let makes = this.CreateStringFromArray(data);
      makes += "makes";
      let modelvaluetochange = "makes";
      await this.OpenDialog(makes, modelvaluetochange);
    });
  }

  ClickModel(){
    this.http.get(this.baseAppUrl + "vehicle/GetModelsByMake?make=" + this.vehicle.make).subscribe(async (data: string[])=>  {
      let models = this.CreateStringFromArray(data);
      models += "models";
      let modelvaluetochange = "models";
      await this.OpenDialog(models, modelvaluetochange);
    });
  }

  ClickBodyType(){
    this.http.get(this.baseAppUrl + "vehicle/GetBodyTypes").subscribe(async (data: string[])=>  {
      let bodyTypes = this.CreateStringFromArray(data);
      bodyTypes += "bodytypes";
      let modelvaluetochange = "bodytypes";
      await this.OpenDialog(bodyTypes, modelvaluetochange);
    });
  }

  ClickInsuranceGroup(){
    this.http.get(this.baseAppUrl + "vehicle/GetInsuranceGroups").subscribe(async (data: string[])=>  {
      let insuranceGroups = this.CreateStringFromArray(data);
      insuranceGroups += "insurancegroups";
      let modelvaluetochange = "insurancegroups";
      await this.OpenDialog(insuranceGroups, modelvaluetochange);
    });
  }

  SetSettings(data: any) {
    localStorage.setItem(this.storageName, JSON.stringify(data));
  }

  GetUserSettings() {
    let data = localStorage.getItem(this.storageName);
    return JSON.parse(data);
  }

  MessageToVehiclePage(vehicle){
    this.data.changeMessage(this.vehicle.make +" "+ this.vehicle.model +" "+ this.vehicle.minprice +" "+  
                            this.vehicle.maxprice +" "+ this.vehicle.bodyType +" "+ this.vehicle.insuranceGroup + " " + 
                            this.vehicle.postcode + " (" + vehicle.distanceFromCustomerPostCode + ") (" + 
                            vehicle.timeFromCustomerPostCode + ")"); //Why did I do this - just pass in the vehicle - refactor all this!!
  }

  GetVehicleInfo(){
    return this.vehicle.make +" "+ this.vehicle.model +" "+ this.vehicle.minprice +" "+  
           this.vehicle.maxprice +" "+ this.vehicle.bodyType +" "+ this.vehicle.insuranceGroup + " " + this.vehicle.postcode;
  }

  CreateStringFromArray(data){
    let tempString = "";
    for(var i = 0; i < data.length; i++){
      tempString += data[i] + ",";
    }
    return tempString;
  }

  OpenDialog(data, modelvaluetochange){

      this.dialogRef = this.dialog.open(DialogComponent, { data : data, autoFocus: false });
      this.dialogRef.afterClosed().subscribe(result => {
        if(result != undefined) {
          if(result != "closedialog" && result != "removefilter") {
          this.ChangeModelValue(modelvaluetochange, result);
        };
          if(result === "removefilter"){
          this.RemoveFilter(modelvaluetochange);
        };
      }
    });
  }

  ChangeModelValue(modelvaluetochange, result){
    if(modelvaluetochange === "makes"){
      this.vehicle.make = result;
      this.vehicle.model = "Any";
    } else if(modelvaluetochange === "models"){
      this.vehicle.model = result;
    }else if(modelvaluetochange === "bodytypes"){
      this.vehicle.bodyType = result;
    }else if(modelvaluetochange === "insurancegroups"){
      this.vehicle.insuranceGroup = result;
    }
    this.GetVehiclesBySelectedInfo();
  }

  RemoveFilter(modelvaluetochange){
    if(modelvaluetochange === "makes"){
      this.vehicle.make = "Any";
      this.vehicle.model = "Any";
    } else if(modelvaluetochange === "models"){
      this.vehicle.model = "Any";
    }else if(modelvaluetochange === "bodytypes"){
      this.vehicle.bodyType = "Any";
    }else if(modelvaluetochange === "insurancegroups"){
      this.vehicle.insuranceGroup = "Any";
    }
    this.GetVehiclesBySelectedInfo();
  }

  PopulateVehicleModel(message: String){
      var splitstring = message.split(' ');
      
      if(splitstring[0] === "null"){
        this.vehicle.make = "Any";  
      }else{
        this.vehicle.make = splitstring[0];
      }
      if(splitstring[1] === "null"){
        this.vehicle.model = "Any";   
      }else{
        this.vehicle.model = splitstring[1];   
      }      
      if(splitstring[2] === "0"){
        this.vehicle.minprice = splitstring[2];
        this.minpriceplaceholrder = "(any)";
      }else{
        this.vehicle.minprice = splitstring[2];
        this.minpriceplaceholrder = "£" + this.vehicle.minprice;
      }
      if(splitstring[3] === "65000"){
        this.vehicle.maxprice = splitstring[3];
        this.maxpriceplaceholrder = "(any)";
      }else{
        this.vehicle.maxprice = splitstring[3];
        this.maxpriceplaceholrder = "£" + this.vehicle.maxprice;
      }      

      if(splitstring[4] === "null"){
        this.vehicle.bodyType = "Any";
      }      
      if(splitstring[5] === "null"){
        this.vehicle.insuranceGroup = "Any";
      }

      this.vehicle.postcode = splitstring[6];
      
      this.PopulatePriceRow();
  } 

  SelectMinPrice(event){
    if(event.value === "(any)"){
      event.value = '0';
    }
    this.vehicle.minprice = this.RemoveCommaFromPrice(event.value);
    this.ChangeValueInMessage(this.vehicle.minprice, 2);
    this.savedmessage = this.GetVehicleInfo();
    this.SetSettings(this.GetVehicleInfo());
    this.PopulatePriceRow();    
    this.GetVehiclesBySelectedInfo();
  }

  SelectMaxPrice(event){
    if(event.value === "(any)"){
      event.value = '65000';
    }
    this.vehicle.maxprice = this.RemoveCommaFromPrice(event.value);
    this.ChangeValueInMessage(this.vehicle.maxprice, 3);
    this.savedmessage = this.GetVehicleInfo();
    this.SetSettings(this.GetVehicleInfo());
    this.PopulatePriceRow();
    this.GetVehiclesBySelectedInfo();
  }

  ChangeValueInMessage(value, valuetochange){
    let messagearray = this.message.split(" ");
    let newmessage = "";
    messagearray[valuetochange] = value;
    for(let i = 0; i < messagearray.length; i++){
      newmessage += messagearray[i] + " ";
    }
    this.message = newmessage.substring(0, newmessage.length - 1);
    this.data.changeMessage(this.message);    
  }

  PopulatePriceRow(){
    if(this.vehicle.minprice === '0' && this.vehicle.maxprice != "65000"){
      this.textpreprice = "Any to ";
      this.textpricecenter = "";
      this.textminprice = "";
      this.textmaxprice = "£" + this.vehicle.maxprice;
    } else if (this.vehicle.minprice === '0' && this.vehicle.maxprice === "65000"){
      this.textpreprice = "Any"
      this.textminprice = "";
      this.textpricecenter = "";
      this.textmaxprice = "";
    } else if(this.vehicle.minprice != '0' && this.vehicle.maxprice === "65000"){
      this.textpreprice = "";
      this.textminprice = "£" + this.vehicle.minprice;
      this.textpricecenter = " to Any";
      this.textmaxprice = "";
    }else if(this.vehicle.minprice != '0' && this.vehicle.maxprice != "65000"){
      this.textpreprice = "";
      this.textminprice = "£" + this.vehicle.minprice;
      this.textpricecenter = " to ";
      this.textmaxprice = "£" + this.vehicle.maxprice;
    }
  }

  OpenPriceMenu(){ 
    var x = document.getElementById("pricemenu");
    var y = document.getElementById("pricemenuimg");
    if ((x.style.display === "block" || x.style.display === "") && (y.style.display === "block" || y.style.display === "")) {
      x.style.display = "none";
      y.style.display = "none";
    } else {
      x.style.display = "block";
      y.style.display = "block";
    }
  }

  RemoveCommaFromPrice(price){    
    if(price.length > 6) {
        var minpriceBeginning = price.substring(1,3);
        var minpriceEnd = price.substring(4,7);
        return minpriceBeginning + minpriceEnd;
    } else return price;
  }

  RemoveWhiteSpaceForImg(vehicles: any){
    var result = [];
    for (var i = 0; i < vehicles.length; i++) {
      result = vehicles[i].version.split(' ').join('');
      vehicles[i].imgUrls = [];
      vehicles[i].imgUrl = result;
      for (var j = 1; j < 4; j++) {
        vehicles[i].imgUrls.push(result + "-" + j);
      }
    }
  }

  ChangeUndefinedValuesToAny(){
    if(this.vehicle.bodyType == undefined){
      this.vehicle.bodyType = "Any";
    }
    if(this.vehicle.insuranceGroup == undefined){
      this.vehicle.insuranceGroup = "Any";
    }
  }

  ChangeColorMakeIn(e){  
    this.makeref.nativeElement.cells[0].style.color = "#01D5D1";    
  }
  ChangeColorModelIn(e){  
    this.modelref.nativeElement.cells[0].style.color = "#01D5D1";    
  }
  ChangeColorPriceIn(e){  
    this.priceref.nativeElement.cells[0].style.color = "#01D5D1";    
  }
  ChangeColorBodyTypeIn(e){  
    this.bodytyperef.nativeElement.cells[0].style.color = "#01D5D1";    
  }
  ChangeColorInsuranceGroupIn(e){  
    this.insurancegroupref.nativeElement.cells[0].style.color = "#01D5D1";    
  }
  ChangeColorMakeOut(e){
    this.makeref.nativeElement.cells[0].style.color = "#2A65BA";
  }
  ChangeColorModelOut(e){
    this.modelref.nativeElement.cells[0].style.color = "#2A65BA";
  }
  ChangeColorPriceOut(e){
    this.priceref.nativeElement.cells[0].style.color = "#2A65BA";
  }
  ChangeColorBodyTypeOut(e){
    this.bodytyperef.nativeElement.cells[0].style.color = "#2A65BA";
  }
  ChangeColorInsuranceGroupOut(e){
    this.insurancegroupref.nativeElement.cells[0].style.color = "#2A65BA";
  }
}
