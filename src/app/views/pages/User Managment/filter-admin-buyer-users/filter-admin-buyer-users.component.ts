import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { CustomizerService } from "app/shared/services/customizer.service";
import { ThemeService, ITheme } from "app/shared/services/theme.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { CommonService } from "app/shared/services/MyServices/common.service";
import { AuthorizeService } from "app/shared/services/MyServices/authorize.service";
import { LayoutService } from "app/shared/services/layout.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-filter-admin-buyer-users',
  templateUrl: './filter-admin-buyer-users.component.html',
  styleUrls: ['./filter-admin-buyer-users.component.scss']
})
export class FilterAdminBuyerUsersComponent implements OnInit {

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
  @Output() messageEvent = new EventEmitter<string>();
  @Output() resetValueEvent = new EventEmitter<string>();
  @Input() userTypeInfo: any;
  Accountpk: any;
  isBuyerUser: boolean = false;
  isAdminUser: boolean = false;
  userType: string;
  constructor(
    public layout: LayoutService,
    private themeService: ThemeService,
    public customizer: CustomizerService,
    private fb: FormBuilder, private commonService: CommonService, private Auth: AuthorizeService,
    private router: Router,private datepipe: DatePipe,) { }
  hideUserType: boolean = false;
  ngOnInit() {

    this.getstate()
    if (this.userTypeInfo == "buyer") {
      this.userTypeInfo = true;
    }
    let currentUrl = this.router.url;
    this.isAdminUser = currentUrl.includes('UserList') ? true : false;
    this.isBuyerUser = currentUrl.includes('BuyerUser') ? true : false;
    this.layoutConf = this.layout.layoutConf;
    this.selectedLayout = this.layoutConf.navigationPos;
    this.isTopbarFixed = this.layoutConf.topbarFixed;
    this.isRTL = this.layoutConf.dir === "rtl";
    this.egretThemes = this.themeService.egretThemes;
    if(this.isBuyerUser==true)
    {
      this.userType = "buyer"
    }
    this.itemForm = this.fb.group({
      ppt: [''],
      registration_number: [''],
      from_date: [''],
      to_date: [''],
      inventory_code: [''],
      mobile_number: [''],
      full_name: [''],
      state: [''],
      district: [''],
      city: [''],
      user_type: [this.userType || ""],
      username: [ ""],
      is_active: [''],
      category:[''] ,
    })
  }
  reset() {

    this.itemForm.reset();
    this.resetValueEvent.emit(this.userType)
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

        //  console.log(res.data)

         this.States=res.data


        } else {
          
        }
      },
      (err) => {
      
      }
    );
  }

  Search() {
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
    this.messageEvent.emit(this.itemForm.value)
    this.isCustomizerOpen = false;
  }

}
