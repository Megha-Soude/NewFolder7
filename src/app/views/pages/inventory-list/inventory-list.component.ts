import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'app/shared/services/MyServices/common.service';
import Swal from "sweetalert2";
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';

import { DataPassService } from 'app/shared/services/MyServices/data-pass.service';
import { Router } from '@angular/router';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { BulkUploadInventoryComponent } from '../inventory-list/bulk-upload-inventory/bulk-upload-inventory.component';
import { debug } from 'util';
import { ExcelService } from 'app/shared/services/excel.service';
import { DatePipe } from '@angular/common';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {
  //  @ViewChild(DatatableComponent, { static: false }) mydatatable10: DatatableComponent;
  config: any;
  public isSideNavOpen: boolean;
  public viewMode: string = "list-view";
  public currentPage: any;
  constructor(private commonService: CommonService, private confirmService: AppConfirmService,
    private dataPass: DataPassService, private router: Router, private Auth: AuthorizeService, private excelService: ExcelService,
    private datepipe: DatePipe, private loader: AppLoaderService, private dialog: MatDialog,) {
    this.config = {
      itemsPerPage: 0,
      currentPage: 0,
      totalItems: 0,
    };
  }
  Accountpk: any;
  href: any;
  pagevalid: any = []

  testaay = []
  pendingcount: any = 0;
  isdisablereport: boolean = true;




  SessionData: any

  SubpartytypeId: any

  ngOnInit() {
    this.href = this.router.url;
    var splitted = this.href.split("/", 3);
    this.pagevalid = this.dataPass.Permission(splitted[2])
    this.Accountpk = this.Auth.GetAccountPk()
    const ListInput1: Input = {} as Input;
    ListInput1.size = 10
    ListInput1.offset = 0
    ListInput1.account_pk = this.Accountpk;
    this.GetData(ListInput1)
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


    ListInput1.inventory_code = this.inventory_code ? this.inventory_code : ''
    ListInput1.availablity_status = this.availablity_status ? this.availablity_status : ''
    ListInput1.approved_status = this.approved_status ? this.approved_status : ''
    ListInput1.mobile_number = this.mobile_number ? this.mobile_number : ''
    ListInput1.yard_code = this.yard_code ? this.yard_code : ''
    ListInput1.yard_name = this.yard_name ? this.yard_name : ''
    ListInput1.yard_city = this.yard_city ? this.yard_city : ''
    ListInput1.yard_region = this.yard_region ? this.yard_region : ''
    ListInput1.yard_state = this.yard_state ? this.yard_state : ''
    ListInput1.year_of_manufacture = this.year_of_manufacture ? this.year_of_manufacture : ''
    ListInput1.evaluation_type = this.evaluation_type ? this.evaluation_type : ''
    ListInput1.from_date = this.from_date ? this.from_date : ''
    ListInput1.to_date = this.to_date ? this.to_date : ''
    ListInput1.from_reposs_date = this.from_reposs_date ? this.from_reposs_date : ''
    ListInput1.to_reposs_date = this.to_reposs_date ? this.to_reposs_date : ''
    ListInput1.from_evaluator_date = this.from_evaluator_date ? this.from_evaluator_date : ''
    ListInput1.to_evaluator_date = this.to_evaluator_date ? this.to_evaluator_date : ''
    ListInput1.evaluation_agency = this.evaluation_agency ? this.evaluation_agency : ''

    ListInput1.ppt = this.ppt ? this.ppt : ''
    ListInput1.registration_number = this.registration_number ? this.registration_number : ''
    ListInput1.account_pk = this.Accountpk;
    ListInput1.contract_no = this.contract_no ? this.contract_no : ''
    this.GetData(ListInput1);
  }
  FilterString: any

  FilterStrings(ListInput) {

    this.FilterString = "";


    if (ListInput.mobile_number == "" || ListInput.mobile_number == undefined || ListInput.mobile_number == null) {
    }
    else { this.FilterString = ' <b>Mobile Number: </b>' + ListInput.mobile_number; }


    if (ListInput.contract_no == "" || ListInput.contract_no == undefined || ListInput.contract_no == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>Contract Number: </b>' + ListInput.contract_no; }

    if (ListInput.yard_code == "" || ListInput.yard_code == undefined || ListInput.yard_code == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>Yard Code: </b>' + ListInput.yard_code; }

    if (ListInput.yard_name == "" || ListInput.yard_name == undefined || ListInput.yard_name == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>Yard Name: </b>' + ListInput.yard_name; }






    if (ListInput.yard_city == "" || ListInput.yard_city == undefined || ListInput.yard_city == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>Yard City: </b>' + ListInput.yard_city; }





    if (ListInput.yard_region == "" || ListInput.yard_region == undefined || ListInput.yard_region == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>Yard Region: </b>' + ListInput.yard_region; }



    if (ListInput.yard_state == "" || ListInput.yard_state == undefined || ListInput.yard_state == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>Yard State: </b>' + ListInput.yard_state; }




    if (ListInput.year_of_manufacture == "" || ListInput.year_of_manufacture == undefined || ListInput.year_of_manufacture == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>Year of Manufacture: </b>' + ListInput.year_of_manufacture; }




    if (ListInput.availablity_status == "" || ListInput.availablity_status == undefined || ListInput.availablity_status == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>Availabilty Status: </b>' + ListInput.availablity_status; }



    if (ListInput.approved_status == "" || ListInput.approved_status == undefined || ListInput.approved_status == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>Approved Status: </b>' + ListInput.approved_status; }


    if (ListInput.inventory_code == "" || ListInput.inventory_code == undefined || ListInput.inventory_code == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>Inventory Code: </b>' + ListInput.inventory_code; }


    if (ListInput.ppt == "" || ListInput.ppt == undefined || ListInput.ppt == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>PPT: </b>' + ListInput.ppt; }


    if (ListInput.registration_number == "" || ListInput.registration_number == undefined || ListInput.registration_number == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>Registration Number: </b>' + ListInput.registration_number; }


    var EVReport



    if (ListInput.evaluation_type == 'YES') {
      EVReport = 'COMPLETED'
    }
    else if (ListInput.evaluation_type == 'NO') {
      EVReport = 'PENDING'
    }



    if (ListInput.evaluation_type == "" || ListInput.evaluation_type == undefined || ListInput.evaluation_type == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>Evaluation Status: </b>' + EVReport }


    if (ListInput.from_date == "" || ListInput.from_date == undefined || ListInput.from_date == null) {
    } else { this.FilterString = ' <b>From Date: </b>' + this.datepipe.transform(ListInput.from_date, 'dd-MM-yyyy') }

    if (ListInput.to_date == "" || ListInput.to_date == undefined || ListInput.to_date == null) {
    } else { this.FilterString = this.FilterString + ' <b>To Date: </b>' + this.datepipe.transform(ListInput.to_date, 'dd-MM-yyyy') }

    
    if (ListInput.from_reposs_date == "" || ListInput.from_reposs_date == undefined || ListInput.from_reposs_date == null) {
    } else { this.FilterString = ' <b>From Reposs Date: </b>' + this.datepipe.transform(ListInput.from_reposs_date, 'dd-MM-yyyy') }

    if (ListInput.to_reposs_date == "" || ListInput.to_reposs_date == undefined || ListInput.to_reposs_date == null) {
    } else { this.FilterString = this.FilterString + ' <b>To Reposs Date: </b>' + this.datepipe.transform(ListInput.to_reposs_date, 'dd-MM-yyyy') }

    
    if (ListInput.from_evaluator_date == "" || ListInput.from_evaluator_date == undefined || ListInput.from_evaluator_date == null) {
    } else { this.FilterString = ' <b>From Evaluator Date: </b>' + this.datepipe.transform(ListInput.from_evaluator_date, 'dd-MM-yyyy') }

    if (ListInput.to_evaluator_date == "" || ListInput.to_evaluator_date == undefined || ListInput.to_evaluator_date == null) {
    } else { this.FilterString = this.FilterString + ' <b>To Evaluator Date: </b>' + this.datepipe.transform(ListInput.to_evaluator_date, 'dd-MM-yyyy') }

    
    if (ListInput.evaluation_agency == "" || ListInput.evaluation_agency == undefined || ListInput.evaluation_agency == null) {
    }
    else { this.FilterString = this.FilterString + ' <b>Evaluation Agency: </b>' + ListInput.evaluation_agency; }

 


  }

  FinaldataData: any;
  GetData(json) {
    this.loader.open()
    this.FilterStrings(json);
    this.FinaldataData = []

    this.commonService.InventoryList(json).subscribe(
      (res) => {
        if (res.success == true) {

          this.loader.close()
          // this.InventoryFormNew.get('yard_city').setValue(res.data.yard_city);

          this.FinaldataData = res.data;
          this.config.itemsPerPage = 10;
          this.config.offset = 0;
          this.config.totalItems = res.total_count;

        //  this.mydatatable10.offset = (json.offset)/10;

        } else {
          this.loader.close()
          Swal.fire("Oops...", res.data.message, "error");
          this.FinaldataData = [];
          this.config.itemsPerPage = 0;
          this.config.offset = 0;
          this.config.totalItems = 0;

        //  this.mydatatable10.offset = (json.offset)/10;
        }
      },
      (err) => {
      //  this.mydatatable10.offset = (json.offset)/10;
        this.loader.close()
        Swal.fire("Oops...", err.error.data.message, "error");
      }
    );
  }
  pgTitle = 'Confirmation ';
  pgText = 'Are you sure want to Change  Password??';


  StatusUpdate(Inventory, Status) {
    if (!Inventory.evaluation_done) {
      Swal.fire("Oops...", 'Evaluation is not done for this vehicle , Please contact to Evaluator ', "error");
      return false
    }
    var Json = {
      "status": Status,
      "inventory_id": Inventory.id,
      "account_pk": this.Accountpk,
      "remarks": "test"
    }


    this.pgText = "Are you sure want to  Approve Inventory??"

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
  Addvevhileclick(Data) {
    if (Data == '') {
      this.dataPass.setVehiceldetail(Data);
      this.router.navigate(['pages/Addinventory']);
    }
    else {
      this.loader.open()
      var Json = { inventory_id: Data.id, account_pk: this.Accountpk }
      this.commonService.getVehicleDetailbyid(Json).subscribe(
        (res) => {
          if (res.success == true) {
            this.loader.close()
            //this.PPTDATA = res.data
            this.dataPass.setVehiceldetail(res.data);
            this.router.navigate(['pages/Addinventory']);
          } else {
            this.loader.close()
            Swal.fire("Oops...", res.message, "error");
          }
        },
        (err) => {
          this.loader.close()
          Swal.fire("Oops...", err.message, "error");
        }
      );
    }






  }

  DisableornotDisapprove(Approvestatus, Availblestatus) {
    if ((Approvestatus == 'APPROVED' || Approvestatus == 'PENDING') && Availblestatus != 'SOLD') {
      return false;
    }
    else {
      return true;
    }
  }

  Disableornot(status, Availblestatus) {
    if ((status == 'PENDING' || status == 'DISAPPROVED') && (Availblestatus != 'SOLD')) {
      return false
    }
    else {
      return true
    }
  }



  AddBulkIpload() {


    let title = '';
    let dialogRef: MatDialogRef<any> = this.dialog.open(BulkUploadInventoryComponent, {
      width: '800px',
      disableClose: false,
      data: { title: title, payload: '' }
    })

    dialogRef.afterClosed()
      .subscribe(res => {



      })


  }


  StatusUpdateDisapprove(Inventory, Status) {

    Swal.fire({
      title: 'Reason For Disapprove',
      input: 'textarea',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write reason!'
        }
      }

    }).then((result) => {
      // if (result.value != '') {
      if (result.value) {


        var Json = {
          "status": Status,
          "inventory_id": Inventory.id,
          "account_pk": this.Accountpk,
          "remarks": String(result.value)
        }



        this.Changestatus(Json)


      }


    }, (error: any) => console.log(error));

  }





  Sold(Product) {
    this.pgTitle = 'Confirmation ';
    this.pgText = 'Are you sure want to Release this Vehicle??';
    var Json = {
      "inventory_id": Product.id
      , "account_pk": this.Accountpk
    }
    this.confirmService.LogOutOCnform({ title: this.pgTitle, message: this.pgText })
      .subscribe((result) => {
        var access = result;
        if (access == true) {

          this.commonService.MarkAsSold(Json).subscribe(
            (res) => {
              if (res.success == true) {

                this.loader.close()
                Swal.fire("Success", res.data.message, "success");

                const ListInput1: Input = {} as Input;
                // ListInput1.size = 10
                // ListInput1.offset = 0
                // ListInput1.account_pk = this.Accountpk;

                if (this.config.currentPage == 0) {
                  ListInput1.size = 10
                  ListInput1.offset = 0
                }
                else {
                  ListInput1.size = (this.config.currentPage * 10);
                  ListInput1.offset = ((this.config.currentPage - 1) * 10)
                }


                ListInput1.inventory_code = this.inventory_code ? this.inventory_code : ''
                ListInput1.availablity_status = this.availablity_status ? this.availablity_status : ''
                ListInput1.approved_status = this.approved_status ? this.approved_status : ''
                ListInput1.mobile_number = this.mobile_number ? this.mobile_number : ''
                ListInput1.yard_code = this.yard_code ? this.yard_code : ''
                ListInput1.yard_name = this.yard_name ? this.yard_name : ''
                ListInput1.yard_city = this.yard_city ? this.yard_city : ''
                ListInput1.yard_region = this.yard_region ? this.yard_region : ''
                ListInput1.yard_state = this.yard_state ? this.yard_state : ''
                ListInput1.year_of_manufacture = this.year_of_manufacture ? this.year_of_manufacture : ''
                ListInput1.evaluation_type = this.evaluation_type ? this.evaluation_type : ''
                
                ListInput1.from_date = this.from_date ? this.from_date : ''
                ListInput1.to_date = this.to_date ? this.to_date : ''
                ListInput1.from_reposs_date = this.from_reposs_date ? this.from_reposs_date : ''
                ListInput1.to_reposs_date = this.to_reposs_date ? this.to_reposs_date : ''
                ListInput1.from_evaluator_date = this.from_evaluator_date ? this.from_evaluator_date : ''
                ListInput1.to_evaluator_date = this.to_evaluator_date ? this.to_evaluator_date : ''
                ListInput1.evaluation_agency = this.evaluation_agency ? this.evaluation_agency : ''
                ListInput1.ppt = this.ppt ? this.ppt : ''
                ListInput1.registration_number = this.registration_number ? this.registration_number : ''

                ListInput1.account_pk = this.Accountpk;

                ListInput1.contract_no = this.contract_no ? this.contract_no : ''

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
        else {

        }
      });


  }
  DocUrl: any
  getUrl(Data) {
    var data2 = Data.filter(book => book.position === 'evaluation_criteria');
    var Url = data2.url;
    this.DocUrl = data2.url
  }


  Changestatus(Json) {
    this.loader.open()
    this.commonService.Changestatus(Json).subscribe(
      (res) => {
        if (res.success == true) {
          this.loader.close()

          // this.InventoryFormNew.get('yard_city').setValue(res.data.yard_city);

          Swal.fire("Success", res.data.message, "success");

          this.config.currentPage = this.config.currentPage
          const ListInput1: Input = {} as Input;
          // ListInput1.size = 10
          // ListInput1.offset = 0


          // ListInput1.size = (this.config.currentPage * 10);
          // ListInput1.offset = ((this.config.currentPage - 1) * 10)


          if (this.config.currentPage == 0) {
            ListInput1.size = 10
            ListInput1.offset = 0
          }
          else {
            ListInput1.size = (this.config.currentPage * 10);
            ListInput1.offset = ((this.config.currentPage - 1) * 10)
          }


          ListInput1.inventory_code = this.inventory_code ? this.inventory_code : ''
          ListInput1.availablity_status = this.availablity_status ? this.availablity_status : ''
          ListInput1.approved_status = this.approved_status ? this.approved_status : ''
          ListInput1.mobile_number = this.mobile_number ? this.mobile_number : ''
          ListInput1.yard_code = this.yard_code ? this.yard_code : ''
          ListInput1.yard_name = this.yard_name ? this.yard_name : ''
          ListInput1.yard_city = this.yard_city ? this.yard_city : ''
          ListInput1.yard_region = this.yard_region ? this.yard_region : ''
          ListInput1.yard_state = this.yard_state ? this.yard_state : ''
          ListInput1.year_of_manufacture = this.year_of_manufacture ? this.year_of_manufacture : ''
          ListInput1.evaluation_type = this.evaluation_type ? this.evaluation_type : ''
         
          ListInput1.from_date = this.from_date ? this.from_date : ''
          ListInput1.to_date = this.to_date ? this.to_date : ''
          ListInput1.from_reposs_date = this.from_reposs_date ? this.from_reposs_date : ''
          ListInput1.to_reposs_date = this.to_reposs_date ? this.to_reposs_date : ''
          ListInput1.from_evaluator_date = this.from_evaluator_date ? this.from_evaluator_date : ''
          ListInput1.to_evaluator_date = this.to_evaluator_date ? this.to_evaluator_date : ''
          ListInput1.evaluation_agency = this.evaluation_agency ? this.evaluation_agency : ''
          ListInput1.ppt = this.ppt ? this.ppt : ''
          ListInput1.registration_number = this.registration_number ? this.registration_number : ''

          ListInput1.account_pk = this.Accountpk;

          ListInput1.contract_no = this.contract_no ? this.contract_no : ''
          this.GetData(ListInput1)
        } else {
          this.loader.close()
          Swal.fire("Oops...", res.data.message, "error");


        }
      },
      (err) => {
        this.loader.close()
        Swal.fire("Oops...", err.msg, "error");
      }
    );
  }


  inventory_code: any
  mobile_number: any
  yard_code: any
  yard_name:any
  yard_city: any
  yard_region: any
  yard_state: any
  year_of_manufacture: any

  availablity_status: any
  approved_status: any
  ppt: any
  registration_number: any
  evaluation_type: any
  from_date: any
  to_date: any
  from_reposs_date: any
  to_reposs_date: any
  from_evaluator_date: any
  to_evaluator_date: any
  evaluation_agency: any
  contract_no: any;
  receiveMessage($event) {
    this.evaluation_type = $event.evaluation_type
    this.ppt = $event.ppt
    this.registration_number = $event.registration_number
    this.inventory_code = $event.inventory_code
    this.mobile_number = $event.mobile_number
    this.yard_code = $event.yard_code
    this.yard_name = $event.yard_name
    this.yard_city = $event.yard_city
    this.yard_region = $event.yard_region
    this.yard_state = $event.yard_state
    this.year_of_manufacture = $event.year_of_manufacture
    this.availablity_status = $event.availablity_status
    this.approved_status = $event.approved_status
    let from_date = this.datepipe.transform($event.from_date, 'yyyy-MM-dd')
    let to_date = this.datepipe.transform($event.to_date, 'yyyy-MM-dd')
    let from_reposs_date = this.datepipe.transform($event.from_reposs_date, 'yyyy-MM-dd')
    let to_reposs_date = this.datepipe.transform($event.to_reposs_date, 'yyyy-MM-dd')
    let from_evaluator_date = this.datepipe.transform($event.from_evaluator_date, 'yyyy-MM-dd')
    let to_evaluator_date = this.datepipe.transform($event.to_evaluator_date, 'yyyy-MM-dd')
    this.evaluation_agency = $event.evaluation_agency
    


    this.contract_no = $event.contract_no
    this.config.currentPage = 0
    const ListInput1: Input = {} as Input;

  
    ListInput1.size = 10
    ListInput1.offset = 0
    ListInput1.inventory_code = this.inventory_code ? this.inventory_code : ''
    ListInput1.availablity_status = this.availablity_status ? this.availablity_status : ''
    ListInput1.approved_status = this.approved_status ? this.approved_status : ''
    ListInput1.mobile_number = this.mobile_number ? this.mobile_number : ''
    ListInput1.yard_code = this.yard_code ? this.yard_code : ''
    ListInput1.yard_name = this.yard_name ? this.yard_name : ''
    ListInput1.yard_city = this.yard_city ? this.yard_city : ''
    ListInput1.yard_region = this.yard_region ? this.yard_region : ''
    ListInput1.yard_state = this.yard_state ? this.yard_state : ''
    ListInput1.year_of_manufacture = this.year_of_manufacture ? this.year_of_manufacture : ''
    ListInput1.evaluation_type = this.evaluation_type ? this.evaluation_type : ''
    ListInput1.from_date = from_date ? from_date : ''
    ListInput1.to_date = to_date ? to_date : ''
    ListInput1.from_reposs_date = from_reposs_date ? from_reposs_date : ''
    ListInput1.to_reposs_date = to_reposs_date ? to_reposs_date : ''
    ListInput1.from_evaluator_date = from_evaluator_date ? from_evaluator_date : ''
    ListInput1.to_evaluator_date = to_evaluator_date ? to_evaluator_date : ''
    ListInput1.evaluation_agency = this.evaluation_agency ? this.evaluation_agency : ''
    ListInput1.ppt = this.ppt ? this.ppt : ''
    ListInput1.registration_number = this.registration_number ? this.registration_number : ''
    ListInput1.account_pk = this.Accountpk;

    ListInput1.contract_no = this.contract_no ? this.contract_no : ''



    this.GetData(ListInput1);


  }
  async ReportExport() {
    if(this.config.totalItems == 0){
      return
    }
    this.isdisablereport = false
    this.pendingcount = 0
    this.testaay = [];


    const ListInput: Input = {} as Input;
    ListInput.size = this.config.totalItems;
    ListInput.offset = 0;
    ListInput.account_pk = this.Accountpk ? this.Accountpk : '';

    if (this.inventory_code) { ListInput.inventory_code = this.inventory_code }
    if (this.availablity_status) { ListInput.availablity_status = this.availablity_status }
    if (this.approved_status) { ListInput.approved_status = this.approved_status }
    if (this.mobile_number) { ListInput.mobile_number = this.mobile_number }
    if (this.yard_code) { ListInput.yard_code = this.yard_code }
    if (this.yard_name) { ListInput.yard_name = this.yard_name }
    if (this.yard_city) { ListInput.yard_city = this.yard_city }
    if (this.yard_region) { ListInput.yard_region = this.yard_region }
    if (this.yard_state) { ListInput.yard_state = this.yard_state }
    if (this.year_of_manufacture) { ListInput.year_of_manufacture = this.year_of_manufacture }
    if (this.evaluation_type) { ListInput.evaluation_type = this.evaluation_type }
    if (this.from_date) { ListInput.from_date = this.from_date }
    if (this.to_date) { ListInput.to_date = this.to_date }
    if (this.from_reposs_date) { ListInput.from_reposs_date = this.from_reposs_date }
    if (this.to_reposs_date) { ListInput.to_reposs_date = this.to_reposs_date }
    if (this.from_evaluator_date) { ListInput.from_evaluator_date = this.from_evaluator_date }
    if (this.to_evaluator_date) { ListInput.to_evaluator_date = this.to_evaluator_date }
    if (this.evaluation_agency) { ListInput.evaluation_agency = this.evaluation_agency }
    
    if (this.ppt) { ListInput.ppt = this.ppt }
    if (this.registration_number) { ListInput.registration_number = this.registration_number }
    if (this.contract_no) { ListInput.contract_no = this.contract_no }



    var Size = 250
    var offset = 0


    var rou = (Math.ceil(this.config.totalItems / 250))






    for (let i = 0; i < rou; i++) {

      ListInput.offset = offset
      ListInput.size = Size + offset

      let createdEmployee = await this.commonService.InventoryListExcel(ListInput);
      //console.log('Created Employee: '+createdEmployee);
      if (createdEmployee.success == true) {

        for (let entry of createdEmployee.data) {

          const Input: ExportInput = {} as ExportInput;
          Input.inventory_title = entry.inventory_title
          Input.registration_number = entry.registration_number
          Input.year_of_manufacture = entry.year_of_manufacture
          Input.contract_no = entry.contract_no
          Input.ppt_name = entry.ppt_name
          Input.approved_status = entry.approved_status
          Input.evaluation_done = entry.evaluation_done == true ? 'YES' : 'NO'
          Input.chassis_no = entry.chassis_no
          Input.days_in_stock = entry.days_in_stock
          Input.yard_code = entry.yard_code
          Input.yard_name = entry.yard_name
          Input.yard_name = entry.yard_name
          Input.yard_state = entry.yard_state
          Input.yard_region = entry.yard_region
          Input.created_at = this.datepipe.transform(entry.created_at, 'dd-MM-yyyy hh:mm:ss a')
          Input.availablity_status = entry.availablity_status
          Input.evaluator_date = entry.evaluator_date
          Input.bid_start_price = entry.bid_start_price
          Input.image_uploaded = entry.image_uploaded == true ? 'YES' : 'NO'
          Input.evaluation_uploaded = entry.evaluation_uploaded  == true ? 'YES' : 'NO'
          Input.tax_paid_validity = entry.tax_paid_validity
          Input.insurance_validity = entry.insurance_validity
          Input.fitness_validity = entry.fitness_validity
         



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
      this.excelService.exportAsExcelFile(this.testaay, 'Inventory_List');



      this.isdisablereport = true


    }




  }
}






export class Input {


 
  inventory_code: string
  availablity_status: string
  approved_status: string
  mobile_number: string
  yard_code: string
  yard_name:string
  yard_city: string
  yard_region: string
  yard_state: string
  year_of_manufacture: string
  size: number
  offset: number
  ppt: string
  registration_number: string
  account_pk: string
  evaluation_type: string

  contract_no: string
  from_date: string
  to_date: string
  from_reposs_date: string
  to_reposs_date: string
  from_evaluator_date: string
  to_evaluator_date: string
  evaluation_agency: string
}



export class ExportInput {
  inventory_title: string
  registration_number: string
  year_of_manufacture: string
  contract_no: string
  ppt_name: string
  approved_status: string
  evaluation_done: string
  chassis_no: string
  days_in_stock: string
  yard_code: string
  yard_name: string
  yard_state: string
  yard_region: string
  created_at: string
  availablity_status: string
  evaluator_date: string
  bid_start_price: string
  image_uploaded: string
  evaluation_uploaded: string
  tax_paid_validity: string
  insurance_validity: string
  fitness_validity: string
}