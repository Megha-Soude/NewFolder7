import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { egretAnimations } from "../../../shared/animations/egret-animations";
import { Bid } from '../../../shared/models/bid';
import { BidService } from '../../../shared/services/MyServices/bid.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { DataPassService } from 'app/shared/services/MyServices/data-pass.service';
import { CommonService } from '../../../shared/services/MyServices/common.service'
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { Page } from '../../../../../src/app/shared/models/PaginationPage'
import { DatePipe } from '@angular/common';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { ExcelService } from 'app/shared/services/excel.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-acr-report',
  templateUrl: './acr-report.component.html',
  styleUrls: ['./acr-report.component.scss'], animations: egretAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class AcrReportComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) mydatatable1: DatatableComponent;
  page = new Page();
  Accountpk: any
  items: any[];
  temp = [];
  testaay = []
  pendingcount: any = 0;
  isdisablereport: boolean = true;
  FilterString: any;
  Auction_Title
    Chassis_No
    Mobile_Number;
    Contract_Number
    Email_Id
    Inventory_Title
    Total_Bid_Count
    WINNING_BID_AMOUNT
    Winner_Name
    Year_of_manufacture
    start_at
    end_at
  constructor(private router: Router,
    private BidService: BidService,
    private DataPassServic: DataPassService,
    private CommonService: CommonService, 
    private datepipe: DatePipe,
    private loader: AppLoaderService,
    private Auth: AuthorizeService,
    private confirmService: AppConfirmService,
    private excelService: ExcelService,) 
    { 
      this.page.pageNumber = 0;
      this.page.size = 10;
      this.page.totalElements = 0;

    }

  ngOnInit() {
 
    this.Accountpk = this.Auth.GetAccountPk()
    const ListInput1: Input = {} as Input;
    ListInput1.size = 10
    ListInput1.offset = 0
    ListInput1.account_pk = this.Accountpk
    this.GetList(ListInput1)
  }
  GetList(json) {
    this.loader.open();
    this.items = []
    this.FilterStrings(json);
    this.BidService.ACRReport(json).subscribe(
      (res) => {
        if (res.success == true) {
          this.loader.close()
          this.items = this.temp = res.data as Bid[];
          this.items = res.data;
          this.page.pageNumber = 0;
          this.page.size = 10;
          this.page.totalElements = res.count
          this.mydatatable1.offset = (json.offset)/10;
        } else {
          this.loader.close()
          Swal.fire("Oops...", res.data.message, "error");
          this.items = [];
          this.page.pageNumber = 0;
          this.page.size = 0;
          this.page.totalElements = 0
          this.mydatatable1.offset = (json.offset)/10;
        }
      },
      (err) => {
        this.mydatatable1.offset = (json.offset)/10;
        this.loader.close()
        // Swal.fire("Oops...", err.msg, "error");
        Swal.fire("Oops...", err.error.data.message, "error");
      }
    );
  }

  FilterStrings(ListInput) {

    this.FilterString = "";
    
    if (ListInput.Auction_Title == "" || ListInput.Auction_Title == undefined || ListInput.Auction_Title == null) {
    } else { this.FilterString = ' <b>Auction Title: </b>' + ListInput.Auction_Title; }

    if (ListInput.Chassis_No == "" || ListInput.Chassis_No == undefined || ListInput.Chassis_No == null) {
    } else { this.FilterString = this.FilterString + ' <b>Mobile Number: </b>' + ListInput.Chassis_No; }
    
    if (ListInput.Mobile_Number == "" || ListInput.Mobile_Number == undefined || ListInput.Mobile_Number == null) {
    } else { this.FilterString = this.FilterString + ' <b>Mobile Number : </b>' + ListInput.Mobile_Number; }

    if (ListInput.Contract_Number == "" || ListInput.Contract_Number == undefined || ListInput.Contract_Number == null) {
    } else { this.FilterString = this.FilterString + ' <b>Contract Number : </b>' + ListInput.Contract_Number; }
    
    if (ListInput.Email_Id == "" || ListInput.Email_Id == undefined || ListInput.Email_Id == null) {
    } else { this.FilterString = this.FilterString + ' <b>Email Id : </b>' + ListInput.Email_Id; }

    if (ListInput.Inventory_Title == "" || ListInput.Inventory_Title == undefined || ListInput.Inventory_Title == null) {
    } else { this.FilterString = this.FilterString + ' <b>Inventory Title : </b>' + ListInput.Inventory_Title; }

    if (ListInput.Total_Bid_Count == "" || ListInput.Total_Bid_Count == undefined || ListInput.Total_Bid_Count == null) {
    } else { this.FilterString = this.FilterString + ' <b>Total Bid Count : </b>' + ListInput.Total_Bid_Count; }

    if (ListInput.WINNING_BID_AMOUNT == "" || ListInput.WINNING_BID_AMOUNT == undefined || ListInput.WINNING_BID_AMOUNT == null) {
    } else { this.FilterString = this.FilterString + ' <b>Winning Bid Amount : </b>' + ListInput.WINNING_BID_AMOUNT; }

    if (ListInput.Winner_Name == "" || ListInput.Winner_Name == undefined || ListInput.Winner_Name == null) {
    } else { this.FilterString = this.FilterString + ' <b>Winner Name: </b>' + ListInput.Winner_Name; }

    if (ListInput.Year_of_manufacture == "" || ListInput.Year_of_manufacture == undefined || ListInput.Year_of_manufacture == null) {
    } else { this.FilterString = this.FilterString + ' <b>Year of manufacture: </b>' + ListInput.Year_of_manufacture; }


    if (ListInput.start_at == "" || ListInput.start_at == undefined || ListInput.start_at == null) {
    } else { this.FilterString = this.FilterString + ' <b>From Date: </b>' + ListInput.start_at; }


    if (ListInput.end_at == "" || ListInput.end_at == undefined || ListInput.end_at == null) {
    } else { this.FilterString = this.FilterString + ' <b>To Date: </b>' + ListInput.end_at; }

  }


  deleteItem(row) { }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    var columns = Object.keys(this.temp[0]);
    // Removes last "$$index" from "column"
    columns.splice(columns.length - 1);

    if (!columns.length)
      return;

    const rows = this.temp.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        let column = columns[i];
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });

    this.items = rows;
  }


  setPage(pageInfo) {



    const ListInput1: Input = {} as Input;
    ListInput1.size = (pageInfo.offset * 10) + 10;
    ListInput1.offset = (pageInfo.offset * 10);
    ListInput1.account_pk = this.Accountpk
   
    
    if (this.Auction_Title) { ListInput1.Auction_Title = this.Auction_Title } else { ListInput1.Auction_Title = "" }
    if (this.Chassis_No) { ListInput1.Chassis_No = this.Chassis_No } else { ListInput1.Chassis_No = "" }
    if (this.Contract_Number) { ListInput1.Contract_Number = this.Contract_Number } else { ListInput1.Contract_Number = "" }
    if (this.Email_Id) { ListInput1.Email_Id = this.Email_Id } else { ListInput1.Email_Id = "" }
    if (this.Inventory_Title) { ListInput1.Inventory_Title = this.Inventory_Title } else { ListInput1.Inventory_Title = "" }
    if (this.Mobile_Number) { ListInput1.Mobile_Number = this.Mobile_Number } else { ListInput1.Mobile_Number = "" }
    if (this.Total_Bid_Count) { ListInput1.Total_Bid_Count = this.Total_Bid_Count } else { ListInput1.Total_Bid_Count= "" }
    if (this.WINNING_BID_AMOUNT) { ListInput1.WINNING_BID_AMOUNT = this.WINNING_BID_AMOUNT } else { ListInput1.WINNING_BID_AMOUNT = "" }
    if (this.Winner_Name) { ListInput1.Winner_Name = this.Winner_Name } else { ListInput1.Winner_Name = "" }
    if (this.Year_of_manufacture) { ListInput1.Year_of_manufacture = this.Year_of_manufacture } else { ListInput1.Year_of_manufacture = "" }
    if (this.start_at) { ListInput1.start_at = this.start_at } else { ListInput1.start_at = "" }
    if (this.end_at) { ListInput1.end_at = this.end_at } else { ListInput1.end_at = "" }
    this.GetList(ListInput1);


  }


  receiveMessage($event) {


    this.Auction_Title = $event.Auction_Title
    this.Chassis_No = $event.Chassis_No
    this.Contract_Number = $event.Contract_Number
    this.Email_Id = $event.Email_Id
    this.Inventory_Title = $event.Inventory_Title
    this.Mobile_Number = $event.Mobile_Number
    this.Total_Bid_Count = $event.Total_Bid_Count
    this.WINNING_BID_AMOUNT = $event.WINNING_BID_AMOUNT
    this.Winner_Name = $event.Winner_Name
    this.Year_of_manufacture = $event.Year_of_manufacture

    var fromdate = this.datepipe.transform($event.start_at, 'yyyy-MM-dd')
    var todate = this.datepipe.transform($event.end_at, 'yyyy-MM-dd')

    const ListInput1: Input = {} as Input;
    ListInput1.size = 10
    ListInput1.offset = 0
    ListInput1.account_pk = this.Accountpk


    if (this.Auction_Title) { ListInput1.Auction_Title = this.Auction_Title } else { ListInput1.Auction_Title = "" }
    if (this.Chassis_No) { ListInput1.Chassis_No = this.Chassis_No } else { ListInput1.Chassis_No = "" }
    if (this.Contract_Number) { ListInput1.Contract_Number = this.Contract_Number } else { ListInput1.Contract_Number = "" }
    if (this.Email_Id) { ListInput1.Email_Id = this.Email_Id } else { ListInput1.Email_Id = "" }
    if (this.Inventory_Title) { ListInput1.Inventory_Title = this.Inventory_Title } else { ListInput1.Inventory_Title = "" }
    if (this.Mobile_Number) { ListInput1.Mobile_Number = this.Mobile_Number } else { ListInput1.Mobile_Number = "" }
    if (this.Total_Bid_Count) { ListInput1.Total_Bid_Count = this.Total_Bid_Count } else { ListInput1.Total_Bid_Count= "" }
    if (this.WINNING_BID_AMOUNT) { ListInput1.WINNING_BID_AMOUNT = this.WINNING_BID_AMOUNT } else { ListInput1.WINNING_BID_AMOUNT = "" }
    if (this.Winner_Name) { ListInput1.Winner_Name = this.Winner_Name } else { ListInput1.Winner_Name = "" }
    if (this.Year_of_manufacture) { ListInput1.Year_of_manufacture = this.Year_of_manufacture } else { ListInput1.Year_of_manufacture = "" }
    if (fromdate) { ListInput1.start_at = fromdate } else { ListInput1.start_at = "" }
    if (todate) { ListInput1.end_at = todate } else { ListInput1.end_at = "" }
    this.GetList(ListInput1);


  }
  async ReportExport() {
    if(this.page.totalElements == 0){
    return
  }
    this.isdisablereport = false
    this.pendingcount = 0
    this.testaay = [];


    const ListInput1: Input = {} as Input;
    ListInput1.size = this.page.totalElements;
    ListInput1.offset = 0;
    ListInput1.account_pk = this.Accountpk ? this.Accountpk : '';
    if (this.Auction_Title) { ListInput1.Auction_Title = this.Auction_Title } else { ListInput1.Auction_Title = "" }
    if (this.Chassis_No) { ListInput1.Chassis_No = this.Chassis_No } else { ListInput1.Chassis_No = "" }
    if (this.Contract_Number) { ListInput1.Contract_Number = this.Contract_Number } else { ListInput1.Contract_Number = "" }
    if (this.Email_Id) { ListInput1.Email_Id = this.Email_Id } else { ListInput1.Email_Id = "" }
    if (this.Inventory_Title) { ListInput1.Inventory_Title = this.Inventory_Title } else { ListInput1.Inventory_Title = "" }
    if (this.Mobile_Number) { ListInput1.Mobile_Number = this.Mobile_Number } else { ListInput1.Mobile_Number = "" }
    if (this.Total_Bid_Count) { ListInput1.Total_Bid_Count = this.Total_Bid_Count } else { ListInput1.Total_Bid_Count= "" }
    if (this.WINNING_BID_AMOUNT) { ListInput1.WINNING_BID_AMOUNT = this.WINNING_BID_AMOUNT } else { ListInput1.WINNING_BID_AMOUNT = "" }
    if (this.Winner_Name) { ListInput1.Winner_Name = this.Winner_Name } else { ListInput1.Winner_Name = "" }
    if (this.Year_of_manufacture) { ListInput1.Year_of_manufacture = this.Year_of_manufacture } else { ListInput1.Year_of_manufacture = "" }
    if (this.start_at) { ListInput1.start_at = this.start_at } else { ListInput1.start_at = "" }
    if (this.end_at) { ListInput1.end_at = this.end_at } else { ListInput1.end_at = "" }
   
    var Size = 250
    var offset = 0


    var rou = (Math.ceil(this.page.totalElements / 250))






    for (let i = 0; i < rou; i++) {

      ListInput1.offset = offset
      ListInput1.size = Size + offset

      let createdEmployee = await this.CommonService.ACRReportListExcel(ListInput1);
      if (createdEmployee.success == true) {

        for (let entry of createdEmployee.data) {

          const Input: Input = {} as Input;
          
          Input.Auction_Title = entry.Auction_Title
          Input.Contract_Number = entry.Contract_Number
          Input.Inventory_Title = entry.Inventory_Title
          Input.Registration_Number = entry.Registration_Number
          Input.Chassis_No = entry.Chassis_No
          Input.Year_of_manufacture = entry.Year_of_manufacture
          Input.WINNING_BID_AMOUNT = entry.WINNING_BID_AMOUNT
          Input.Winner_Name = entry.Winner_Name
          Input.Mobile_Number = entry.Mobile_Number
          Input.Email_Id = entry.Email_Id
          Input.RUNNER_UP_1_BID_AMOUNT = entry.RUNNER_UP_1_BID_AMOUNT
          Input.RUNNER_UP_1_MOBILE_NO = entry.RUNNER_UP_1_MOBILE_NO
          Input.RUNNER_UP_1_NAME = entry.RUNNER_UP_1_NAME
          Input.RUNNER_UP_2_BID_AMOUNT = entry.RUNNER_UP_2_BID_AMOUNT
          Input.RUNNER_UP_2_MOBILE_NO = entry.RUNNER_UP_2_MOBILE_NO
          Input.RUNNER_UP_2_NAME = entry.RUNNER_UP_2_NAME
          Input.BIDS = entry.BIDS  
          Input.Total_Bid_Count = entry.Total_Bid_Count
          Input.BID_STATUS = entry.BID_STATUS   
        


         this.Datapepare(Input);




        }





      }

      offset = offset + 250
    }
  }


  Datapepare(aray) {

    this.testaay.push(aray)
    this.pendingcount = this.testaay.length
    if (this.testaay.length == this.page.totalElements) {



      this.testaay.sort((a: any, b: any) => { return Date.parse(b.SortDate) - Date.parse(a.SortDate) });
      this.testaay.forEach(function (x) { delete x.SortDate });
      this.excelService.exportAsExcelFile(this.testaay, 'ACR_Reports');



      this.isdisablereport = true


    }




  }

}

export class Input {
 
  Auction_Title: string
  BIDS: string
  BID_STATUS :string
  Registration_Number :string
  Chassis_No: string
  Contract_Number: string
  Email_Id: string
  Inventory_Title: string
  Mobile_Number: string
  RUNNER_UP_1_BID_AMOUNT: string
  RUNNER_UP_1_MOBILE_NO: string
  RUNNER_UP_1_NAME: string
  RUNNER_UP_2_BID_AMOUNT: string
  RUNNER_UP_2_MOBILE_NO: string
  RUNNER_UP_2_NAME: string
  Total_Bid_Count: string
  WINNING_BID_AMOUNT: string
  Winner_Name: string
  Year_of_manufacture: string
  start_at:string
  end_at:string
    offset: number
    size: number
    account_pk: number


}
