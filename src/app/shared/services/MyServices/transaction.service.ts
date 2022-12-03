import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, of, throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment, } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient, private _Router: Router) { }



  handlError(error: HttpErrorResponse) {
    return throwError(error)
  }

}
