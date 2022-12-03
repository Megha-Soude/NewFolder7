import { DatePipe } from '@angular/common';
import { HttpHeaderResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { CommonService } from 'app/shared/services/MyServices/common.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-fee',
  templateUrl: './add-fee.component.html',
  styleUrls: ['./add-fee.component.scss']
})
export class AddFeeComponent implements OnInit, AfterViewInit {

  emdForm: FormGroup;
  Accountpk: any;

  isShown: boolean = false;

  constructor(
 
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private router: Router,
    private commonService: CommonService,
    private Auth: AuthorizeService,
    private datepipe: DatePipe,
  ) {
    
   
   }

  DataString : any ;

  BuyerState :any ;
  SaleOfficeState:any;
  Fee:any;
  IGST:any;
  SGST:any;
  CGST:any;
  Total:any;

  ngOnInit() {

  

    this.GetCompanyCode()
    this.Accountpk = this.Auth.GetAccountPk()





    this.emdForm = this.fb.group({
      mobile_number: ["", Validators.required],
      amount: [this.Fee],
      payment_type: ["", Validators.required],
      bank_name: ["", Validators.required],
      cheque_dd_no: [""],
      cheque_dd_date: [""],
      micr_nonmicr: [""],
      local_outstation: [""],
      bank_code: [""],
      coop_noncoop: [""],
      company_code: ["", Validators.required],
      brh_code: ["", Validators.required],
      rtgs_utr_no: [""],
    });


    window.addEventListener("keyup", disableF5);

    window.addEventListener("keydown", disableF5);

    function disableF5(e) {

      if ((e.which || e.keyCode) == 116) e.preventDefault();

    };

  }

  special_number(event) {
    var k;
    k = event.charCode;
    return ((k >= 48 && k <= 57));
  }

  checkState(event){
    console.log(event.target.value)

    let request = { "mobile_number": event.target.value }
    this.commonService.GetBuyerState(request).subscribe(response => {
      if (response instanceof HttpHeaderResponse) {
        return
      }
      if (response.success) {
       
        this.BuyerState=response.data.state.toUpperCase( );
      }
      else {
        Swal.fire({
          icon: 'error',
          text: response.data.message
        })
      }
    }, error => {
      this.loader.close();
      Swal.fire({
        icon: 'error',
        text: error.error.data.message
      })
     
    })


  }

  IGSTValue:any;
  SGSTValue:any;
  CGSTValue:any;
  Calculated:boolean = false
StateMatch :any = 'NA'
  SelectBranch(value)
  {

    

   if(!this.BuyerState)
   {
    Swal.fire({
      icon: 'error',
      text: 'Please Enter Valid Mobile Number'
    })
   }
   else
   {
    this.Calculated = true
   }
  

    var Data = this.BranchListData.filter(
      book => book.sap_sac_code === value);


      this.SaleOfficeState =Data[0].state_name.toUpperCase( )
     

      if(this.BuyerState == this.SaleOfficeState)
      {

        this.CGSTValue = (Number(this.CGST) / 100) * Number(this.Fee);
        this.SGSTValue = (Number(this.SGST) / 100) * Number(this.Fee);
        this.IGSTValue = 0
        this.Total =Number(this.Fee) + Number(this.CGSTValue) +  Number(this.SGSTValue )

        this.StateMatch = 'CGST'
      }

      else
      {
        this.CGSTValue = 0
        this.SGSTValue = 0
        this.IGSTValue = (Number(this.IGST) / 100) * Number(this.Fee);
        this.Total = Number(this.Fee) + Number(this.IGSTValue) 
        this.StateMatch = 'IGST'
      }
  }

  ngAfterViewInit() {

    this.commonService.getJSON().subscribe(data => {
     
      this.Fee=data.Fee;
      this.IGST=data.IGST;
      this.SGST=data.SGST;
      this.CGST=data.CGST;
     
  });


    
  }



 
  




  toggleShow(data: string) {
    if (data == 'show') {
      this.isShown = true
    }
    else {
      this.isShown = false;
    }
  }

  checkValidation(value: string) {
    if (value == 'DD' || value == 'Cheque') {
      this.rtgsClear();
      this.commonBankValidation();
      this.addValidation();
    }
    else if (value == 'RTGS') {
      this.emdForm.controls["rtgs_utr_no"].setValidators(Validators.required)
      this.emdForm.controls["rtgs_utr_no"].updateValueAndValidity()
      this.commonBankValidation();
      this.clearValidators();

    }
    else if (value == 'Cash') {
      this.emdForm.controls["bank_code"].clearValidators()
      this.emdForm.controls["bank_code"].updateValueAndValidity()
      this.emdForm.controls["bank_name"].clearValidators()
      this.emdForm.controls["bank_name"].updateValueAndValidity()
      this.clearValidators();
      this.rtgsClear();
    }
  }

  addValidation() {
    this.emdForm.controls["cheque_dd_no"].setValidators(Validators.required)
    this.emdForm.controls["cheque_dd_no"].updateValueAndValidity()
    this.emdForm.controls["cheque_dd_date"].setValidators(Validators.required)
    this.emdForm.controls["cheque_dd_date"].updateValueAndValidity()
  }

  commonBankValidation() {
    this.emdForm.controls["bank_name"].setValidators(Validators.required)
    this.emdForm.controls["bank_name"].updateValueAndValidity()
    this.emdForm.controls["bank_code"].setValidators(Validators.required)
    this.emdForm.controls["bank_code"].updateValueAndValidity()
  }

  clearValidators() {
    this.emdForm.controls["cheque_dd_no"].clearValidators()
    this.emdForm.controls["cheque_dd_no"].updateValueAndValidity()
    this.emdForm.controls["cheque_dd_date"].clearValidators()
    this.emdForm.controls["cheque_dd_date"].updateValueAndValidity()
  }

  rtgsClear() {
    this.emdForm.controls["rtgs_utr_no"].clearValidators()
    this.emdForm.controls["rtgs_utr_no"].updateValueAndValidity()
  }

  alphanumbericOnly(event): boolean {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9 ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  getBranchData(compCode: any) {
    let request = { "comp_code": compCode }
    this.commonService.getBranchCode(request).subscribe(response => {
      if (response instanceof HttpHeaderResponse) {
        return
      }
      if (response.success) {
        this.BranchListData = response.data
      }
      else {
        Swal.fire({
          icon: 'error',
          text: response.data.message
        })
      }
    }, error => {
      this.loader.close();
      Swal.fire({
        icon: 'error',
        text: error.error.data.message
      })
      console.log(error);
    })
  }

  BranchListData = [];
  companyCodeListData = [];
  GetCompanyCode() {

   var json =  {
      "source_txn_type": "ZRG"
  }

    
    this.commonService.getCompanyCode(json).subscribe(response => {
      if (response instanceof HttpHeaderResponse) {
        return
      }
      if (response.success) {
        this.companyCodeListData = response.data
      }
      else {
        Swal.fire({
          icon: 'error',
          text: response.data.message
        })
      }
    }, error => {
      this.loader.close();
      Swal.fire({
        icon: 'error',
        text: error.error.data.message
      })
      console.log(error);
    })
  }

  onSubmit() {
    if (this.emdForm.invalid) {
      Swal.fire({
        icon: "info",
        text: 'Please fill in the required fields'
      });
      return;
    }
    try {
      this.loader.open();
      let emdData = {
        account_pk: this.Accountpk,
        mobile_number: this.emdForm.value.mobile_number,
        amount: parseInt(this.Fee),
        payment_type: this.emdForm.value.payment_type,
        bank_name: this.emdForm.value.bank_name,
         cheque_dd_no: this.emdForm.value.cheque_dd_no,
         cheque_dd_date: this.datepipe.transform(this.emdForm.value.cheque_dd_date, 'yyyy-MM-dd'),
        micr_nonmicr: this.emdForm.value.micr_nonmicr,
        local_outstation: this.emdForm.value.local_outstation,
        bank_code: this.emdForm.value.bank_code,
        coop_noncoop: this.emdForm.value.coop_noncoop,
        company_code: this.emdForm.value.company_code,
        rtgs_utr_no: this.emdForm.value.rtgs_utr_no,
        brh_code: this.emdForm.value.brh_code,
       // customer_name: "Rahul",
        igst: this.IGSTValue,
        cgst: this.CGSTValue,
        sgst: this.SGSTValue,
        source_txn_type: "ZRG"
      }
      this.commonService.AddEMD(emdData).subscribe(
        response => {
          if (response instanceof HttpHeaderResponse) {
            return;
          } if (response.success) {
            this.loader.close();
            Swal.fire({
              title: 'Success!',
              text: response.data.message,
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.value) {
                this.router.navigateByUrl('pages/Feelist');
              }
              else {
                this.router.navigateByUrl('pages/Feelist');
              }
            })
          } else {
            this.loader.close();
            Swal.fire({
              icon: 'error',
              text: response.data.message
            })
          }
        }, error => {
          this.loader.close();
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


  onReset() {
    this.emdForm.reset();
  }
}
