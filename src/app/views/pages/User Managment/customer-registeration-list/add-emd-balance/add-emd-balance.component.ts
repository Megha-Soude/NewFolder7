import { DatePipe } from '@angular/common';
import { HttpHeaderResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { CommonService } from 'app/shared/services/MyServices/common.service';
import Swal from 'sweetalert2';
import { AddEMDBalanceComponent } from '../../buyer-registration-list/add-emd-balance/add-emd-balance.component';

@Component({
  selector: 'app-add-emd-balance',
  templateUrl: './add-emd-balance.component.html',
  styleUrls: ['./add-emd-balance.component.scss']
})
export class AddEmdBalanceComponent implements OnInit {
   
  emdForm: FormGroup
  Accountpk: any;
  isShown: boolean = false;
  
  constructor(private autherization:AuthorizeService,
    private formbldr: FormBuilder,private Common: CommonService,
    private Date: DatePipe,@Inject(MAT_DIALOG_DATA) public datanew: any,
    private Loader: AppLoaderService,public Dialog: MatDialogRef<AddEMDBalanceComponent>) { }

  ngOnInit() {
    this.Accountpk = this.autherization.GetAccountPk()
    this.emdForm = this.formbldr.group({
      amount: ["", Validators.required],
      payment_type: ["", Validators.required],
      bank_name: [""],
      cheque_dd_no: [""],
      cheque_dd_date: [""],
      micr_nonmicr: [""],
      local_outstation: [""],
      bank_code: [""],
      coop_noncoop: [""],
    })
  }

  special_number(event) {
    var p;
    p = event.charCode;
    return ((p >= 48 && p <= 57));
  }

  onSubmit() {
    if (this.emdForm.invalid) {
      Swal.fire({
        icon:"info",
        text:'Please fill in the required fields'
      });
      return;
    }

    try {
      this.Loader.open();
      let emdData = {
        account_pk : this.Accountpk,
        mobile_number: this.datanew.payload.mobile_number,
        amount: parseInt(this.emdForm.value.amount),
        payment_type: this.emdForm.value.payment_type,
        bank_name: this.emdForm.value.bank_name,
        cheque_dd_no: this.emdForm.value.cheque_dd_no,
        cheque_dd_date:this.Date.transform(this.emdForm.value.cheque_dd_date, 'yyyy-MM-dd'),
        micr_nonmicr: this.emdForm.value.micr_nonmicr,
        local_outstation: this.emdForm.value.local_outstation,
        bank_code: this.emdForm.value.bank_code,
        coop_noncoop: this.emdForm.value.coop_noncoop,
        company_code:this.emdForm.value.company_code,
        rtgs_utr_no:this.emdForm.value.rtgs_utr_no,
        brh_code:this.emdForm.value.brh_code,
      }
      this.Common.AddEMD(emdData).subscribe(
        response => {
          if (response instanceof HttpHeaderResponse) {
            return;
          } if (response.success) {
            this.Loader.close();
            this.Dialog.close();
            Swal.fire({
              icon: 'success',
              text: response.data.msg
            })
            
          } else {
            this.Loader.close();
            Swal.fire({
              icon: 'error',
              text: response.data.message
            })
          }
        }, error => {
          this.Loader.close();
          Swal.fire({
            icon: 'error',
            text: error.error.data.message
          })
          console.log(error);
        })
    }
    catch (error) {

    }
  }

  onReset(){
    this.emdForm.reset();
  }


toggleShow(data:string) {
  if(data=='show')
  {
    this.isShown =true
  }
  else{
    this.isShown =false;
  }
}
}



