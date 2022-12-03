import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FileUploadService } from 'app/file-upload/file-upload.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { ExcelService } from '../../../shared/services/excel.service'
import Swal from "sweetalert2";

@Component({
  selector: 'app-update-inventory-images',
  templateUrl: './update-inventory-images.component.html',
  styleUrls: ['./update-inventory-images.component.scss']
})
export class UpdateInventoryImagesComponent implements OnInit {
  constructor(private excelService: ExcelService,
    private Auth: AuthorizeService,
    private confirmService: AppConfirmService,
    private router: Router,
    private loader: AppLoaderService,
    private FileUpService: FileUploadService,) { }
  @ViewChild('inputFile', { static: false }) myInputVariable: ElementRef;

  Accountpk: any
  ngOnInit() {
    this.Accountpk = this.Auth.GetAccountPk()
  }


  DocumentFile = [];
  urls = new Array<string>();
  fileList: File[] = [];

  SelectDocumentFiles(event) {
    var msg = 'Are You Sure to upload ' + event.target.files[0].name + '?'
    this.confirmService.confirm({ message: msg })
    .subscribe(res => {
      if (res === false) {
        this.onRefresh();
      }
      if (res) {
        if(event.target.files){
          let files = event.target.files; 
          this.urls = [];
          var data = new FormData();
          // data.append("zip",event.target.files[0]);
          this.fileList = event.target.files;
          for (const file of this.fileList) {
           // formData.append(i.ImagePositionType, i.FileName);
           data.append('zip', file);
          // data.append("zip",event.target.files[i]);
          }

          this.loader.open()
          this.FileUpService.UpdateInventoryImagesZip(data).subscribe(res => {
            if (res.success == true) {
              this.loader.close();
              Swal.fire(res.data.message)
              this.DocumentFile = [];
              this.myInputVariable.nativeElement.value = "";
            }
            else {
              Swal.fire(res.data.message)
              this.DocumentFile = [];
              this.loader.close();
              this.myInputVariable.nativeElement.value = "";
            }
          },
    (error: any) => {
      this.loader.close();
      Swal.fire(error.error.data.message)
      this.fileList = [];
      this.DocumentFile = [];
      this.myInputVariable.nativeElement.value = "";
    });


          this.onRefresh();

        //   for (let file of files) {
        //     var Extension = event.target.files[0].name.substring(
        //       event.target.files[0].name.lastIndexOf('.') + 1).toLowerCase();
        //     if (Extension == "zip" || Extension == "Zip") {
        //       if (file.size < 5000000) {
        //         this.DocumentFile.push(file);
        //       }
        //       else {
        //         Swal.fire('Oops...', 'Upload only 5 MB size files!')
        //       }
        //     }
        //     else {
        //       this.myInputVariable.nativeElement.value = '';
        //       Swal.fire('Upload only Zip Files');
        //     }
        // }
        //this.UploadImagesZip(this.DocumentFile)
        }
      }
      else{
        this.fileList = [];
              this.DocumentFile = [];
              this.loader.close();
              this.myInputVariable.nativeElement.value = "";
      }
      })
  }



  


  UploadImagesZip(data) {
    //this.loader.open();
    var Check = false;
    const formData = new FormData();
    for (var i = 0; i < data.length; i++) { 
      formData.append("zip",data[i],"/C:/Users/admin/Downloads/ezyzip.zip");
    }
    formData.append('account_pk', this.Accountpk);
    Check = true
    if (Check) {
      this.FileUpService.UpdateInventoryImagesZip(formData).subscribe(res => {
        if (res.success == true) {
          this.loader.close();
          Swal.fire(res.data.message)
          this.DocumentFile = [];
          this.myInputVariable.nativeElement.value = "";
        }
        else {
          Swal.fire(res.data.message)
          this.DocumentFile = [];
          this.loader.close();
          this.myInputVariable.nativeElement.value = "";
        }
      });
    }
    else {
      //  this.loader.close();
      Swal.fire('Error Occured , Please Try After Some Times')
    }
  }


  onRefresh() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; };
    // let currentUrl = this.router.url + '?';
    let currentUrl = this.router.url;
    this.router.navigateByUrl(currentUrl)
      .then(() => {
        this.router.navigated = false;
        this.router.navigate([this.router.url]);
      });
  }

}
