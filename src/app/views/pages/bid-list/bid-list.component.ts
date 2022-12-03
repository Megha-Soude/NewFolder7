import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { CommonService } from 'app/shared/services/MyServices/common.service';
import { DataPassService } from 'app/shared/services/MyServices/data-pass.service';
import { Page } from '../../../../../src/app/shared/models/PaginationPage'
import Swal from "sweetalert2";
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import {BidLogsComponent} from './bid-logs/bid-logs.component'
import { DatatableComponent } from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-bid-list',
  templateUrl: './bid-list.component.html',
  styleUrls: ['./bid-list.component.scss'], encapsulation: ViewEncapsulation.None,
})
export class BidListComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) mydatatable3: DatatableComponent;

  constructor(private commonService: CommonService, private confirmService: AppConfirmService,
    private dataPass: DataPassService, private router: Router,private loader: AppLoaderService,
    private Auth:AuthorizeService, private dialog: MatDialog,) { this.page.pageNumber = 0;
      this.page.size = 10;
      this.page.totalElements = 0;}
  items: any;
  page = new Page();
  selectedTab: any
  Accountpk:any;

  ngOnInit() {
    this.Accountpk =this.Auth.GetAccountPk()

    const ListInput1: Input = {} as Input;
    ListInput1.size = 10
    ListInput1.offset = 0
    ListInput1.auction_type  ='current'
    this.GetData(ListInput1)
  }

  GetData(json) {
    this.loader.open()
    this.items = []
    this.commonService.bidList(json).subscribe(
      (res) => {
        if (res.success == true) {
          this.loader.close()
          this.items = res.data;
          this.page.pageNumber = 0;
          this.page.size = 10;
          this.page.totalElements = res.count

           this.mydatatable3.offset = (json.offset)/10;
        } else {
          this.loader.close()
          Swal.fire("Oops...", res.data.message, "error");
          this.items = [];
           this.mydatatable3.offset = (json.offset)/10;
        }
      },
      (err) => {
         this.mydatatable3.offset = (json.offset)/10;
        this.loader.close()
        Swal.fire("Oops...", err.message, "error");
      }
    );
  }



  ViewLogs(data: any = {}) {
    if (data != '') {
      //this.data.setOption(data);

      let title = '';
      let dialogRef: MatDialogRef<any> = this.dialog.open(BidLogsComponent, {
         width: '700px',
        disableClose: false,
        data: { title: title, payload: data }
      })
    }
    else {
     // this.router.navigate(['pages/RuleSetup']);

    }



  }

  TabChange(tab) {
    this.selectedTab = tab.index

    const ListInput1: Input = {} as Input;
    ListInput1.size = 10
    ListInput1.offset = 0

   
    
     if (tab.index == 0) {
      ListInput1.auction_type= "current"
     
     }
     if (tab.index == 1) {
      ListInput1.auction_type= "closed"
     
    }
    

    this.GetData(ListInput1)


  }

}




export class Input {



  size: number
  offset: number
  auction_type  :string

}