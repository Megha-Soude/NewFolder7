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
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'app/shared/services/excel.service';
import { UserRegistrationComponent } from '../user-registration/user-registration.component';
import { UpdateCategoryLimitComponent } from './update-category-limit/update-category-limit.component';
import { UpdateBuyerUserComponent } from './update-buyer-user/update-buyer-user.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';


@Component({
  selector: 'app-buyer-registration-list',
  templateUrl: './buyer-registration-list.component.html',
  styleUrls: ['./buyer-registration-list.component.scss'],
  animations: egretAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class BuyerRegistrationListComponent implements OnInit {
   @ViewChild(DatatableComponent, { static: false }) mydatatable11: DatatableComponent;

  userTypeInfo: string;
  action_type: string;
  

  constructor(private Regservice: RegistrationService, private dialog: MatDialog,
    private data: DataPassService, private confirmService: AppConfirmService,
    private commonService: CommonService, private router: Router,
    private loader: AppLoaderService, private fb: FormBuilder,
    private excelService: ExcelService, private Auth: AuthorizeService, private datepipe: DatePipe,) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.page.totalElements = 0;
  }

  Accountpk: any;
  page = new Page();
  ngOnInit() {
    this.userTypeInfo = "buyer";
    this.tableOffset = 0
    this.Accountpk = this.Auth.GetAccountPk()
    const dataList1: UserInput = {} as UserInput;
    dataList1.account_pk = this.Accountpk
    dataList1.size = 10
    dataList1.offset = 0
    dataList1.action_type = 'buyer'
    this.GetUserList(dataList1)
  }

  AddNewUser() {
    this.data.SetGetUserInfo('');
    this.router.navigateByUrl('pages/UserRegistration');
  }
  tableOffset: number;
  setPage(pageInfo) {
    this.tableOffset = pageInfo.offset;
    this.page.totalElements = 0;
    // const ListInput1: UserInput = {} as UserInput;
    // ListInput1.size = (pageInfo.offset * 10) + 10;
    // ListInput1.offset = (pageInfo.offset * 10);
    // ListInput1.account_pk = this.Accountpk
    const ListInput1: UserInput = {} as UserInput;
    ListInput1.size = (pageInfo.offset * 10) + 10;
    ListInput1.offset = (pageInfo.offset * 10);
    ListInput1.mobile_number = this.mobile_number ? this.mobile_number : ''
    ListInput1.full_name = this.full_name ? this.full_name : ''
    ListInput1.action_type = this.action_type ? this.action_type : ''
    ListInput1.state = this.state ? this.state : ''
    ListInput1.district = this.district ? this.district : ''
    ListInput1.city = this.city ? this.city : ''
    ListInput1.is_active = this.is_active ? this.is_active : ''
    ListInput1.account_pk = this.Accountpk ? this.Accountpk : ''
    ListInput1.username = this.username ? this.username : ''
    ListInput1.action_type = 'buyer'
    //  this.GetUserList(ListInput1);
    this.GetUserList(ListInput1)
  }

  TempDownloadarray = []
  TotalElements: any;
  isdiableeporrt: boolean = true;
  reportDownload() {
    this.isdiableeporrt = false
    this.TempDownloadarray = []
    const ListInput1: UserInput = {} as UserInput;
    ListInput1.size = this.TotalElements;
    ListInput1.offset = 0;
    ListInput1.mobile_number = this.mobile_number ? this.mobile_number : ''
    ListInput1.full_name = this.full_name ? this.full_name : ''
    ListInput1.user_type = this.user_type ? this.user_type : ''
    ListInput1.state = this.state ? this.state : ''
    ListInput1.district = this.district ? this.district : ''
    ListInput1.city = this.city ? this.city : ''
    ListInput1.is_active = this.is_active ? this.is_active : ''
    ListInput1.category = this.category ? this.category : ''
    ListInput1.from_date = this.from_date ? this.from_date : ''
    ListInput1.to_date = this.to_date ? this.to_date : ''
    ListInput1.account_pk = this.Accountpk ? this.Accountpk : ''
    ListInput1.username = this.username ? this.username : ''
    ListInput1.action_type = 'buyer'
    this.Regservice.GetAllusers(ListInput1).subscribe(
      (res) => {
        if (res.success == true) {
          this.loader.close()
          for (let entry of res.data) {
            var Json = {
              "Status": entry.is_active ? 'Active' : 'Inactive',
              "Mobile_Number": entry.mobile_number,
              "EMD_Balance": entry.emd_balance,
              "Bidder Code": entry.bidder_code,
              "Category" : entry.category,
              "Full_Name": entry.full_name,
              "Registration_Date": this.datepipe.transform(entry.created_at, 'dd-MM-yyyy hh:mm:ss.sss a'),
              "Username":entry.username,
              "Email_id": entry.email_id,
              "State": entry.state,
              "District": entry.district,
              "City": entry.city,
              "Remark": entry.remarks,
            }
            this.TempDownloadarray.push(Json)
            this.pendingcount = this.TempDownloadarray.length;
          }
          this.excelService.exportAsExcelFile(this.TempDownloadarray, 'Buyer Users');
          this.isdiableeporrt = true
        } else {
          this.loader.close()
          Swal.fire("Oops...", res.data.message, "error");
          this.isdiableeporrt = true
        }
      },
      (err) => {
        this.loader.close()
        this.isdiableeporrt = true
        Swal.fire("Oops...", err.error.data.message, "error");
      }
    );
  }

  items: any
  pendingcount: any = 0;
  GetUserList(json) {
    this.items = []
    this.FilterStrings(json);
    // this.Regservice.GetAllusers(json).subscribe(data => {
    //   if (data instanceof HttpErrorResponse) {
    //     return;
    //   }
    //   if (data.success = true) {
    //     this.items = data.data
    //     this.items = data.data;
    //     this.page.pageNumber = 0;
    //     this.page.size = 10;
    //     this.page.totalElements = data.count
    //   }
    //   else {
    //     Swal.fire(data.data.msg, 'Error')
    //   }
    // });
    this.loader.open()
    this.Regservice.GetAllusers(json).subscribe(
      (res) => {
        if (res.success == true) {
          this.loader.close()
          this.items = res.data
          this.items = res.data;
          this.page.pageNumber = 0;
          this.page.size = 10;
          this.page.totalElements = res.count
          this.TotalElements = res.count
         this.mydatatable11.offset = (json.offset)/10;
        } else {
          this.loader.close()
          Swal.fire("Oops...", res.data.message, "error");
          this.items = []
          this.page.pageNumber = 0;
          this.page.size = 0;
          this.page.totalElements = 0
         this.mydatatable11.offset = (json.offset)/10;

        }
      },
      (err) => {
       this.mydatatable11.offset = (json.offset)/10;
        this.loader.close()
        Swal.fire("Oops...", err.error.data.message, "error");
      }
    );


  }

  inventory_code: any
  mobile_number: any
  full_name: any;
  state: any;
  user_type: any;
  is_active: any;
  category:any;
  district: any
  city: any
  username: any;
  from_date: string
  to_date: string
  receiveMessage($event) {
    this.inventory_code = $event.inventory_code;
    this.mobile_number = $event.mobile_number;
    this.full_name = $event.full_name;
    this.user_type = $event.user_type;
    this.state = $event.state;
    this.district = $event.district;
    this.city = $event.city;
    this.is_active = $event.is_active;
    this.category = $event.category;  
    let from_date = this.datepipe.transform($event.from_date, 'yyyy-MM-dd')
    let to_date = this.datepipe.transform($event.to_date, 'yyyy-MM-dd')
    this.username = $event.username;
    const ListInput1: UserInput = {} as UserInput;
    ListInput1.size = 10
    ListInput1.offset = 0
    ListInput1.mobile_number = this.mobile_number;
    ListInput1.full_name = this.full_name;
    ListInput1.user_type = this.user_type;
    ListInput1.state = this.state;
    ListInput1.district = this.district;
    ListInput1.city = this.city;
    ListInput1.is_active = this.is_active;
    ListInput1.category = this.category;
    ListInput1.from_date = from_date ? from_date : '';
    ListInput1.to_date  = to_date ? to_date : '';

    ListInput1.account_pk = this.Accountpk;
    ListInput1.auction_type = 'buyer'
    ListInput1.username = this.username ? this.username : ''

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

    // if (ListInput.user_type == "" || ListInput.user_type == undefined || ListInput.user_type == null) {
    // }
    // else { this.FilterString = this.FilterString + ' <b>User Type: </b>' + ListInput.user_type; }

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
   
    if (ListInput.category == "" || ListInput.category == undefined || ListInput.category == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>Category: </b>' + ListInput.category; }

    if (ListInput.from_date == "" || ListInput.from_date == undefined || ListInput.from_date == null) {
    } else { this.FilterString = ' <b>From Date: </b>' + this.datepipe.transform(ListInput.from_date, 'dd-MM-yyyy') }

    if (ListInput.to_date == "" || ListInput.to_date == undefined || ListInput.to_date == null) {
    } else { this.FilterString = this.FilterString + ' <b>To Date: </b>' + this.datepipe.transform(ListInput.to_date, 'dd-MM-yyyy') }

    if (ListInput.username == "" || ListInput.username == undefined || ListInput.username == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>User Name: </b>' + ListInput.username; }


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
        this.commonService.disableUser(request).subscribe(data => {
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
            dataList1.action_type = 'buyer'
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
        let request = { "user_id": value.id, "remarks": String(result.value) }
        this.commonService.disableUser(request).subscribe(data => {
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

  resetFilter($event) {
    this.loader.close();
    if ($event == 'buyer') {
      const dataList1: UserInput = {} as UserInput;
      dataList1.account_pk = this.Accountpk
      dataList1.size = 10
      dataList1.offset = 0
      dataList1.action_type = 'buyer'
      this.GetUserList(dataList1)
    }
  }


  EditBuyerUser(data) {
    let title = '';
    let dialogRef: MatDialogRef<any> = this.dialog.open(UpdateBuyerUserComponent, {
      width: '800px',
      disableClose: true,
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed().subscribe(res => {
      const dataList1: UserInput = {} as UserInput;
      dataList1.account_pk = this.Accountpk
      dataList1.size = 10;
      dataList1.offset = 0;
      dataList1.action_type = 'buyer';
      this.tableOffset = 0



      dataList1.mobile_number = this.mobile_number ? this.mobile_number : ''
      dataList1.full_name = this.full_name ? this.full_name : ''
      dataList1.auction_type = this.user_type ? this.user_type : ''
      dataList1.state = this.state ? this.state : ''
      dataList1.district = this.district ? this.district : ''
      dataList1.city = this.city ? this.city : ''
      dataList1.is_active = this.is_active ? this.is_active : ''
      dataList1.category = this.category ? this.category : ''
      dataList1.from_date = this.from_date ? this.from_date : ''
      dataList1.to_date = this.to_date ? this.to_date : ''
      dataList1.account_pk = this.Accountpk ? this.Accountpk : ''
      dataList1.username = this.username ? this.username : ''
      dataList1.user_type = 'buyer'
      this.GetUserList(dataList1)
    })
  }
  UpdateBuyerUserCategoryLimit(data) {
    let title = '';
    let dialogRef: MatDialogRef<any> = this.dialog.open(UpdateCategoryLimitComponent, {
      width: '500px',
      disableClose: true,
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed().subscribe(res => {
      const dataList1: UserInput = {} as UserInput;
      dataList1.account_pk = this.Accountpk;
      dataList1.size = 10;
      dataList1.offset = 0;
      dataList1.action_type = 'buyer';
      this.tableOffset = 0;
      this.GetUserList(dataList1)
    })
  }


  getname(row, value) {
    var DisplayValue = ''

    if (row.length > 0) {


      var Data = row.filter(
        book => book.document_type === 'Address Proof');

      if (Data.length > 0) {
        if (value == 'Name') {
          DisplayValue = Data[0].document_sub_type
        }
        
        else {
          DisplayValue = Data[0].document_no
        }


      }
      else {
        DisplayValue = ''
      }



    }

    return DisplayValue;
  }



}



export interface UserInput {
  user_type: any;

  action_type: string;
  page_id: string;
  page_detail_id: string;
  account_pk: number;
  auction_type: string;
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
  category:string;
  size: number
  offset: number
  username: string;
  from_date: string
  to_date: string
}

