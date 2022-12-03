import { Component, ElementRef, OnInit, ViewChild , Inject} from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { CommonService } from 'app/shared/services/MyServices/common.service';
import { RegexService } from 'app/shared/services/MyServices/regex-service';
import { RegistrationService } from 'app/shared/services/MyServices/registration.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { AppFormErrorService } from 'app/shared/services/form-error.service';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { inputAll } from '../../buyer-registration-list/update-buyer-user/update-buyer-user.component';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Router } from '@angular/router';
import { ShowImagePopupComponent } from 'app/views/pages/show-image-popup/show-image-popup.component';


@Component({
  selector: 'app-update-customer-user',
  templateUrl: './update-customer-user.component.html',
  styleUrls: ['./update-customer-user.component.scss']
})
export class UpdateCustomerUserComponent implements OnInit {
  @ViewChild('inputidFile', { static: false }) inputidFileVariable: ElementRef;
  @ViewChild('inputFile', { static: false }) myInputVariable: ElementRef;
  @ViewChild('inputgstFile', { static: false }) myInputGSTVariable: ElementRef;

  updateBuyerUserForm: FormGroup
  Accountpk: string;
  isGSTDocumentChanged: string;
  isPANDocumentChanged: string;
  isAadharDocumentChanged: string;
  data: any;
  isASubmit:boolean;
  userID: any;
  AddressDocumentFile: any;
  GSTDocumentFile: any;
  documenturl: any;
  DocumentFile: any;
  isdocFilePDF:boolean;
  isdocFileImage:boolean;
  isaddressDocImage:boolean;
  isaddressDocPdf:boolean
  PartyTypeArray: any;
  Evaluator: any[];
  stateName: any;
  districtName: any;
  pincode: any;
  cityName: any;
  StateArray: any;
  DistictArray: any[];
  CityArray: any[];
  PincodeArray: any[];
  PincodeArray1: any;
  AttachementFile: any;
  isTypeChange:boolean;
  documentType: any;
  AddressAttachementFile: any;
  GSTAttachementFile: any;


  constructor(private autherization : AuthorizeService,
              private Common: CommonService, private formBuilder: FormBuilder,
              private regexService : RegexService, private registeration: RegistrationService,
              private formErrorService : AppFormErrorService,
              public Dialog: MatDialogRef<UpdateCustomerUserComponent>,
              private Loader: AppLoaderService, private router: Router,
              @Inject(MAT_DIALOG_DATA) public data1: any, public dialog: MatDialog,) { }

  ngOnInit() {
    this.Accountpk = this.autherization.GetAccountPk()
    this.isPANDocumentChanged = "No";
    this.isGSTDocumentChanged = "No";
    this.isAadharDocumentChanged = "No";
    this.BindPartyType();
    this.BindEvaluator();
    if (this.data.payload == '') {
      this.isASubmit = false;
      this.buildItemForm('');
    }

    else {
      this.isASubmit = true;
      this.buildItemForm(this.data.payload);
      this.userID = this.data.payload.id;
      this.AddressDocumentFile = this.data.payload.user_documents.aadhar_url;
      this.GSTDocumentFile = this.data.payload.user_documents.gst_url;
      this.updateBuyerUserForm.controls['mobile_number'].disable()
      this.documenturl = this.data.payload.user_document_list
      for (var i = 0; i < this.documenturl.length; i++) {
        if (this.documenturl[i].document_sub_type == "Pan") {
          this.DocumentFile = this.documenturl[i].document_url;
          this.updateBuyerUserForm.get('pan_no').setValue(this.documenturl[i].document_no);
          if (this.DocumentFile) {

            if (this.DocumentFile.includes('Pdf') || this.DocumentFile.includes('pdf')) {
              this.isdocFilePDF = true

              this.isdocFileImage = true
            }
            else {
              this.isdocFilePDF = false

              this.isdocFileImage = true
            }

      }
  }
  else if (this.documenturl[i].document_sub_type == "Passport") {
    this.AddressDocumentFile = this.documenturl[i].document_url;

    if (this.AddressDocumentFile.includes('Pdf') || this.AddressDocumentFile.includes('pdf')) {
      this.isaddressDocPdf = true

      this.isaddressDocImage = true
    }

    else {
      this.isaddressDocPdf = false

      this.isaddressDocImage = true
    }
    this.updateBuyerUserForm.get('Type').setValue("Passport");
    this.updateBuyerUserForm.get('aadhar_no').setValue(this.documenturl[i].document_no);
}

else if (this.documenturl[i].document_sub_type == "Utility") {

  this.AddressDocumentFile = this.documenturl[i].document_url;

  if (this.AddressDocumentFile.includes('Pdf') || this.AddressDocumentFile.includes('pdf')) {
    this.isaddressDocPdf = true

    this.isaddressDocImage = true
  }
  else {
    this.isaddressDocPdf = false

    this.isaddressDocImage = true
  }
  this.updateBuyerUserForm.get('Type').setValue("Utility");
  this.updateBuyerUserForm.get('aadhar_no').setValue(this.documenturl[i].document_no);
}

else if (this.documenturl[i].document_sub_type == "Driving") {

  this.AddressDocumentFile = this.documenturl[i].document_url;

  if (this.AddressDocumentFile.includes('Pdf') || this.AddressDocumentFile.includes('pdf')) {
    this.isaddressDocPdf = true

    this.isaddressDocImage = true
  }
  else {
    this.isaddressDocPdf = false

    this.isaddressDocImage = true
  }
  this.updateBuyerUserForm.get('Type').setValue("Driving");
  this.updateBuyerUserForm.get('aadhar_no').setValue(this.documenturl[i].document_no);
}
}
}
}

BindPartyType() {
  this.Common.BindPartyType('').subscribe(
    data => {
      this.PartyTypeArray = data.data;
    }, (err) => {
      Swal.fire('Oops...', err.message, 'error')
    }
  );
}

BindEvaluator() {
  this.Evaluator = []
  this.Common.EvaluatorList('').subscribe(
    data => {
      this.Evaluator = data.data;
    }, (err) => {
      Swal.fire('Oops...', err.message, 'error')
    }
  );
}

back() {
  this.router.navigateByUrl('pages/UserList');

}

onClear() {
  this.updateBuyerUserForm.reset;
}


buildItemForm(item) {
  this.updateBuyerUserForm = this.formBuilder.group({
    account_pk: [this.Accountpk],
    username: [item.username || '', Validators.required],
    mobile_number: [item.mobile_number || "", [Validators.required, Validators.pattern(this.regexService.Phone)]],
    email_id: [item.email_id || "", [Validators.required, Validators.pattern(this.regexService.Email)]],
    full_name: [item.full_name || "", [Validators.required, Validators.pattern(this.regexService.HumanName)]],
    state: [item.state || "", Validators.required],
    district: [item.district || "", Validators.required],
    city: [item.city || "", Validators.required],
    pincode: [item.pincode || "", [Validators.required, Validators.pattern(this.regexService.chequeNumber)]],
    address_1: [item.address_1 || "", Validators.required],
    address_2: [item.address_2 || ""],
    aadhar_no: [item.aadhar_no || "", Validators.required],
    gst_no: [item.gst_no || "", [Validators.pattern(this.regexService.GstNo)]],
    pan_no: [item.pan_no || "", [Validators.required, Validators.pattern(this.regexService.Pan)]],
    bidder_code: [item.bidder_code || ""],
    Type: [""]
  })

  this.stateName = item.state;
  this.districtName = item.district;
  this.cityName = item.city;
  this.pincode = item.pincode;
  this.registeration.BindState().pipe().subscribe(res => {
    if (res.data.length > 0) {
      this.StateArray = res.data;
      if (this.stateName != undefined) {
        var selectData = this.StateArray.filter(data => data.state_name === this.stateName);
        this.updateBuyerUserForm.controls['state'].setValue(selectData[0].state_name);
        this.OnSelectState(selectData[0].state_name);
      }
      this.DistictArray = [];
      this.CityArray = [];
      this.PincodeArray = [];
    }
  })

}

OnSelectState(value) {
  try {
    var data = ({ "name": value });
    this.registeration.BindDistrict(data).pipe().subscribe(res => {
      if (res instanceof HttpErrorResponse) {
        return
      } if (res.data.length > 0) {
        if (this.cityName != undefined) {
          this.OnSelectDistrict(this.districtName);
        }
        this.DistictArray = res.data;
        this.CityArray = [];
      } else {
        const error = res
        Swal.fire('Oops...', error.error.data.message, 'error')
        return
      }
    }, error => {
      Swal.fire('Oops...', error.error.data.message, 'error')
    })
  }
  catch (error) {
    Swal.fire('Oops...', error.error.data.message, 'error')
  }
}

OnSelectDistrict(value) {
  try {
    let request = { "name": value }
    this.registeration.BindCity(request).pipe().subscribe(res => {
      if (res instanceof HttpErrorResponse) {
        return
      }
      if (res.data.cities.length > 0) {
        this.CityArray = res.data.cities;
        if (this.cityName != undefined) {
          this.OnSelectPincode(this.cityName);
        }
        this.PincodeArray = [];
      }
      else {
        const error = res
        Swal.fire('Oops...', error.error.data.message, 'error')
        return;
      }
    }, error => {
      Swal.fire('Oops...', error.error.data.message, 'error')
    })

  } catch (error) {
    Swal.fire('Oops...', error.error.data.message, 'error')
  }
}

OnSelectPincode(value) {
  try {
    let request = { "name": value }
    this.registeration.BindPincode(request).pipe().subscribe(res => {
      if (res instanceof HttpErrorResponse) {
        return
      }
      if (res.data.pincodes.length > 0) {
        this.PincodeArray = res.data.pincodes;
        this.PincodeArray1 = res.data;
        var selectData = this.PincodeArray.filter(data => data == this.pincode);
        this.updateBuyerUserForm.controls['pincode'].setValue(selectData[0]);
      }
      else {
        const error = res
        Swal.fire('Oops...', error.error.data.message, 'error')
        return;
      }
    }, error => {
      Swal.fire('Oops...', error.error.data.message, 'error')
    })

  } catch (error) {
    Swal.fire('Oops...', error.error.data.message, 'error')
  }
}

Save(){
  if (this.updateBuyerUserForm.invalid) {
    this.formErrorService.displayFormErrors(this.updateBuyerUserForm);
    return;
  }
  this.registeration.AdminRegistration(this.updateBuyerUserForm.value).pipe().subscribe(res => {
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
          this.Dialog.close();
          this.updateBuyerUserForm.reset();
        }
        else {
          this.Dialog.close();
          this.updateBuyerUserForm.reset();
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

  var type = this.updateBuyerUserForm.value.Type
  
  if (type == undefined || type == null || type == "") {
    Swal.fire("Oops...", 'Please select document type', "error");
  }
  else {
    if (this.isAadharDocumentChanged == "No" && this.AddressDocumentFile == "") {
      Swal.fire("Oops...", 'Please upload document', "error");
      return false
    }
    else {
      var documentNo = this.updateBuyerUserForm.value.aadhar_no;
    }
  }


  
  if (this.isPANDocumentChanged == "No" && this.DocumentFile == "") {
    Swal.fire("Oops...", 'Please upload PAN No.', "error");
    return false

  }

    const ListInput: inputAll = {} as inputAll;
ListInput.action = "update";
ListInput.user_id = this.data.payload.id;
ListInput.party_type_id = "2";
ListInput.party_sub_type_id = "2";
ListInput.account_pk = this.Accountpk,
ListInput.username = this.updateBuyerUserForm.value.username,
ListInput.evaluator_code = this.updateBuyerUserForm.value.evaluator_code,
ListInput.email_id = this.updateBuyerUserForm.value.email_id,
ListInput.full_name = this.updateBuyerUserForm.value.full_name,
ListInput.state = this.updateBuyerUserForm.value.state,
ListInput.district = this.updateBuyerUserForm.value.district,
ListInput.city = this.updateBuyerUserForm.value.city,
ListInput.pincode = this.updateBuyerUserForm.value.pincode,
ListInput.address_1 = this.updateBuyerUserForm.value.address_1,
ListInput.address_2 = this.updateBuyerUserForm.value.address_2,

ListInput.bidder_code = this.updateBuyerUserForm.value.bidder_code

if (this.isPANDocumentChanged == "Yes") {
  ListInput.pan_no = this.updateBuyerUserForm.value.pan_no,
    ListInput.pan_base64_url = this.DocumentFile
}
else if (this.isPANDocumentChanged == "No") {
  ListInput.pan_no = this.updateBuyerUserForm.value.pan_no
}

ListInput.document_sub_type = type;

if (this.isAadharDocumentChanged == "Yes") {
  ListInput.document_no = documentNo,
    ListInput.document_base64_url = this.AddressDocumentFile
}
else if (this.isAadharDocumentChanged == "No") {
  ListInput.document_no = documentNo
}

this.Loader.open()
this.registeration.AdminRegistration(ListInput).pipe().subscribe(res => {
  if (res instanceof HttpErrorResponse) {
    return;
  }
  if (res.success) {
    this.Loader.close()
    Swal.fire({
      title: 'Success!',
      text: res.data.message,
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then((result) => {
      this.Loader.close()
      if (result.value) {
        this.Dialog.close();
        this.updateBuyerUserForm.reset();
      }
      else {
        this.Loader.close()
        this.Dialog.close();
        this.updateBuyerUserForm.reset();
      }
    })
  }
  else {
    this.Loader.close()
    Swal.fire(res.data.message, 'Error')
  }
},
  error => {
    this.Loader.close()
    Swal.fire(error.error.data.message, "Error");
  });
}


numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

IncomeFileUpload(event){
    
  this.isPANDocumentChanged = "Yes";
  if (event.target.files && event.target.files[0]) {
    var Extension = event.target.files[0].name.substring(event.target.files[0].name.lastIndexOf(".") + 1).toLowerCase();

    if (Extension == "JPEG" || Extension == "jpeg" || Extension == "PDF" || Extension == "pdf" ||
    Extension == "jpg" || Extension == "png" || Extension == "JPG" || Extension == "PNG") {


    if (Extension == "PDF" || Extension == "pdf") {
      this.isdocFilePDF = false

      this.isdocFileImage = false

    }
    else {
      this.isdocFilePDF = false
      this.isdocFileImage = true
    }

    const reader = new FileReader();
    const file = event.target.files[0];
    this.DocumentFile = file;
    this.AttachementFile = file.name;
    if (file.size < 5000000) {
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {



        let target: any = event.target;
        this.DocumentFile = target.result;
      };
    } else {
      Swal.fire("Upload only 5 MB size files!");
      this.inputidFileVariable.nativeElement.value = '';
      return;
    }
  }
  else {
    Swal.fire("Only JPEG,PNG,JPG and PDF files are allowed.!");
    this.inputidFileVariable.nativeElement.value = '';
  }


}

}

AddressFileUpload(event) {
  this.isAadharDocumentChanged = "Yes";
  if (event.target.files && event.target.files[0]) {
    var Extension = event.target.files[0].name.substring(event.target.files[0].name.lastIndexOf(".") + 1).toLowerCase();
    if (Extension == "JPEG" || Extension == "jpeg" || Extension == "PDF" || Extension == "pdf" ||
      Extension == "jpg" || Extension == "png" || Extension == "JPG" || Extension == "PNG") {

      if (Extension == "PDF" || Extension == "pdf") {
        this.isaddressDocPdf = false

        this.isaddressDocImage = false

      }

      else {
        this.isaddressDocPdf = false
        this.isaddressDocImage = true
      }
      const reader = new FileReader();

      const file = event.target.files[0];
      this.AddressDocumentFile = file;
      this.AddressAttachementFile = file.name;
      if (file.size < 5000000) {
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event) => {
          let target: any = event.target;
          this.AddressDocumentFile = target.result;
        };
      } else {
        Swal.fire("Upload only 5 MB size files!");
        this.myInputVariable.nativeElement.value = '';
        return;
      }
    }
    else {
      Swal.fire("Only JPEG,PNG,JPG and PDF files are allowed.!");
      this.myInputVariable.nativeElement.value = '';
    }


  }
}

GSTFileUpload(event) {
  this.isGSTDocumentChanged = "Yes";
  if (event.target.files && event.target.files[0]) {
    var Extension = event.target.files[0].name.substring(event.target.files[0].name.lastIndexOf(".") + 1).toLowerCase();
    if (Extension == "JPEG" || Extension == "jpeg" || Extension == "jpg" || Extension == "PDF" ||
      Extension == "png" || Extension == "JPG" || Extension == "PNG") {
      const reader = new FileReader();
      const file = event.target.files[0];
      this.GSTDocumentFile = file;
      this.GSTAttachementFile = file.name;
      if (file.size < 5000000) {
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event) => {
          let target: any = event.target;
          this.GSTDocumentFile = target.result;
        };
      } else {
        Swal.fire("Upload only 5 MB size files!");
        this.myInputGSTVariable.nativeElement.value = '';
        return;
      }
    }
    else {
      Swal.fire("Only JPEG,PNG,JPG and PDF files are allowed.!");
      this.myInputGSTVariable.nativeElement.value = '';
    }
  }
}


//--****##AlpHANumerIC ValidaTioN##****
alphanumbericOnly(event): boolean {
  var inp = String.fromCharCode(event.keyCode);
  if (/[a-zA-Z0-9 ]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

ShowImagePopUp(Image: any) {
  const dialogConfig = new MatDialogConfig()
  dialogConfig.hasBackdrop = true;
  dialogConfig.data = Image;
  dialogConfig.disableClose = false;
  let dialogRef = this.dialog.open(ShowImagePopupComponent, dialogConfig);
  dialogRef.afterClosed().subscribe(result => {
  });
}
public hasRequiredError = (controlName: string): boolean =>
  this.formErrorService.hasRequiredError(controlName, this.updateBuyerUserForm);
public hasPatternError = (controlName: string): boolean =>
  this.formErrorService.hasPatternError(controlName, this.updateBuyerUserForm);
public hasMinLengthError = (controlName: string): boolean =>
  this.formErrorService.hasMinLengthError(controlName, this.updateBuyerUserForm);

onSelectType(event: any) {
  // console.log(event)
  //if (event == "Passport") {
  this.documentType = event
  // console.log(this.documentType)
  this.AddressDocumentFile = "";
  this.updateBuyerUserForm.get('aadhar_no').reset();
  this.isTypeChange = true;
  
}
}
    