import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, of, throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment, } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

 
  private uploadInventoryImages = `${environment.baseUrl}/api/v1/admin/upload_inventory_files/`;
  private updateInventoryImages = `${environment.baseUrl}/api/v1/admin/inventory_images_folder_upload/`;
  private uploadAuctionImagesTMFLURL = `${environment.baseUrl}/api/v1/admin/upload_auction_files/`;

  private InventoryBulkuploadURL = `${environment.baseUrl}/api/v1/admin/upload_bulk_inventory/`;
  private UpdateInventoryURL = `${environment.baseUrl}/api/v1/admin/update_bulk_inventory/`;
  private UploadOBSURL = `${environment.baseUrl}/api/v1/admin/confirm_winner/`;


  constructor(private http: HttpClient, private _Router: Router) { }

  InventoryBulkupload(data: FormData) {
    return this.http.post<any>(this.InventoryBulkuploadURL, data).pipe(catchError(this.handlError))
  }


  UpdateInventory(data: FormData) {
    return this.http.post<any>(this.UpdateInventoryURL, data).pipe(catchError(this.handlError))
  }
  UpdateInventoryImagesZip(data: FormData) {
    return this.http.post<any>(this.updateInventoryImages, data).pipe(catchError(this.handlError))
  }

  uploadInventoryImagesTMFL(data: FormData) {
    return this.http.post<any>(this.uploadInventoryImages, data).pipe(catchError(this.handlError))
  }
  uploadOBSExcel(data: FormData) {
    return this.http.post<any>(this.UploadOBSURL, data).pipe(catchError(this.handlError))
  }


  
  uploadAuctionImagesTMFL(data: FormData) {
    return this.http.post<any>(this.uploadAuctionImagesTMFLURL, data).pipe(catchError(this.handlError))
  }



  handlError(error: HttpErrorResponse) {
    return throwError(error)
  }
}
