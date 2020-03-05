import { EngineInfoModel } from './engineinfo.model';
import { ImagesModel } from './images.model';

export class VehicleModel {
  vehicleID: number;
  make: string;
  model: string;
  year: string;
  price: number;
  roadTax: string;
  insuranceGroup: string;
  bodyType: string;
  engineInfo: EngineInfoModel;
  standardEquipmentArray: string[];
  standardEquipmentList:string[];
  rrp: string;
  save: string;
  imgUrl: string;
  imgUrls: string[];
  count: number;
  minprice: string;
  maxprice: string;
  version:string;
  postcode:string;
  distanceFromCustomerPostCode:string;
  timeFromCustomerPostCode:string;
  images: ImagesModel;
}
