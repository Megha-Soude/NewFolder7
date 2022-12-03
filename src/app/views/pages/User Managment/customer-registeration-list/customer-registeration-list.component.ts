import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from 'app/shared/models/PaginationPage';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ExcelService } from 'app/shared/services/excel.service';
import { DataPassService } from 'app/shared/services/MyServices/data-pass.service';
import { RegistrationService } from 'app/shared/services/MyServices/registration.service';
import { UserInput } from '../userlist/userlist.component';
import Swal from 'sweetalert2';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { CommonService } from 'app/shared/services/MyServices/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material';
// import { UpdateCategoryLimitComponent } from './update-category-limit/update-category-limit.component';
import { UpdateBuyerUserComponent } from '../buyer-registration-list/update-buyer-user/update-buyer-user.component';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { UpdateCustomerLimitComponent } from './update-customer-limit/update-customer-limit.component';
@Component({
  selector: 'app-customer-registeration-list',
  templateUrl: './customer-registeration-list.component.html',
  styleUrls: ['./customer-registeration-list.component.scss']
})
export class CustomerRegisterationListComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) mydatatable11: DatatableComponent;

  userTypeInfo: string;
  mobile_number: any;
  full_name: any;
  action_type: string;
  state: any;
  district: any;
  city: any;
  is_active: any;
  username: any;
  items: any[];
  datepipe: any;
  isdiableeporrt: boolean;
  TempDownloadarray: any[];
  TotalElements: number;
  user_type: any;
  category: any;
  from_date: any;
  to_date: any;
  pendingcount: number;
  inventory_code: any;
  pageTitle: string;
  pageText: string;
  output: boolean = true;
  
  constructor( private data: DataPassService,  private router: Router,
    private registration: RegistrationService, private Loader: AppLoaderService,
    private Excel: ExcelService, private Confirm: AppConfirmService,
    private commonService: CommonService, private Dialog: MatDialog,
     private autherization : AuthorizeService) 
     {this.page.pageNumber = 0;
      this.page.size = 10;
      this.page.totalElements = 0; }
 
      Accountpk: any;
  page = new Page();
  ngOnInit() {
    this.userTypeInfo = "Customer";
    this.tableOffset = 0
    this.Accountpk = this.autherization.GetAccountPk()
    const dataList1: UserInput = {} as UserInput;
    dataList1.account_pk = this.Accountpk
    dataList1.size = 10
    dataList1.offset = 0
    dataList1.action_type = 'Customer'
    this.GetUserList(dataList1)
  }

  AddNewUser() {
    this.data.SetGetUserInfo('');
    this.router.navigateByUrl('pages/CustomerUser');
  }
  tableOffset: number;
  setPage(pageInfo) {
    this.tableOffset = pageInfo.offset;
    this.page.totalElements = 0;

    const ListInput1: UserInput = {} as UserInput;
    ListInput1.size = (pageInfo.offset * 10) + 10;
    ListInput1.offset = (pageInfo.offset * 10);
    ListInput1.mobile_number = this.mobile_number ? this.mobile_number: '';
    ListInput1.full_name = this.full_name ? this.full_name : ' ';
    ListInput1.action_type = this.action_type ? this.action_type : '';
    ListInput1.state = this.state ? this.state : '';
    ListInput1.district = this.district ? this.district : ''
    ListInput1.city = this.city ? this.city : ''
    ListInput1.is_active = this.is_active ? this.is_active : ''
    ListInput1.account_pk = this.Accountpk ? this.Accountpk : ''
    ListInput1.username = this.username ? this.username : ''
    ListInput1.action_type = 'Customer'
    this.GetUserList(ListInput1)
  }


  reportDownload(){
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
    ListInput1.action_type = 'Customer'
    this.registration.GetAllusers(ListInput1).subscribe( (data)=>{
      if(data.success == true) {
         this.Loader.close()
         for (let entry of data.data1){
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
         this.Excel.exportAsExcelFile(this.TempDownloadarray, 'Customer Users');
         this.isdiableeporrt = true
      } else {
        this.Loader.close()
        Swal.fire("Oops...", data.data1.message, "error");
        this.isdiableeporrt = true
      }
    },
    (err) => {
      this.Loader.close()
      this.isdiableeporrt = true
      Swal.fire("Oops...", err.error.data.message, "error");
    }
    );
  }

  
  GetUserList(json) {
    this.items = []
    this.FilterStrings(json);
  
  this.Loader.open()
  this.registration.GetAllusers(json).subscribe( (data) => {
    if (data.success == true) {

      this.Loader.close()
      this.items = data.data1
      this.items = data.data1;
      this.page.pageNumber = 0;
      this.page.size = 10;
      this.page.totalElements = data.count
      this.TotalElements = data.count
     this.mydatatable11.offset = (json.offset)/10;
    }
    else {
      this.Loader.close()
      Swal.fire("Oops...", data.data1.message, "error");
      this.items = []
      this.page.pageNumber = 0;
      this.page.size = 0;
      this.page.totalElements = 0
     this.mydatatable11.offset = (json.offset)/10;
    }
  },
  (err) => {
    this.mydatatable11.offset = (json.offset)/10;
     this.Loader.close()
     Swal.fire("Oops...", err.error.data.message, "error");
   }
  )
  }

  receiveMessage($event){
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
    ListInput1.auction_type = 'Customer'
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

 
  disableCustomer(value) {
    this.pageTitle = 'Confirmation ';
    this.pageText = 'Are you sure you want to Active this user??';
    this.Confirm.LogOutOCnform({ title: this.pageTitle, message: this.pageText }).subscribe((result) => {
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

  disableCustomerDiactivate(value){
    
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
  this.Loader.close();
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
  let dialogRef: MatDialogRef<any> = this.Dialog.open(UpdateBuyerUserComponent, {
    width: '800px',
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

UpdateCustomerUserCategoryLimit(data) {
  let title = '';
  let dialogRef: MatDialogRef<any> = this.Dialog.open(UpdateCustomerLimitComponent, {
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


