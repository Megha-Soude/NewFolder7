import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { CommonService } from 'app/shared/services/MyServices/common.service';
import { DataPassService } from 'app/shared/services/MyServices/data-pass.service';
import Swal from "sweetalert2";
import { Page } from '../../../../../src/app/shared/models/PaginationPage'
@Component({
  selector: 'app-auction-list',
  templateUrl: './auction-list.component.html',
  styleUrls: ['./auction-list.component.scss'], encapsulation: ViewEncapsulation.None,
})
export class AuctionListComponent implements OnInit {


  getRowClass = (row) => {
    
    if(row.auction_status == "PENDING"){
      return {
        'row-color': true
      };
    }
  
  }

  constructor(private commonService: CommonService, private confirmService: AppConfirmService,
    private dataPass: DataPassService, private router: Router,private loader: AppLoaderService,
    private Auth:AuthorizeService,private Passdata: DataPassService,) { this.page.pageNumber = 0;
      this.page.size = 10;
      this.page.totalElements = 0;}
  items: any;
  page = new Page();
  selectedTab: any
  Accountpk:any;
  public viewMode: string = "list-view";
  ngOnInit() {

    
    this.Accountpk =this.Auth.GetAccountPk()
    this.items = []
    const ListInput1: Input = {} as Input;
    ListInput1.size = 10
    ListInput1.offset = 0

    ListInput1.account_pk= this.Accountpk
    ListInput1.auction_type= ""
    ListInput1.auction_status= ""
    // ListInput1.order_by=["-start_at", "id"]




     this.GetData(ListInput1)

  }



 
  setPage(pageInfo) {






    const ListInput1: Input = {} as Input;
  

    
    ListInput1.size = (pageInfo.offset * 10) + 10;
    ListInput1.offset = (pageInfo.offset * 10);

    ListInput1.account_pk= this.Accountpk
   
   
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
      "status":Status,
      "auction_id":  Auction.id ,
      "account_pk" :parseInt(this.Accountpk),
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
      var  Json1 = {
        "status":Status,
        "auction_id":  Auction.id ,
        "account_pk" :parseInt(this.Accountpk),
        "remarks" : "test"
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


  Changestatus(Json) {
    this.loader.open()
    this.commonService.AuctionStatsChange(Json).subscribe(
      (res) => {
        if (res.success == true) {
          this.loader.close()
          
          // this.InventoryFormNew.get('yard_city').setValue(res.data.yard_city);

          Swal.fire("Success", res.data.message, "success");

          const ListInput1: Input = {} as Input;
          ListInput1.size = 10
          ListInput1.offset = 0
          ListInput1.account_pk = this.Accountpk
       
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

    ListInput1.account_pk= this.Accountpk
   
   
    // ListInput1.order_by=["-start_at", "id"]

    ListInput1.auction_status= ""
    
     if (tab.index == 0) {
      ListInput1.auction_type= "current"
     
     }
     if (tab.index == 1) {
      ListInput1.auction_type= "upcoming"
     
    }
    if (tab.index == 2) {
      ListInput1.auction_type= "closed"
      
    }


    this.GetData(ListInput1)


  }

  FinaldataData: any;
  GetData(json) {
    this.loader.open()
    this.items = []
    this.commonService.Auctionlist(json).subscribe(
      (res) => {
        if (res.success == true) {
          this.loader.close()
          this.items = res.data;
          this.page.totalElements = res.count

        } else {
          this.loader.close()
          Swal.fire("Oops...", res.data.message, "error");
          this.items = [];

     
          this.page.pageNumber = 0;
                   this.page.totalElements = 0


        }
      },
      (err) => {
        this.loader.close()
        // Swal.fire("Oops...", err.msg, "error");
        Swal.fire("Oops...", err.error.data.message, "error");
      }
    );
  }

  AddAuctionClick()
  {
    this.Passdata.setAuctioncode(''); 
    this.router.navigateByUrl('pages/AddAuction');
  }
  Vechiledetails:any
  ViewDetail(Data)
  {
      this.Vechiledetails = []
      var json = { "auction_id": Data.id  , "account_pk":this.Accountpk }
      this.commonService.AuctionDetails(json).subscribe(
        (res) => {
          if (res.success == true) {
            this.loader.close()
            this.Vechiledetails = res.data;
          //  console.log(this.Vechiledetails)
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

}



export class Input {
  size: number
  offset: number

  account_pk: number
   auction_type: string
   auction_status: string
   order_by:any


}
