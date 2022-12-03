import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, of, throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment, } from '../../../../environments/environment';

import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthorizeService } from './authorize.service';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {


  private auctionMasterUrl = `${environment.baseUrl}/api/v1/add/auction/`;

  constructor(private http: HttpClient, private _Router: Router,private auth: AuthorizeService) { }

 

  AddAuctionMasterDetails(data): Observable<any> {
    const HttpUploadOptions = {
      headers: new HttpHeaders({
        'Content-Type': `application/json`, Authorization: `Bearer ${this.auth.getTataToken()}`,
      })
    }
    return this.http.post<any>(this.auctionMasterUrl, data, HttpUploadOptions).pipe(catchError(this.handlError));
  }

  createAuthHeader(headers: Headers) {
    //headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    })
  }
  private httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    })
  }

  private headerDict = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
  }

  private requestOptionss = {
    headers: new Headers(this.headerDict),
  };


 


  //uploadData(data: any): Observable<any> {
 


  // return this.http.post(
  //     this.UploadDocumentUrl + '/token'
  //    , data.toString()
  //    , { headers: headers }
  //   )
  //   .pipe(map(res => res.json()))
  //   .pipe(map(res => {
  //     localStorage.setItem('auth_token', res.auth_token);
  //     return true;
  //   }))
  //   .pipe(catchError((error: any) => {
  //     return Observable.throw(error);
  //   }));
  //   }



  // uploadData(data: any): Observable<any> {
  //   const headers= new HttpHeaders(
  //     {
  //       'Content-Type': `application/x-www-form-urlencoded`,
  //     }
  //   )

  //   return this.http.post(this.UploadDocumentUrl,data,
  //     {
  //       headers: headers
  //     });
  //   // return this.http.post(this.UploadDocumentUrl, data, {
  //   //          headers:{"Content-Type": "application/x-www-form-urlencoded"},
  //   //          observe: 'response' }).pipe(catchError(this.handlError));
  //   //return this.http.post<any>(this.UploadDocumentUrl,data).pipe(catchError(this.handlError));
  // }

  handlError(error: HttpErrorResponse) {
    return throwError(error)
  }
}