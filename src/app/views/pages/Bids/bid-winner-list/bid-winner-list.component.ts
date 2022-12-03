import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { egretAnimations } from "../../../../shared/animations/egret-animations";
import { Bid } from '../../../../shared/models/bid';
import { BidService } from '../../../../shared/services/MyServices/bid.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { DataPassService } from 'app/shared/services/MyServices/data-pass.service';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { Page } from '../../../../../../src/app/shared/models/PaginationPage'
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'app/shared/services/excel.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { ShowImagePopupComponent } from '../../show-image-popup/show-image-popup.component';
import { ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-bid-winner-list',
  templateUrl: './bid-winner-list.component.html',
  styleUrls: ['./bid-winner-list.component.scss'],
  animations: egretAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class BidWinnerListComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) mydatatable5: DatatableComponent;

  public items: any[];
  temp = [];
  SessionData: any;
  UserCode: any;
  bid_amount: any;

  public getItemSub: Subscription;
  row_id: any;
  constructor(private router: Router, private BidService: BidService,public dialog: MatDialog, 
    private DataPassServic: DataPassService, private excelService: ExcelService,
    private Auth: AuthorizeService, private loader: AppLoaderService, private datepipe: DatePipe) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.page.totalElements = 0;
  }
  Accountpk: any
  page = new Page();
  CurrentDate = new Date();
  selectedAuctionType: string = "CUSTOMER";
  ngOnInit() {
    this.Accountpk = this.Auth.GetAccountPk()
    const ListInput1: Input = {} as Input;
    ListInput1.size = 10
    ListInput1.offset = 0
    
    ListInput1.bid_type = 'all';
    ListInput1.type_of_auction = this.selectedAuctionType;
    //  ListInput1.account_pk = this.Accountpk
    //ListInput1.auction_type = 'current'
    this.getBidList(ListInput1)
  }

  tabChange(event){
    if(event.index === 0){
      this.selectedAuctionType = "CUSTOMER";
    }
    else if(event.index === 1){
      this.selectedAuctionType = "BUYER";
    }
    const ListInput1: Input = {} as Input;
    ListInput1.size = 10;
    ListInput1.offset = 0;
    ListInput1.bid_type = this.bid_type ? this.bid_type : 'all';
    ListInput1.type_of_auction = this.selectedAuctionType;
    this.getBidList(ListInput1);
  }

  tableOffset: number = 0;
  setPage(pageInfo) {
    this.tableOffset = pageInfo.offset;
    this.page.totalElements = 0;
    const ListInput1: Input = {} as Input;
    ListInput1.size = (pageInfo.offset * 10) + 10;
    ListInput1.offset = (pageInfo.offset * 10);
    if (this.from_date) { ListInput1.from_date = this.from_date } else { ListInput1.from_date = "" }
    if (this.to_date) { ListInput1.to_date = this.to_date } else { ListInput1.to_date = "" }
    if (this.auction_title) { ListInput1.auction_title = this.auction_title } else { ListInput1.auction_title = "" }
    if (this.inventory_title) { ListInput1.inventory_title = this.inventory_title } else { ListInput1.inventory_title = "" }
    if (this.contract_no) { ListInput1.contract_no = this.contract_no } else { ListInput1.contract_no = "" }
    if (this.registration_number) { ListInput1.registration_number = this.registration_number } else { ListInput1.registration_number = "" }
    // if (this.bidder_code) { ListInput1.bidder_code = this.bidder_code } else { ListInput1.bidder_code = "" }
    
    //   ListInput1.auction_type = 'closed'

 ListInput1.bid_type = this.bid_type ? this.bid_type : 'all';
 ListInput1.type_of_auction = this.selectedAuctionType;
    this.getBidList(ListInput1)
  }

  refresh() {
    this.CurrentDate = new Date()
    const ListInput1: Input = {} as Input;
    ListInput1.size = 10
    ListInput1.offset = 0
    ListInput1.type_of_auction = this.selectedAuctionType;
    //ListInput1.account_pk = this.Accountpk;
    // ListInput1.auction_detail_id=''
    // ListInput1.auction_detail_code=""
    // ListInput1.auction_id=""
    // ListInput1.auction_code=""
    // ListInput1.auction_title=""
    // ListInput1.inventory_title=""
    // ListInput1.inventory_id=""
    // ListInput1.auction_type = 'current'
    this.getBidList(ListInput1)
  }

  
  getBidList(json) {
    this.items = []
    this.FilterStrings(json);
    this.loader.open()
    this.BidService.WinnerBidList(json).subscribe(
      (res) => {
        if (res.success == true) {
          this.loader.close()
          this.items = this.temp = res.data as Bid[];
          this.items = res.data;
          this.page.pageNumber = 0;
          this.page.size = 10;
          this.page.totalElements = res.count
          this.TotalCount = res.count
         this.mydatatable5.offset = (json.offset)/10;
        } else {
          this.loader.close()
          Swal.fire("Oops...", res.data.message, "error");
          this.items = [];
          this.items = []
          this.page.pageNumber = 0;
          this.page.size = 0;
          this.page.totalElements = 0
         this.mydatatable5.offset = (json.offset)/10;
        }
      },
      (err) => {
       this.mydatatable5.offset = (json.offset)/10;
        this.loader.close()
        Swal.fire("Oops...", err.error.data.message, "error");
      }
    );
  }


  FilterString: any
  FilterStrings(ListInput) {
    this.FilterString = "";
    if (ListInput.from_date == "" || ListInput.from_date == undefined || ListInput.from_date == null) {
    }
    else { this.FilterString = ' <b>From Date: </b>' + this.datepipe.transform(ListInput.from_date, 'dd-MM-yyyy') }
    if (ListInput.to_date == "" || ListInput.to_date == undefined || ListInput.to_date == null) {
    } else { this.FilterString = this.FilterString + ' <b>To Date: </b>' + this.datepipe.transform(ListInput.to_date, 'dd-MM-yyyy') }
    if (ListInput.auction_title == "" || ListInput.auction_title == undefined || ListInput.auction_title == null) {
    } else { this.FilterString = this.FilterString + ' <b>Auction Title: </b>' + ListInput.auction_title; }
    if (ListInput.inventory_title == "" || ListInput.inventory_title == undefined || ListInput.inventory_title == null) {
    } else { this.FilterString = this.FilterString + ' <b>Inventory Title: </b>' + ListInput.inventory_title; }
    if (ListInput.auction_code == "" || ListInput.auction_code == undefined || ListInput.auction_code == null) {
    } else { this.FilterString = this.FilterString + ' <b>Auction Code: </b>' + ListInput.auction_code; }
    if (ListInput.full_name == "" || ListInput.full_name == undefined || ListInput.full_name == null) {
    } else { this.FilterString = this.FilterString + ' <b>Full Name: </b>' + ListInput.full_name; }
    if (ListInput.email_id == "" || ListInput.email_id == undefined || ListInput.email_id == null) {
    } else { this.FilterString = this.FilterString + ' <b>Email Id: </b>' + ListInput.email_id; }
    if (ListInput.mobile_number == "" || ListInput.mobile_number == undefined || ListInput.mobile_number == null) {
    } else { this.FilterString = this.FilterString + ' <b>Mobile Number: </b>' + ListInput.mobile_number; }
    if (ListInput.contract_no == "" || ListInput.contract_no == undefined || ListInput.contract_no == null) {
    }    else { this.FilterString = this.FilterString + ' <b>Contract Number: </b>' + ListInput.contract_no; }

    if (ListInput.registration_number == "" || ListInput.registration_number == undefined || ListInput.registration_number == null) {
    }    else { this.FilterString = this.FilterString + ' <b>Registration Number: </b>' + ListInput.registration_number; }
   
    // if (ListInput.bidder_code == "" || ListInput.bidder_code == undefined || ListInput.bidder_code == null) {
    // }    else { this.FilterString = this.FilterString + ' <b>Bidder Code: </b>' + ListInput.bidder_code; }
   
    

    if (ListInput.bid_type == "" || ListInput.bid_type == undefined || ListInput.bid_type == null) {
      // this.FilterString = this.FilterString + ' <b>Type: </b>' + 'Winner';
    } else { this.FilterString = this.FilterString  + ' <b>Type: </b>' + ListInput.bid_type.toUpperCase()   + ' BIDDER'; }

  


  }

  from_date: any;
  to_date: any;
  auction_title: any;
  inventory_title: any;
  contract_no : any;
  registration_number :any
  mobile_number: any;
  email_id: any;
  full_name: any;
  bidder_code:any;
  auction_code: any;
  bid_type:any
  receiveMessage($event) {
    this.auction_title = $event.auction_title
    this.inventory_title = $event.inventory_title
    this.contract_no = $event.contract_no
    this.registration_number = $event.registration_number
    this.full_name = $event.full_name;
    this.mobile_number = $event.mobile_number;
    this.auction_code = $event.auction_code;
    this.email_id = $event.email_id;
    var fromdate = this.datepipe.transform($event.from_date, 'yyyy-MM-dd')
    var todate = this.datepipe.transform($event.to_date, 'yyyy-MM-dd')
    this.from_date = fromdate
    this.to_date = todate
    this.bid_type = $event.bid_type
    // this.bidder_code = $event.bidder_code;

    


    const ListInput1: Input = {} as Input;
    ListInput1.size = 10
    ListInput1.offset = 0
    // ListInput1.account_pk = this.Accountpk
    // ListInput1.auction_type = 'current'
    if (this.from_date) { ListInput1.from_date = fromdate } else { ListInput1.from_date = "" }
    if (this.to_date) { ListInput1.to_date = todate } else { ListInput1.to_date = "" }
    if (this.auction_title) { ListInput1.auction_title = this.auction_title } else { ListInput1.auction_title = "" }
    if (this.inventory_title) { ListInput1.inventory_title = this.inventory_title } else { ListInput1.inventory_title = "" }
    if (this.mobile_number) { ListInput1.mobile_number = this.mobile_number } else { ListInput1.mobile_number = "" }
    if (this.full_name) { ListInput1.full_name = this.full_name } else { ListInput1.full_name = "" }
    if (this.auction_code) { ListInput1.auction_code = this.auction_code } else { ListInput1.auction_code = "" }
    if (this.email_id) { ListInput1.email_id = this.email_id } else { ListInput1.email_id = "" }
    if (this.contract_no) { ListInput1.contract_no = this.contract_no } else { ListInput1.contract_no = "" }
    if (this.registration_number) { ListInput1.registration_number = this.registration_number } else { ListInput1.registration_number = "" }
    // if (this.bidder_code) { ListInput1.bidder_code = this.bidder_code }  else { ListInput1.bidder_code= "" }
    
    ListInput1.bid_type = this.bid_type ? this.bid_type : 'all';
    ListInput1.type_of_auction = this.selectedAuctionType;
    this.getBidList(ListInput1);
  }

  TotalCount: any;
  isdiableeporrt: boolean = true;
  pendingcount: any = 0;
  TempDownloadarray = []
  reportDownload() {
    this.isdiableeporrt = false
    this.TempDownloadarray = []
    this.pendingcount = 0
    const ListInput1: Input = {} as Input;
    ListInput1.size = this.TotalCount
    ListInput1.offset = 0
    // ListInput1.account_pk = this.Accountpk
    //ListInput1.auction_type = 'current'
    if (this.from_date) { ListInput1.from_date = this.from_date } else { ListInput1.from_date = "" }
    if (this.to_date) { ListInput1.to_date = this.to_date } else { ListInput1.to_date = "" }
    if (this.auction_title) { ListInput1.auction_title = this.auction_title } else { ListInput1.auction_title = "" }
    if (this.inventory_title) { ListInput1.inventory_title = this.inventory_title } else { ListInput1.inventory_title = "" }
    if (this.auction_code) { ListInput1.auction_code = this.auction_code } else { ListInput1.auction_code = "" }
    if (this.mobile_number) { ListInput1.mobile_number = this.mobile_number } else { ListInput1.mobile_number = "" }
    if (this.email_id) { ListInput1.email_id = this.email_id } else { ListInput1.email_id = "" }
    if (this.full_name) { ListInput1.full_name = this.full_name } else { ListInput1.full_name = "" }
    if (this.bid_amount) { ListInput1.bid_amount = this.bid_amount } else { ListInput1.bid_amount = "" }
    if (this.row_id) { ListInput1.row_id = this.row_id } else { ListInput1.row_id = "" }
    if (this.contract_no) { ListInput1.contract_no = this.contract_no } else { ListInput1.contract_no = "" }
    if (this.registration_number) { ListInput1.registration_number = this.registration_number } else { ListInput1.registration_number = "" }
    // if (this.bidder_code) { ListInput1.bidder_code = this.bidder_code }  else { ListInput1.bidder_code= "" }
   
    ListInput1.bid_type = this.bid_type ? this.bid_type : 'all';
    ListInput1.type_of_auction = this.selectedAuctionType;
    
    // ListInput1.bid_type = this.bid_type ? this.bid_type : '';
    this.BidService.WinnerBidList(ListInput1).subscribe(data => {
      if (data instanceof HttpErrorResponse) {
        return;
      }
      if (data.success = true) {

        for (let entry of data.data) {
          var Json = {
            "Row Id":entry.row_id,
            "Bid Amount":entry.bid_amount,
            "Full Name": entry.user.full_name,
            "Bidder Code" : entry.user.bidder_code,
            "Mobile Number": entry.user.mobile_number,
            "Email Id": entry.user.email_id,
            "Auction Title": entry.auction_detail.auction.auction_title,
            "Auction Code": entry.auction_detail.auction.auction_code,
            "Inventory Title": entry.auction_detail.inventory.inventory_title,

            "Registration Number": entry.auction_detail.inventory.registration_number,
            "Contract No": entry.auction_detail.inventory.contract_no,
            "Chassis No": entry.auction_detail.inventory.chassis_no,
            "Year of manufacture": entry.auction_detail.inventory.year_of_manufacture,


            // "Auction_Start_Date": this.datepipe.transform(entry.auction_start_at, 'dd-MM-yyyy hh:mm:ss.sss a'),
            // "Auction_End_Date": this.datepipe.transform(entry.auction_end_at, 'dd-MM-yyyy hh:mm:ss.sss a'),
            //"Inventory_Created_Date": this.datepipe.transform(entry.inventory_created_at, 'dd-MM-yyyy hh:mm:ss.sss a'),
          }
          this.TempDownloadarray.push(Json)
          this.pendingcount = this.TempDownloadarray.length;
        }
        this.excelService.exportAsExcelFile(this.TempDownloadarray, 'Bidder');
        this.isdiableeporrt = true
      }
      else {
        this.loader.close()
        Swal.fire(data.data.msg, 'Error')
      }
    });
  }

  // openPopUp(data: any = {}, isNew?) {
  //   var DisplayName = data.auction.auction_title + '(' + data.inventory.inventory_title + ')'
  //   this.DataPassServic.setBiiderData(data, 'Current', DisplayName);
  //   this.router.navigateByUrl('pages/Bidder');
  // }
  deleteItem(row) { }
  onGetRowClass = (row) => {
    if (row.inventory.inventory_title === "ACE") {
      return "age-is-ten";
    }
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    var columns = Object.keys(this.temp[0]);
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
 
}
export class Input {
  size: number
  offset: number
  account_pk: number
  from_date: string
  to_date: string
  auction_title: string
  auction_type: string
  inventory_title: string
  auction_detail_id: any;
  auction_detail_code: any;
  auction_id: any;
  mobile_number: any;
  full_name: any;
  bidder_code:any;
  email_id: any;
  row_id:any;
  bid_amount:any;
  contract_no:any;
  auction_code: any;
  inventory_id: any;
  bid_type : any;
  registration_number:string
  type_of_auction: any;
}