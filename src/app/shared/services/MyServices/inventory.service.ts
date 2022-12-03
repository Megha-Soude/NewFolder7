import { Injectable } from '@angular/core';
import {HttpClient,HttpParams, HttpErrorResponse} from '@angular/common/http'
import {BehaviorSubject, forkJoin, throwError, Observable,of, combineLatest} from 'rxjs';
import { catchError,startWith, debounceTime, delay, map, switchMap } from 'rxjs/operators';

import {Router} from '@angular/router';
import { environment, } from '../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { InventoyDataList } from '../../../shared/models/models';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {


   

  constructor(private http:HttpClient,private _Router:Router) { }


  
  handlError(error:HttpErrorResponse)
  {
    return throwError(error)
  }
}
