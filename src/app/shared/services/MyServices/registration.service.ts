import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import {catchError} from 'rxjs/operators';
import { throwError, Observable} from 'rxjs';
import {Router} from '@angular/router';
import { environment, } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RegistrationService {


  private GetAllusersTMFLURL = `${environment.baseUrl}/api/v1/admin/registered_user_list/`;
  private AdminRegistrationURL = `${environment.baseUrl}/api/v1/admin/add_user/`;
  private updateCategoryLimitURL = `${environment.baseUrl}/api/v1/admin/update_category_limit/`;
  private state = `${environment.baseUrl}/api/v1/get_states/`;
  private district = `${environment.baseUrl}/api/v1/get_districts/`;
  private city = `${environment.baseUrl}/api/v1/get_cities/`;
  private pincode = `${environment.baseUrl}/api/v1/get_pincodes/`;
  private updateBuyeRegistration = `${environment.baseUrl}/api/v1/registration/`;
  constructor(private http:HttpClient,private _Router:Router) { }
  // Buyer Registration Start
  GetAllusers(data:any):Observable<any>
  {
     return this.http.post<any>(this.GetAllusersTMFLURL,data).pipe(catchError(this.handlError));
  }

  AdminRegistration(data:any):Observable<any>
  {
     return this.http.post<any>(this.AdminRegistrationURL,data).pipe(catchError(this.handlError));
  }

  updateCategoryLimit(data:any):Observable<any>{
    return this.http.post<any>(this.updateCategoryLimitURL,data).pipe(catchError(this.handlError));
  }
  BindState(): Observable<any> {
    return this.http.get(this.state).pipe(catchError(this.handlError))
  }

  BindDistrict(data): Observable<any> {
    return this.http.post(this.district, data).pipe(catchError(this.handlError))
  }

  BindCity(data): Observable<any> {
    return this.http.post(this.city, data).pipe(catchError(this.handlError));
  }

  BindPincode(data): Observable<any> {
    return this.http.post(this.pincode, data).pipe(catchError(this.handlError));
  }

  handlError(error:HttpErrorResponse)
  {
    return throwError(error)
  }
 
}
