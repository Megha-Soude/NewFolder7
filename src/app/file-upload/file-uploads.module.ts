import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FileUploadService} from '../file-upload/file-upload.service';
  import { from } from 'rxjs';
  import {FileAppinterceptorService} from 'app/shared/services/MyServices/appinterceptor.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,HttpClientModule
  ],
  providers: [FileUploadService,
    {provide: HTTP_INTERCEPTORS, useClass: FileAppinterceptorService, multi: true},
  ],
})
export class FileUploadsModule { }
