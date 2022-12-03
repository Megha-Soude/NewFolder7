import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/MyServices/common.service';
import Swal from "sweetalert2";
import { DataPassService } from 'app/shared/services/MyServices/data-pass.service';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service'
import { FileUploadService } from 'app/file-upload/file-upload.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { HttpErrorResponse } from '@angular/common/http';
import { first, map, startWith } from 'rxjs/operators';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Observable } from 'rxjs';
import { AppDateAdapter, APP_DATE_FORMATS } from '../format-datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-addinventory',
  templateUrl: './addinventory.component.html',
  styleUrls: ['./addinventory.component.scss'], encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class AddinventoryComponent implements OnInit {
  InventoryFormNew: FormGroup;
  minDate: Date;
  @ViewChild('stepper', { static: false }) private myStepper: MatStepper;
  constructor(private fb: FormBuilder, private commonService: CommonService, private dataPass: DataPassService,
    private Auth: AuthorizeService, private imageCompress: NgxImageCompressService,
    private router: Router, private FileUpService: FileUploadService, private confirmService: AppConfirmService,
    private loader: AppLoaderService, private datepipe: DatePipe) {
    this.minDate = new Date();
  }
  //  InventoryForm: FormGroup;
  vehicledata: any;
  Accountpk: any
  InventoryID: any
  ImagesData = new FormGroup({})
  isedit: boolean = false
  year: any = []
  todayDate: Date = new Date();
  myControl = new FormControl();
  // options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  tempdata: []
  href: any;
  pagevalid: any = []
  yard_id: any
  chassis_description: any
  SessionData: any
  SubpartytypeId: any
  isreadonly: boolean = false
  msgdisplay: boolean = false
  issold: string
  ngOnInit() {
    this.SessionData = this.commonService.getUserDetails();
    this.SubpartytypeId = this.SessionData.party_sub_type;
    this.yard_id = ""
    this.href = this.router.url;
    var splitted = this.href.split("/", 3);
    this.pagevalid = this.dataPass.Permission('InventoryList')
    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value))
    // );
    this.IsDocumentChanged = "No";
    const currentYear = (new Date()).getFullYear();
    const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
    this.year = range(currentYear, currentYear - 20, -1)
    this.Accountpk = this.Auth.GetAccountPk()
    this.vehicledata = []
    this.vehicledata = this.dataPass.getVehiceldetail();
    //this.GetPPt();
    var json = {}
    this.GetChasiedescription();
    if (this.vehicledata.id) {
      this.isedit = true
      this.issold = this.vehicledata.availablity_status
      if (this.vehicledata.approved_status == 'APPROVED') {
        // this.isedit = false
        this.msgdisplay = true
      }
      this.InventoryID = this.vehicledata.id;
      this.chassis_description = this.vehicledata.chassis_description
      this.yard_id = this.vehicledata.yard;
      this.builditemform(this.vehicledata)
    }
    else {
      this.isedit = false
      this.builditemform('')
      // this.router.navigate(['pages/InventoryList']);
      // this.InventoryFormNew.controls['yard_id'].valueChanges.subscribe(change => {
      //   this._filter(change)
      //  });

    }
    this.getYardMaster()
    this.InventoryFormNew.controls['YardDetails'].valueChanges.subscribe(change => {
      if (change == '') {
        this.InventoryFormNew.get('yard_state').setValue('');
        // this.InventoryFormNew.get('YardDetails').setValue('');
        this.InventoryFormNew.get('yard_city').setValue('');
        this.InventoryFormNew.get('remarks').setValue('');
        this.InventoryFormNew.get('yard_region').setValue('');
        this.InventoryFormNew.get('second_online_agency').setValue('');
      }
      this._filter(change)
    });
    this.InventoryFormNew.controls['Chassiedescription'].valueChanges.subscribe(change => {
      if (change == '') {
      }
      this._filterChassiedescription(change)
    });
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

  private _filter(value: string) {
    if (value !== '') {
      const filterValue = value.toString().toLowerCase();
      this.tempdata = this.YardData.filter(option => option.Dsiplay.toLowerCase().includes(filterValue))
    }
    else {
      this.tempdata = this.YardData;
    }
  }
  TempChassidescription = []
  private _filterChassiedescription(value: string) {
    if (value !== '') {
      const filterValue = value.toString().toLowerCase();
      this.TempChassidescription = this.Chasiedescription.filter(option => option.Display.toLowerCase().includes(filterValue))
    }
    else {
      this.TempChassidescription = this.Chasiedescription;
    }
  }

  onItemDeleted(index: number) {
    // this.imageSrcUrls.splice(index, 1);
    this.urls.splice(index, 1);
  }

  public demoForm: FormGroup;
  createItem(data): FormGroup {
    return this.fb.group(data);
  }

  gevehicledetails(id) {
    var Json = { inventory_id: id }
    this.commonService.getVehicleDetailbyid(Json).subscribe(
      (res) => {
        if (res.success == true) {
          //this.PPTDATA = res.data
          this.builditemform(res.data)
        } else {
          Swal.fire("Oops...", res.msg, "error");
        }
      },
      (err) => {
        Swal.fire("Oops...", err.msg, "error");
      }
    );

  }

  removeGroup1(i: number, data: any) {
    const control = <FormArray>(
      this.InventoryFormNew.controls["InventoryUploadData"]
    );
    var filename = control.value[i].id;
    alert(filename)
  }
  removeGroup(i: number, data: any) {
    if (this.issold == 'SOLD') {
      Swal.fire('Opss..', 'Not allow to take action , Inventory is SOLD', 'error')
      return false
    }
    // remove address from the list
    this.confirmService
      .confirm({ message: `Are You Sure to remove this Image?` })
      .subscribe((data) => {
        if (data) {
          const control = <FormArray>(this.InventoryFormNew.controls["InventoryUploadData"]);
          var invdetailid = control.value[i].id;
          var filename = control.value[i].FileName;
          // if (
          //   this.InventoryID == null ||
          //   this.InventoryID == undefined ||
          //   this.InventoryID == "" ||
          //   this.InventoryID == " "
          // ) {
          if (invdetailid == '') {
            control.removeAt(i);
            Swal.fire("Image Removed Successfully");
          } else {
            // filename = filename.replace(
            //   "https://epcfs-sink.s3.amazonaws.com/",
            //   ""
            // );
            var json = {
              "account_pk": this.Accountpk,
              "inventory_id": this.InventoryID,
              "inventory_document_id": invdetailid
            }
            this.commonService.RemoveInventoryById(json).pipe(first()).subscribe((res) => {
              if (res instanceof HttpErrorResponse) {
                return;
              }
              if (res.success) {
                control.removeAt(i);
                Swal.fire("Remove Image Successfully");
              } else {
                Swal.fire(res.data.msg, "Error");
              }
            },
              (error) => {
                Swal.fire(error.error.data.message, "Error");
              }
            );

          }
        }
      });
  }




  SelectImageFiles(event) {
    this.urls = [];
    let files = event.target.files;
    //this.AllVechileImages = files;
    if (files) {
      for (let file of files) {

        this.AllImageFile.push(file);
        let reader = new FileReader();
        reader.onload = (e: any) => {
          //this.urls.push(e.target.result);
        }
        reader.readAsDataURL(file);
      }
      if (this.urls.length = files.length) {
        this.BindControlArray(files);
      }
    }
  }


  BindControlArray(data) {
    var position = ""
    this.InventoryFormNew['InventoryUploadData'] = []
    for (let file of data) {
      if (file.size < 5000000) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
          // this.imageCompress.compressFile(file, -2, 50, 50).then(
          //   result => {
          //     var imageBase64 = result;
          //     var binary = this.base64toBlob(result, 'image/jpeg');
          //     var blob_ = new Blob([binary], { type: 'image/jpeg' });
          //     var file = new File([blob_], 'test.jpg', { type: 'image/jpeg' });
          //     const reader = new FileReader();
          //     const filecompress = file;
          //     reader.readAsDataURL(filecompress);

          //     reader.onload = (event) => {
          //       let target: any = event.target;

          //     }

          //   }
          // );
          this.getmultipleControl.push(this.bindValueArray(file, e.target.result, position, "NEW", ''))
        }
      }
      else {
      }
    }
  }

  base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);
    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);
      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  bindValueArray(FileName, Base64, Postion, ImageType, id) {
    return this.fb.group(
      {
        FileImageSrc: [Base64],
        FileName: [FileName],
        ImagePositionType: [Postion || ""],
        ImageType: [ImageType],
        id: [id],
      }
    )
  }


  get getmultipleControl() {
    return <FormArray>this.InventoryFormNew.get('InventoryUploadData');
  }
  YardData: any
  options: string[] = []
  getYardMaster() {
    //  this.loader.open()
    this.YardData = []
    this.commonService.Yardmaster().subscribe(
      (res) => {
        if (res.success == true) {
          this.loader.close()
          //   this.YardData = res.data
          for (let file of res.data) {
            var json = {
              "id": file.id,
              "yard_code": file.yard_code,
              "yard_state": file.yard_state,
              "tmfl_state": file.tmfl_state,
              "yard_name": file.yard_name,
              "Dsiplay": file.yard_state + '-' + file.yard_code + '-' + file.yard_name
            }
            this.YardData.push(json)
          }
          this.tempdata = this.YardData
          if (this.yard_id) {
            // alert(this.yard_id)
            var data2 = this.YardData.filter(book => book.id === this.yard_id);
            var YardDetails = data2[0].yard_state + '-' + data2[0].yard_code + '-' + data2[0].yard_name;
            this.InventoryFormNew.get('YardDetails').setValue(YardDetails);
          }



        } else {
          this.loader.close()
          Swal.fire("Oops...", res.msg, "error");
        }
      },
      (err) => {
        this.loader.close()
        Swal.fire("Oops...", err.msg, "error");
      }
    );
  }

  PPTDATA: any;
  GetPPt(Input) {
    this.PPTDATA = []

    var json = {}
    this.commonService.GetPPt(Input).subscribe(
      (res) => {
        if (res.success == true) {

          this.PPTDATA = res.data


          this.InventoryFormNew.get('ppt_id').setValue(this.PPTDATA[0].id);

        } else {
          Swal.fire("Oops...", res.msg, "error");
        }
      },
      (err) => {
        Swal.fire("Oops...", err.msg, "error");
      }
    );
  }


  goBack(steeper) {
    this.myStepper.previous();
  }


  Savedatanew() {





    if (this.InventoryFormNew.get('InventoryUploadData').value.length > 0) {


      for (let i of this.InventoryFormNew.get('InventoryUploadData').value) {
        if (i.ImagePositionType == '') {
          Swal.fire("Oops...", 'Please Select  Image Position', "error");
          this.loader.close()
          return false
        }
      }
    }
  }

  IsDocumentChanged: any
  DocumentFile: any;
  AttachementFile: string;
  onSelectDocument(event) {
    this.IsDocumentChanged = "Yes";
    if (event.target.files && event.target.files[0]) {
      var Extension = event.target.files[0].name.substring(
        event.target.files[0].name.lastIndexOf('.') + 1).toLowerCase();
      // var Extension = event.target.files[0].name
      // .substring(event.target.files[0].name.lastIndexOf(".") + 1)
      // .toLowerCase();
      if (Extension == 'pdf') {
        const reader = new FileReader();
        const file = event.target.files[0];
        this.DocumentFile = file;
        this.AttachementFile = file.name;
        if (file.size < 5000000) {
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = (event) => {
            let target: any = event.target;
            // this.DocumentFile = target.result;

          }
        }
        else {
          Swal.fire('Oops...', 'Upload only 5 MB size files!', 'error')
        }
      }
      else {
        Swal.fire('Oops...', 'Upload only pdf files!', 'error')
      }




    }

  }


  Save() {
    var validfirsttab = this.Checkvalidation(1)
    if (!validfirsttab) {
      return false
    }
    var validsecondtab = this.Checkvalidation(2)
    if (!validsecondtab) {
      return false
    }
    this.loader.open()
    // if (this.InventoryFormNew.value.inventory_title == ''

    //   || this.InventoryFormNew.value.registration_number == ''
    //   || this.InventoryFormNew.value.yard_id == ''
    //   || this.InventoryFormNew.value.ppt_id == ''

    //   || this.InventoryFormNew.value.chassis_description == ''
    //   || this.InventoryFormNew.value.chassis_no == ''
    //   || this.InventoryFormNew.value.engine_no == ''
    //   || this.InventoryFormNew.value.year_of_manufacture == ''
    //   || this.InventoryFormNew.value.brand_type == ''
    //   || this.InventoryFormNew.value.contract_no == ''
    // ) {
    //   this.loader.close()
    //   Swal.fire("Oops...", 'Please fill all madentory details', "error");

    //   return false

    // }


    // var images = this.InventoryFormNew.get('InventoryUploadData').value;
    // var data2 = images.filter(book => book.ImagePositionType === 'cover_image');


    // if (data2.length == 0) {
    //   Swal.fire("Oops...", 'Please upload Inventory Cover Image', "error");
    //   this.loader.close()
    //   return false
    // }





    // if (this.InventoryFormNew.get('InventoryUploadData').value.length == 0) {
    //   Swal.fire("Oops...", 'Please add atleast 1 Image', "error");
    //   this.loader.close()
    //   return false

    // }
    if (this.InventoryFormNew.get('InventoryUploadData').value.length > 0) {
      var images = this.InventoryFormNew.get('InventoryUploadData').value;
      var data2 = images.filter(book => book.ImagePositionType === 'cover_image');
      if (data2.length == 0) {
        Swal.fire("Oops...", 'Please upload Inventory Cover Image', "error");
        this.loader.close()
        return false
      }
      for (let i of this.InventoryFormNew.get('InventoryUploadData').value) {
        if (i.ImagePositionType == '') {
          Swal.fire("Oops...", 'Please Select  Image Position', "error");
          this.loader.close()
          return false
        }
      }
    }








    const ListInput1: Input = {} as Input;

    ListInput1.mobile_number = this.InventoryFormNew.value.mobile_number
    ListInput1.yard_id = this.InventoryFormNew.value.yard_id
    ListInput1.yard_code = this.InventoryFormNew.value.yard_code
    ListInput1.yard_city = this.InventoryFormNew.value.yard_city
    ListInput1.remarks = this.InventoryFormNew.value.remarks
    
    ListInput1.yard_region = this.InventoryFormNew.value.yard_region
    ListInput1.yard_state = this.InventoryFormNew.value.yard_state
    ListInput1.tmfl_state = this.InventoryFormNew.value.tmfl_state
    ListInput1.second_online_agency = this.InventoryFormNew.value.second_online_agency
    ListInput1.registration_number = this.InventoryFormNew.value.registration_number
    ListInput1.place_of_origin = this.InventoryFormNew.value.place_of_origin
    ListInput1.inventory_title = this.InventoryFormNew.value.Chassiedescription
    ListInput1.chassis_description_id = this.InventoryFormNew.value.chassis_description_id
    ListInput1.ppt_id = this.InventoryFormNew.value.ppt_id
    ListInput1.vehicle_registered = this.InventoryFormNew.value.vehicle_registered
    ListInput1.engine_no = this.InventoryFormNew.value.engine_no
    ListInput1.chassis_no = this.InventoryFormNew.value.chassis_no
    ListInput1.year_of_manufacture = this.InventoryFormNew.value.year_of_manufacture
    ListInput1.reposs_date = this.datepipe.transform(this.InventoryFormNew.value.reposs_date, 'yyyy-MM-dd') 
    ListInput1.tax_paid_validity = this.datepipe.transform(this.InventoryFormNew.value.tax_paid_validity, 'yyyy-MM-dd') 
    ListInput1.insurance_validity = this.datepipe.transform(this.InventoryFormNew.value.insurance_validity, 'yyyy-MM-dd') 
    ListInput1.fitness_validity = this.datepipe.transform(this.InventoryFormNew.value.fitness_validity, 'yyyy-MM-dd') 
    ListInput1.days_in_stock = this.InventoryFormNew.value.days_in_stock
    ListInput1.rc_available_status = this.InventoryFormNew.value.rc_available_status
    ListInput1.vehicle_type = this.InventoryFormNew.value.vehicle_type
    ListInput1.brand_type = this.InventoryFormNew.value.brand_type
    ListInput1.account_pk = this.InventoryFormNew.value.account_pk
    ListInput1.contract_no = this.InventoryFormNew.value.contract_no
    ListInput1.evaluator_date = this.datepipe.transform(this.InventoryFormNew.value.evaluator_date, 'yyyy-MM-dd')
    ListInput1.bid_start_price = this.InventoryFormNew.value.bid_start_price
    ListInput1.avg_sale_price = this.InventoryFormNew.value.avg_sale_price
    ListInput1.chassis_invoice_value = this.InventoryFormNew.value.chassis_invoice_value
    ListInput1.body_type = this.InventoryFormNew.value.body_type
    ListInput1.body_invoice_value = this.InventoryFormNew.value.body_invoice_value
    ListInput1.evaluator_registration_number = this.InventoryFormNew.value.evaluator_registration_number
    ListInput1.evaluator_engine_no = this.InventoryFormNew.value.evaluator_engine_no
    ListInput1.evaluator_chassis_no = this.InventoryFormNew.value.evaluator_chassis_no
    ListInput1.remarks = this.InventoryFormNew.value.remarks
    ListInput1.bp_code = this.InventoryFormNew.value.bp_code
    this.commonService.AddVehicle(ListInput1).subscribe(
      (res) => {
        if (res.success == true) {
          this.loader.close()
          if (this.InventoryFormNew.get('InventoryUploadData').value.length > 0) {
            const formData = new FormData();
            for (let i of this.InventoryFormNew.get('InventoryUploadData').value) {
              formData.append(i.ImagePositionType, i.FileName);
            }
            formData.append("inventory_id", res.data.id);
            if (this.DocumentFile != "" && this.IsDocumentChanged == "Yes") {
              formData.append('evaluation_criteria', this.DocumentFile);
            }
            this.FileUpService.uploadInventoryImagesTMFL(formData).subscribe(
              (res) => {
                if (res.success == true) {
                  this.loader.close()
                }
                else {
                  this.loader.close()
                  Swal.fire("Success...", res.data.message, "success");
                  this.router.navigate(["pages/InventoryList"]);
                }
              },
              (err) => {
                this.loader.close()
                Swal.fire("Oops...", err.message, "error");
                this.router.navigate(["pages/InventoryList"]);
              }
            );
          }

          this.loader.close()
          //    Swal.fire("Success...", res.data.message, "success");
          // this.router.navigate(["pages/InventoryList"]);
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
              this.router.navigate(["pages/InventoryList"]);
            }
            else {
              this.router.navigate(["pages/InventoryList"]);
            }
          })
          // setTimeout(() => {
          //   this.router.navigate(["pages/InventoryList"]);
          // }, 300);
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

    this.loader.close()
  }

  Update1() {
    var d4 = Date.parse(this.InventoryFormNew.value.evaluator_date);
    var d3 = Date.parse(this.InventoryFormNew.value.reposs_date);
    if (this.InventoryFormNew.value.reposs_date) {
      if (d3 > d4) {
        Swal.fire('Evaluation date can not be eariler to Reposs date.')
        return false
      }
    }
  }


  Update() {
    if (this.Evaluationdata != "" && this.IsDocumentChanged == "Yes") {
      var json = {
        "account_pk": this.Accountpk,
        "inventory_id": this.InventoryID,
        "inventory_document_id": this.Evaluationdata[0].id
      }

      this.commonService.RemoveInventoryById(json).pipe(first()).subscribe(
        (res) => {
          if (res instanceof HttpErrorResponse) {
            return;
          }
          if (res.success) {

            Swal.fire("Remove Image Successfully");
          } else {
            Swal.fire(res.data.msg, "Error");
          }
        },
        (error) => {
          Swal.fire(error.error.data.message, "Error");
        }
      );
    }

    if (this.issold == 'SOLD') {
      Swal.fire('Opss..', 'Not allow to take action , Inventory is SOLD', 'error')
      return false
    }

    if (this.SubpartytypeId == 3) {
      if (this.InventoryFormNew.value.evaluator_registration_number) {
      }
      else {
        Swal.fire("Oops...", 'Please Enter Registration Number', "error");
        return false
      }
      if (this.InventoryFormNew.value.evaluator_engine_no) {
      }
      else {
        Swal.fire("Oops...", 'Please Enter Engine Number', "error");
        return false
      }
      if (this.InventoryFormNew.value.evaluator_chassis_no) {
      }
      else {
        Swal.fire("Oops...", 'Please Enter Chassis Number', "error");
        return false
      }

      const Codevaidator = this.InventoryFormNew.get('evaluator_date');
      const Codevaidator1 = this.InventoryFormNew.get('bid_start_price');
      Codevaidator.setValidators([Validators.required]);
      Codevaidator.updateValueAndValidity();
      Codevaidator1.setValidators([Validators.required]);
      Codevaidator1.updateValueAndValidity();
      if (this.InventoryFormNew.value.bid_start_price == '' || this.InventoryFormNew.value.evaluator_date == '') {
        Swal.fire("Oops...", 'Please fill all  mandatory details (Amount/Evaluation Date)', "error");
        return false
      }
      var images = this.InventoryFormNew.get('InventoryUploadData').value;
      var data2 = images.filter(book => book.ImagePositionType === 'cover_image');
      if (data2.length == 0) {
        Swal.fire("Oops...", 'Please upload Inventory Cover Image', "error");
        return false
      }
      if (this.IsDocumentChanged == "No" && this.DocumentFile == "") {
        Swal.fire("Oops...", 'Please upload Evaluation Report', "error");
        return false
      }
      if (this.InventoryFormNew.get('InventoryUploadData').value.length == 0) {
        Swal.fire("Oops...", 'Please add atleast 1 Image', "error");
        return false
      }
      if (!this.InventoryFormNew.get('InventoryUploadData').valid) {
        Swal.fire("Oops...", 'Please Select  Image Position', "error");
        return false
      }
      else {
        this.InventoryFormNew.controls['Chassiedescription'].enable()
        this.InventoryFormNew.controls['ppt_id'].enable()
        this.InventoryFormNew.controls['contract_no'].enable()
        this.InventoryFormNew.controls['YardDetails'].enable()
        this.InventoryFormNew.controls['second_online_agency'].enable()
        this.InventoryFormNew.controls['yard_state'].enable()
        this.InventoryFormNew.controls['yard_region'].enable()
        this.InventoryFormNew.controls['yard_city'].enable()
        this.InventoryFormNew.controls['remarks'].enable()
        
        this.InventoryFormNew.controls['chassis_no'].enable()
        this.InventoryFormNew.controls['engine_no'].enable()
        this.InventoryFormNew.controls['vehicle_registered'].enable()
        this.InventoryFormNew.controls['registration_number'].enable()
        this.InventoryFormNew.controls['rc_available_status'].disable()
        this.InventoryFormNew.controls['year_of_manufacture'].enable()
        this.InventoryFormNew.controls['reposs_date'].enable()
        this.InventoryFormNew.controls['tax_paid_validity'].enable()
        this.InventoryFormNew.controls['insurance_validity'].enable()
        this.InventoryFormNew.controls['fitness_validity'].enable()
        this.InventoryFormNew.controls['brand_type'].enable()
        this.InventoryFormNew.controls['avg_sale_price'].enable()
        this.InventoryFormNew.controls['chassis_invoice_value'].enable()
        this.InventoryFormNew.controls['body_type'].enable()
        this.InventoryFormNew.controls['body_invoice_value'].enable()
      }
    }
    var d4 = Date.parse(this.InventoryFormNew.value.evaluator_date);
    var d3 = Date.parse(this.InventoryFormNew.value.reposs_date);

    if (this.InventoryFormNew.value.reposs_date) {
      if (d3 > d4) {
        Swal.fire('Evaluation date can not be eariler to Reposs date')
        return false
      }
    }


    if (this.InventoryFormNew.get('InventoryUploadData').value.length > 0) {
      var images = this.InventoryFormNew.get('InventoryUploadData').value;
      var data2 = images.filter(book => book.ImagePositionType === 'cover_image');
      if (data2.length == 0) {
        Swal.fire("Oops...", 'Please upload Inventory Cover Image', "error");
        this.loader.close()
        return false
      }
      for (let i of this.InventoryFormNew.get('InventoryUploadData').value) {
        if (i.ImagePositionType == '') {
          Swal.fire("Oops...", 'Please Select  Image Position', "error");
          this.loader.close()
          return false
        }
      }
    }
    if(this.InventoryFormNew.value.bp_code === '' || this.InventoryFormNew.value.bp_code === null || this.InventoryFormNew.value.bp_code === undefined){
      Swal.fire("Oops...", 'Please fill BP Code', "error");
      this.loader.close();
      return false;
    }
    var Check = false;
    const formData = new FormData();
    for (let i of this.InventoryFormNew.get('InventoryUploadData').value) {
      if (i.ImageType == "NEW") {
        formData.append(i.ImagePositionType, i.FileName);
        Check = true;
      }
    }
    if (this.DocumentFile != "" && this.IsDocumentChanged == "Yes") {
      formData.append('evaluation_criteria', this.DocumentFile);
      Check = true;
    }
    const ListInput1: Input = {} as Input;
    ListInput1.inventory_id = this.InventoryID
    ListInput1.mobile_number = this.InventoryFormNew.value.mobile_number
    ListInput1.yard_id = this.InventoryFormNew.value.yard_id
    ListInput1.yard_code = this.InventoryFormNew.value.yard_code
    ListInput1.yard_city = this.InventoryFormNew.value.yard_city
    ListInput1.remarks = this.InventoryFormNew.value.remarks
    
    ListInput1.yard_region = this.InventoryFormNew.value.yard_region
    ListInput1.yard_state = this.InventoryFormNew.value.yard_state
    ListInput1.tmfl_state = this.InventoryFormNew.value.tmfl_state
    ListInput1.second_online_agency = this.InventoryFormNew.value.second_online_agency
    ListInput1.registration_number = this.InventoryFormNew.value.registration_number
    ListInput1.place_of_origin = this.InventoryFormNew.value.place_of_origin
    ListInput1.inventory_title = this.InventoryFormNew.value.Chassiedescription
    ListInput1.chassis_description_id = this.InventoryFormNew.value.chassis_description_id
    ListInput1.ppt_id = this.InventoryFormNew.value.ppt_id
    ListInput1.vehicle_registered = this.InventoryFormNew.value.vehicle_registered
    ListInput1.engine_no = this.InventoryFormNew.value.engine_no
    ListInput1.chassis_no = this.InventoryFormNew.value.chassis_no
    ListInput1.year_of_manufacture = this.InventoryFormNew.value.year_of_manufacture
    ListInput1.reposs_date = this.datepipe.transform(this.InventoryFormNew.value.reposs_date, 'yyyy-MM-dd')
    ListInput1.tax_paid_validity = this.datepipe.transform(this.InventoryFormNew.value.tax_paid_validity, 'yyyy-MM-dd') 
    ListInput1.insurance_validity = this.datepipe.transform(this.InventoryFormNew.value.insurance_validity, 'yyyy-MM-dd') 
    ListInput1.fitness_validity = this.datepipe.transform(this.InventoryFormNew.value.fitness_validity, 'yyyy-MM-dd') 
    ListInput1.days_in_stock = this.InventoryFormNew.value.days_in_stock
    ListInput1.rc_available_status = this.InventoryFormNew.value.rc_available_status
    ListInput1.vehicle_type = this.InventoryFormNew.value.vehicle_type
    ListInput1.brand_type = this.InventoryFormNew.value.brand_type
    ListInput1.account_pk = this.InventoryFormNew.value.account_pk
    ListInput1.contract_no = this.InventoryFormNew.value.contract_no
    ListInput1.evaluator_date = this.datepipe.transform(this.InventoryFormNew.value.evaluator_date, 'yyyy-MM-dd')
    ListInput1.bid_start_price = this.InventoryFormNew.value.bid_start_price
    ListInput1.avg_sale_price = this.InventoryFormNew.value.avg_sale_price
    ListInput1.chassis_invoice_value = this.InventoryFormNew.value.chassis_invoice_value
    ListInput1.body_type = this.InventoryFormNew.value.body_type
    ListInput1.body_invoice_value = this.InventoryFormNew.value.body_invoice_value
    ListInput1.evaluator_registration_number = this.InventoryFormNew.value.evaluator_registration_number
    ListInput1.evaluator_engine_no = this.InventoryFormNew.value.evaluator_engine_no
    ListInput1.evaluator_chassis_no = this.InventoryFormNew.value.evaluator_chassis_no
    ListInput1.remarks = this.InventoryFormNew.value.remarks
    ListInput1.bp_code = this.InventoryFormNew.value.bp_code
    this.CheckvalidationforEvaluator(2)
    if (this.SubpartytypeId == 3) {
      if (this.EvaluatorValidationerror) {
        Swal.fire({
          title: this.EvaluatorValidationerror,
          input: 'textarea',
          inputValidator: (value) => {
            if (!value) {
              return 'You need to write reason!'
            }
          }

        }).then((result) => {
          if (result.value) {
            this.InventoryFormNew.get('remarks').setValue(String(result.value));
            ListInput1.remarks = this.InventoryFormNew.value.remarks
            this.UpdateData(ListInput1, formData, Check)
          }
        }, (error: any) => console.log(error));
      }
      else {
        this.UpdateData(ListInput1, formData, Check)
      }
    }
    else {
      this.UpdateData(ListInput1, formData, Check)
    }


  }


  UpdateData(ListInput1, formData, Check) {
    this.commonService.updateVehicle(ListInput1).subscribe(
      (res) => {
        if (res.success == true) {
          //  Swal.fire("Success...", res.data.message, "success");
          formData.append("inventory_id", this.InventoryID);
          // Check = true;
          if (Check == true) {
            this.FileUpService.uploadInventoryImagesTMFL(formData).subscribe(
              (res) => {
                if (res.success == true) {
                  //    Swal.fire("Success...image", res.data.message, "success");
                  //  this.router.navigate(["pages/InventoryList"]);
                }
              },
              (err) => {
                Swal.fire("Oops...", err.msg, "error");
              }
            );
          }
          // Swal.fire("Success...", res.data.message, "success");
          // this.router.navigate(["pages/InventoryList"]);
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
              this.router.navigate(["pages/InventoryList"]);
            }
            else {
              this.router.navigate(["pages/InventoryList"]);
            }
          })



        } else {
          Swal.fire("Oops...", res.data.message, "error");
        }
      },
      (err) => {
        Swal.fire("Oops...", err.error.data.message, "error");
      }
    );
  }

  EvaluatorValidationerror: any = '';

  CheckvalidationforEvaluator(tabno) {
    this.EvaluatorValidationerror = ''
    if (tabno == 2) {
      var valid = false
      var Error = ""
      if (this.InventoryFormNew.value.evaluator_registration_number.toUpperCase() == this.InventoryFormNew.value.registration_number.toUpperCase()) {
        valid = true
      }
      else {
        Error = Error + '<br> Mismatch in Registration Number'
        valid = false
      }

      if (this.InventoryFormNew.value.evaluator_engine_no.toUpperCase() == this.InventoryFormNew.value.engine_no.toUpperCase()) {
        valid = true
      }
      else {
        Error = Error + '<br> Mismatch in Engine  Number'
        valid = false
      }


      if (this.InventoryFormNew.value.evaluator_chassis_no.toUpperCase() == this.InventoryFormNew.value.chassis_no.toUpperCase()) {
        valid = true
      }
      else {
        Error = Error + ' <br> Mismatch in Chassis Number'
        valid = false
      }


      if (Error) {
        this.EvaluatorValidationerror = 'Note : ' + Error
      }

      return valid;

    }

  }

  Checkvalidation(tabno) {
    if (tabno == 1) {
      var data2 = this.YardData.filter(book => book.Dsiplay === this.InventoryFormNew.value.YardDetails);
      if (data2.length == 0) {
        Swal.fire("Oops...", 'Please Select Yard  from Suggetion', "error");
        return false
      }
      var data3 = this.Chasiedescription.filter(chassie => chassie.Display === this.InventoryFormNew.value.Chassiedescription);
      if (data3.length == 0) {
        Swal.fire("Oops...", 'Please Select Chassis Description from Suggetion', "error");
        return false
      }
      if (this.InventoryFormNew.value.ppt_id == '' || this.InventoryFormNew.value.contract_no == '') {
        Swal.fire("Oops...", 'Please fill all mandatory details', "error");
        return false
      }
      if(this.InventoryFormNew.value.bp_code === '' || this.InventoryFormNew.value.bp_code === undefined || this.InventoryFormNew.value.bp_code === null){
        Swal.fire("Oops...", 'Please fill BP Code', "error");
        return false;
      }
      else {
        return true;
      }

    }

    if (tabno == 2) {
      if (this.InventoryFormNew.value.vehicle_registered == 'Yes') {
        if (this.InventoryFormNew.value.registration_number == '') {
          Swal.fire("Oops...", 'Please fill all mandatory details', "error");
          return false
        }
      }
      if (this.InventoryFormNew.value.ppt_id == '' || this.InventoryFormNew.value.chassis_description == ''
        // || this.InventoryFormNew.value.chassis_no == ''
        || this.InventoryFormNew.value.engine_no == '' || this.InventoryFormNew.value.year_of_manufacture == ''
        || this.InventoryFormNew.value.brand_type == '' || this.InventoryFormNew.value.chassis_invoice_value == ''
        // || this.InventoryFormNew.value.registration_number == ''
      ) {
        Swal.fire("Oops...", 'Please fill all mandatory details', "error");
        return false
      }
      else {
        return true
      }
    }
  }


  goForward(steeper, id) {
    var Valid = false
    if (this.SubpartytypeId == 3) {
      Valid = true
      // Valid = this.CheckvalidationforEvaluator(id)
      // if (!Valid) {
      //   Swal.fire("Oops...", this.EvaluatorValidationerror, "error");
      //   return false
      // }
    }
    else {
      Valid = this.Checkvalidation(id)
    }

    if (Valid) {
      this.myStepper.next();
    }

    // if (id == 2) {
    //   if (this.InventoryFormNew.value.ppt_id == ''

    //     || this.InventoryFormNew.value.chassis_description == ''
    //     || this.InventoryFormNew.value.chassis_no == ''
    //     || this.InventoryFormNew.value.engine_no == ''
    //     || this.InventoryFormNew.value.year_of_manufacture == ''
    //     || this.InventoryFormNew.value.brand_type == ''
    //     // || this.InventoryFormNew.value.registration_number == ''
    //   ) {

    //     Swal.fire("Oops...", 'Please fill all madentory details', "error");

    //     return false

    //   }
    // }

  }



  RCStatus = ['Yes', 'No']

  OnchangeVehicleregister(value) {
    this.RCStatus = []
    const Codevaidator = this.InventoryFormNew.get('registration_number');
    if (value == 'Yes') {
      this.RCStatus.push('Yes')
      this.RCStatus.push('No')
      this.InventoryFormNew.get('rc_available_status').setValue(null);
      Codevaidator.setValidators([Validators.required]);
      Codevaidator.updateValueAndValidity();
    }
    else {
      this.RCStatus.push('No')
      this.InventoryFormNew.get('rc_available_status').setValue('No');
      Codevaidator.setValidators(null);
      Codevaidator.updateValueAndValidity();
      // this.InventoryFormNew.get('vehicle_registered').setValue('');
    }

  }

  disableSelectFunction(value) {
    if (value === 'myValue') {
      return true; // disabled
    } else {
      return false; // not disabled
    }
  }


  OnchangDescription(Data) {
    var data2 = this.Chasiedescription.filter(book => book.Display === Data.option.value);
    this.InventoryFormNew.get('chassis_description_id').setValue(data2[0].id);
    var input = {
      "id": data2[0].category_id
    }
    this.GetPPt(input)
  }
  Chasiedescription: any;
  GetChasiedescription() {
    this.Chasiedescription = []
    //   var json = { "id": id }
    this.TempChassidescription = []
    this.commonService.Chasiedescription().subscribe(
      (res) => {
        if (res.success == true) {
          for (let file of res.data) {
            var json = {
              "id": file.id,
              "description": file.description,
              "category_id": file.category_id,
              "Display": file.description
            }
            this.Chasiedescription.push(json)
          }
          this.TempChassidescription = this.Chasiedescription
          if (this.chassis_description) {
            var data2 = this.Chasiedescription.filter(book => book.id === this.chassis_description);
            this.InventoryFormNew.get('Chassiedescription').setValue(data2[0].Display);
            var input = {
              "id": data2[0].category_id
            }
            this.GetPPt(input)
          }
        } else {
          Swal.fire("Oops...", res.msg, "error");
        }
      },
      (err) => {
        Swal.fire("Oops...", err.msg, "error");
      }
    );
  }


  AllImageFile = [];
  urls = new Array<string>();
  selectedvalue: any

  Onchangeyard(Event) {
    var data2 = this.YardData.filter(book => book.Dsiplay === Event.option.value);

    if (data2.length == 0) {
      alert('0')
    }
    else {
      this.selectedvalue = data2[0].yard_state + '-' + data2[0].yard_code
      this.InventoryFormNew.get('yard_state').setValue(data2[0].yard_state);
      this.InventoryFormNew.get('yard_id').setValue(data2[0].id)
      // var YardDetails = data2[0].yard_code + '-' + data2[0].yard_name
      // this.InventoryFormNew.get('YardDetails').setValue(YardDetails);
      this.GetYarddetails(data2[0].yard_code)
    }
  }



  GetYarddetails(event) {
    var json = { "yard_code": event }
    this.commonService.Yarddetail(json).subscribe(
      (res) => {
        if (res.success == true) {
          // this.InventoryFormNew.get('yard_city').setValue(res.data.yard_city);
          if (res.data.yard_city) {
            this.InventoryFormNew.get('yard_city').setValue(res.data.yard_city);
          }
          else {
            this.InventoryFormNew.get('yard_city').setValue('');
          }

          this.InventoryFormNew.get('yard_region').setValue(res.data.yard_region);
          this.InventoryFormNew.get('second_online_agency').setValue(res.data.agency_name);
        } else {
          Swal.fire("Oops...", res.msg, "error");
        }
      },
      (err) => {
        Swal.fire("Oops...", err.msg, "error");
      }
    );
  }


  urlsnew = []
  detectFiles(event) {
    this.urls = [];
    let files = event.target.files;
    if (files) {
      var i = 0
      for (let file of files) {
        i = i + 1
        this.ImagesData.addControl('id', new FormControl(i))
        let reader = new FileReader();
        reader.onload = (e: any) => {
          var json = { "path": e.target.result }
          this.urlsnew.push(json);
        }
        reader.readAsDataURL(file);
      }
    }
  }




  SelectImages: any
  Evaluationdata: any
  EvaluatorRemark: any
  builditemform(item) {
    this.SelectImages = []
    this.InventoryFormNew = this.fb.group({
      //basic
      // username: [item.username || '', Validators.required],
      mobile_number: [item.mobile_number || ''],
      yard_id: [item.yard || '', Validators.required],
      //
      yard_code: [item.yard_code || ''],
      yard_city: [item.yard_city || ''],
      remarks:[item.remarks || ''],
      yard_region: [item.yard_region || ''],
      yard_state: [item.yard_state || ''],
      //
      tmfl_state: [item.tmfl_state || ''],
      second_online_agency: [item.second_online_agency || ''],
      registration_number: [item.registration_number || ''],
      place_of_origin: [item.place_of_origin || ''],
      inventory_title: [item.inventory_title || '', Validators.required],
      //vehicle 
      chassis_description_id: [item.chassis_description || '', Validators.required],
      ppt_id: [item.ppt || '', Validators.required],
      vehicle_registered: [item.vehicle_registered || ''],
      engine_no: [item.engine_no || ''],
      chassis_no: [item.chassis_no || ''],
      year_of_manufacture: [item.year_of_manufacture || ''],
      reposs_date: [item.reposs_date || ''],
      tax_paid_validity: [item.tax_paid_validity || ''], 
      insurance_validity: [item.insurance_validity || ''],
      fitness_validity: [item.fitness_validity || ''],
      days_in_stock: [item.days_in_stock || null],
      rc_available_status: [item.rc_available_status || ''],
      vehicle_type: [item.vehicle_type || ''],
      brand_type: [item.brand_type || '', Validators.required],
      //Other
      YardDetails: [],
      Chassiedescription: [],
      contract_no: [item.contract_no || ''],
      account_pk: [this.Accountpk],
      InventoryUploadData: this.fb.array([]),
      evaluator_date: [item.evaluator_date || ''],
      bid_start_price: [item.bid_start_price || ''],
      avg_sale_price: [item.avg_sale_price || ''],
      chassis_invoice_value: [item.chassis_invoice_value || ''],
      body_type: [item.body_type || ''],
      body_invoice_value: [item.body_invoice_value || ''],
      evaluator_registration_number: [item.evaluator_registration_number || ''],
      evaluator_engine_no: [item.evaluator_engine_no || ''],
      evaluator_chassis_no: [item.evaluator_chassis_no || ''],
      bp_code: [item.bp_code || '', Validators.required]
    })
    this.EvaluatorRemark = '';
    if (item.remarks) {
      this.EvaluatorRemark = '<b>Evaluator Remark :</b> ' + item.remarks
    }
    if (this.SubpartytypeId == 3) {
      this.InventoryFormNew.controls['Chassiedescription'].disable()
      this.InventoryFormNew.controls['ppt_id'].disable()
      this.InventoryFormNew.controls['contract_no'].disable()
      this.InventoryFormNew.controls['YardDetails'].disable()
      this.InventoryFormNew.controls['second_online_agency'].disable()
      this.InventoryFormNew.controls['yard_state'].disable()
      this.InventoryFormNew.controls['yard_region'].disable()
      this.InventoryFormNew.controls['yard_city'].disable()
      this.InventoryFormNew.controls['remarks'].disable()
      
      this.InventoryFormNew.controls['chassis_no'].disable()
      this.InventoryFormNew.controls['engine_no'].disable()
      this.InventoryFormNew.controls['vehicle_registered'].disable()
      this.InventoryFormNew.controls['registration_number'].disable()
      this.InventoryFormNew.controls['rc_available_status'].disable()
      this.InventoryFormNew.controls['year_of_manufacture'].disable()
      this.InventoryFormNew.controls['reposs_date'].disable()
      this.InventoryFormNew.controls['brand_type'].disable()
      this.InventoryFormNew.controls['avg_sale_price'].disable()
      this.InventoryFormNew.controls['chassis_invoice_value'].disable()
      this.InventoryFormNew.controls['body_type'].disable()
      this.InventoryFormNew.controls['body_invoice_value'].disable()
    }
    if (item) {
      // this.OnchangPPT(parseInt(item.ppt))
      this.IsDocumentChanged = "No";
      this.SelectImages = item.inventory_documents;
      this.EditBindControlArray(this.SelectImages);
      var data2 = this.SelectImages.filter(book => book.position === 'evaluation_criteria');
      if (data2.length > 0) {
        this.DocumentFile = data2[0].url;
        this.Evaluationdata = data2;
      }
      else {
        this.Evaluationdata = ""
      }
    }
  }

  EditBindControlArray(data) {
    var datasss;
    this.InventoryFormNew["InventoryUploadData"] = [];
    for (let files of data) {
      var position = files.position;
      if (position !== 'evaluation_criteria') {
        this.getmultipleControl.push(
          this.bindValueArray(files.url, files.url, position, "OLD", files.id)
        );
      }
    }
  }

}

export class Input {
  mobile_number: string
  yard_id: string
  yard_code: string
  yard_city: string
  remarks:string
  yard_region: string
  yard_state: string
  tmfl_state: string
  second_online_agency: string
  registration_number: string
  place_of_origin: string
  inventory_title: string
  chassis_description_id: string
  ppt_id: string
  vehicle_registered: string
  engine_no: string
  chassis_no: string
  year_of_manufacture: string
  reposs_date: string
  tax_paid_validity: string
  insurance_validity: string
  fitness_validity: string
  days_in_stock: string
  rc_available_status: string
  vehicle_type: string
  brand_type: string
  account_pk: string
  inventory_id: number
  contract_no: string
  evaluator_date: string
  bid_start_price: string
  avg_sale_price: string
  chassis_invoice_value: string
  body_type: string
  body_invoice_value: string
  evaluator_registration_number: string
  evaluator_engine_no: string
  evaluator_chassis_no: string
  bp_code: any;
}


export class InventoryImage {
  file_path: string;
  inventory_id: number;
}

