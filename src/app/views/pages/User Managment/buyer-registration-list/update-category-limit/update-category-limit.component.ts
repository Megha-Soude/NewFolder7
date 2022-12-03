import { HttpErrorResponse, HttpHeaderResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { CommonService } from 'app/shared/services/MyServices/common.service';
import { DataPassService } from 'app/shared/services/MyServices/data-pass.service';
import { RegistrationService } from 'app/shared/services/MyServices/registration.service';
import Swal from 'sweetalert2';
import { UserRegistrationComponent } from '../../user-registration/user-registration.component';

@Component({
  selector: 'app-update-category-limit',
  templateUrl: './update-category-limit.component.html',
  styleUrls: ['./update-category-limit.component.scss']
})
export class UpdateCategoryLimitComponent implements OnInit {
  UpdateCategoryLimitForm: FormGroup;
  isShown: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private matDialog: MatDialog,
    private RegService: RegistrationService, private loader: AppLoaderService, private Auth: AuthorizeService,
    public dialogRef: MatDialogRef<UpdateCategoryLimitComponent>

  ) { }

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
    this.loader.open();
    try {
      let requestData = {
        user_id: this.data.payload.id,
        category: this.UpdateCategoryLimitForm.value.category,
        vehicle_limit: parseInt(this.UpdateCategoryLimitForm.value.vehicle_limit),
      }
      this.RegService.updateCategoryLimit(requestData).subscribe(
        response => {
          if (response instanceof HttpHeaderResponse) {
            return;
          } if (response.success) {
            this.loader.close();
            Swal.fire({
              icon: 'success',
              text: response.data.message
            })
            this.dialogRef.close();
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
