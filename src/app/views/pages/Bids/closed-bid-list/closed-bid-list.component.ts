import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { egretAnimations } from "../../../../shared/animations/egret-animations";
import { Bid } from '../../../../shared/models/bid';
import { BidService } from '../../../../shared/services/MyServices/bid.service';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { DataPassService } from 'app/shared/services/MyServices/data-pass.service';
import { CommonService } from '../../../../shared/services/MyServices/common.service'
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { Page } from '../../../../../../src/app/shared/models/PaginationPage'
import { DatePipe } from '@angular/common';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ExcelService } from 'app/shared/services/excel.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-closed-bid-list',
  templateUrl: './closed-bid-list.component.html',
  styleUrls: ['./closed-bid-list.component.scss'],
  animations: egretAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class ClosedBidListComponent implements OnInit {

   @ViewChild(DatatableComponent, { static: false }) mydatatable6: DatatableComponent;
  public items: any[];
  temp = [];
  UserCode: any;
  SessionData: any;
  public getItemSub: Subscription;
  constructor(private router: Router,
    private BidService: BidService,
    private DataPassServic: DataPassService,
    private CommonService: CommonService, private datepipe: DatePipe,
    private loader: AppLoaderService,
    private Auth: AuthorizeService,
    private excelService: ExcelService,
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.page.totalElements = 0;
  }
  Accountpk: any;
  selectedAuctionType: string = "CUSTOMER";
  ngOnInit() {
    // this.SessionData=this.CommonService.getUserDetails();
    this.Accountpk = this.Auth.GetAccountPk()
    const ListInput1: Input = {} as Input;
    ListInput1.size = 10
    ListInput1.offset = 0
    ListInput1.account_pk = this.Accountpk
    ListInput1.auction_type='closed'
    ListInput1.type_of_auction = this.selectedAuctionType;
    this.getBidList(ListInput1)
  }

  tabChange(event){
    if(event.index === 0){
      this.selectedAuctionType = "CUSTOMER";
    }
    else if(event.index === 1){
      this.selectedAuctionType = "BUYER";
    }
    this.Accountpk = this.Auth.GetAccountPk()
    const ListInput1: Input = {} as Input;
    ListInput1.size = 10
    ListInput1.offset = 0
    ListInput1.account_pk = this.Accountpk
    ListInput1.auction_type='closed'
    ListInput1.type_of_auction = this.selectedAuctionType;
    this.getBidList(ListInput1);
  }
  page = new Page();


  Allccount :any = 0
 
  getBidList(json) {

    //var json = { "auction_type": 'closed', "account_pk": this.Accountpk }
   
this.loader.open()
    this.items=[]
    this.FilterStrings(json);

      this.BidService.CurrentBidList(json).subscribe(
        (res) => {
          if (res.success == true) {
            this.loader.close()
            this.items = this.temp = res.data as Bid[];
            this.items = res.data;
            this.page.pageNumber = 0;
            this.page.size = 10;
            this.page.totalElements = res.count
            this.TotalCount= res.count
            this.Allccount=res.all_bid_count;

           this.mydatatable6.offset = (json.offset)/10;
          } else {
            this.loader.close()
            Swal.fire("Oops...", res.data.message, "error");
            this.items = [];
            this.TotalCount= 0
           
            this.items =[]
            this.page.pageNumber = 0;
            this.page.size = 0;
            this.page.totalElements = 0
            this.Allccount= 0;
           this.mydatatable6.offset = (json.offset)/10;
          }
        },
        (err) => {
         this.mydatatable6.offset = (json.offset)/10;
          this.loader.close()
          // Swal.fire("Oops...", err.msg, "error");
          Swal.fire("Oops...", err.error.data.message, "error");
        }
      );
  }


  TotalCount:any;
  isdiableeporrt: boolean = true;
  pendingcount :any = 0;

  TempDownloadarray = []
  reportDownload() {
    this.isdiableeporrt = false
    this.TempDownloadarray = []
    this.pendingcount = 0


    const ListInput1: Input = {} as Input;
    ListInput1.size = this.Allccount
    ListInput1.offset = 0
    ListInput1.account_pk = this.Accountpk
    ListInput1.auction_type='closed'

    if (this.from_date) { ListInput1.from_date = this.from_date } else { ListInput1.from_date = "" }
    if (this.to_date) { ListInput1.to_date = this.to_date } else { ListInput1.to_date = "" }
    if (this.auction_title) { ListInput1.auction_title = this.auction_title } else { ListInput1.auction_title = "" }
    if (this.inventory_title) { ListInput1.inventory_title = this.inventory_title } else { ListInput1.inventory_title = "" }
    if (this.contract_no) { ListInput1.contract_no = this.contract_no } else { ListInput1.contract_no = "" }
    if (this.registration_number) { ListInput1.registration_number = this.registration_number } else { ListInput1.registration_number = "" }
    ListInput1.type_of_auction = this.selectedAuctionType;



    this.BidService.BidListExport(ListInput1)
      .subscribe(data => {
        if (data instanceof HttpErrorResponse) {
          return;
        }
        if (data.success = true) {
          for (let entry of data.data) {
            var Json = {
              "Auction_Title": entry.auction_title,
              "Auction_Start_Date": this.datepipe.transform(entry.auction_start_at, 'dd-MM-yyyy hh:mm:ss.sss a'),
              "Auction_End_Date": this.datepipe.transform(entry.auction_end_at, 'dd-MM-yyyy hh:mm:ss.sss a'),
              "Inventory_Title": entry.inventory_title,
              "Inventory_Created_Date": this.datepipe.transform(entry.inventory_created_at, 'dd-MM-yyyy hh:mm:ss.sss a'),
              "Registration_Number": entry.registration_number,
              "Yard": entry.yard_name + '_' + entry.yard_region + '_' + entry.yard_state,
              "Name": entry.user.full_name,
              "Mobile_Number": entry.user.mobile_number,
              "State(City)": entry.user.state + '(' + entry.user.city + ')',
              "Bid_Amount": entry.bid_amount,
              "Bit Attempts": entry.bid_logs.length,
              "Status": entry.status,
              "Date": this.datepipe.transform(entry.updated_at, 'dd-MM-yyyy hh:mm:ss.sss a'),
              "Contract_Number" : entry.contract_no
            }
            this.TempDownloadarray.push(Json)
            this.pendingcount = this.TempDownloadarray.length;
            this.pendingcount = this.pendingcount 
          
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


  tableOffset: number =  0;
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
    ListInput1.auction_type='closed'
    //this.GetUserList(ListInput1);
    ListInput1.type_of_auction = this.selectedAuctionType;


    this.getBidList(ListInput1)
  }


  FilterString :any
  FilterStrings(ListInput) {

    this.FilterString = "";


    if (ListInput.from_date == "" || ListInput.from_date == undefined || ListInput.from_date == null) {
    }
    else { this.FilterString = ' <b>From Date: </b>' +  this.datepipe.transform(ListInput.from_date, 'dd-MM-yyyy') }


    if (ListInput.to_date == "" || ListInput.to_date == undefined || ListInput.to_date == null) {
    }    else { this.FilterString = this.FilterString + ' <b>To Date: </b>' +  this.datepipe.transform(ListInput.to_date, 'dd-MM-yyyy')  }



    if (ListInput.auction_title == "" || ListInput.auction_title == undefined || ListInput.auction_title == null) {
    }    else { this.FilterString = this.FilterString + ' <b>Auction Title: </b>' + ListInput.auction_title; }



    // if (ListInput.auction_type == "" || ListInput.auction_type == undefined || ListInput.auction_type == null) {
    // }    else { this.FilterString = this.FilterString + ' <b>Auction Type: </b>' + ListInput.auction_type; }
  
    if (ListInput.contract_no == "" || ListInput.contract_no == undefined || ListInput.contract_no == null) {
    }    else { this.FilterString = this.FilterString + ' <b>Contract Number: </b>' + ListInput.contract_no; }

    if (ListInput.registration_number == "" || ListInput.registration_number == undefined || ListInput.registration_number == null) {
    }    else { this.FilterString = this.FilterString + ' <b>Registration Number: </b>' + ListInput.registration_number; }


    if (ListInput.inventory_title == "" || ListInput.inventory_title == undefined || ListInput.inventory_title == null) {
    }    else { this.FilterString = this.FilterString + ' <b>Auction Title: </b>' + ListInput.inventory_title; }




  }

  openPopUp(data: any = {}, isNew?) {
    var DisplayName = data.auction.auction_title + '(' + data.inventory.inventory_title + ')'
    this.DataPassServic.setBiiderData(data, 'Closed', DisplayName);
    this.router.navigateByUrl('pages/Bidder');

    // var json = { "auction_detail_id": data.id, "account_pk": this.Accountpk }
    // this.getItemSub = this.BidService.BidDetails(json)
    //   .subscribe(data => {
    //     if (data instanceof HttpErrorResponse) {
    //       return;
    //     }
    //     if (data.success = true) {

    //       this.DataPassServic.setBiiderData(data.data,'Closed');
    //       this.router.navigateByUrl('pages/Bidder');
    //     }
    //     else {
    //       Swal.fire(data.data.msg, 'Error')
    //     }

    //   });


  }
  deleteItem(row) { }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    var columns = Object.keys(this.temp[0]);
    // Removes last "$$index" from "column"
    columns.splice(columns.length - 1);

    // console.log(columns);
    if (!columns.length)
      return;

    const rows = this.temp.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        let column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });

    this.items = rows;
  }

  from_date: any;
  to_date: any;
  auction_title: any;
  inventory_title: any;
  contract_no : any;
  registration_number :any


  receiveMessage($event) {

    this.auction_title = $event.auction_title
    this.inventory_title = $event.inventory_title
    var fromdate = this.datepipe.transform($event.from_date, 'yyyy-MM-dd')
    var todate = this.datepipe.transform($event.to_date, 'yyyy-MM-dd')
    this.contract_no = $event.contract_no
    this.registration_number = $event.registration_number

    this.from_date = fromdate
    this.to_date =todate
    const ListInput1: Input = {} as Input;
    ListInput1.size = 10
    ListInput1.offset = 0
    ListInput1.account_pk = this.Accountpk
    ListInput1.auction_type='closed'

    if (this.from_date) { ListInput1.from_date = fromdate } else { ListInput1.from_date = "" }
    if (this.to_date) { ListInput1.to_date = todate } else { ListInput1.to_date = "" }
    if (this.auction_title) { ListInput1.auction_title = this.auction_title } else { ListInput1.auction_title = "" }
    if (this.inventory_title) { ListInput1.inventory_title = this.inventory_title } else { ListInput1.inventory_title = "" }
 if (this.contract_no) { ListInput1.contract_no = this.contract_no } else { ListInput1.contract_no = "" }
    if (this.registration_number) { ListInput1.registration_number = this.registration_number } else { ListInput1.registration_number = "" }
    ListInput1.type_of_auction = this.selectedAuctionType;
    this.getBidList(ListInput1);


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
  registration_number:string
  contract_no:string
  type_of_auction: any;


}
