import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { BidService } from '../../../../shared/services/MyServices/bid.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { Router } from '@angular/router';
import { CommonService } from '../../../../shared/services/MyServices/common.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { BidList, BidWinnerList } from '../../../../shared/models/bid';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { DataPassService } from 'app/shared/services/MyServices/data-pass.service';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { ExcelService } from 'app/shared/services/excel.service';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material';
import { BidLogsComponent } from '../../bid-list/bid-logs/bid-logs.component'
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ListInput } from 'app/shared/models/list-input';

@Component({
  selector: 'app-bidder',
  templateUrl: './bidder.component.html',
  styleUrls: ['./bidder.component.scss'],
  animations: egretAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class BidderComponent implements OnInit {
   Auction_Status = false;
  @ViewChild(DatatableComponent, { static: false }) mydatatable4: DatatableComponent;

  getRowClass = (row) => {

    if (row.highest_bidder) {
      return {
        'row-color1': true
      };
    }

  }
  FilterString: string;

  

  constructor(private dialog: MatDialog, private BidService: BidService, private router: Router,
    private CommonService: CommonService, private confirmService: AppConfirmService, private loader: AppLoaderService,
    private DataPassServic: DataPassService, private Auth: AuthorizeService, private excelService: ExcelService,
    private datepipe: DatePipe) { }
  AuctionDetailCode: any;
  public ServiceData: any[];
  public getItem: Subscription;
  public Winneritems: any[];
  public items: any[];
  public items1: any[];
  FinalData = [];
  FinalWinnerData = [];
  SessionData: any;
  RoleName: any;
  BidSubTypeCode: any;
  temp = [];
  DispalyAction: boolean;
  bidderdata: any;
  BidType: any
  isactionallow: boolean
  Accountpk: any;
  Id: any
  AuctiondetailCode: any
  DisplayAuctionname: any
  ngOnInit() {
    this.Accountpk = this.Auth.GetAccountPk()
    this.SessionData = this.CommonService.getUserDetails();
    this.DisplayAuctionname = this.DataPassServic.getDisplayTitle();
    this.bidderdata = this.DataPassServic.getBiiderData()
    this.BidType = this.DataPassServic.getBiiderType()
    if (this.bidderdata == undefined) {
      this.router.navigateByUrl('pages/ClosedBidList');
    }
    else {
      //this.items = this.bidderdata;
      this.Id = this.bidderdata.id
      this.AuctiondetailCode = this.bidderdata.auction_detail_code
      const ListInput1: Input = {} as Input;
      ListInput1.size = 1000
      ListInput1.offset = 0
      ListInput1.account_pk = this.Accountpk
      ListInput1.auction_detail_id = this.Id
      this.GetDetails(ListInput1)
      if (this.BidType == "Closed") {
        this.isactionallow = true
        const WinInput: WinInput = {} as WinInput;
        WinInput.size = 1000
        WinInput.offset = 0
        WinInput.account_pk = this.Accountpk
        WinInput.auction_detail_code = this.AuctiondetailCode
        setTimeout(() => {
        }, 500);
      }
      else {
        this.isactionallow = false
      }
    }
  }


  onClick(){
    this.Auction_Status = !this.Auction_Status
  }
  // onActionStatus(){
  //   if (ListInput.auction_status == "" || ListInput.auction_status == undefined || ListInput.auction_status == null) {
  //   } else { this.FilterString = this.FilterString + ' <b>Auction Status: </b>' + ListInput.auction_status; }
   
  // }


  ViewLogs(data: any = {}) {
    if (data != '') {
      let title = '';
      let dialogRef: MatDialogRef<any> = this.dialog.open(BidLogsComponent, {
        width: '700px',
        disableClose: false,
        data: { title: title, payload: data }
      })
    }
    else {
    }
  }

  selectedTab: any = 0
  TabChange(tab) {
    this.selectedTab = tab.index
    // const ListInput1: Input = {} as Input;
    // ListInput1.size = 10
    // ListInput1.offset = 0
    //  if (tab.index == 0) {
    //   ListInput1.auction_type= "current"
    //  }
    //  if (tab.index == 1) {
    //   ListInput1.auction_type= "closed"
    // }
    // this.GetData(ListInput1)
  }



  WiningData = []
  GetBidWinner(data: any = {}, isNew?) {
    this.items1 = [];
    this.BidService.BidWinnnerTMFLlist(data).subscribe(data => {
      if (data instanceof HttpErrorResponse) {
        return;
      }
      if (data.success = true) {
        this.items1 = data.data;
        this.loader.close()
       this.mydatatable4.offset = (data.offset)/10;
        // this.DataPassServic.setBiiderData(data.data,'Closed');
        // this.router.navigateByUrl('pages/Bidder');
      }
      else {
       this.mydatatable4.offset = (data.offset)/10;
        this.loader.close()
        this.items1 = []
        Swal.fire(data.data.message, 'Error')
      }
    });
  }

  TotalCount: any
  pendingcount: any = 0
  isdiableeporrt: boolean = true;
  GetDetails(data: any = {}, isNew?) {
    this.loader.open()
    var Winner;
    this.BidService.BidDetails(data).subscribe(data => {
      if (data instanceof HttpErrorResponse) {
        return;
      }
      if (data.success = true) {
        this.items = data.data
        this.TotalCount = this.items.length;
        this.loader.close()
        for (let entry of this.items) {
          if (entry.status == 'BID WINNER') {
            Winner = "Yes"
          }
        }
        if (Winner == "Yes") {
          const WinInput: WinInput = {} as WinInput;
          WinInput.size = 1000
          WinInput.offset = 0
          WinInput.account_pk = this.Accountpk
          WinInput.auction_detail_code = this.AuctiondetailCode
          this.GetBidWinner(WinInput)
        }
      }
      else {
        this.loader.close()
        Swal.fire(data.data.msg, 'Error')
      }
    });
  }

  TempDownloadarray = []
  setStatus: string;
  reportDownload() {
    this.isdiableeporrt = false
    this.TempDownloadarray = []
    const ListInput1: Input = {} as Input;
    ListInput1.size = this.TotalCount
    ListInput1.offset = 0
    ListInput1.account_pk = this.Accountpk
    ListInput1.auction_detail_id = this.Id
    this.BidService.BidDetails(ListInput1).subscribe(data => {
      if (data instanceof HttpErrorResponse) {
        return;
      }
      if (data.success = true) {
        for (let entry of data.data) {

          if (!entry.highest_bidder && entry.approved_status !== 'CANCELLED') {
            this.setStatus = entry.status
          }
          else if (entry.highest_bidder && entry.approved_status !== 'CANCELLED') {
            this.setStatus = "HIGHEST BIDDER"
          }
          else if (entry.approved_status == 'CANCELLED') {
            this.setStatus = entry.approved_status
          }
          var Json = {
            "row_id": entry.row_id,
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
            "Email": entry.user.email_id,
            "year_of_manufacture": entry.inventory.year_of_manufacture,
            "contract_no": entry.inventory.contract_no,
            "chassis_no": entry.inventory.chassis_no,


            "Bid_Amount": entry.bid_amount,
            "Bid Attempts": entry.bid_logs.length,
            "Bid_Status": entry.status,
            "Status": this.setStatus,
            "Cancel Remarks ": entry.remarks,
            "Date": this.datepipe.transform(entry.updated_at, 'dd-MM-yyyy hh:mm:ss.sss a')
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

  Remove(value) {
    Swal.fire({
      title: 'Reason For Cancel',
      input: 'textarea',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write reason!'
        }
      }

    }).then((result) => {
      if (result.value) {
        let request = //{ "user_id": value.id, "remarks": String(result.value) }
        {
          "account_pk": this.Accountpk,
          "bid_id": value.id,
          "remarks": String(result.value)
        }
        this.BidService.RemoveBid(request).subscribe(data => {
          if (data instanceof HttpErrorResponse) {
            return;
          }
          if (data.success = true) {
            Swal.fire({
              icon: 'success',
              text: data.data.message,
            })
            const ListInput1: Input = {} as Input;
            ListInput1.size = 1000
            ListInput1.offset = 0
            ListInput1.account_pk = this.Accountpk
            ListInput1.auction_detail_id = this.Id
            this.GetDetails(ListInput1)
          }
          else {
            Swal.fire({
              icon: 'error',
              text: data.data.message,
            })
          }
        });
      }
    }, (error: any) => console.log(error));
  }



  back() {
    if (this.BidType == "Closed") {
      this.router.navigateByUrl('pages/ClosedBidList');
    }
    else {
      this.router.navigateByUrl('pages/CurrentBidList');
    }
  }

  BidWinner(event) {
    var json = { "id": event.auction_detail, "bid_id": event.id, "account_pk": parseInt(this.Accountpk) }
    this.confirmService.confirm({ message: `Are You Sure, Make this User As A Bid Winner???` }).subscribe(res => {
      if (res) {
        this.getItem = this.BidService.BidWinnnerTMFL(json).subscribe(data => {
          if (data instanceof HttpErrorResponse) {
            return;
          }
          if (data.success = true) {
            Swal.fire('Bid Winner Selection Done!!', 'success');
            const ListInput1: Input = {} as Input;
            ListInput1.size = 1000
            ListInput1.offset = 0
            ListInput1.account_pk = this.Accountpk
            ListInput1.auction_detail_id = this.Id
            this.GetDetails(ListInput1)
          }
          else {
            Swal.fire(data.data.message, 'Error')
          }
        });
      }
    })
  }
}
export class Input {
  offset: number
  size: number
  account_pk: number
  auction_detail_id: number
}

export class WinInput {
  inventory_title: string
  auction_title: string
  auction_detail_code: string
  auction_code: string
  offset: number
  size: number
  account_pk: number
  auction_detail_id: number
}