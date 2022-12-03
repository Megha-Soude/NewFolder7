
  import { DatePipe } from '@angular/common';
  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { MatDialog, MatDialogRef } from '@angular/material';
  import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
  import { CommonService } from 'app/shared/services/MyServices/common.service';
  import Swal from 'sweetalert2';
  
  import { BidService } from '../../../shared/services/MyServices/bid.service';
  
  import { ExcelService } from 'app/shared/services/excel.service';
  import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-leadreport',
  templateUrl: './leadreport.component.html',
  styleUrls: ['./leadreport.component.scss']
})
export class LeadreportComponent implements OnInit {


  date = new Date();
  minDate = new Date(this.date.getFullYear(),  this.date.getMonth() , this.date.getDate() );
  maxDate = new Date(this.date.getFullYear(), this.date.getMonth() ,  this.date.getDate() );
    constructor(private formBuilder: FormBuilder, private excelService: ExcelService,
      private dialog: MatDialog,
      private commonService: CommonService, private loader: AppLoaderService, private datepipe: DatePipe, private BidService: BidService,) { }
  
    Form: FormGroup;
  
    ngOnInit() {
  
      this.Form = this.formBuilder.group({
        from_date: [],
        to_date: [],
        type: ['ALL'],
      })
  
  
    }
  
    SelectedType: any = 'ALL'
    OnChangeType(value) {
      this.SelectedType = value
  
  
  
   
    }
  
    Download() {
      
  
  
  
      if (this.Form.value.type == 'DateWise') {
  
  
        if (this.Form.value.from_date == null && this.Form.value.to_date == null) {
          Swal.fire('Select From Date & To Date');
          return false
        }
  
        if (this.Form.value.from_date !== null || this.Form.value.to_date !== null) {
          if (this.Form.value.from_date == null && this.Form.value.to_date !== null) {
            Swal.fire('Select From Date');
            return false
          }
          else if (this.Form.value.from_date !== null && this.Form.value.to_date == null) {
            Swal.fire('Select To Date');
            return false
          }
        }
  
        if (this.Form.value.from_date !== null && this.Form.value.to_date !== null) {
          var d1 = Date.parse(this.datepipe.transform(this.Form.value.from_date, 'yyyy-MM-dd'));
          var d2 = Date.parse(this.datepipe.transform(this.Form.value.to_date, 'yyyy-MM-dd'));
          if (d1 > d2) {
            Swal.fire('From-Date Should be Less Than To-Date.');
            return false
          }
        }
  
        var Json1  = {from_date : this.datepipe.transform(this.Form.value.from_date, 'yyyy-MM-dd')  , to_date :this.datepipe.transform(this.Form.value.to_date, 'yyyy-MM-dd') } 
        this.reportDownload(Json1)
      }
  
      else {
        var Json = { from_date: '', to_date: '' }
  
        this.reportDownload(Json)
      }
  
  
  
  
  
  
  
  
  
  
  
    }
  
    TempDownloadarray = []
    pendingcount: any
  
    reportDownload(Json) {
  
  
  
  
  
  this.loader.open()
      this.BidService.ExportLEAD(Json)
        .subscribe(data => {
          if (data instanceof HttpErrorResponse) {
            return;
          }
          if (data.success = true) {
            this.loader.close()

            for (let entry of data.data) {
              var Json = {
                "First Name": entry['first_name'],
                "Last Name": entry['last_name'],
                "Mobile Number": entry['mobile_number'],
                "Category": entry['category'],
                "Chassis Description":entry['chassis_description'],
                "Contract No":entry['contract_no'],
                "Registration No":entry['registration_no'],
                "User Account":entry['user_login'],
                // "Buying Price":entry['expected_price'],
                // "Inventory Id":entry['inventory_id'],
                "Interested for finance":entry['interested_finance'],
                
                //  "Status": entry.status,
                "Created At": this.datepipe.transform(entry.created_at, 'dd-MM-yyyy hh:mm:ss.sss a')
              }
  
  
              this.TempDownloadarray.push(Json)
        
              this.pendingcount = this.TempDownloadarray.length;
  
           }
            this.excelService.exportAsExcelFile(this.TempDownloadarray, 'Lead_Report');
  
            this.TempDownloadarray = []
  
          }
          else {
            this.loader.close()
            Swal.fire(data.data.msg, 'Error')
          }
  
        });
  
  
    }
  
  }
  

