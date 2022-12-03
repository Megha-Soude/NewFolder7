import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { RegistrationService } from 'app/shared/services/MyServices/registration.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse, HttpHeaderResponse } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';

@Component({
  selector: 'app-update-customer-limit',
  templateUrl: './update-customer-limit.component.html',
  styleUrls: ['./update-customer-limit.component.scss']
})
export class UpdateCustomerLimitComponent implements OnInit {
  data: any;
  isShown:boolean;
  UpdateCategoryLimitForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private Loader: AppLoaderService,
              private registeration: RegistrationService,private Auth: AuthorizeService,
              public dialogRef: MatDialogRef<UpdateCustomerLimitComponent>) { }

  ngOnInit() {
    this.UpdateCategoryLimitFormBuilder(this.data.payload);
    if (this.data.payload.category=="Normal") {
      this.isShown = true
      this.disable("Normal")
    }
    else if (this.data.payload.category=="TMF Dealer/TASS") {
      this.isShown = false
    }
    
  }
  UpdateCategoryLimitFormBuilder(item) {
    this.UpdateCategoryLimitForm = this.formBuilder.group({
      category: [item.category || "", Validators.required],
      vehicle_limit: [item.vehicle_limit || "", Validators.required]
    });
  }


  onClear() {

  }
  onSubmit() {
    this.UpdateCategoryLimitForm.controls['vehicle_limit'].enable();
    if (this.UpdateCategoryLimitForm.value.vehicle_limit==null
      ||this.UpdateCategoryLimitForm.value.vehicle_limit==""||
      this.UpdateCategoryLimitForm.value.vehicle_limit==undefined) {
      Swal.fire({
        icon: "info",
        text: 'Please enter the vehicle limit'
      });
      return
    }
    if (this.UpdateCategoryLimitForm.invalid) {
      Swal.fire({
        icon: "info",
        text: 'Please fill the mandatory field'
      });
      return;
    }
    this.Loader.open();
    try {
      let requestData = {
        user_id: this.data.payload.id,
        category: this.UpdateCategoryLimitForm.value.category,
        vehicle_limit: parseInt(this.UpdateCategoryLimitForm.value.vehicle_limit),
      }
      this.registeration.updateCategoryLimit(requestData).subscribe(
        response => {
          if (response instanceof HttpHeaderResponse) {
            return;
          } if (response.success) {
            this.Loader.close();
            Swal.fire({
              icon: 'success',
              text: response.data.message
            })
            this.dialogRef.close();
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
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  disable(data: string) {
    if (data == "Normal") {
      this.isShown = true
    }
    else {
      this.isShown = false
    }
  }

}
