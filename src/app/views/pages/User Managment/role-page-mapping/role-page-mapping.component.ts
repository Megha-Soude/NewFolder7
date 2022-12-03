


import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { DataPassService } from 'app/shared/services/MyServices/data-pass.service';
import { CommonService } from 'app/shared/services/MyServices/common.service';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';


@Component({
  selector: 'app-role-page-mapping',
  templateUrl: './role-page-mapping.component.html',
  styleUrls: ['./role-page-mapping.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RolePageMappingComponent implements OnInit {
  color;
  tableOffset:any = 0
  checked;
  CheckedLable: string;
  disabled;
  RoleTypeDisabled: boolean;
  isApprove: boolean;
  btnSave: boolean;
  btnUpdate: boolean;
  DstCOdeDisabled: boolean;
  rows = [];
  selected = [];
  isDisplayTable: boolean;
  DataPushArray = [];
  public itemForm: FormGroup;
  constructor(
    private data: DataPassService,
    private CommonService: CommonService,
    private snack: MatSnackBar,
    private router: Router,
    private loader: AppLoaderService,
    private fb: FormBuilder,
    private Auth: AuthorizeService,
  ) { }
  public datas: any;
  RoleType: any[];
  Position: any[];

  click: Subscription;
  href: any;
  pagevalid: boolean
  Role: any
  Accountpk: any;
  ngOnInit() {

    this.tableOffset= 0
    this.Accountpk = this.Auth.GetAccountPk()

    var RoleName = this.CommonService.getRole();
    this.Role = RoleName;

    this.href = this.router.url;

    var splitted = this.href.split("/", 3);

    //this.pagevalid = this.data.GetPageVlidation(splitted[2])
    this.pagevalid = true;

    if (this.pagevalid == true) {

      this.selected = [];
      this.isDisplayTable = false
      this.GetPartyType();

      this.buildItemForm()



    }
    else {
      this.router.navigate(['pages/NOTFound']);
    }





  }

  PartyTypeArray: any[];
  GetPartyType() {
    this.CommonService.BindPartyType('').subscribe(
      data => {
        if (data.success == true) {
          this.PartyTypeArray = data.data;
        }
        else {
        }
      }, (err) => {
      });
  }

  SubPartyTypeArray: any[];
  GetSubPartyType(partytypeid) {
    
    var Json = {
      "party_type": partytypeid
    }

    this.CommonService.BindSubPartyType(Json).subscribe(
      data => {
        if (data.success == true) {
          this.SubPartyTypeArray = data.data;
        }
        else {
        }
      }, (err) => {
      }

    );




  }


  buildItemForm() {
    this.itemForm = this.fb.group({
      party_type_id: [''],
      party_sub_type_id: [''],
      account_pk: [this.Accountpk]


    })

    if (this.Role == "Distributor") {
      this.itemForm.get('role_id').setValue(2);
      this.GetSubPartyType(2)
      this.RoleTypeDisabled = true;


    }
  }

  OnselectedSubPartyType(Event) {
    this.tableOffset= 0

    const dataList1: Input = {} as Input;
    dataList1.party_type_id = this.itemForm.value.party_type_id
    dataList1.party_sub_type_id = this.itemForm.value.party_sub_type_id
    dataList1.account_pk = this.Accountpk
    dataList1.size = 100
    dataList1.offset = 0


    this.bindList(dataList1);
  }

  bindList(Input) {
    this.rows = [];
    this.selected = [];
    this.loader.open()
    // console.log(this.itemForm.value);
    // var input = this.itemForm.value;
    this.tableOffset= 0



    this.CommonService.GetPagemasterData(Input).subscribe(

      data => {

        if (data.success == true) {
          this.loader.close()
          // console.log(data.data);
          // console.log(data);
          this.rows = data.data;

          for (let entry1 of this.rows) {

            if (entry1.has_access == true) {
              this.selected.push(entry1);
            }
          }

          //this.Position = data.data;

        }


        else {
          this.rows = [];
          this.selected = [];
          this.loader.close()

        }
      }, (err) => {
        this.rows = [];
        this.selected = [];
        this.loader.close()

      }

    );


    this.isDisplayTable = true
  }



  OnselectedParty(value) {
    this.rows = [];
    this.selected = [];
    this.GetSubPartyType(value);
  }

  submit() {
  }

  oncalcel() {
    ///this.router.navigate(['pages/RegistrationList']);
  }

  save() {
    this.DataPushArray = []
    //console.log(this.selected)
    this.loader.open()
    if (this.selected.length > 0) {


      for (let entry1 of this.selected) {
        const dataList1: FormArray = {} as FormArray;
        dataList1.page_detail_id = entry1.id;
        dataList1.page_id = entry1.page_id;

        this.DataPushArray.push(dataList1);

      }


      const Final: FinalArray = {} as FinalArray;
      Final.party_type_id = this.itemForm.value.party_type_id;
      Final.party_sub_type_id = this.itemForm.value.party_sub_type_id;
      Final.account_pk =this.Accountpk;
      Final.pages = this.DataPushArray;



      this.CommonService.Insertupdate_page_mapping(Final).subscribe(

        data => {
          //  console.log(data.rangeInfo.total_row);
          // this.page.totalElements=data.rangeInfo.total_row;
          this.loader.close();
          if (data.success == true) {



            //this.RefreshTab();
            // Swal.fire('Data Save Succesfully !');



            Swal.fire({
              title: 'Data Save Successfully !',
              // text: "You won't be able to revert this!",
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.value) {
                //this.bindList(Event);
                this.rows = [];
                this.selected = [];
                this.itemForm.reset();
                this.GetPartyType();
                this.buildItemForm()
                this.isDisplayTable = false
              }
              else {
                //this.bindList(Event);
                this.rows = [];
                this.selected = [];
                this.itemForm.reset();
                this.GetPartyType();
                this.buildItemForm()
                this.isDisplayTable = false
              }
            })

          }



          else {

            this.rows = [];
            this.loader.close();
          }
        }, (err) => {
          this.rows = [];
          this.loader.close();

        }

      );


    }
    else {
      this.loader.close()

      Swal.fire('Please Select at Least One Page.');
    }


  }


  update() {

  }

  CheckStatus(row) {
    return row;
  }

}


export class Input {


  party_type_id: string;
  party_sub_type_id: string;
  account_pk: string;
  size: number
  offset: number


}







export interface FormArray {
  page_id: string;
  page_detail_id: string;

}


export interface FinalArray {


  pages: any[];

party_type_id: string;
      party_sub_type_id : string;
      account_pk: string;




}