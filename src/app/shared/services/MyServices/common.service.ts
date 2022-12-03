import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, of, throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment, } from '../../../../environments/environment';
import { AuthorizeService } from '../MyServices/authorize.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {








  private addEmD = `${environment.baseUrl}/api/v1/admin/add_emd/`;

  private PartyTypeDrpDown = `${environment.baseUrl}/api/v1/admin/party_types/`;



  private PartySubTypeDrpDown = `${environment.baseUrl}/api/v1/admin/party_sub_types/`;






  private PagemasterDataURL = `${environment.baseUrl}/api/v1/admin/get_all_pages/`;





  private InsertUpdatePagemappingURL = `${environment.baseUrl}/api/v1/admin/assign_page/`;


  private YardUrl = `${environment.baseUrl}/api/v1/admin/get_all_yards/`;
  private InsertUpdatePositionMasppingURL = `${environment.baseUrl}/api/v1/admin/update_create_party_sub_type/`;
  private AddvehicleURL = `${environment.baseUrl}/api/v1/admin/add/inventory/`;
  private GetPPtURl = `${environment.baseUrl}/api/v1/admin/get_categories/`;
  private YarddetailUrl = `${environment.baseUrl}/api/v1/admin/get_yard_details/`;
  private ChasiedescriptionURL = `${environment.baseUrl}/api/v1/admin/get_chassis_desc/`;
  private InventoryListURL = `${environment.baseUrl}/api/v1/admin/inventory_list/`;
  private AddAuctionURL = `${environment.baseUrl}/api/v1/add/auction/`;
  private AuctionlistUrl = `${environment.baseUrl}/api/v1/admin/auction_list/`;
  private UploadInventoryimagesURL = `${environment.baseUrl}/api/v1/admin/upload_inventory_files/`;

  private bidListURL = `${environment.baseUrl}/api/v1/admin/get_all_bids/`;

  private disableUSER = `${environment.baseUrl}/api/v1/admin/user/activate_deactivate/`;
  private AuctionStatsChangeURL = `${environment.baseUrl}/api/v1/admin/update_auction_status/`;

  private AuctionDetailsURL = `${environment.baseUrl}/api/v1/admin/view_auction/`;
  private RemoveInventoryUrl = `${environment.baseUrl}/api/v1/admin/remove_inventory_file/`;



  private updateAuctionApiURL = `${environment.baseUrl}/api/v1/update/auction/`;
  private updateVehicleURL = `${environment.baseUrl}/api/v1/admin/update/inventory/`;

  private getVehicleDetailbyidURL = `${environment.baseUrl}/api/v1/admin/inventory_details/`;
  private changestatusURL = `${environment.baseUrl}/api/v1/admin/update_inventory_status/`;
  private MarkAsSoldURL = `${environment.baseUrl}/api/v1/admin/sold_inventory/`;

  private EvaluatorListURL = `${environment.baseUrl}/api/v1/admin/get_evaluators/`;

  private GetstateURL = `${environment.baseUrl}/api/v1/get_states/`;

  private GetDistrictURL = `${environment.baseUrl}/api/v1/get_districts/`;

  private GetApprovalData = `${environment.baseUrl}/api/v1/admin/obs/approval/`;

  private SettingsURL = `${environment.baseUrl}/api/v1/admin/settings/`;
  private CompanyCodeListURL = `${environment.baseUrl}/api/v1/branch_list/`;
  private BranchListURL = `${environment.baseUrl}/api/v1/branch_list/`;
  private BuyerState = `${environment.baseUrl}/api/v1/admin/buyer_state/`;
  //exceldownloads
  private UserListURL = `${environment.baseUrl}/api/v1/admin/registered_user_list/`;
  private EmdTransactionListURL = `${environment.baseUrl}/api/v1/admin/get_all_emd_transactions/`;
  private AuctionListURL = `${environment.baseUrl}/api/v1/admin/auction_all_data_list/`;
  private InventoryListURLNew = `${environment.baseUrl}/api/v1/admin/inventory_list/`;
  private ACRReportURL = `${environment.baseUrl}/api/v1/admin/acr_tracker/`;
  //close
  private InventoryStatus = new BehaviorSubject<string>('');
  cast = this.InventoryStatus.asObservable();
  constructor(private http: HttpClient, private auth: AuthorizeService) { }
  getAuditButtonStatus(data) {
    this.InventoryStatus.next(data);
    this.getJSON().subscribe(data => {
      // console.log(data);
    });


  }
  private getToken = this.auth.getToken();

  disableUser(Data: any): Observable<any> {
    return this.http.post<any>(this.disableUSER, Data).pipe(catchError(this.handlError));
  }


  public getJSON(): Observable<any> {
    return this.http.get("./assets/mydata.json");
  }


  Getstate(Data: any): Observable<any> {
    //return this.http.post<any>(this.GetstateURL, '').pipe(catchError(this.handlError));
    return this.http.get(this.GetstateURL).pipe(catchError(this.handlError));
  }

  GetDistrict(Data: any): Observable<any> {
    return this.http.post<any>(this.GetDistrictURL, Data).pipe(catchError(this.handlError));
    // return this.http.get(this.GetDistrictURL).pipe(catchError(this.handlError));
  }

  // BindCategory(): Observable<any> {
  //   return this.http.post<any>(this.CategoryUrl, '').pipe(catchError(this.handlError));
  // }

  // BindSubCategory(data: any): Observable<any> {
  //   return this.http.post<any>(this.SubCategoryUrl, data).pipe(catchError(this.handlError));
  // }



  getBranchCode(data): Observable<any> {
    const HttpUploadOptions = {
      headers: new HttpHeaders({
        'Content-Type': `application/json`, Authorization: `Bearer ${this.auth.getToken()}`,
      })
    }
    return this.http.post<any>(this.BranchListURL, data, HttpUploadOptions).pipe(catchError(this.handlError));
  }

  getApproval(data): Observable<any> {
    return this.http.post<any>(this.GetApprovalData, data).pipe(catchError(this.handlError));
  }


  GetBuyerState(data): Observable<any> {
    const HttpUploadOptions = {
      headers: new HttpHeaders({
        'Content-Type': `application/json`, Authorization: `Bearer ${this.auth.getToken()}`,
      })
    }
    return this.http.post<any>(this.BuyerState, data, HttpUploadOptions).pipe(catchError(this.handlError));
  }


  getCompanyCode(data): Observable<any> {
    const HttpUploadOptions = {
      headers: new HttpHeaders({
        'Content-Type': `application/json`, Authorization: `Bearer ${this.auth.getToken()}`,
      })
    }
    return this.http.post<any>(this.CompanyCodeListURL,data, HttpUploadOptions).pipe(catchError(this.handlError));
  }

  AddEMD(data): Observable<any> {
    const HttpUploadOptions = {
      headers: new HttpHeaders({
        'Content-Type': `application/json`, Authorization: `Bearer ${this.auth.getToken()}`,
      })
    }
    return this.http.post<any>(this.addEmD, data, HttpUploadOptions).pipe(catchError(this.handlError));
  }

  BindPartyType(Data: any): Observable<any> {
    return this.http.post<any>(this.PartyTypeDrpDown, Data).pipe(catchError(this.handlError));
  }



  EvaluatorList(Data: any): Observable<any> {
    return this.http.post<any>(this.EvaluatorListURL, Data).pipe(catchError(this.handlError));
  }








  BindSubPartyType(Data: any): Observable<any> {
    return this.http.post<any>(this.PartySubTypeDrpDown, Data).pipe(catchError(this.handlError));
  }















  Yardmaster(): Observable<any> {
    return this.http.post<any>(this.YardUrl, '').pipe(catchError(this.handlError));
  }


  GetPPt(Data: any): Observable<any> {
    return this.http.post<any>(this.GetPPtURl, Data).pipe(catchError(this.handlError));
  }


  AddVehicle(Data: any): Observable<any> {
    return this.http.post<any>(this.AddvehicleURL, Data).pipe(catchError(this.handlError));
  }


  updateVehicle(Data: any): Observable<any> {
    return this.http.post<any>(this.updateVehicleURL, Data).pipe(catchError(this.handlError));
  }


  getVehicleDetailbyid(Data: any): Observable<any> {
    return this.http.post<any>(this.getVehicleDetailbyidURL, Data).pipe(catchError(this.handlError));
  }

  UploadInventoryimages(Data: FormData) {
    return this.http.post<any>(this.UploadInventoryimagesURL, Data).pipe(catchError(this.handlError));
  }


  Yarddetail(Data: any): Observable<any> {
    return this.http.post<any>(this.YarddetailUrl, Data).pipe(catchError(this.handlError));
  }

  InventoryList(Data: any): Observable<any> {
    return this.http.post<any>(this.InventoryListURL, Data).pipe(catchError(this.handlError));
  }


  MarkAsSold(Data: any): Observable<any> {
    return this.http.post<any>(this.MarkAsSoldURL, Data).pipe(catchError(this.handlError));
  }

  Auctionlist(Data: any): Observable<any> {
    return this.http.post<any>(this.AuctionlistUrl, Data).pipe(catchError(this.handlError));
  }


  AuctionDetails(Data: any): Observable<any> {
    return this.http.post<any>(this.AuctionDetailsURL, Data).pipe(catchError(this.handlError));
  }


  bidList(Data: any): Observable<any> {
    return this.http.post<any>(this.bidListURL, Data).pipe(catchError(this.handlError));
  }



  Settings(Data: any): Observable<any> {
    return this.http.post<any>(this.SettingsURL, Data).pipe(catchError(this.handlError));
  }










  AddAuction(Data: any): Observable<any> {
    return this.http.post<any>(this.AddAuctionURL, Data).pipe(catchError(this.handlError));
  }


  updateAuctionApi(Data: any): Observable<any> {
    return this.http.post<any>(this.updateAuctionApiURL, Data).pipe(catchError(this.handlError));
  }





  Changestatus(Data: any): Observable<any> {
    return this.http.post<any>(this.changestatusURL, Data).pipe(catchError(this.handlError));
  }

  AuctionStatsChange(Data: any): Observable<any> {
    return this.http.post<any>(this.AuctionStatsChangeURL, Data).pipe(catchError(this.handlError));
  }


  Chasiedescription(): Observable<any> {
    return this.http.post<any>(this.ChasiedescriptionURL, '').pipe(catchError(this.handlError));
  }




  // BindState() {
  //   return this.http.post(this.StateURL, {
  //     headers:{"Content-Type": "application/json"},
  //    observe: 'response'
  //  }).pipe(catchError(err => of(err)));
  //}












  getUserCode(): string {
    if (localStorage.getItem('loginData') && localStorage.getItem('loginData') != "null") {
      var i = JSON.parse(localStorage.getItem('loginData'))
      return i.user_id;
    }
    else {
      return null;
    }
  }
  getUserCode1(): string {
    if (localStorage.getItem('loginData') && localStorage.getItem('loginData') != "null") {
      var i = JSON.parse(localStorage.getItem('loginData'))
      return i.user_code;
    }
    else {
      return null;
    }
  }
  getDealerCode(): string {
    if (localStorage.getItem('loginData') && localStorage.getItem('loginData') != "null") {
      var i = JSON.parse(localStorage.getItem('loginData'))
      //return i[0].dealer_code;
      return i.username;
    }
    else {
      return null;
    }
  }

  getUserDetails(): string {
    if (localStorage.getItem('loginData') && localStorage.getItem('loginData') != "null") {
      var i = JSON.parse(localStorage.getItem('loginData'))
      return i;
    }
    else {
      return null;
    }
  }

  getFullName(): string {
    if (localStorage.getItem('loginData') && localStorage.getItem('loginData') != "null") {
      var i = JSON.parse(localStorage.getItem('loginData'))
      // return i[0].dsm_name;

      let Name = ";"
      if (i.first_name = null) {
        Name = i.first_name + ' ' + i.last_name;
      }
      else {
        Name = i.username;
      }
      return Name;
      // return i.username;
    }
    else {
      return null;
    }
  }



  getRole(): string {
    if (localStorage.getItem('loginData') && localStorage.getItem('loginData') != "null") {
      var i = JSON.parse(localStorage.getItem('loginData'))
      return i.role_name;
    }
    else {
      return null;
    }
  }
  GetPagemasterData(Data: any): Observable<any> {
    return this.http.post(this.PagemasterDataURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  Insertupdate_page_mapping(Data: any): Observable<any> {
    return this.http.post(this.InsertUpdatePagemappingURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  InsertUpdateSubpartyMapping(Data: any): Observable<any> {
    return this.http.post(this.InsertUpdatePositionMasppingURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }



  RemoveInventoryById(data: any): Observable<any> {
    return this.http.post<any>(this.RemoveInventoryUrl, data).pipe(catchError(this.handlError));
  }

  handlError(error: HttpErrorResponse) {
    return throwError(error)
  }

  //excel download api 
  async UserListExcel(Data: any): Promise<any> {
    return await this.http.post(this.UserListURL, Data, { headers: { "Content-Type": "application/json" } }).toPromise();
  }
  async EmdTransactionListExcel(Data: any): Promise<any> {
    return await this.http.post(this.EmdTransactionListURL, Data, { headers: { "Content-Type": "application/json" } }).toPromise();
  }
  async AuctionListExcel(Data: any): Promise<any> {
    return await this.http.post(this.AuctionListURL, Data, { headers: { "Content-Type": "application/json" } }).toPromise();
  }
  async InventoryListExcel(Data: any): Promise<any> {
    return await this.http.post(this.InventoryListURLNew, Data, { headers: { "Content-Type": "application/json" } }).toPromise();
  }
  async ACRReportListExcel(Data: any): Promise<any> {
    return await this.http.post(this.ACRReportURL, Data, { headers: { "Content-Type": "application/json" } }).toPromise();
  }
  //close
}
