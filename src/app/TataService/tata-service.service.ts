import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpBackend, HttpHeaders } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, of, throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment, } from 'environments/environment';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';


@Injectable({
  providedIn: 'root'
})
export class TataServiceService {
  private httpClient: HttpClient;

  constructor(private handler: HttpBackend, private http: HttpClient, private auth: AuthorizeService) {
    this.httpClient = new HttpClient(handler);
  }







 

  BindNewState(): Promise<any> {
    const HttpUploadOptions = {
      headers: new HttpHeaders({
        'Content-Type': `application/json`, Authorization: `Bearer ${this.auth.getTataToken()}`,
      })
    }
    let url = `${environment.baseUrl}/api/v1/get_states/`;
    return this.httpClient.get<any>(url, HttpUploadOptions).toPromise();
  }

  BindNewDistrict(data: any): Observable<any> {
    const HttpUploadOptions = {
      headers: new HttpHeaders({
        'Content-Type': `application/json`, Authorization: `Bearer ${this.auth.getTataToken()}`,
      })
    }
    let url = `${environment.baseUrl}/api/v1/get_districts/`;
    return this.httpClient.post(url, data, HttpUploadOptions).pipe(catchError(err => of(err)));
  }
  BindNewCity(data: any): Observable<any> {
    const HttpUploadOptions = {
      headers: new HttpHeaders({
        'Content-Type': `application/json`, Authorization: `Bearer ${this.auth.getTataToken()}`,
      })
    }
    let url = `${environment.baseUrl}/api/v1/get_cities/`
    return this.httpClient.post(url, data, HttpUploadOptions).pipe(catchError(err => of(err)));
  }


 






 

  handlError(error: HttpErrorResponse) {
    return throwError(error)
  }

}
