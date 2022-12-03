import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CommonService } from 'app/shared/services/MyServices/common.service';
import Swal from 'sweetalert2';

import { BidService } from '../../../../shared/services/MyServices/bid.service';

import { ExcelService } from 'app/shared/services/excel.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-misreport',
  templateUrl: './misreport.component.html',
  styleUrls: ['./misreport.component.scss']
})
export class MISReportComponent implements OnInit {

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
    this.BidService.ExportMIS(Json)
      .subscribe(data => {
        if (data instanceof HttpErrorResponse) {
          return;
        }
        if (data.success = true) {
          this.loader.close()
          
          let entry = data.data;
          // for (let entry of data.data) {
            var Json = {
              "Pending Registration Fee": entry['Pending Registration Fee'],
              "Approved Registration Fee": entry['Approved Registration Fee'],
              "Registration Authorization Done": entry['Registration Authorization Done'],
              "Registration Fee SAP Posted":entry['Registration Fee SAP Posted'],
              "EMD Pending":entry['EMD Pending'],
              "EMD Authorization Done":entry['EMD Authorization Done'],
              "EMD Approved":entry['EMD Approved'],
              "EMD SAP Posted":entry['EMD SAP Posted'],
              "Registration Fee Collected":entry['Registration Fee Collected'],
              "EMD Collected":entry['EMD Collected'],

              "Total Inventory": entry['Total Inventory'],
              "Inventory Document": entry['Inventory Document'],
              "Total_Registration_at_portal_by_Bidder": entry['Total Registration at portal by Bidder'],
              "KYC_Uploaded_by_Bidder":entry['KYC Uploaded by Bidder'],
              "Total_KYC_Documents_Uploaded":entry['Total KYC Documents Uploaded'],
              "Auction_Scheduled_By_HO_Admin":entry['Auction Scheduled By HO Admin'],
              "Auction_Live":entry['Auction Live'],
              "Auction_Completed":entry['Auction Completed'],
              "Total_Bidding done":entry['Total Bidding done'],
              "Bidding_Approved":entry['Bidding Approved'],
              // "Bid_Amount": entry.bid_amount,
              // "Bit Attempts": entry.bid_logs.length,
              // "Status": entry.status,
              // "Date": this.datepipe.transform(entry.updated_at, 'dd-MM-yyyy hh:mm:ss.sss a')
            }


            this.TempDownloadarray.push(Json)
      
            this.pendingcount = this.TempDownloadarray.length;

         // }
          this.excelService.exportAsExcelFile(this.TempDownloadarray, 'Tracker');

          this.TempDownloadarray = []

        }
        else {
          this.loader.close()
          Swal.fire(data.data.msg, 'Error')
        }

      });


  }

}
