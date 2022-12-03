import { Component, OnInit, Input, Renderer2, EventEmitter, Output, ViewEncapsulation } from "@angular/core";
import PerfectScrollbar from "perfect-scrollbar";
import { CustomizerService } from "app/shared/services/customizer.service";
import { ThemeService, ITheme } from "app/shared/services/theme.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { CommonService } from "app/shared/services/MyServices/common.service";
import { AuthorizeService } from "app/shared/services/MyServices/authorize.service";
import Swal from "sweetalert2";
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from "@angular/common";
import { LayoutService } from "app/shared/services/layout.service";
import { NavigationService } from "app/shared/services/navigation.service";
import { AppDateAdapter, APP_DATE_FORMATS } from "app/views/pages/format-datepicker";


@Component({
  selector: 'winnerList-Advance-Filter',
  templateUrl: './advance-filter.component.html',
  styleUrls: ['./advance-filter.component.scss'], providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class AdvanceFilterComponent implements OnInit {
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

  constructor(public layout: LayoutService,  private themeService: ThemeService,public customizer: CustomizerService,
    private fb: FormBuilder,private datepipe: DatePipe,private Auth: AuthorizeService) { }
  Accountpk: any;
  ngOnInit() {
    this.Accountpk = this.Auth.GetAccountPk()
    this.layoutConf = this.layout.layoutConf;
    this.selectedLayout = this.layoutConf.navigationPos;
    this.isTopbarFixed = this.layoutConf.topbarFixed;
    this.isRTL = this.layoutConf.dir === "rtl";
    this.egretThemes = this.themeService.egretThemes;
    this.itemForm = this.fb.group({
      from_date: [],
      to_date: [],
      auction_title: [],
      inventory_title: [],
      contract_no : [],
      registration_number : [],
      auction_code: [],
      full_name: [],
      email_id: [],
      mobile_number: [],
      bid_type: [],
    })
  }

  reset() {
    this.itemForm.reset();
    this.messageEvent.emit(this.itemForm.value)
    this.isCustomizerOpen = false;
  }

  PPTDATA: any;
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
