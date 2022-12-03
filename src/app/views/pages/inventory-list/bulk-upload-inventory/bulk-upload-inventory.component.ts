import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FileUploadService } from 'app/file-upload/file-upload.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { ExcelService } from '../../../../shared/services/excel.service'

import Swal from "sweetalert2";
@Component({
  selector: 'app-bulk-upload-inventory',
  templateUrl: './bulk-upload-inventory.component.html',
  styleUrls: ['./bulk-upload-inventory.component.scss']
})
export class BulkUploadInventoryComponent implements OnInit {

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


  DocumentFile: any;

  SelectDocumentFiles(event) {
    var msg = 'Are You Sure to upload ' + event.target.files[0].name + '?'
    this.confirmService.confirm({ message: msg })
      .subscribe(res => {
        if (res) {
          if (event.target.files && event.target.files[0]) {
            var Extension = event.target.files[0].name.substring(
              event.target.files[0].name.lastIndexOf('.') + 1).toLowerCase();
            if (Extension == "xlsx" || Extension == "xlsx") {
              const reader = new FileReader();
              const file = event.target.files[0];
              this.DocumentFile = file;

              if (file.size < 5000000) {
                reader.readAsDataURL(event.target.files[0]);
                reader.onload = (event) => {
                  let target: any = event.target;

                  this.UploadCSV();
                }
              }
              else {
                Swal.fire('Oops...', 'Upload only 5 MB size files!')
              }
            }
            else {

              this.myInputVariable.nativeElement.value = '';

              Swal.fire('Upload only Csv Files');

            }


          }

        }
      })





  }


  UploadCSV() {
    this.loader.open();
    var Check = false;
    const formData = new FormData();
    //formData.append('bid_winner_id',  bid_winner_id);
    formData.append('files', this.DocumentFile);
    formData.append('account_pk', this.Accountpk);
    Check = true
    if (Check) {
      // this.loader.open();
      this.FileUpService.InventoryBulkupload(formData).subscribe(data => {
        if (data.success == true) {
          this.loader.close();
          this.DocumentFile = "";
          this.myInputVariable.nativeElement.value = "";
          if (data.data.length > 0) {
            // alert('Ok')
            // console.log(data.data_error_array)

            Swal.fire({
              title: 'File Uploaded Successfully!! Please check downloaded sheet for Status',
              // text: "You won't be able to revert this!",
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.value) {

                  this.excelService.exportAsExcelFile(data.data, 'Bulk Upload Status file');

              }
              else {
                  this.excelService.exportAsExcelFile(data.data, 'Bulk Upload Status file');
              }
            })


          }
          //    Swal.fire("Success, Some ids are not inserted" + "<br>" + data.invalid_account_ids.join())  }
          else {
            Swal.fire({
              title: 'File Uploaded Successfully!! ',

              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
            }).then((result) => {
            })

          }

          this.onRefresh();



        }
        else {
          this.loader.close();
          this.DocumentFile = "";



          this.myInputVariable.nativeElement.value = "";


          Swal.fire('Invalid Request. Please reupload using the assigned format only')

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
