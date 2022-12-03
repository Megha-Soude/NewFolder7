import { Injectable } from '@angular/core';
import { HttpInterceptor,HttpRequest,HttpHandler,HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {AuthorizeService} from '../MyServices/authorize.service'
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppinterceptorService implements HttpInterceptor {

  constructor(private auth: AuthorizeService) { }
  handlError(error:HttpErrorResponse)
  {   
    return throwError(error)
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    const headers= new HttpHeaders(
      {
        Authorization: `Bearer ${this.auth.getToken()}`,
         'Content-Type': `application/json`, 
      }
    )
    const clone= req.clone({
      headers:headers
    })
   return next.handle(clone).pipe(
     catchError(error=>{
      if (error.status === 401) {
        this.auth.loggedOut();
        throw error;
      }
      else
      {
        throw error;
      }
     })
   );
  }
}



@Injectable({
  providedIn: 'root'
})
export class TATAAppinterceptorService implements HttpInterceptor {

  constructor(private auth: AuthorizeService) { }
  handlError(error:HttpErrorResponse)
  {
    return throwError(error)
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    const headers= new HttpHeaders(
      {
        'Content-Type': `application/json`, 
        'Authorization': `Bearer ${this.auth.getTataToken()}`,
        }
    )
    const clone= req.clone({
      headers:headers
    })
   return next.handle(clone).pipe(
     catchError(this.handleError)
   );
  }
  handleError(error: HttpErrorResponse){
 
    return throwError(error);
   }
}



@Injectable({
  providedIn: 'root'
})
export class FileAppinterceptorService implements HttpInterceptor {

  constructor(private auth: AuthorizeService) { }
  handlError(error:HttpErrorResponse)
  {
    return throwError(error)
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    
    const headers= new HttpHeaders(
      {
        Authorization: `Bearer ${this.auth.getToken()}`,
       // 'Content-Type': `application/x-www-form-urlencoded`, 

        }
    )
    const clone= req.clone({
      headers:headers
    })
   return next.handle(clone).pipe(
     catchError(error=>{
      if (error.status === 401) {
        this.auth.loggedOut();
        throw error;
      }
      else
      {
        throw error;
      }
     })
   );
  }
}