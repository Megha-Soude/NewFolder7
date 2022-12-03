import { Component, OnInit, Input, Renderer2, EventEmitter, Output, ViewEncapsulation } from "@angular/core";
import { NavigationService } from "../../../../shared/services/navigation.service";
import { LayoutService } from "../../../../shared/services/layout.service";
import PerfectScrollbar from "perfect-scrollbar";
import { CustomizerService } from "app/shared/services/customizer.service";
import { ThemeService, ITheme } from "app/shared/services/theme.service";

import { FormGroup, FormBuilder } from "@angular/forms";
import { CommonService } from "app/shared/services/MyServices/common.service";
import { AuthorizeService } from "app/shared/services/MyServices/authorize.service";
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import Swal from "sweetalert2";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-advanced-filter',
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.scss']
  , encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class AdvancedFilterComponent implements OnInit {
  public itemForm: FormGroup;
  
  isCustomizerOpen: boolean = false;
  viewMode: 'options' | 'json' = 'options';
  sidenavTypes = [
    {
      name: "Default Menu",
      value: "default-menu"
    },
    {
      name: "Separator Menu",
      value: "separator-menu"
    },
    {
      name: "Icon Menu",
      value: "icon-menu"
    }
  ];
  sidebarColors: any[];
  topbarColors: any[];
  RoleType: any[];

  Position: any[];
  layoutConf;
  selectedMenu: string = "icon-menu";
  selectedLayout: string;
  isTopbarFixed = false;
  isFooterFixed = false;
  isRTL = false;
  egretThemes: ITheme[];
  perfectScrollbarEnabled: boolean = true;
  PositioNname: any
  RoleName: any





  constructor(

    private navService: NavigationService,
    public layout: LayoutService,
    private themeService: ThemeService,
    public customizer: CustomizerService,
    private renderer: Renderer2,
    private fb: FormBuilder,private commonService: CommonService
    , private Auth:AuthorizeService,private datepipe: DatePipe,
  ) { }
  @Output() messageEvent = new EventEmitter<string>();
  Accountpk:any;
  ngOnInit() {

    this. getstate()
// this.getYardAgency();
    this.Accountpk =this.Auth.GetAccountPk()

    //this.GetPPt();
    this.layoutConf = this.layout.layoutConf;
    this.selectedLayout = this.layoutConf.navigationPos;
    this.isTopbarFixed = this.layoutConf.topbarFixed;
    this.isRTL = this.layoutConf.dir === "rtl";
    this.egretThemes = this.themeService.egretThemes;





    this.itemForm = this.fb.group({

      ppt:[''],
      registration_number :[''],
      
      inventory_code: [''],
      mobile_number: [''],
      yard_code: [''],
      yard_name: [''],
      yard_city: [''],
      yard_region: [''],
      yard_state: [''],
      year_of_manufacture: [''],
      availablity_status: [''],
      approved_status: [''],
      evaluation_type: [''],
      contract_no : [''],  
      from_date:  [''],
      to_date:  [''],
      from_reposs_date: [''],
      to_reposs_date: [''],
      from_evaluator_date: [''],
      to_evaluator_date: [''],
      evaluation_agency: [''],
    })



  }

  reset() {
    this.itemForm.reset();
    this.messageEvent.emit(this.itemForm.value)

    this.isCustomizerOpen = false;
  }


  District :any

  OnchangeState(value)
  {

    this.District = []

    var json = {
      "name": value
   }

    this.commonService.GetDistrict(json).subscribe(
      (res) => {
        if (res.success == true) {

 

         this.District=res.data


        } else {
          
        }
      },
      (err) => {
      
      }
    );
  }
States :any;
  getstate()
  {
  this.States = []
    this.commonService.Getstate('').subscribe(
      (res) => {
        if (res.success == true) {
         this.States=res.data
        } else {
        }
      },
      (err) => {
      
      }
    );
  }
  getYardAgency()
  {
    var json = { "yard_code": '' }
    this.commonService.Yarddetail(json).subscribe(
      (res) => {
        if (res.success == true) {
         let agency =res.data
        //  console.log(agency)
        } else {
        }
      },
      (err) => {
      
      }
    );
  }


  PPTDATA: any;
  // GetPPt() {
  //   this.PPTDATA = []
  //   this.commonService.GetPPt().subscribe(
  //     (res) => {
  //       if (res.success == true) {

  //         this.PPTDATA = res.data

  //       } else {
  //        // Swal.fire("Oops...", res.msg, "error");
  //       }
  //     },
  //     (err) => {
  //     //  Swal.fire("Oops...", err.msg, "error");
  //     }
  //   );
  // }


  Search() {
    //this.router.navigate(['pages/OrdersList']);
    // this.router.navigate(["OrdersList"]);
    //this.router.navigateByUrl('/OrdersList');
    if (this.itemForm.value.from_date !== null || this.itemForm.value.to_date !== null) {
      if (this.itemForm.value.from_date == null && this.itemForm.value.to_date !== null) {
        Swal.fire('Select From Date');
       return false
      }
      else if (this.itemForm.value.from_date !== null && this.itemForm.value.to_date == null) {
        Swal.fire('Select To Date');
        return false
      }
    }

    if (this.itemForm.value.from_date !== null && this.itemForm.value.to_date !== null) {
      var d1 = Date.parse(this.datepipe.transform(this.itemForm.value.from_date, 'yyyy-MM-dd'));
      var d2 = Date.parse(this.datepipe.transform(this.itemForm.value.to_date, 'yyyy-MM-dd'));
      if (d1 > d2) {
        Swal.fire('From-Date Should be Less Than To-Date.');
        return false
      }

    }

    

    //reposs_date
    if (this.itemForm.value.from_reposs_date !== null || this.itemForm.value.to_reposs_date !== null) {
      if (this.itemForm.value.from_reposs_date == null && this.itemForm.value.to_reposs_date !== null) {
        Swal.fire('Select From Date');
       return false
      }
      else if (this.itemForm.value.from_reposs_date !== null && this.itemForm.value.to_reposs_date == null) {
        Swal.fire('Select To Date');
        return false
      }
    }

    if (this.itemForm.value.from_reposs_date !== null && this.itemForm.value.to_reposs_date !== null) {
      var d1 = Date.parse(this.datepipe.transform(this.itemForm.value.from_reposs_date, 'yyyy-MM-dd'));
      var d2 = Date.parse(this.datepipe.transform(this.itemForm.value.to_reposs_date, 'yyyy-MM-dd'));
      if (d1 > d2) {
        Swal.fire('From-Date Should be Less Than To-Date.');
        return false
      }

    }
   //reposs_date
   
    //evaluator_date
    if (this.itemForm.value.from_evaluator_date !== null || this.itemForm.value.to_evaluator_date !== null) {
      if (this.itemForm.value.from_evaluator_date == null && this.itemForm.value.to_evaluator_date !== null) {
        Swal.fire('Select From Date');
       return false
      }
      else if (this.itemForm.value.from_evaluator_date !== null && this.itemForm.value.to_evaluator_date == null) {
        Swal.fire('Select To Date');
        return false
      }
    }

    if (this.itemForm.value.from_evaluator_date !== null && this.itemForm.value.to_evaluator_date !== null) {
      var d1 = Date.parse(this.datepipe.transform(this.itemForm.value.from_evaluator_date, 'yyyy-MM-dd'));
      var d2 = Date.parse(this.datepipe.transform(this.itemForm.value.to_evaluator_date, 'yyyy-MM-dd'));
      if (d1 > d2) {
        Swal.fire('From-Date Should be Less Than To-Date.');
        return false
      }
  //evaluator_date
    }









        this.messageEvent.emit(this.itemForm.value)
        this.isCustomizerOpen = false;
  }





}
