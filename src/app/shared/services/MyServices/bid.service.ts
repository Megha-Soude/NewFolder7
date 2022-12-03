import { Injectable } from '@angular/core';
import {HttpClient,HttpParams, HttpErrorResponse} from '@angular/common/http'
import {catchError, map} from 'rxjs/operators';
import {BehaviorSubject, forkJoin, of, throwError, Observable} from 'rxjs';
import {Router} from '@angular/router';
import { environment, } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BidService {

  
  
  private CurrentBidListurl = `${environment.baseUrl}/api/v1/admin/bid_list/`;
  private BidDetailsURL = `${environment.baseUrl}/api/v1/admin/bids_logs/`;
  private BidWinnnerTMFLURL = `${environment.baseUrl}/api/v1/admin/add_bid_winner/`;
  private BidWinnnerTMFLList = `${environment.baseUrl}/api/v1/admin/bid_winnings/`;
  private EMDTrasactionListURL = `${environment.baseUrl}/api/v1/admin/get_all_emd_transactions/`;
  private RemoveBidURL = `${environment.baseUrl}/api/v1/admin/cancel_bid/`;
  private BidListExportURL = `${environment.baseUrl}/api/v1/admin/export_bid/`;
  private BidWinnerURLList = `${environment.baseUrl}/api/v1/admin/bid_winnings/`;

  private ExportLEADURL = `${environment.baseUrl}/api/v1/admin/get_enquiry/`;
  private ExportMISURL = `${environment.baseUrl}/api/v1/admin/mis_tracker/`;
  private ACRReportURL = `${environment.baseUrl}/api/v1/admin/acr_tracker/`;
  constructor(private http:HttpClient,private _Router:Router) {   }


  CurrentBidList(data:any):Observable<any>
  {
     return this.http.post<any>(this.CurrentBidListurl,data).pipe(catchError(this.handlError));
  } 
  WinnerBidList(data:any):Observable<any>
  {
     return this.http.post<any>(this.BidWinnerURLList,data).pipe(catchError(this.handlError));
  } 

  EMDTrasactionList(data:any):Observable<any>
  {
     return this.http.post<any>(this.EMDTrasactionListURL,data).pipe(catchError(this.handlError));
  } 



  BidDetails(data:any):Observable<any>
  {
     return this.http.post<any>(this.BidDetailsURL,data).pipe(catchError(this.handlError));
  } 

  BidListExport(data:any):Observable<any>
  {
     return this.http.post<any>(this.BidListExportURL,data).pipe(catchError(this.handlError));
  } 


  ExportLEAD(data:any):Observable<any>
  {
     return this.http.post<any>(this.ExportLEADURL,data).pipe(catchError(this.handlError));
  } 

  ExportMIS(data:any):Observable<any>
  {
     return this.http.post<any>(this.ExportMISURL,data).pipe(catchError(this.handlError));
  } 

  ACRReport(data:any):Observable<any>
  {
     return this.http.post<any>(this.ACRReportURL,data).pipe(catchError(this.handlError));
  }

  RemoveBid(data:any):Observable<any>
  {
     return this.http.post<any>(this.RemoveBidURL,data).pipe(catchError(this.handlError));
  } 

  
  handlError(error:HttpErrorResponse)
  {
    return throwError(error)
  }

  BidWinnnerTMFL(data:any):Observable<any>
  {
     return this.http.post<any>(this.BidWinnnerTMFLURL,data).pipe(catchError(this.handlError));
  }

  BidWinnnerTMFLlist(data:any):Observable<any>
  {
     return this.http.post<any>(this.BidWinnnerTMFLList,data).pipe(catchError(this.handlError));
  }
  BidWinnnerList(data:any):Observable<any>
  {
     return this.http.post<any>(this.BidWinnerURLList,data).pipe(catchError(this.handlError));
  }
 


}
