import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { from } from 'rxjs';
import { TataServiceService} from 'app/TataService/tata-service.service';
  import {TATAAppinterceptorService} from 'app/shared/services/MyServices/appinterceptor.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,HttpClientModule
  ],
  providers: [TataServiceService,
    {provide: HTTP_INTERCEPTORS, useClass: TATAAppinterceptorService, multi: true},
  ],
})
export class TataServiceModule { }
