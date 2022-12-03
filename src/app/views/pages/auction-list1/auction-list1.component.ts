import { DatePipe } from '@angular/common';
import { Component, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DateAdapter } from 'angular-calendar';
import { ListInput } from 'app/shared/models/list-input';

import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ExcelService } from 'app/shared/services/excel.service';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { CommonService } from 'app/shared/services/MyServices/common.service';
import { DataPassService } from 'app/shared/services/MyServices/data-pass.service';
import { EventEmitter } from 'events';
import Swal from "sweetalert2";
import { Page } from '../../../../../src/app/shared/models/PaginationPage'
import { APP_DATE_FORMATS, AppDateAdapter } from './../format-datepicker';
import { ShopService } from 'app/shared/services/shop.service';


@Component({
  selector: 'app-auction-list1',
  templateUrl: './auction-list1.component.html',
  styleUrls: ['./auction-list1.component.scss'], encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class AuctionList1Component implements OnInit {
  // @ViewChild(DatatableComponent, { static: false }) mydatatable2: DatatableComponent;
  current:any;
  Auction_Status = true;
  userActive = true;
  testaay = []
  pendingcount: any = 0;
  isdisablereport: boolean = true;
  product :any


  getRowClass = (row) => {

    if (row.auction_status == "PENDING") {
      return {
        'row-color': true
      };
    }

  }
  auction_status: string;



  constructor(private commonService: CommonService, private confirmService: AppConfirmService,  private shopService: ShopService,
    private dataPass: DataPassService, private router: Router, private loader: AppLoaderService, private excelService: ExcelService,
    private Auth: AuthorizeService, private Passdata: DataPassService, private datepipe: DatePipe,) {
    this.config = {
      itemsPerPage: 0,
      currentPage: 0,
      totalItems: 0,
    };
  
  }
  public viewMode: string = "list-view";
  config: any;
  items: any;
  page = new Page();
  selectedTab: any
  Accountpk: any;
  href: any;
  pagevalid: any = [];
  selectedAuctionType: string = "CUSTOMER";
  ngOnInit() {

    this.shopService = this.product;
    this.Accountpk = this.Auth.GetAccountPk()
    this.items = []
    const ListInput1: Input = {} as Input;
    ListInput1.size = 10
    ListInput1.offset = 0

    ListInput1.account_pk = this.Accountpk
    ListInput1.auction_type = ""
    ListInput1.auction_status = ""
    ListInput1.type_of_auction = this.selectedAuctionType;
    // ListInput1.order_by=["-start_at", "id"]




    this.GetData(ListInput1)




    this.href = this.router.url;

    var splitted = this.href.split("/", 3);

    this.pagevalid = this.dataPass.Permission(splitted[2])

  }

  // onActionStatus(){

  //   if (ListInput.auction_status == "" || ListInput.auction_status == undefined || ListInput.auction_status == null) {
  //   } else { this.FilterString = this.FilterString + ' <b>Auction Status: </b>' + ListInput.auction_status; }
   
  // }



  CheckPermission(value) {
    var data2 = this.pagevalid.filter(book => book === value);

    // console.log(data2)


    if (data2.length > 0) {
      return true
    }
    else {
      return false
    }
  }




  setPage(pageInfo) {






    const ListInput1: Input = {} as Input;



    ListInput1.size = (pageInfo.offset * 10) + 10;
    ListInput1.offset = (pageInfo.offset * 10);

    ListInput1.account_pk = this.Accountpk





    if (this.open_auction_type) { ListInput1.open_auction_type = this.open_auction_type } else { ListInput1.open_auction_type = "" }
    if (this.auction_status) { ListInput1.auction_status = this.auction_status } else { ListInput1.auction_status = "" }
    // if(this.from_date){ ListInput1.from_date =  fromdate} else{ ListInput1.from_date =  ""}
    // if(this.to_date){ ListInput1.to_date =  todate} else{ ListInput1.to_date =  ""}
    if (this.auction_title) { ListInput1.auction_title = this.auction_title } else { ListInput1.auction_title = "" }
    if (this.contract_no) { ListInput1.contract_no = this.contract_no } else { ListInput1.contract_no = "" }
    if (this.registration_number) { ListInput1.registration_number = this.registration_number } else { ListInput1.registration_number = "" }
    if (this.bid_start_price) { ListInput1.bid_start_price = this.bid_start_price } else { ListInput1.bid_start_price = "" }
    if (this.inventory_title) { ListInput1.inventory_title = this.inventory_title } else { ListInput1.inventory_title = "" }
   
    ListInput1.auction_type = this.auction_type ? this.auction_type : ''

    // ListInput1.order_by=["-start_at", "id"]



    //  if (this.selectedTab == 0) {
    //   ListInput1.auction_type= "current"
    //   ListInput1.auction_status= ""
    //  }
    //  if (this.selectedTab == 1) {
    //   ListInput1.auction_type= "upcoming"
    //   ListInput1.auction_status= ""
    // }
    // if (this.selectedTab == 2) {
    //   ListInput1.auction_type= "closed"
    //   ListInput1.auction_status= ""
    // }


    this.GetData(ListInput1)




  }
  pgTitle = 'Confirmation ';
  pgText = 'Are you sure want to Change  Password??';
  StatusUpdate(Auction, Status) {
    var Json = {
      "status": Status,
      "auction_id": Auction.id,
      "account_pk": parseInt(this.Accountpk),
    }

    if (Status != "DISAPPROVED") {
      this.pgText = "Are you sure want to Approve  Auction??"

      this.confirmService.LogOutOCnform({ title: this.pgTitle, message: this.pgText })
        .subscribe((result) => {

          var access = result;
          if (access == true) {

            this.Changestatus(Json)

          }
          else {

          }
        });
    }
    else {
      this.pgText = "Are you sure want to Disapprove this Auction??"
      var Json1 = {
        "status": Status,
        "auction_id": Auction.id,
        "account_pk": parseInt(this.Accountpk),
        "remarks": "test"
      }

      this.confirmService.LogOutOCnform({ title: this.pgTitle, message: this.pgText })
        .subscribe((result) => {

          var access = result;
          if (access == true) {

            this.Changestatus(Json1)

          }
          else {

          }
        });

      }

  }


  pageChanged(event) {


    var offset = event;
    if (offset > 0) {
      offset = offset - 1;
    }
    this.config.currentPage = event;

    const ListInput1: Input = {} as Input;
    ListInput1.size = (event * 10);
    ListInput1.offset = ((event - 1) * 10)
    ListInput1.account_pk = this.Accountpk;

    ListInput1.open_auction_type = this.open_auction_type
    ListInput1.auction_status = this.auction_status
    ListInput1.account_pk = this.Accountpk

    ListInput1.from_date = this.from_date
    ListInput1.to_date = this.to_date
    ListInput1.auction_title = this.auction_title
    ListInput1.contract_no = this.contract_no
    ListInput1.registration_number = this.registration_number
    ListInput1.bid_start_price = this.bid_start_price
    ListInput1.inventory_title = this.inventory_title


    ListInput1.auction_type = this.auction_type ? this.auction_type : ''
    ListInput1.type_of_auction = this.selectedAuctionType;


    this.GetData(ListInput1);
  }



  StatusUpdateDisapprove(Inventory, Status) {
   let statusName = Status == "DISAPPROVED" ? 'Disapprove' : 'Cancellation'
    Swal.fire({
      title: 'Reason For ' + statusName,
      input: 'textarea',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write reason!'
        }
      }

    }).then((result) => {
      // if (result.value != '') {
      if (result.value) {





        var Json1 = {
          "status": Status,
          "auction_id": Inventory.id,
          "account_pk": parseInt(this.Accountpk),
          "remarks": result.value
        }



        this.Changestatus(Json1)


      }


    }, (error: any) => console.log(error));

  }


  Changestatus(Json) {
    this.loader.open()
    this.commonService.AuctionStatsChange(Json).subscribe(
      (res) => {
        if (res.success == true) {
          this.loader.close()

          // this.InventoryFormNew.get('yard_city').setValue(res.data.yard_city);

          Swal.fire("Success", res.data.message, "success");



          this.config.currentPage = this.config.currentPage

          const ListInput1: Input = {} as Input;


          if (this.config.currentPage == 0) {
            ListInput1.size = 10
            ListInput1.offset = 0
          }
          else {
            ListInput1.size = (this.config.currentPage * 10);
            ListInput1.offset = ((this.config.currentPage - 1) * 10)
          }


          ListInput1.account_pk = this.Accountpk


          ListInput1.open_auction_type = this.open_auction_type
          ListInput1.auction_status = this.auction_status
          ListInput1.account_pk = this.Accountpk

          ListInput1.from_date = this.from_date
          ListInput1.to_date = this.to_date
          ListInput1.auction_title = this.auction_title

          ListInput1.contract_no = this.contract_no
          ListInput1.registration_number = this.registration_number
          ListInput1.bid_start_price = this.bid_start_price
          ListInput1.inventory_title = this.inventory_title


          this.GetData(ListInput1)
        } else {
          this.loader.close()
          Swal.fire("Oops...", res.data.message, "error");
        }
      },
      (err) => {
        this.loader.close()
        Swal.fire("Oops...", err.error.data.message, "error");
      }
    );
  }


  TabChange(tab) {
    this.selectedTab = tab.index

    const ListInput1: Input = {} as Input;
    ListInput1.size = 10
    ListInput1.offset = 0

    ListInput1.account_pk = this.Accountpk


    // ListInput1.order_by=["-start_at", "id"]

    ListInput1.auction_status = ""

    if (tab.index == 0) {
      ListInput1.auction_type = "current"

    }
    if (tab.index == 1) {
      ListInput1.auction_type = "upcoming"

    }
    if (tab.index == 2) {
      ListInput1.auction_type = "closed"

    }


    this.GetData(ListInput1)


  }

  tabChange($event){
    this.page.totalElements = 0;
    this.items = [];
    this.config.itemsPerPage = 10;
    this.config.offset = 0;
    this.config.totalItems = 0;
    const ListInput1: Input = {} as Input;
    ListInput1.size = 10;
    ListInput1.offset = 0;
    ListInput1.account_pk = this.Accountpk;
    ListInput1.auction_status = "";
    ListInput1.auction_type = ""
    if ($event.index == 0) {
      this.selectedAuctionType = "CUSTOMER";
    }
    if ($event.index == 1) {
      this.selectedAuctionType = "BUYER";
    }
    ListInput1.type_of_auction = this.selectedAuctionType;
    this.GetData(ListInput1);
  }

  open_auction_type: any
  // auction_status: any

  from_date: any
  to_date: any
  auction_title: any

  auction_type: any
  contract_no:any
  registration_number:any
  bid_start_price:any
  inventory_title:any
  receiveMessage($event) {
    this.config.currentPage = 0
    this.open_auction_type = $event.open_auction_type
    this.auction_status = $event.auction_status
    this.from_date = $event.from_date
    this.to_date = $event.to_date
    this.auction_title = $event.auction_title
    this.auction_type = $event.auction_type
    var fromdate = this.datepipe.transform($event.from_date, 'yyyy-MM-dd')
    var todate = this.datepipe.transform($event.to_date, 'yyyy-MM-dd')
    this.contract_no = $event.contract_no
    this.registration_number = $event.registration_number
    this.bid_start_price = $event.bid_start_price
    this.inventory_title = $event.inventory_title

    
    const ListInput1: Input = {} as Input;
    ListInput1.size = 10
    ListInput1.offset = 0
    ListInput1.open_auction_type =  this.open_auction_type
    ListInput1.auction_status =   this.auction_status
    ListInput1.account_pk = this.Accountpk
    ListInput1.type_of_auction = this.selectedAuctionType;
    ListInput1.from_date= this.from_date
    ListInput1.to_date= this.to_date
    ListInput1.auction_title= this.auction_title

    if (this.open_auction_type) { ListInput1.open_auction_type = this.open_auction_type } else { ListInput1.open_auction_type = "" }
    if (this.auction_status) { ListInput1.auction_status = this.auction_status } else { ListInput1.auction_status = "" }
    if (this.from_date) { ListInput1.from_date = fromdate } else { ListInput1.from_date = "" }
    if (this.to_date) { ListInput1.to_date = todate } else { ListInput1.to_date = "" }
    if (this.auction_title) { ListInput1.auction_title = this.auction_title } else { ListInput1.auction_title = "" }
    if (this.contract_no) { ListInput1.contract_no = this.contract_no } else { ListInput1.contract_no = "" }
    if (this.registration_number) { ListInput1.registration_number = this.registration_number } else { ListInput1.registration_number = "" }
    if (this.bid_start_price) { ListInput1.bid_start_price = this.bid_start_price } else { ListInput1.bid_start_price = "" }
    if (this.inventory_title) { ListInput1.inventory_title = this.inventory_title } else { ListInput1.inventory_title = "" }
   
    ListInput1.auction_type = this.auction_type ? this.auction_type : ''
    this.GetData(ListInput1);
  }
  FinaldataData: any;
  GetData(json) {

    
    this.loader.open()
    this.items = []
    this.FilterStrings(json);
    this.commonService.Auctionlist(json).subscribe(
      (res) => {
        if (res.success == true) {
          this.loader.close()
          this.items = res.data;
          this.page.totalElements = res.count
          this.config.itemsPerPage = 10;
          this.config.offset = 0;

          // this.mydatatable2.offset = (json.offset)/10;
          // if (res.count < 10) {
          //   this.config.totalItems = 10
          // }
          // else {
            this.config.totalItems = res.count;
          // }

        } else {
          this.loader.close()
          Swal.fire("Oops...", res.data.message, "error");
          


          // this.page.pageNumber = 0;
          // this.page.totalElements = 0


          // this.config.itemsPerPage = 10;
          // this.config.offset = 0;

          this.items = [];
          this.config.itemsPerPage = 10;
          this.config.offset = 0;
          this.config.totalItems = 0;
          // this.mydatatable2.offset = (json.offset)/10;


        }
      },
      (err) => {
        // this.mydatatable2.offset = (json.offset)/10;
        this.loader.close()
        // Swal.fire("Oops...", err.msg, "error");
        Swal.fire("Oops...", err.error.data.message, "error");
      }
    );
  }

  FilterString: any
  FilterStrings(ListInput) {

    this.FilterString = "";


    if (ListInput.open_auction_type == "" || ListInput.open_auction_type == undefined || ListInput.open_auction_type == null) {
    }
    else { this.FilterString = ' <b>Auction Type: </b>' + ListInput.open_auction_type; }

   
    if (ListInput.auction_status == "" || ListInput.auction_status == undefined || ListInput.auction_status == null) {
    } else { this.FilterString = this.FilterString + ' <b>Auction Status: </b>' + ListInput.auction_status; }
   
  

    if (ListInput.from_date == "" || ListInput.from_date == undefined || ListInput.from_date == null) {
    } else { this.FilterString = this.FilterString + ' <b>From Date: </b>' + ListInput.from_date; }


    if (ListInput.to_date == "" || ListInput.to_date == undefined || ListInput.to_date == null) {
    } else { this.FilterString = this.FilterString + ' <b>To Date: </b>' + ListInput.to_date; }


    if (ListInput.auction_title == "" || ListInput.auction_title == undefined || ListInput.auction_title == null) {
    } else { this.FilterString = this.FilterString + ' <b>Auction Title: </b>' + ListInput.auction_title; }

    if (ListInput.auction_type == "" || ListInput.auction_type == undefined || ListInput.auction_type == null) {
    } else { this.FilterString = this.FilterString + ' <b>Auction Type: </b>' + ListInput.auction_type; }

    if (ListInput.contract_no == "" || ListInput.contract_no == undefined || ListInput.contract_no == null) {
    } else { this.FilterString = this.FilterString + ' <b>Contract No: </b>' + ListInput.contract_no; }

    if (ListInput.registration_number == "" || ListInput.registration_number == undefined || ListInput.registration_number == null) {
    } else { this.FilterString = this.FilterString + ' <b>Registration Number: </b>' + ListInput.registration_number; }

    if (ListInput.bid_start_price == "" || ListInput.bid_start_price == undefined || ListInput.bid_start_price == null) {
    } else { this.FilterString = this.FilterString + ' <b>Bid Start Price: </b>' + ListInput.bid_start_price; }

    if (ListInput.inventory_title == "" || ListInput.inventory_title == undefined || ListInput.inventory_title == null) {
    } else { this.FilterString = this.FilterString + ' <b>Inventory Title: </b>' + ListInput.inventory_title; }

  }



  AddAuctionClick() {
    this.Passdata.setAuctioncode('');
    this.router.navigateByUrl('pages/AddAuction');
  }
  Vechiledetails: any
  ViewDetail(Data) {
    this.loader.open()
    this.Vechiledetails = []
    var json = { "auction_id": Data.id, "account_pk": this.Accountpk }
    this.commonService.AuctionDetails(json).subscribe(
      (res) => {
        if (res.success == true) {
          this.loader.close()
          this.Vechiledetails = res.data;
// console.log(Data,"Data")
localStorage.setItem('auctionlistDetails', JSON.stringify(Data));
          this.Passdata.setAuctioncode(this.Vechiledetails);
          this.router.navigateByUrl('pages/AddAuction');

        } else {
          this.loader.close()
          Swal.fire("Oops...", res.data.message, "error");
          this.Vechiledetails = [];

        }
      },
      (err) => {
        this.loader.close()
        Swal.fire("Oops...", err.message, "error");
      }
    );




  }
  async ReportExport() {
    if(this.config.totalItems == 0){
      return
    }
    this.isdisablereport = false
    this.pendingcount = 0
    this.testaay = [];

    const ListInput1: Input = {} as Input;
    ListInput1.size = this.config.totalItems;
    ListInput1.offset = 0;
    ListInput1.account_pk = this.Accountpk ? this.Accountpk : '';
    ListInput1.type_of_auction = this.selectedAuctionType ? this.selectedAuctionType : '';
    if (this.auction_type) { ListInput1.auction_type = this.auction_type } else { ListInput1.auction_type = "" }
    if (this.open_auction_type) { ListInput1.open_auction_type = this.open_auction_type } else { ListInput1.open_auction_type = "" }
    if (this.auction_status) { ListInput1.auction_status = this.auction_status } else { ListInput1.auction_status = "" }
    if (this.from_date) { ListInput1.from_date = this.from_date } else { ListInput1.from_date = "" }
    if (this.to_date) { ListInput1.to_date = this.to_date } else { ListInput1.to_date = "" }
    if (this.auction_title) { ListInput1.auction_title = this.auction_title } else { ListInput1.auction_title = "" }
    if (this.contract_no) { ListInput1.contract_no = this.contract_no } else { ListInput1.contract_no = "" }
    if (this.registration_number) { ListInput1.registration_number = this.registration_number } else { ListInput1.registration_number = "" }
    if (this.bid_start_price) { ListInput1.bid_start_price = this.bid_start_price } else { ListInput1.bid_start_price = "" }
    if (this.inventory_title) { ListInput1.inventory_title = this.inventory_title } else { ListInput1.inventory_title = "" }
   

    var Size = 250
    var offset = 0


    var rou = (Math.ceil(this.config.totalItems / 250))






    for (let i = 0; i < rou; i++) {

      ListInput1.offset = offset
      ListInput1.size = Size + offset

      let createdEmployee = await this.commonService.AuctionListExcel(ListInput1);
      //console.log('Created Employee: '+createdEmployee);
      if (createdEmployee.success == true) {

        for (let entry of createdEmployee.data) {

          const Input: ExportInput = {} as ExportInput;

          // Input.cover_image = entry.cover_image
          Input.auction_title = entry.auction_title
          Input.auction_code = entry.auction_code
          Input.type_of_auction = entry.type_of_auction
          Input.interval = entry.interval
          Input.contract_no = entry.contract_no
          Input.registration_number = entry.registration_number
          Input.bid_start_price = entry.bid_start_price
          Input.inventory_title = entry.inventory_title
          Input.start_date = this.datepipe.transform(entry.start_at, 'dd-MM-yyyy')
          Input.end_date = this.datepipe.transform(entry.end_at, 'dd-MM-yyyy')
          
          Input.start_time = this.datepipe.transform(entry.start_at, 'hh:mm:ss a')
          Input.end_time = this.datepipe.transform(entry.end_at, 'hh:mm:ss a')
          Input.auction_type = entry.auction_type
          Input.open_auction_type = entry.open_auction_type

          // Input.inventory_count = entry.inventory_count
          Input.auction_status = entry.auction_status
          Input.created_at = this.datepipe.transform(entry.created_at, 'dd-MM-yyyy hh:mm:ss a')
          Input.total_bids = entry.total_bids





          this.Datapepare(Input);




        }





      }

      offset = offset + 250
    }
  }


  Datapepare(aray) {

    this.testaay.push(aray)
    this.pendingcount = this.testaay.length
    if (this.testaay.length == this.config.totalItems) {



      this.testaay.sort((a: any, b: any) => { return Date.parse(b.SortDate) - Date.parse(a.SortDate) });
      this.testaay.forEach(function (x) { delete x.SortDate });
      this.excelService.exportAsExcelFile(this.testaay, 'Auction_List');



      this.isdisablereport = true


    }




  }
}



export class Input {
  size: number
  offset: number

  account_pk: number
  auction_type: string
  auction_status: string
  open_auction_type: string
  from_date: string
  to_date: string
  auction_title: string

  contract_no:string
  registration_number:string
  bid_start_price:string
  inventory_title:string
  type_of_auction: any;


}

export class ExportInput {
  [x: string]: any;
  auction_title: string
  auction_code: string
  type_of_auction: string
  interval: string
  start_at: string
  end_at: string
  open_auction_type: string
  auction_type: string
  inventory_count: string
  auction_status: string
  created_at: string
  total_bids: string
  cover_image: string
  contract_no:string
  registration_number:string
  bid_start_price:string
  inventory_title:string
  start_date:string
  end_date:string
  start_time:string
  end_time:string
}

function onActionStatus() {
  throw new Error('Function not implemented.');
}
