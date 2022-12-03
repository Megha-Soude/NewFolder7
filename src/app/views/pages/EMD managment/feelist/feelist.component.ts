import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { Bid } from 'app/shared/models/bid';
import { Page } from 'app/shared/models/PaginationPage';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ExcelService } from 'app/shared/services/excel.service';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { CommonService } from 'app/shared/services/MyServices/common.service';
import { DataPassService } from 'app/shared/services/MyServices/data-pass.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { BidService } from '../../../../shared/services/MyServices/bid.service';

@Component({
  selector: 'app-feelist',
  templateUrl: './feelist.component.html',
  styleUrls: ['./feelist.component.scss'], animations: egretAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class FeelistComponent implements OnInit {

   @ViewChild(DatatableComponent, { static: false }) mydatatable9: DatatableComponent;
  public items: any[];
  temp = [];
  UserCode: any;
  SessionData: any;
  public getItemSub: Subscription;

  Accountpk: any;

  page = new Page();
  //excel start
  testaay = []
  pendingcount: any = 0;
  isdisablereport: boolean = true;
  pagevalid: any;
  Passdata: any;
  href: string;
  //excel close
  constructor(
    private BidService: BidService,
    private PassData: DataPassService,
    private CommonService: CommonService, private datepipe: DatePipe,
    private loader: AppLoaderService,
    private Auth: AuthorizeService, private confirmService: AppConfirmService,private excelService: ExcelService,
    private router:Router
  ) { 
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.page.totalElements = 0;
  }

  ngOnInit() {
    this.Accountpk = this.Auth.GetAccountPk()
    const ListInput1: Input = {} as Input;
    ListInput1.size = 10
    ListInput1.offset = 0
    ListInput1.action='ZRG'
    ListInput1.account_pk = this.Accountpk
    this.GetList(ListInput1),

    
    this.href = this.router.url;

    var splitted = this.href.split("/", 3);
    this.pagevalid = this.PassData.Permission(splitted[2])
  }

  CheckPermission(value) {
    var data2 = this.pagevalid.filter(book => book === value);

  
    if (data2.length > 0) {
      return true
    }
    else {
      return false
    }
  }

  AddSubscriptionClick() {
    this.PassData.setAuctioncode('');
    this.router.navigateByUrl('pages/AddSubscription');
  }

  Cancel(row, title) {
    Swal.fire({
      title: 'Reason For Cancellation',
      input: 'textarea',
      inputValidator: (value) => {
        if (!value) {
          return 'Please provide reason for cancellation'
        }
      }

    }).then((result) => {
      // if (result.value != '') {
      if (result.value) {
        var Json = {
          "type": "update",
          "account_pk": this.Accountpk,
          "id": row.id,
          "rg_status": title,
          "buyer_id": row.buyer.id,
          "remarks": String(result.value),
          "source_txn_type" : 'ZRG'
        }



        this.CommonService.AddEMD(Json).subscribe(data => {
          if (data instanceof HttpErrorResponse) {
            return;
          }
          if (data.success = true) {
            Swal.fire({
              icon: 'success',
              text: data.data.message,
            })
            const ListInput1: Input = {} as Input;
            ListInput1.size = 10
            ListInput1.offset = 0
            ListInput1.action='ZRG'
            ListInput1.account_pk = this.Accountpk
            this.GetList(ListInput1)
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
  pgTitle: any;
  pgText: any;


  Approve(row) {
    this.pgTitle = 'Confirmation ';
    this.pgText = 'Are you sure you want to Approve this request??';
    this.confirmService.LogOutOCnform({ title: this.pgTitle, message: this.pgText }).subscribe((result) => {
      var access = result;
      if (access == true) {
        var Json = {
          "type": "update",
          "account_pk": this.Accountpk,
          "id": row.id,
          "rg_status": 'APPROVED',
          "buyer_id": row.buyer.id,
          
          "source_txn_type" : 'ZRG'
          // "remarks": String(result.value)
        }
        this.CommonService.AddEMD(Json).subscribe(data => {
          if (data instanceof HttpErrorResponse) {
            return;
          }
          if (data.success = true) {
            Swal.fire({
              icon: 'success',
              text: data.data.message,
            })
            const ListInput1: Input = {} as Input;
            ListInput1.size = 10
            ListInput1.offset = 0
            ListInput1.action='ZRG'
            ListInput1.account_pk = this.Accountpk
            this.GetList(ListInput1)
          }
          else {
            Swal.fire({
              icon: 'error',
              text: data.data.message,
            })
          }
        },error=>{
          Swal.fire({
            icon: 'error',
            text: error.error.data.message,
          })
        });
      }
      else {
      }
    });
  }

  GetList(json) {
    this.items = []
    this.FilterStrings(json);
    this.BidService.EMDTrasactionList(json).subscribe(
      (res) => {
        if (res.success == true) {
          this.loader.close()
          this.items = this.temp = res.data as Bid[];
          this.items = res.data;
          this.page.pageNumber = 0;
          this.page.size = 10;
          this.page.totalElements = res.count
          
       this.mydatatable9.offset = (json.offset)/10;
        } else {
         this.mydatatable9.offset = (json.offset)/10;
          this.loader.close()
          Swal.fire("Oops...", res.data.message, "error");
          this.items = [];
          this.items = []
          this.page.pageNumber = 0;
          this.page.size = 0;
          this.page.totalElements = 0
        }
      },
      (err) => {
       this.mydatatable9.offset = (json.offset)/10;
        this.loader.close()
        // Swal.fire("Oops...", err.msg, "error");
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

    if (ListInput.mobile_number == "" || ListInput.mobile_number == undefined || ListInput.mobile_number == null) {
    } else { this.FilterString = this.FilterString + ' <b>Mobile Number: </b>' + ListInput.mobile_number; }

    // if (ListInput.auction_type == "" || ListInput.auction_type == undefined || ListInput.auction_type == null) {
    // }    else { this.FilterString = this.FilterString + ' <b>Auction Type: </b>' + ListInput.auction_type; }

    if (ListInput.full_name == "" || ListInput.full_name == undefined || ListInput.full_name == null) {
    } else { this.FilterString = this.FilterString + ' <b>Full Name: </b>' + ListInput.full_name; }

    if (ListInput.bidder_code == "" || ListInput.bidder_code == undefined || ListInput.bidder_code == null) {
    } else { this.FilterString = this.FilterString + ' <b>Full Name: </b>' + ListInput.bidder_code; }
    

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


  setPage(pageInfo) {

    const ListInput1: Input = {} as Input;
    ListInput1.size = (pageInfo.offset * 10) + 10;
    ListInput1.offset = (pageInfo.offset * 10);
    ListInput1.account_pk = this.Accountpk
    ListInput1.action='ZRG'
    if (this.from_date) { ListInput1.from_date = this.from_date } else { ListInput1.from_date = "" }
    if (this.to_date) { ListInput1.to_date = this.to_date } else { ListInput1.to_date = "" }
    if (this.mobile_number) { ListInput1.mobile_number = this.mobile_number } else { ListInput1.mobile_number = "" }
    if (this.full_name) { ListInput1.full_name = this.full_name } else { ListInput1.full_name = "" }
    if (this.bidder_code) { ListInput1.bidder_code = this.bidder_code } else { ListInput1.bidder_code = "" }

    
    this.GetList(ListInput1);

  }

  from_date: any;
  to_date: any;

  bidder_code:any
  full_name: any;
  mobile_number: any;

  receiveMessage($event) {

    this.mobile_number = $event.mobile_number
    this.full_name = $event.full_name
    this.bidder_code = $event.bidder_code
    var fromdate = this.datepipe.transform($event.from_date, 'yyyy-MM-dd')
    var todate = this.datepipe.transform($event.to_date, 'yyyy-MM-dd')

    this.from_date = fromdate
    this.to_date = todate
    const ListInput1: Input = {} as Input;
    ListInput1.size = 10
    ListInput1.offset = 0
    ListInput1.account_pk = this.Accountpk
    ListInput1.action='ZRG'
    if (this.from_date) { ListInput1.from_date = fromdate } else { ListInput1.from_date = "" }
    if (this.to_date) { ListInput1.to_date = todate } else { ListInput1.to_date = "" }
    if (this.mobile_number) { ListInput1.mobile_number = this.mobile_number } else { ListInput1.mobile_number = "" }
    if (this.full_name) { ListInput1.full_name = this.full_name } else { ListInput1.full_name = "" }
    if (this.bidder_code) { ListInput1.bidder_code = this.bidder_code } else { ListInput1.bidder_code = "" }

    
    this.GetList(ListInput1);
  }
//excel start
  async ReportExport() {
    if(this.page.totalElements == 0){
    return
  }
    this.isdisablereport = false
    this.pendingcount = 0
    this.testaay = [];

    const ListInput: Input = {} as Input;
    ListInput.size = this.page.totalElements;
    ListInput.offset = 0;
    ListInput.account_pk = this.Accountpk ? this.Accountpk : '';
    ListInput.action='ZRG'
    if (this.from_date) { ListInput.from_date = this.from_date } 
    if (this.to_date) { ListInput.to_date = this.to_date } 
    if (this.mobile_number) { ListInput.mobile_number = this.mobile_number } 
    if (this.full_name) { ListInput.full_name = this.full_name }
    if (this.bidder_code) { ListInput.bidder_code = this.bidder_code }
    

    var Size = 250
    var offset = 0
    var rou = (Math.ceil(this.page.totalElements / 250))

   for (let i = 0; i < rou; i++) {

      ListInput.offset = offset
      ListInput.size = Size + offset

      let createdEmployee = await this.CommonService.EmdTransactionListExcel(ListInput);
      //console.log('Created Employee: '+createdEmployee);
      if (createdEmployee.success == true) {
        for (let entry of createdEmployee.data) {

          const Input: ExportInput = {} as ExportInput;
          Input.status = entry.status
          Input.bidder_mobile_number = entry.bidder_mobile_number
          Input.buyer_full_name = entry.buyer.full_name
          Input.bidder_code = entry.buyer.bidder_code
          
          Input.payment_type = entry.payment_type
          Input.transaction_id = entry.transaction_id
          Input.total_amount = entry.total_amount
          Input.from_date = this.datepipe.transform(entry.start_at, 'dd-MM-yyyy hh:mm:ss a')
          Input.to_date = this.datepipe.transform(entry.expired_at, 'dd-MM-yyyy hh:mm:ss a')
          Input.txn_time = this.datepipe.transform(entry.txn_time, 'dd-MM-yyyy hh:mm:ss a')
        
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
      this.excelService.exportAsExcelFile(this.testaay, 'Registration_Fee_List');
      this.isdisablereport = true
    }
  }
  //excel end
}


export class Input {
  size: number
  offset: number
  account_pk: number
  from_date: string
  to_date: string
  full_name: string
  bidder_code:string
  // auction_type: string
  mobile_number: string

  action : string
}
//excel start
export class ExportInput {
      status: string
      bidder_mobile_number: string
      buyer_full_name: string
      payment_type: string
      transaction_id: string
      total_amount: string
      from_date: string
      to_date: string
      txn_time: string
  bidder_code:string

}
//excel end