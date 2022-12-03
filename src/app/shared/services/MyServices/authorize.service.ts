import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, of, throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment, } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {

  private TmflLoginUrl1 ='http://20.193.241.129:8000/api/v1/admin/registration/';
  private SendOTPURL1 ='http://20.193.241.129:8000/api/v1/admin/login/send_otp/';
  private TmflLoginUrl = `${environment.baseUrl}/api/v1/admin/registration/`;
  private SendOTPURL = `${environment.baseUrl}/api/v1/admin/login/send_otp/`;
  private loginOTPURL = `${environment.baseUrl}/api/v1/admin/channel_partner/login/`;
  
  constructor(private http: HttpClient, private _Router: Router) { }


  // TataloginAuth(data: any): Observable<any> {
  //   return this.http.post<any>(this.TATALoginUrl, data).pipe(catchError(this.handlError));
  // }

  loginAuth(data: any): Observable<any> {
    return this.http.post<any>(this.TmflLoginUrl, data).pipe(catchError(this.handlError));
  }


  loginOTP(data: any): Observable<any> {
    return this.http.post<any>(this.loginOTPURL, data).pipe(catchError(this.handlError));
  }

  ExpireDateTime: any;
  loggedIn() {
    this.ExpireDateTime = JSON.parse(localStorage.getItem('timer'));
    let date1 = new Date();
    let date2 = new Date(this.ExpireDateTime);
    if (date2 >= date1) {
      if (localStorage.getItem('TMFLAtoken') && localStorage.getItem('TMFLAtoken') != "null") {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      // localStorage.clear();
      return false;
    }


  }



  SendOTP(data: any): Observable<any> {
    return this.http.post<any>(this.SendOTPURL, data).pipe(catchError(this.handlError));
  }

  public getToken(): string {
    if (this.loggedIn()) {
      return localStorage.getItem('TMFLAtoken');
    }
    else {

    }
  }
  public getTataToken(): string {
    return localStorage.getItem('TataToken');
  }

  public GetAccountPk(): string {
    return localStorage.getItem('id');
  }


  loggedOut() {
    localStorage.removeItem('TMFLAtoken')
     localStorage.clear();
     sessionStorage.clear();
    this._Router.navigate(['/login']);
  }
  handlError(error: HttpErrorResponse) {
    return throwError(error)
  }


}
