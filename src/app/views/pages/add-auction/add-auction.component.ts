import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy, ElementRef, ViewEncapsulation } from '@angular/core';

import { ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
//import { NgxTablePopupComponent } from './ngx-table-popup/ngx-table-popup.component';
import { Subscription } from 'rxjs';
import { egretAnimations } from "../../../shared/animations/egret-animations";
import { AuctionInventoryList, auction_details, AuctionCartData, ControlDetail, InventoryList, ApproveData } from '../../../shared/models/models';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuctionService } from '../../../shared/services/MyServices/auction.service';
import { InventoryService } from '../../../shared/services/MyServices/inventory.service';
import { AuthorizeService } from '../../../shared/services/MyServices/authorize.service';
import { CommonService } from '../../../shared/services/MyServices/common.service';
import { delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FileUploader } from 'ng2-file-upload';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../shared/directives/date.adapter';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { NgxImageCompressService } from 'ngx-image-compress';
//import { ImagePopupComponent } from '../image-popup/image-popup.component';
import { FileUploadService } from 'app/file-upload/file-upload.service';
import { DataPassService } from '../../../shared/services/MyServices/data-pass.service'
import { TataServiceService } from '../../../TataService/tata-service.service';
import { MatStepper } from '@angular/material/stepper';
import { OwlDateTimeIntl, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { DefaultIntl } from '../OwlDatefomat';
import { disableDebugTools } from '@angular/platform-browser';
import 'rxjs/add/observable/timer';
import { ShowImagePopupComponent } from '../show-image-popup/show-image-popup.component';
import { Bid } from 'app/shared/models/bid';
import { Page } from 'app/shared/models/PaginationPage';
import { ThrowStmt } from '@angular/compiler';
import { DatatableComponent } from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-add-auction',
  templateUrl: './add-auction.component.html',
  styleUrls: ['./add-auction.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: egretAnimations,
  providers: [
    { provide: OwlDateTimeIntl, useClass: DefaultIntl }

  ],
})
export class AddAuctionComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) mydatatable: DatatableComponent;
  AttachementFile: string;
  @ViewChild('stepper', { static: false }) private myStepper: MatStepper;

  statebind: any;
  public ServiceData: any[];
  FinalData = [];
  InventoryImages = [];
  InventoryImagesService = [];
  bidAmount;
  error: any = { isError: false, errorMessage: '' };
  editing = {};
  rows = [];
  todayDate = new Date();
  RefInput: ElementRef;
  disableread: boolean[] = [];
  imageSrc: string;
  public uploader: FileUploader = new FileUploader({ url: '' });
  public hasBaseDropZoneOver: boolean = false;
  buttonDisabled: boolean;
  ListData: InventoryList[];
  temp = [];
  public items: any[];
  public Cartitems: any[];
  Binditems = [];
  SaveData = [];
  imgurls = [];
  CompressImage: any;
  DocumentFile: any;
  btnInventory: any;
  CustomData: any = [];
  IsDocumentChanged: any;
  IsImageChanged: any;
  //public Cartitems: any[];

  public getItemSub: Subscription;
  public GetData: any;
  public datas: any;

  firstFormGroup: FormGroup;
  firstFormGrouptest: FormGroup;
  secondFormGroup: FormGroup;
  selected = 'option2';

  StateArray: any[];
  DistictArray: any[];
  CityArray: any[];
  TalukaArray: any[];
  PincodeArray: any[];

  stateCode: string;
  stateName: string;
  districtName: string;
  cityName: string;
  talukaName: string;
  postalCode: string;
  auctionId: any;
  AAUctionCode: any;
  btnSave: boolean;
  btnUpdate: boolean;
  btnApprove: boolean
  Inactive: boolean;
  RemoveLink: boolean;
  page = new Page();
  biditems: any;
  selectedBids: any = [];
  selectedBidArray: any = [];
  matchedBid: any = [];
  InventoryData: any = []
  SortedInventoryData: any = []
  finalinventoryid
  auction_type
  btnUpdateRemove:boolean = false;
  main_auction_status;

  tempdata: []
  YardData: any
  selectedvalue: any
  contractno:any;
  yard_id: any
  minDate: Date;
  public trackingdate = new FormControl(new Date());
  Accountpk: any;
  pagevalid: any = []
  selected1 = '';
  selectedAuctionType: string = "";
  AuctionIdAPi: any
  constructor(private fb: FormBuilder,
    private Auth: AuthorizeService,
    private router: Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private commonService: CommonService,
    private AuthService: AuthorizeService,
    private InvenService: InventoryService,
    private datepipe: DatePipe,
    private imageCompress: NgxImageCompressService,
    private FileUpService: FileUploadService,
    private DataPass: DataPassService,
    private TataService: TataServiceService,
    private dataPass: DataPassService,
    private AuctionService: AuctionService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.page.totalElements = 0;
    // this.todayDate.setDate(this.todayDate.getDate())
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  
  ngOnInit() {
  
    this.yard_id = ""
    this.getstate()
    this.pagevalid = this.dataPass.Permission('AuctionList')

    var d1 = new Date(),
      d2 = new Date(d1);
    d2.setMinutes(d1.getMinutes() + 15);
    this.max = d2;
    this.Accountpk = this.Auth.GetAccountPk()
    this.minDate = new Date();
    this.IsImageChanged = "No";
    this.IsDocumentChanged = "No";
    this.GetData = this.DataPass.getAuctioncode();
    
    this.btnInventory = "Add";
    //this.auctionId = this.GetData.id
    //if (this.auctionId == null || this.auctionId == '' || this.auctionId == undefined) {
    if (!this.GetData) {
      this.buildItemForm('');
      this.btnSave = true;
      this.btnUpdate = false;
    }
    else {
      this.btnSave = false;
      this.btnUpdate = true;
      this.selectedAuctionType = (this.GetData.type_of_auction != undefined && this.GetData.type_of_auction != null && this.GetData.type_of_auction != '') ? this.GetData.type_of_auction : '';
      this.buildItemForm(this.GetData);
      this.AuctionIdAPi = this.GetData.id;
      // this.yard_id = this.vehicledata.yard;
    }





    localStorage.removeItem('AuctionCode');

    this.DataPass.resetOption();


    this.buttonDisabled = false;
    this.secondFormGroup = this.fb.group({
      NewInventoryData: this.fb.array([]),
      YardDetails:[],
      contract_no:[],
    });

    this.getYardMaster()
    this.secondFormGroup.controls['YardDetails'].valueChanges.subscribe(change => {
      // if (change == '') {
      //   this.InventoryFormNew.get('yard_state').setValue('');
      //   // this.InventoryFormNew.get('YardDetails').setValue('');
      //   this.InventoryFormNew.get('yard_city').setValue('');
      //   this.InventoryFormNew.get('remarks').setValue('');
      //   this.InventoryFormNew.get('yard_region').setValue('');
      //   this.InventoryFormNew.get('second_online_agency').setValue('');
      // }
      this._filter(change)
    });
    const InventoryListrData: Input = {} as Input;
    InventoryListrData.size = 10;
    InventoryListrData.offset = 0;
    InventoryListrData.approved_status = 'APPROVED'
    // statuschange
    InventoryListrData.availablity_status = 'INVENTORY'
    InventoryListrData.account_pk = this.Accountpk;


    this.getItems(InventoryListrData, 0)

  }

  StateList() {
    // const control = <FormArray>this.secondFormGroup.controls['NewInventoryData'];
    // for (let i = control.length - 1; i >= 0; i--) {
    //   control.removeAt(i)
    // }

    this.ServiceData = []
    this.FinalData = [];
    this.items = [];
    // this.secondFormGroup.reset();
    this.SortedInventoryData = []
    // this.secondFormGroup.get('NewInventoryData').reset()
    const InventoryListrData: Input = {} as Input;
    InventoryListrData.size = 10;
    InventoryListrData.offset = 0;
    // statuschange
    InventoryListrData.approved_status = 'APPROVED'
    InventoryListrData.availablity_status = 'INVENTORY'
    InventoryListrData.account_pk = this.Accountpk;
    InventoryListrData.yard_state = this.selected1 ;
    InventoryListrData.yard_name = this.selectedvalue ? this.selectedvalue : "";
    InventoryListrData.contract_no = this.secondFormGroup.value.contract_no ?  this.secondFormGroup.value.contract_no  : "";
    this.contractno = this.secondFormGroup.value.contract_no  ?  this.secondFormGroup.value.contract_no  : "";

    this.getItems(InventoryListrData, 0)


  }



  reset() {
    this.selectedAuctionType = '';
    this.selected1 = '';
    const control = <FormArray>this.secondFormGroup.controls['NewInventoryData'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }
    this.selectedvalue=[];
    this.contractno='';
    this.ServiceData = []
    this.FinalData = [];
    this.items = [];
    this.secondFormGroup.reset();
    this.secondFormGroup.get('NewInventoryData').reset()
    const InventoryListrData: Input = {} as Input;
    InventoryListrData.size = 10;
    InventoryListrData.offset = 0;
    // statuschange
    InventoryListrData.approved_status = 'APPROVED'
    InventoryListrData.availablity_status = 'INVENTORY'
    InventoryListrData.account_pk = this.Accountpk;
    this.getItems(InventoryListrData, 0)
  }

  States: any;
  getstate() {
    this.States = []
    this.commonService.Getstate('').subscribe(
      (res) => {
        if (res.success == true) {
          this.States = res.data
        } else {
        }
      },
      (err) => {

      }
    );
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


  Vechiledetails: any = []
  public max = new Date();


  getdetails(id) {
    this.loader.open()
    this.items = []
    var json = { "auction_id": id, "account_pk": this.Accountpk }
    this.commonService.AuctionDetails(json).subscribe(
      (res) => {
        if (res.success == true) {
          this.loader.close()
          this.Vechiledetails = res.data;
          // console.log(this.Vechiledetails,"add")
          this.buildItemForm(this.Vechiledetails)

        } else {
          this.loader.close()
          Swal.fire("Oops...", res.data.message, "error");
          this.items = [];

        }
      },
      (err) => {
        this.loader.close()
        Swal.fire("Oops...", err.msg, "error");
      }
    );
  }






  goForward(steeper) {

    this.myStepper.next();
  }

  goBack(steeper) {
    this.myStepper.previous();
  }



  setTataSession(data) {
    localStorage.setItem('TataToken', data.token.access_token);
  }






  get getmultipleControl() {

    return <FormArray>this.secondFormGroup.get('NewInventoryData');
  }

  bindValueArray(inventory_id, inventory_code, InventoryTitle, coverImage, inv_type, category_type,
    subcategory_type, inventory_status, approved_status, Inv_date, min_bid_amount, disabled) {
    let invData = {
      // inventory_id = entry.inventory_id;
      // inventory_code = entry.inventory_code;
      // inv_type = entry.ppt_name;
      // category_type = entry.registration_number;
      // subcategory_type = entry.contract_no;
      // InventoryTitle = entry.inventory_title;
      // coverImage = entry.image_url
      // min_bid_amount = entry.min_bid_amount;
      // disabled = entry.disabled


      cover_image: coverImage,
      inventory_id: inventory_id,
      inventory_code: inventory_code,
      inventory_title: InventoryTitle,
      inv_type: inv_type,
      category_type: category_type,
      subcategory_type: subcategory_type,
      start_at: '',
      start_time: '',
      actual_end_at: '',
      min_bid_amount: min_bid_amount,
      max_bid_amount: '',
      interval: '',
      disabled: disabled
      //isEditable: [true]
    }
    this.InventoryData.push(invData)
    return this.fb.group(
      {
        cover_image: [coverImage],
        inventory_id: [inventory_id],
        inventory_code: [inventory_code],
        inventory_title: [InventoryTitle],
        inv_type: [inv_type],
        category_type: [category_type],
        subcategory_type: [subcategory_type],
        start_at: [''],
        start_time: [''],
        actual_end_at: [''],
        min_bid_amount: [min_bid_amount],
        max_bid_amount: [''],
        interval: [''],
        disabled: [disabled]
        //isEditable: [true]
      }
    )
  }

  buildItemForm(item) {


    if (item == '') {
      this.todayDate.setDate(this.todayDate.getDate());
      this.RemoveLink = true;
      this.firstFormGroup = this.fb.group({
        auction_title: ['', Validators.required],
        interval: ['', Validators.required],
        start_at: ['', Validators.required],
        actual_end_at: ['', Validators.required],
        type_of_auction: ['',Validators.required]
      });
    }
    else {


      // var TempstartTime = item.start_time
      // var splitsstarytime = TempstartTime.split(":")

      // if (item.auction_type != 'CONTINUOUS') {
      //   var TempEndTime = item.end_time
      //   var splitsEndtime = TempEndTime.split(":")
      // }
      var ServiceImage = "";
      if (item.auction_status == "APPROVED") {
        this.btnApprove = false;
      }
      else {
        this.btnApprove = true;
      }

      this.CompressImage = item.cover_image_url;
      this.imageSrc = item.cover_image_url;
      // this.DocumentFile = item.document_path;
      this.RemoveLink = true;
      this.btnUpdateRemove = false;
      let auction_details = JSON.parse(localStorage.getItem('auctionlistDetails'))
      
      this.main_auction_status = auction_details.open_auction_type;
      if(auction_details.open_auction_type == "current"){
        this.btnUpdateRemove = true;
      }
      // if (item.auction_status == "APPROVED") {

      //   this.btnUpdate = false;
      //   this.Inactive = true;
      
      //   this.RemoveLink = false;
      // }
      this.finalinventoryid = item.id ? item.id : null;


      // this.todayDate.setDate(item.start_date);

      this.firstFormGroup = this.fb.group({
        // auction_status: [item.auction_status || '', Validators.required],
        auction_title: [item.auction_title || '', Validators.required],
        interval: [item.interval || '', Validators.required],
        start_at: [item.start_at || '', Validators.required],
        actual_end_at: [item.actual_end_at || '', Validators.required],
        type_of_auction: [item.type_of_auction || '', Validators.required],
        // bid_type: [item.bid_type || '', Validators.required],
        // auction_price_type: [item.auction_price_type || '', Validators.required],
        // auction_type: [item.auction_type || '', Validators.required],
        // DepositAmount: [item.deposit_amount],
        // start_date: [item.start_date || '', Validators.required],
        //  start_time: [item.start_time || '', Validators.required],
        // sHH: [splitsstarytime[0] || '', Validators.required],
        // sMM: [splitsstarytime[1] || '', Validators.required],
        // sAM: [item.sAM || '', Validators.required],
        // // end_date: [item.end_date || ''],
        // // eHH: [splitsEndtime[0] || ''],
        // // eMM: [splitsEndtime[1] || ''],
        // // end_date: [''],
        // // eHH: [''],
        // // eMM: [''],
        //end_time: [item.end_time || '', Validators.required],

        // eAM: [item.eAM || '', Validators.required],
        // state: [item.state || ''],
        // district: [item.district || ''],
        // city: [item.city || ''],
        // taluka: [item.taluka || ''],
        // postal_code: [item.postal_code || ''],
        // contact_no: [item.contact_no || '', Validators.required],
        // auction_remark: [item.auction_remark || '', Validators.required],
        // location_address: [item.location_address || '', Validators.required],
        auction_details: this.fb.array([this.createItem()])
      });

      this.todayDate.setDate(this.todayDate.getDate())
      for (let entry of item.auction_details) {


        // this.InventoryImagesService = entry.inventory_documents.images;
        // if (this.InventoryImagesService.length > 0) {

        //   var images = this.InventoryImagesService.find(x => x.is_cover === true);

        //   if (images == '' || images == undefined || images == null) {
        //     var images = this.InventoryImagesService[0];
        //     ServiceImage = images.path;
        //   }
        //   else {
        //     ServiceImage = images.path;
        //   }
        // }


        ServiceImage = item.cover_image_url
        // inventory_id,    inventory_code,    inventory_title,    cover_image,    inv_type,    
        // category_type,    subcategory_type,    inventory_status,    approved_status,
        // min_bid_amount,    max_bid_amount
        this.Binditems.push(this.formDataEdit(
          entry.inventory.id, entry.inventory.inventory_code
          , entry.inventory.inventory_title
          ,
          ServiceImage, entry.inventory.ppt_name, entry.inventory.registration_number, entry.inventory.contract_no
          , entry.inventory.inventory_title, entry.inventory.inventory_title, entry.inventory.inventory_title, entry.inventory.inventory_title, entry.min_bid_amount, entry.max_bid_amount, entry.auction_detail_code,
          entry.total_bids



        ));
      }
      this.Cartitems = this.Binditems as AuctionCartData[];

      // this.statebind = item.state;

    }



    // this.stateName = item.state;
    // this.districtName = item.district;
    // this.cityName = item.city;
    // this.talukaName = item.taluka;
    // this.postalCode = item.postal_code;
    // this.TataService.getBindState('').then((res => {
    //   if (res.length > 0) {

    //     this.StateArray = res;
    //     if (this.stateName != undefined) {
    //       var selectData = this.StateArray.filter(data => data.name === this.stateName);
    //       this.firstFormGroup.controls['state'].setValue(selectData[0]);
    //       this.onSelectState(selectData[0]);
    //     }
    //     // this.firstFormGroup.setValue({
    //     //   state: selectData,
    //     // });
    //     this.DistictArray = [];
    //     this.CityArray = [];
    //     this.TalukaArray = [];
    //     this.PincodeArray = [];

    //   }

    // }));
    //Bind State End


  }
  createItem(): FormGroup {
    return this.fb.group({
      inventory_code: [''],
      deposit_amount: [''],
      min_bid_amount: [''],
      max_bid_amount: [''],
    });
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }
  }




  AuctionList: any = []
  getItems(InventoryListrData, offset) {
    this.loader.open()
    this.ServiceData = []
    this.FinalData = [];
    this.items = [];
    // this.secondFormGroup.reset();
    // this.secondFormGroup.get('NewInventoryData').reset()
    this.getItemSub = this.commonService.InventoryList(InventoryListrData).subscribe(
      (data) => {
        if (data instanceof HttpErrorResponse) {
          this.loader.close()
          return;
        }
        if (data.success) {

          // this.secondFormGroup.reset();
          this.ServiceData = data.data;
          this.page.pageNumber = 0;
          this.page.size = 10;
          this.page.totalElements = data.total_count
          let inventory_id: number;
          let inventory_code, InventoryTitle, coverImage: string, min_bid_amount: string, disabled;
          let inv_type, category_type, subcategory_type, inventory_status, approved_status, Inv_date, DealerCode: string;

          this.AuctionList = [];
          let selectedItems = this.Binditems.map(itemY => { return itemY.inventory_id; });

          if (this.ServiceData.length > 0) {
            let unmatchedItems = this.ServiceData.filter(itemX => !selectedItems.includes(itemX.id));
            let matchedItems = this.ServiceData.filter(itemX => selectedItems.includes(itemX.id));
            let matchedItemsFilter = matchedItems.map(itemY => { return itemY.id; });
            let bindmatchedItems = this.Binditems.filter(itemX => matchedItemsFilter.includes(itemX.inventory_id));

            this.InventoryData = [];
            this.SortedInventoryData = [];

            if (matchedItems.length > 0) {
              for (let entry of bindmatchedItems) {
                inventory_id = entry.inventory_id;
                inventory_code = entry.inventory_code;
                inv_type = entry.inv_type;
                category_type = entry.category_type;
                subcategory_type = entry.subcategory_type;
                InventoryTitle = entry.inventory_title;
                coverImage = entry.cover_image
                min_bid_amount = entry.min_bid_amount;
                disabled = entry.disabled

                this.getmultipleControl.push(this.bindValueArray(inventory_id, inventory_code, InventoryTitle, coverImage, inv_type, category_type, subcategory_type, inventory_status, approved_status, Inv_date, min_bid_amount, disabled));

              }
            }
            if (unmatchedItems.length > 0) {
              for (let entry of unmatchedItems) {
                inventory_id = entry.id;
                inventory_code = entry.inventory_code;
                inv_type = entry.ppt_name;
                category_type = entry.registration_number;
                subcategory_type = entry.contract_no;
                InventoryTitle = entry.inventory_title;
                coverImage = entry.image_url
                min_bid_amount = '';
                disabled = false
                this.getmultipleControl.push(this.bindValueArray(inventory_id, inventory_code, InventoryTitle, coverImage, inv_type, category_type, subcategory_type, inventory_status, approved_status, Inv_date, min_bid_amount, disabled));

              }
            }




            //  inventory_status = entry.inventory_status;
            //  approved_status = entry.approved_status;
            // Inv_date = new Date(entry.created_at);
            //  DealerCode = entry.dealer_code;
            //  this.InventoryImages = entry.image_url;            ;


            // if (this.InventoryImages.length > 0) {
            //   var images = this.InventoryImages.find(x => x.is_cover === true);
            //   if (images == '' || images == undefined || images == null) {
            //     var images = this.InventoryImages[0];
            //     coverImage = images.path;
            //   }
            //   else {
            //     coverImage = images.path;
            //   }
            // }
            // else {
            // }
            //  this.FinalData.push(this.formInvListData(inventory_id, inventory_code, InventoryTitle, coverImage, inv_type, category_type, subcategory_type, inventory_status, approved_status, Inv_date));


            //         this.items = this.temp = data.data as InventoryList[];
            this.CustomData = [...unmatchedItems, ...bindmatchedItems]
            var res = this.CustomData.sort((a, b) => a.id - b.id)


            this.SortedInventoryData = this.InventoryData.sort((a, b) => a.id - b.id)

            this.loader.close()
            this.mydatatable.offset = offset;
          }
          this.items = this.temp = this.FinalData;

          let yFilter = this.Binditems.map(itemY => { return itemY.inventory_id; });

          // Use filter and "not" includes to filter the full dataset by the filter dataset's val.
          let filteredX = this.items.filter(itemX => !yFilter.includes(itemX.inventory_id));

          for (let index in this.secondFormGroup.get('NewInventoryData').value) {
            this.editing[index] = false;
          };
          this.items = filteredX;
          for (let i = 0; i < this.items.length; i++) {
            this.disableread[i] = false;
          }
        }
        else {
          Swal.fire(data.data.message, 'Error')
          this.page.pageNumber = 0;
          this.page.size = 0;
          this.page.totalElements = 0

          this.loader.close()
        }

      },
      (error) => {
        this.loader.close()
        Swal.fire(error, 'Error')
      }
    );

    // this.getItemSub = this.crudService.getItems()
    //   .subscribe(data => {
    //     this.items = data;
    //   })
  }
  openPopUp(data: any = {}, isNew?) {
    this.items = data;
    this.router.navigateByUrl('pages/Auction');
  }
  deleteItem(row, rowIndex) {



    var msg = "Are you sure want to delete " + row.inventory_title + "?";
    this.confirmService.confirm({ message: msg })
      .subscribe(res => {
        if (res) {
          this.editing[rowIndex] = true;
          this.loader.open();
          this.removeItem(row).subscribe(data => {
            this.Cartitems = data;

            this.loader.close();
            //this.snack.open('Inventory deleted!', 'OK', { duration: 4000 })
            Swal.fire('Remove', 'Inventory Removed!')
            this.getstate();
            this.reset();
          })
        }
      })
  }

  loadServiceData() {
    const InventoryListrData: Input = {} as Input;
    InventoryListrData.size = 10;
    InventoryListrData.offset = 0;
    // statuschange
    InventoryListrData.approved_status = 'APPROVED'
    InventoryListrData.availablity_status = 'INVENTORY'
    InventoryListrData.account_pk = this.Accountpk;
    
    this.getItems(InventoryListrData, 0)
  }


  removeItem(row) {
    // this.Cartitems = this.Binditems
    let i = this.Cartitems.indexOf(row);
    var data2 = this.secondFormGroup.get('NewInventoryData').value.filter(book => book.inventory_id === row.inventory_id);
    let AddCardi = this.secondFormGroup.get('NewInventoryData').value.indexOf(data2[0]);
    if (!this.AuctionIdAPi) {
      this.editing[AddCardi] = false
    }

    let newfilterList = this.Binditems.filter(item => item.inventory_id !== row.inventory_id);

    this.Binditems = [];
    this.Binditems = newfilterList;

    this.Cartitems.splice(i, 1);
    //  let j = this.Binditems.indexOf(row);
    //   this.Binditems.splice(j, 1);
    return of(this.Cartitems.slice()).pipe(delay(1000));
  }

  updateValue1(event, selectedItem, rowIndex) {


    this.editing[rowIndex] = false;
    this.rows[rowIndex] = event.target.value;
    this.rows = [...this.rows];
    this.selectedBids = {
      "id": selectedItem.inventory_id,
      "min_bid_amount": this.rows[rowIndex]
    }

    let val = this.selectedBidArray.filter(x => x.id !== selectedItem.inventory_id)

    this.selectedBidArray = [];
    this.selectedBidArray = val;
    this.selectedBidArray.push(this.selectedBids)


  }
  AddInventory(selectedItem: any, rowIndex) {

    let matchedValue: any = this.selectedBidArray.filter(x => x.id == selectedItem.inventory_id);


    // var maxbidamout = selectedItem.max_bid_amount;
    // var minbidamout = selectedItem.min_bid_amount;
    //  if (maxbidamout != "" && minbidamout != "" && selectedItem.start_at && selectedItem.start_time) {
    if (matchedValue.length > 0) {
      let matchedItem = matchedValue[matchedValue.length - 1]
      if (matchedItem.min_bid_amount !== "") {
        var existItem = this.Binditems.find(x => x.inventory_code == selectedItem.inventory_code);
        if (existItem) {
          const control = this.secondFormGroup.get('NewInventoryData') as FormArray;
          control.removeAt(rowIndex);

          this.editing[rowIndex] = false;
          Swal.fire('Inventory', 'Inventory  Already Added!')
          // this.dropdownList.forEach((element: any) => {
          //   this.mainDocType = {"id":element.item_id,"text" : element.item_text};
          //   this.newarr.push(this.mainDocType)
          //   });
          // this.multi = {"multi" : this.newarr};

        }
        else {
          // if (parseInt(maxbidamout) < parseInt(minbidamout)) {

          //   Swal.fire('', 'Min Amount should be less than Max Amount!', 'error');
          // }
          // else {
          this.matchedBid.push(matchedItem)
          selectedItem.min_bid_amount = matchedItem.min_bid_amount;
          selectedItem.disabled = true;
          this.editing[rowIndex] = true;
          //this.Binditems.push(this.formData(selectedItem, maxbidamout, minbidamout));
          this.Binditems.push(this.formData(selectedItem));
          this.Binditems = [...this.Binditems];
          // maxbidamout = "";
          // minbidamout = "";

          // this.secondFormGroup.value.max_bid_amount = "";
          //this.secondFormGroup.value.min_bid_amount = "";
          // this.snack.open('Inventory Added!', 'OK', { duration: 4000 })

          Swal.fire('Added To Auction', 'Inventory Added Sucessfully!')
          //}
        }
      } else {
        Swal.fire('', 'Enter Min Bid');
      }
    }
    // else {
    //   Swal.fire('', 'Enter all input');
    // }

  }


  // formData(Datas, maxbidamout, minbidamout): AuctionCartData {
  //   const ArrayData: AuctionCartData = {} as AuctionCartData;
  //   ArrayData.inventory_id = Datas.inventory_id;
  //   ArrayData.inventory_code = Datas.inventory_code;
  //   ArrayData.cat_name = Datas.cat_name;
  //   ArrayData.sub_cat_name = Datas.sub_cat_name;
  //   ArrayData.min_bid_amount = minbidamout;
  //   ArrayData.max_bid_amount = maxbidamout;
  //   return ArrayData;
  // }

  formDataEdit(inventory_id, inventory_code, inventory_title, cover_image, inv_type, category_type, subcategory_type, inventory_status, approved_status,
    start_at, actual_end_at, min_bid_amount, max_bid_amount, auction_detail_code, total_bids): AuctionCartData {
    const ArrayData: AuctionCartData = {} as AuctionCartData;
    ArrayData.inventory_id = inventory_id;
    ArrayData.inv_type = inv_type;
    ArrayData.inventory_code = inventory_code;
    ArrayData.inventory_title = inventory_title;
    ArrayData.cover_image = cover_image;
    ArrayData.category_type = category_type;
    ArrayData.subcategory_type = subcategory_type;
    ArrayData.start_at = start_at;
    ArrayData.actual_end_at = actual_end_at;
    ArrayData.min_bid_amount = min_bid_amount;
    ArrayData.max_bid_amount = max_bid_amount;
    ArrayData.auction_detail_code = auction_detail_code;
    ArrayData.total_bids = total_bids;
    return ArrayData;
  }


  inventorystartat: string;
  inventoryendat: string;
  formData(Datas): AuctionCartData {
    const ArrayData: AuctionCartData = {} as AuctionCartData;
    ArrayData.inventory_id = Datas.inventory_id;
    ArrayData.inv_type = Datas.inv_type;
    ArrayData.auction_detail_code = "";
    ArrayData.inventory_code = Datas.inventory_code;
    ArrayData.inventory_title = Datas.inventory_title;
    ArrayData.cover_image = Datas.cover_image;
    ArrayData.category_type = Datas.category_type;
    ArrayData.subcategory_type = Datas.subcategory_type;
    this.inventorystartat = Datas.start_at + ' ' + Datas.start_time;
    // ArrayData.start_at = this.datepipe.transform(this.inventorystartat, 'yyyy-MM-dd HH:mm:ss.SSS');

    // var startdate = new Date(this.inventorystartat);
    // startdate.setHours(startdate.getHours() + 72);
    // var enddate = this.datepipe.transform(startdate, 'yyyy-MM-dd HH:mm:ss.SSS');
    // this.inventoryendat = enddate;
    ArrayData.min_bid_amount = Datas.min_bid_amount;
    ArrayData.max_bid_amount = Datas.max_bid_amount;
    ArrayData.approved_status = Datas.approved_status;
    ArrayData.inventory_status = Datas.inventory_status;
    ArrayData.disabled = Datas.disabled;

    return ArrayData;
  }


  formInvListData(inventory_id, inventory_code, InventoryTitle, coverImage, inv_type, category_type,
    subcategory_type, inventory_status, approved_status, Inv_date): AuctionInventoryList {
    const InventoryListData: AuctionInventoryList = {} as AuctionInventoryList;

    InventoryListData.inventory_id = inventory_id;
    InventoryListData.inventory_code = inventory_code;
    InventoryListData.inventory_title = InventoryTitle;
    InventoryListData.inv_type = inv_type;
    InventoryListData.category_type = category_type;
    InventoryListData.subcategory_type = subcategory_type;
    InventoryListData.approved_status = approved_status;
    InventoryListData.inventory_status = inventory_status;
    InventoryListData.cover_image = coverImage;
    InventoryListData.created_at = Inv_date;
    return InventoryListData;

  }


  private subscription: Subscription;
  private timer: Observable<any>;

  BindCartData() {
    this.loader.open()
    // this.timer        = Observable.timer(5000); // 5000 millisecond means 5 seconds
    // this.subscription = this.timer.subscribe(() => {
    //     // set showloader to false to hide loading div from view after 5 seconds
    //     this.loader.close()
    // });
    this.Cartitems = this.Binditems as AuctionCartData[];
    if (this.Cartitems != undefined) {
      if (this.Cartitems.length > 0) {
        this.myStepper.next();
        this.loader.close()
      } else {
        Swal.fire("No Data Added In auction.");
        this.myStepper.previous();
        this.loader.close()
      }
    }
    else {
      Swal.fire("No Data Added In auction.");
      this.myStepper.previous();
      this.loader.close()
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    var columns = Object.keys(this.temp[0]);
    columns.splice(columns.length - 1);
    if (!columns.length)
      return;

    const rows = this.temp.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        let column = columns[i];
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });

    this.items = rows;
  }






  update() {
    this.loader.open()
    var Startdate = this.datepipe.transform(this.firstFormGroup.value.start_at, 'yyyy-MM-dd HH:mm:ss')
    var Enddate = this.datepipe.transform(new Date(this.firstFormGroup.value.actual_end_at), 'yyyy-MM-dd HH:mm:ss')
    if (this.Cartitems.length > 0) {

      for (let i = 0; i < this.Cartitems.length; i++) {
        if (this.Cartitems.length > this.SaveData.length) {
          this.SaveData.push(this.FormAuctionDetails(this.Cartitems[i].inventory_id, this.Cartitems[i].inventory_code, this.Cartitems[i].max_bid_amount, this.Cartitems[i].min_bid_amount));
        }
      }

    }

    var FinalInput = {
      "auction_id": this.AuctionIdAPi,
      "auction_title": this.firstFormGroup.value.auction_title, "account_pk": parseInt(this.Accountpk)
      , "start_at": Startdate, "actual_end_at": Enddate, "auction_details": this.SaveData,
      "interval": parseInt(this.firstFormGroup.value.interval),
      "type_of_auction": this.selectedAuctionType
    }



    this.commonService.updateAuctionApi(FinalInput).pipe(first()).subscribe(res => {
      if (res instanceof HttpErrorResponse) {
        return;
      }
      if (res.success) {
        this.items = res.data as AuctionMaster[];
        var Check = false;
        const formData = new FormData();
        // append your data
        formData.append('auction_id', res.data.id);
        formData.append('account_pk', this.Accountpk);
        formData.append('cover_image', this.CompressImage);
        Check = true;
        if (this.IsImageChanged == 'Yes') {
          if (Check) {
            this.FileUpService.uploadAuctionImagesTMFL(formData).subscribe(data => {
              this.firstFormGroup.reset();
              this.secondFormGroup.reset();
            });
          }
        }
        this.loader.close()
        this.firstFormGroup.reset();
        this.secondFormGroup.reset();
        Swal.fire({
          title: 'Success',
          text: "Updated Successfully",
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            this.router.navigate(['pages/AuctionList'])
          }
          else {
            this.router.navigate(['pages/AuctionList'])
          }
        })
      }
      else {
        this.loader.close()
        Swal.fire(res.data.message, 'Error')
      }

    },
      error => {
        this.loader.close()
        Swal.fire(error.error.data.message, "Error");
      });

  }
  InactiveData(row:any){
    
  }
  submit() {
    this.loader.open()
    if (!this.firstFormGroup.valid) {
      this.loader.close()
      this.myStepper.previous();
      this.myStepper.previous();
      return
    }
    if (this.Cartitems.length <= 0) {

      Swal.fire("No Data Added In auction.");
      this.myStepper.previous();

    }
    var Startdate = this.datepipe.transform(this.firstFormGroup.value.start_at.toISOString(), 'yyyy-MM-dd HH:mm') + ':00'
    var Enddate = this.datepipe.transform(new Date(this.firstFormGroup.value.actual_end_at).toISOString(), 'yyyy-MM-dd HH:mm') + ':00'


    this.Cartitems = [...this.Cartitems]
    this.SaveData = [];
    for (let i = 0; i < this.Cartitems.length; i++) {
      // if (this.Cartitems.length > this.SaveData.length) {
      this.SaveData.push(this.FormAuctionDetails(this.Cartitems[i].inventory_id, this.Cartitems[i].inventory_code, this.Cartitems[i].max_bid_amount, this.Cartitems[i].min_bid_amount));
      // }
    }
    var FinalInput = {
      "auction_title": this.firstFormGroup.value.auction_title,
      "interval": parseInt(this.firstFormGroup.value.interval),
      "account_pk": parseInt(this.Accountpk)
      , "start_at": Startdate, "actual_end_at": Enddate, "auction_details": this.SaveData,
      "type_of_auction": this.firstFormGroup.value.type_of_auction
    }
    this.commonService.AddAuction(FinalInput).pipe(first()).subscribe(res => {
      if (res instanceof HttpErrorResponse) {
        return;
      }
      if (res.success) {
        this.items = res.data as AuctionMaster[];
        var Check = false;
        const formData = new FormData();
        // append your data
        formData.append('auction_id', res.data.id);
        formData.append('account_pk', this.Accountpk);
        formData.append('cover_image', this.CompressImage);
        Check = true;
        if (Check) {
          this.FileUpService.uploadAuctionImagesTMFL(formData).subscribe(data => {
          });
        }
        else {
        }
        this.loader.close()
        this.firstFormGroup.reset();
        this.secondFormGroup.reset();

        Swal.fire({
          title: 'Success',
          text: "Auction Saved Successfully!",
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            this.router.navigate(['pages/AuctionList'])
          }
          else {
            this.router.navigate(['pages/AuctionList'])
          }
        })





      }
      else {
        this.loader.close()
        Swal.fire(res.data.message, 'Error')
      }

    },
      error => {
        this.loader.close()
        Swal.fire(error.error.data.message, "Error");
      });

  }


  FormAuctionDetails(id, InvCode, maxbidamout, minbidamout): auction_details {
    const AucArrayData: auction_details = {} as auction_details;

    AucArrayData.inventory_id = id;
    AucArrayData.inventory_code = InvCode;
    AucArrayData.min_bid_amount = minbidamout;
    AucArrayData.max_bid_amount = maxbidamout;

    return AucArrayData;
  }

  onSelectDocument(event) {

    this.IsDocumentChanged = "Yes";

    if (event.target.files && event.target.files[0]) {
      var Extension = event.target.files[0].name.substring(
        event.target.files[0].name.lastIndexOf('.') + 1).toLowerCase();
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

  }
  createAuthHeader(headers: Headers) {
    headers.append('Content-Type', 'application/json');
  }


  onSelectFile(event) {

    this.IsImageChanged = "Yes";

    if (event.target.files && event.target.files[0]) {
      var Extension = event.target.files[0].name.substring(
        event.target.files[0].name.lastIndexOf('.') + 1).toLowerCase();
      //  if (Extension == 'JPEG' || Extension == 'jpg' || Extension == 'png') {
      const reader = new FileReader();
      const file = event.target.files[0];
      this.CompressImage = file;


      if (file.size < 5000000) {
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event) => {
          let target: any = event.target;
          this.imageCompress.compressFile(target.result, -2, 50, 50).then(
            result => {
              var imageBase64 = result;
              var binary = this.base64toBlob(result, 'image/jpeg');
              var blob_ = new Blob([binary], { type: 'image/jpeg' });
              var file = new File([blob_], 'test.jpg', { type: 'image/jpeg' });
              const reader = new FileReader();
              const filecompress = file;
              reader.readAsDataURL(filecompress);
              reader.onload = (event) => {
                let target: any = event.target;
                this.imageSrc = imageBase64;
              }
            });
        }
      }
      else {
        Swal.fire('Oops...', 'Upload only 5 MB size files!', 'error')
      }
    }
  }
  onItemDeleted(index: number) {
    this.imgurls.splice(index, 1);
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

  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return [date.getFullYear(), mnth, day, hours, minutes].join("-");
  }

  compareTwoDates() {
    if (!this.firstFormGroup.value.auction_title) {
      Swal.fire('Please Enter Auction Title')
      return false
    }
    else if (!this.firstFormGroup.value.start_at) {
      Swal.fire('Please Select Start Date')
      return false
    }
    else if (!this.firstFormGroup.value.actual_end_at) {
      Swal.fire('Please Select End Date')
      return false
    }
    var d3 = Date.parse(this.firstFormGroup.value.start_at);
    var d4 = Date.parse(this.firstFormGroup.value.actual_end_at);
    if (d3 > d4) {
      Swal.fire('Start-Date Should be Less Than End-Date.')
      return false
    }
    if (!this.firstFormGroup.value.interval) {
      Swal.fire('Please Enter Interval');
      return false
    }
    if (this.CompressImage == undefined) {
      Swal.fire('Please Upload Auction Cover Image')
      return false
    }
    if (!this.firstFormGroup.value.type_of_auction) {
      Swal.fire('Please Select Type Of Auction')
      return false
    }
    else {
      this.myStepper.next();
    }
  }
  CheckData() {
    if (this.Cartitems != undefined) {
      if (this.Cartitems.length > 0) {
      } else {
        Swal.fire("No Data Added In Cart.");
        this.myStepper.previous();
      }
    }
    else {
      Swal.fire("No Data Added In Cart.");
      this.myStepper.previous();
    }
  }

  ShowImagePopUp(Image: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = Image;
    dialogConfig.disableClose = false;
    let dialogRef = this.dialog.open(ShowImagePopupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  setPage(pageInfo) {


    const ListInput1: Input = {} as Input;
    ListInput1.size = (pageInfo.offset * 10) + 10;
    ListInput1.offset = (pageInfo.offset * 10);
    let offset = pageInfo.offset;
    ListInput1.account_pk = this.Accountpk
    // this.table.offset = 0;
    ListInput1.approved_status = 'APPROVED'
    ListInput1.availablity_status = 'INVENTORY'

    this.getItems(ListInput1, offset);


  }
  private _filter(value: string) {
    if (value) {
      const filterValue = value.toString().toLowerCase();
      this.tempdata = this.YardData.filter(option => option.Dsiplay.toLowerCase().includes(filterValue))
    }
    else {
      this.tempdata = this.YardData;
    }
  }
  
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
            this.secondFormGroup.get('YardDetails').setValue(YardDetails);
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  Onchangeyard(Event) {
    var data2 = this.YardData.filter(book => book.Dsiplay === Event.option.value);

    if (data2.length == 0) {
      alert('0')
    }
    else {
      this.selectedvalue = data2[0].yard_name
      // this.selectedvalue = data2[0].yard_state + '-' + data2[0].yard_code
      // this.secondFormGroup.get('yard_state').setValue(data2[0].yard_state);
      // this.secondFormGroup.get('yard_id').setValue(data2[0].id)
      // var YardDetails = data2[0].yard_code + '-' + data2[0].yard_name
      // this.InventoryFormNew.get('YardDetails').setValue(YardDetails);
      // this.GetYarddetails(data2[0].yard_code)
    }
  }

}


interface AuctionMaster {
  user_id: number;
  auction_id: number;
  auction_code: string;
  auction_title: string;
  auction_type: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  location_address: string;
  city: string;
  state: string;
  district: string;
  taluka: string;
  postal_code: string;
  contact_no: string;
  auction_status: string;
  auction_remark: string;
  auction_price_type: string;
  bid_type: string;
  deposit_amount: string;
  auction_details: auction_details[];
  offset: number;
}



export class Input {



  availablity_status: string
  approved_status: string

  size: number
  offset: number

  account_pk: number
  yard_state: string
  yard_name:string
  contract_no:string
}