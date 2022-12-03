import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { RegistrationService } from '../../../../shared/services/MyServices/registration.service';
import Swal from 'sweetalert2';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { DataPassService } from 'app/shared/services/MyServices/data-pass.service';
import { CommonService } from 'app/shared/services/MyServices/common.service';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Page } from 'app/shared/models/PaginationPage';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { MatDialog, MatDialogRef } from '@angular/material';
import { UserRegistrationComponent } from '../../User Managment/user-registration/user-registration.component';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'app/shared/services/excel.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss'], animations: egretAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class UserlistComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) mydatatable12: DatatableComponent;
  config: any;
  public isSideNavOpen: boolean;
  public viewMode: string = "list-view";
  public currentPage: any;
  constructor(private Regservice: RegistrationService, private dialog: MatDialog, private confirmService: AppConfirmService,
    private data: DataPassService, private CommonService: CommonService, private router: Router, private loader: AppLoaderService,
    private fb: FormBuilder, private Auth: AuthorizeService, private datepipe: DatePipe, private excelService: ExcelService,) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.page.totalElements = 0;
  }
  Accountpk: any;
  page = new Page();
  testaay = []
  pendingcount: any = 0;
  isdisablereport: boolean = true;
  selectedAuctionType: string = "CUSTOMER";
  ngOnInit() {
    this.tableOffset = 0
    this.Accountpk = this.Auth.GetAccountPk()
    const dataList1: UserInput = {} as UserInput;
    dataList1.account_pk = this.Accountpk
    dataList1.size = 10
    dataList1.offset = 0
    dataList1.user_type = this.selectedAuctionType;
    this.GetUserList(dataList1)
  }

  tabChange(event){
    if(event.index === 0){
      this.selectedAuctionType = "CUSTOMER";
    }
    else if(event.index === 1){
      this.selectedAuctionType = "BUYER";
    }
    this.Accountpk = this.Auth.GetAccountPk()
    const dataList1: UserInput = {} as UserInput;
    dataList1.account_pk = this.Accountpk
    dataList1.size = 10
    dataList1.offset = 0
    dataList1.user_type = this.selectedAuctionType;
    this.GetUserList(dataList1);
  }

  AddNewUser(data) {
    let title = '';
    let dialogRef: MatDialogRef<any> = this.dialog.open(UserRegistrationComponent, {
      width: '800px',
      disableClose: true,
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed().subscribe(res => {
      const dataList1: UserInput = {} as UserInput;
      dataList1.account_pk = this.Accountpk
      dataList1.size = 10
      dataList1.offset = 0
      this.tableOffset = 0
      this.GetUserList(dataList1)
    })
  }
  tableOffset: number;
  setPage(pageInfo) {
    this.tableOffset = pageInfo.offset;
    this.page.totalElements = 0;
    const ListInput1: UserInput = {} as UserInput;
    ListInput1.size = (pageInfo.offset * 10) + 10;
    ListInput1.offset = (pageInfo.offset * 10);
    ListInput1.mobile_number = this.mobile_number ? this.mobile_number : ''
    ListInput1.full_name = this.full_name ? this.full_name : ''
    ListInput1.from_date = this.from_date ? this.from_date : ''
    ListInput1.to_date = this.to_date ? this.to_date : ''
    
    ListInput1.user_type = this.user_type ? this.user_type : ''
    ListInput1.state = this.state ? this.state : ''
    ListInput1.district = this.district ? this.district : ''
    ListInput1.city = this.city ? this.city : ''
    ListInput1.is_active = this.is_active ? this.is_active : ''
    ListInput1.account_pk = this.Accountpk ? this.Accountpk : ''
    ListInput1.username = this.username ? this.username : ''

    // ListInput1.party_type_name = this.party_type_name ? this.party_type_name : ''
    // ListInput1.party_sub_type_name = this.party_sub_type_name ? this.party_sub_type_name : ''
    // ListInput1.created_at = this.created_at ? this.created_at : ''
    // ListInput1.evaluator_code = this.evaluator_code ? this.evaluator_code : ''
    // ListInput1.email_id = this.email_id ? this.email_id : ''

    //this.GetUserList(ListInput1);
    ListInput1.user_type = this.selectedAuctionType;
    this.GetUserList(ListInput1)
  }
  items: any
  GetUserList(json) {
    this.items = [];
    this.FilterStrings(json)
    this.Regservice.GetAllusers(json).subscribe(
      (res) => {
        if (res.success == true) {
          this.loader.close()
          this.items = res.data;
          this.page.totalElements = res.count
          this.page.pageNumber = 0;
          this.page.size = 10;
          
        // this.mydatatable12.offset = json.offset;
        } else {
          this.loader.close()
          Swal.fire("Oops...", res.data.message, "error");
          this.items = [];
          this.page.pageNumber = 0;
          this.page.size = 0;
          this.page.totalElements = 0;
          // this.mydatatable12.offset = json.offset;
        }
      },
      (err) => {
        // this.mydatatable12.offset = json.offset;
        this.loader.close()

        Swal.fire("Oops...", err.error.data.message, "error");
      });
  }
  pgTitle: any;
  pgText: any;


  disableBuyer(value) {
    this.pgTitle = 'Confirmation ';
    this.pgText = 'Are you sure you want to Active this user??';
    this.confirmService.LogOutOCnform({ title: this.pgTitle, message: this.pgText }).subscribe((result) => {
      var access = result;
      if (access == true) {
        let request = { "user_id": value.id }
        this.CommonService.disableUser(request).subscribe(data => {
          if (data instanceof HttpErrorResponse) {
            return;
          }
          if (data.success = true) {
            Swal.fire({
              icon: 'success',
              text: data.data.message,
            })
            const dataList1: UserInput = {} as UserInput;
            dataList1.account_pk = this.Accountpk
            dataList1.size = 10
            dataList1.offset = 0
            this.GetUserList(dataList1)
          }
          else {
            Swal.fire({
              icon: 'error',
              text: data.data.message,
            })
          }
        });
      }
      else {
      }
    });

  }


  disableBuyerDiactivate(value) {
    Swal.fire({
      title: 'Reason For Deactive',
      input: 'textarea',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write reason!'
        }
      }

    }).then((result) => {
      // if (result.value != '') {
      if (result.value) {
        // var Json = {
        //   "status": Status,
        //   "inventory_id": Inventory.id,
        //   "account_pk": this.Accountpk,
        //   "remarks": String(result.value)
        // }
        let request = { "user_id": value.id, "remarks": String(result.value) }
        this.CommonService.disableUser(request).subscribe(data => {
          if (data instanceof HttpErrorResponse) {
            return;
          }
          if (data.success = true) {
            Swal.fire({
              icon: 'success',
              text: data.data.message,
            })
            const dataList1: UserInput = {} as UserInput;
            dataList1.account_pk = this.Accountpk
            dataList1.size = 10
            dataList1.offset = 0
            this.GetUserList(dataList1)
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

  inventory_code: any
  mobile_number: any
  full_name: any;
  from_date: any
  to_date: any
  state: any;
  user_type: any;
  is_active: any;
  district: any
  city: any
  username: any
  // party_type_name: any;
  party_sub_type_name: any;
  created_at: any;
  evaluator_code: any;
  email_id: any;
  receiveMessage($event) {
    this.inventory_code = $event.inventory_code;
    this.mobile_number = $event.mobile_number;
    this.full_name = $event.full_name; 
   
    let from_date = this.datepipe.transform($event.from_date, 'yyyy-MM-dd')
    let to_date = this.datepipe.transform($event.to_date, 'yyyy-MM-dd') 
     
    this.user_type = $event.user_type;
    this.state = $event.state;
    this.district = $event.district;
    this.city = $event.city;
    this.is_active = $event.is_active;
    this.username = $event.username;
    // this.party_type_name = $event.party_type_name;
    // this.party_sub_type_name = $event.party_sub_type_name;
    // this.created_at = $event.created_at;
    // this.evaluator_code = $event.evaluator_code;
    const ListInput1: UserInput = {} as UserInput;
    ListInput1.size = 10
    ListInput1.offset = 0
    ListInput1.mobile_number = this.mobile_number ? this.mobile_number : ''
    ListInput1.full_name = this.full_name ? this.full_name : ''
    ListInput1.from_date = from_date ? from_date : ''
    ListInput1.to_date = to_date ? to_date : ''
    
    ListInput1.user_type = this.user_type ? this.user_type : ''
    ListInput1.state = this.state ? this.state : ''
    ListInput1.district = this.district ? this.district : ''
    ListInput1.city = this.city ? this.city : ''
    ListInput1.is_active = this.is_active ? this.is_active : ''
    ListInput1.account_pk = this.Accountpk ? this.Accountpk : ''
    ListInput1.username = this.username ? this.username : ''
    // ListInput1.party_type_name = this.party_type_name ? this.party_type_name : ''
    // ListInput1.party_sub_type_name = this.party_sub_type_name ? this.party_sub_type_name : ''
    // ListInput1.created_at = this.created_at ? this.created_at : ''
    // ListInput1.evaluator_code = this.evaluator_code ? this.evaluator_code : ''
    ListInput1.user_type = this.selectedAuctionType;
    this.GetUserList(ListInput1);
  }

  FilterString: any
  FilterStrings(ListInput) {
    this.FilterString = "";
    if (ListInput.mobile_number == "" || ListInput.mobile_number == undefined || ListInput.mobile_number == null) {
    }
    else { this.FilterString = ' <b>Mobile Number: </b>' + ListInput.mobile_number; }
    
    if (ListInput.full_name == "" || ListInput.full_name == undefined || ListInput.full_name == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>Full Name: </b>' + ListInput.full_name; }
   
    if (ListInput.user_type == "" || ListInput.user_type == undefined || ListInput.user_type == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>User Type: </b>' + ListInput.user_type; }
    if (ListInput.state == "" || ListInput.state == undefined || ListInput.state == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>State: </b>' + ListInput.state; }
    if (ListInput.district == "" || ListInput.district == undefined || ListInput.district == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>District: </b>' + ListInput.district; }
    if (ListInput.city == "" || ListInput.city == undefined || ListInput.city == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>City: </b>' + ListInput.city; }
    if (ListInput.is_active == "" || ListInput.is_active == undefined || ListInput.is_active == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>isActive: </b>' + ListInput.is_active; }
    if (ListInput.username == "" || ListInput.username == undefined || ListInput.username == null) {
    }

    else { this.FilterString = this.FilterString + ' <b>User Name: </b>' + ListInput.username; }
   
    if (ListInput.from_date == "" || ListInput.from_date == undefined || ListInput.from_date == null) {
    }
    else { this.FilterString = ' <b>From Date: </b>' + this.datepipe.transform(ListInput.from_date, 'dd-MM-yyyy') }

    if (ListInput.to_date == "" || ListInput.to_date == undefined || ListInput.to_date == null) {
    } else { this.FilterString = this.FilterString + ' <b>To Date: </b>' + this.datepipe.transform(ListInput.to_date, 'dd-MM-yyyy') }

  }

  resetFilter($event) {
    if ($event != 'buyer') {
      this.Accountpk = this.Auth.GetAccountPk()
      const dataList1: UserInput = {} as UserInput;
      dataList1.account_pk = this.Accountpk
      dataList1.size = 10
      dataList1.offset = 0
      dataList1.user_type = this.selectedAuctionType;
      this.GetUserList(dataList1)
    }
  }
  async ReportExport() {
    if(this.page.totalElements == 0){
      return
    }
    this.isdisablereport = false
    this.pendingcount = 0
    this.testaay = [];


    const ListInput: UserInput = {} as UserInput;
    ListInput.size = this.page.totalElements;
    ListInput.offset = 0;
    ListInput.account_pk = this.Accountpk ? this.Accountpk : '';
    if (this.is_active) { ListInput.is_active = this.is_active; }
    if (this.full_name) { ListInput.full_name = this.full_name; }
    if (this.from_date) { ListInput.from_date = this.from_date; }
    if (this.to_date) { ListInput.to_date = this.to_date; }
    if (this.user_type) { ListInput.user_type = this.user_type; }
    if (this.mobile_number) { ListInput.mobile_number = this.mobile_number; }
    if (this.username) { ListInput.username = this.username; }
    ListInput.user_type = this.selectedAuctionType;

   
    var Size = 250
    var offset = 0


    var rou = (Math.ceil(this.page.totalElements / 250))




    for (let i = 0; i < rou; i++) {

      ListInput.offset = offset
      ListInput.size = Size + offset

      let createdEmployee = await this.CommonService.UserListExcel(ListInput);
      //console.log('Created Employee: '+createdEmployee);
      if (createdEmployee.success == true) {

        for (let entry of createdEmployee.data) {

          const Input: ExcelInput = {} as ExcelInput;

          Input.status = entry.is_active ? 'Active' : 'Inactive'
          

          Input.full_name = entry.full_name
          Input.user_type = entry.user_type
          Input.sub_type = entry.party_sub_type_name
          Input.bidder_code = entry.bidder_code,
          Input.mobile_number = entry.mobile_number
          Input.username = entry.username
          Input.registration_date = this.datepipe.transform(entry.created_at, 'dd-MM-yyyy hh:mm:ss a')
          Input.evaluator_code = entry.evaluator_code
          Input.email_id = entry.email_id


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
      this.excelService.exportAsExcelFile(this.testaay, 'UserList');



      this.isdisablereport = true


    }




  }



}



export interface UserInput {
  auction_type: string;
  category: any;
  action_type: any;
  page_id: string;
  page_detail_id: string;
  account_pk: number;
  user_type: string;
  mobile_number: number;
  email_id: string;
  address_1: string;
  address_2: string;
  state: string;
  city: string;
  district: string;
  taluka: string;
  full_name: string;
  country: string;
  is_active: boolean;
  size: number
  offset: number
  username: string;
  from_date: string
  to_date: string

}

export interface ExcelInput {
  account_pk: string
  status: string;
  full_name: string;
  user_type: string;
  sub_type: string;
  mobile_number: string;
  username: string;
  registration_date: string;
  evaluator_code: string;
  email_id: string;
  size: number
  offset: number
  bidder_code:string
}

