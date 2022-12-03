import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { egretAnimations } from "../../../../shared/animations/egret-animations";
import Swal from 'sweetalert2';
import { RegistrationService } from 'app/shared/services/MyServices/registration.service';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { MustMatch } from "app/shared/helpers/must-match.validator"
import { CommonService } from '../../../../shared/services/MyServices/common.service';
import { DataPassService } from 'app/shared/services/MyServices/data-pass.service';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { ApproveData } from 'app/shared/models/models';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
  animations: egretAnimations,
})
export class UserRegistrationComponent implements OnInit {

  PartyTypeArray: any[];
  SubPartyTypeArray: any[];
  RoleTypeArray: any[];
  //public DataUserPassService: any;
  isApprove: boolean;
  isASubmit: boolean;
  StatusCheck: boolean;
  AdminRegForm: FormGroup;
  isReadOnly: boolean;
  bookFilteredList: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private confirmService: AppConfirmService,
    private commonService: CommonService, private RegService: RegistrationService, private router: Router
    , private DataPassServic: DataPassService, private Auth: AuthorizeService, public dialogRef: MatDialogRef<UserRegistrationComponent>
  ) { }
  Accountpk: any
  ChannelPartnerRegistration: boolean = false

  ngOnInit() {
    this.Accountpk = this.Auth.GetAccountPk()
    this.BindPartyType();
    this.BindEvaluator();
    //   this.DataUserPassService = this.DataPassServic.GetUserInfo();
    if (this.data.payload == '') {
      this.isASubmit = false;
      this.buildItemForm('');
    }
    else {
      this.isASubmit = true;
      this.buildItemForm(this.data.payload);
      this.onSelectParty(this.data.payload.party_type);
      this.AdminRegForm.controls['username'].disable()
    }
    // this.DataUserPassService = this.DataPassServic.resetOption();
  }


  Save() {
    if (!this.AdminRegForm.valid) {
      Swal.fire("Oops...", 'Please fill all mandatory details', "error");
      return false
    }
    this.RegService.AdminRegistration(this.AdminRegForm.value).pipe().subscribe(res => {
      if (res instanceof HttpErrorResponse) {
        return;
      }
      if (res.success) {
        Swal.fire({
          title: 'Success!',
          text: res.data.message,
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            this.dialogRef.close();
            this.AdminRegForm.reset();
          }
          else {
            this.dialogRef.close();
            this.AdminRegForm.reset();
          }
        })
      }
      else {
        Swal.fire(res.data.message, 'Error')
      }
    },
      error => {
        Swal.fire(error.error.data.message, "Error");
      });
  }




  Update() {
    this.AdminRegForm.controls['username'].enable()
    if (!this.AdminRegForm.valid) {
      Swal.fire("Oops...", 'Please fill all mandatory details', "error");
      return false
    }
    var Input = {
      action: "update",
      user_id: this.data.payload.id,
      party_type_id: this.AdminRegForm.value.party_type_id,
      party_sub_type_id: this.AdminRegForm.value.party_sub_type_id,
      account_pk: this.Accountpk,
      username: this.AdminRegForm.value.username,
      evaluator_code: this.AdminRegForm.value.evaluator_code,
      email_id: this.AdminRegForm.value.email_id,
      full_name: this.AdminRegForm.value.full_name
    }
    this.RegService.AdminRegistration(Input).pipe().subscribe(res => {
      if (res instanceof HttpErrorResponse) {
        return;
      }
      if (res.success) {
        Swal.fire({
          title: 'Success!',
          text: res.data.message,
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            this.dialogRef.close();
            this.AdminRegForm.reset();
          }
          else {
            this.dialogRef.close();
            this.AdminRegForm.reset();
          }
        })
      }
      else {
        Swal.fire(res.data.message, 'Error')
      }
    },
      error => {
        Swal.fire(error.error.data.message, "Error");
      });
  }

  buildItemForm(item) {
    this.AdminRegForm = this.formBuilder.group({
      party_type_id: [item.party_type || '', Validators.required],
      party_sub_type_id: [item.party_sub_type || '', Validators.required],
      account_pk: [this.Accountpk],
      username: [item.username || '', Validators.required],
      evaluator_code: [item.evaluator_code || ''],
      email_id: [item.email_id || '', Validators.email],
      full_name: [item.full_name || '', Validators.required],
    })
  }

  BindPartyType() {
  

    this.commonService.BindPartyType('').subscribe(
      data => {
        this.PartyTypeArray = data.data;
      }, (err) => {
        Swal.fire('Oops...', err.message, 'error')
      }
    );
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  Evaluator: any = []
  BindEvaluator() {
    this.Evaluator = []
    this.commonService.EvaluatorList('').subscribe(
      data => {
        this.Evaluator = data.data;
      }, (err) => {
        Swal.fire('Oops...', err.message, 'error')
      }
    );
  }

  onSelectParty(value) {
    if (value == 3) {
      this.ChannelPartnerRegistration = true
      this.AdminRegForm.controls["evaluator_code"].setValidators(Validators.required);
      this.AdminRegForm.controls["evaluator_code"].updateValueAndValidity();
    }
    else {
      this.ChannelPartnerRegistration = false
      this.AdminRegForm.controls["evaluator_code"].clearValidators();
      this.AdminRegForm.controls["evaluator_code"].updateValueAndValidity();
    }

    this.SubPartyTypeArray = [];
    // let json = '{"party_type_id":"' + value + '"}';
    var Json = { "party_type": value }
    this.commonService.BindSubPartyType(Json).subscribe(
      data => {
        this.SubPartyTypeArray = data.data;
        // }
        // else {
        //   Swal.fire('Oops...', data.msg, 'error')
        // }
      }, (err) => {
        Swal.fire('Oops...', err.error.data.message, 'error')
      }
    );
  }

  back() {
    this.router.navigateByUrl('pages/UserList');

  }

  onClear() {
    this.AdminRegForm.reset;
  }
}
