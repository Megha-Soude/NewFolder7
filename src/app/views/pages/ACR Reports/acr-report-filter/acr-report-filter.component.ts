import { Component, OnInit, Input, Renderer2, EventEmitter, Output } from "@angular/core";
import { NavigationService } from "../../../../shared/services/navigation.service";
import { CustomizerService } from "app/shared/services/customizer.service";
import { ThemeService, ITheme } from "app/shared/services/theme.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { CommonService } from "app/shared/services/MyServices/common.service";
import { AuthorizeService } from "app/shared/services/MyServices/authorize.service";
import Swal from "sweetalert2";
import { DatePipe } from "@angular/common";
import { LayoutService } from "app/shared/services/layout.service";
@Component({
  selector: 'app-acr-report-filter',
  templateUrl: './acr-report-filter.component.html',
  styleUrls: ['./acr-report-filter.component.scss']
})
export class AcrReportFilterComponent implements OnInit {
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
  Accountpk: any;
  PPTDATA: any;
  constructor(
    private navService: NavigationService,
    public layout: LayoutService,
    private themeService: ThemeService,
    public customizer: CustomizerService,
    private renderer: Renderer2,
    private fb: FormBuilder, 
    private commonService: CommonService ,
    private datepipe: DatePipe,
    private Auth: AuthorizeService,) { }

  
  
  ngOnInit() {
    this.Accountpk = this.Auth.GetAccountPk()
    this.layoutConf = this.layout.layoutConf;
    this.selectedLayout = this.layoutConf.navigationPos;
    this.isTopbarFixed = this.layoutConf.topbarFixed;
    this.isRTL = this.layoutConf.dir === "rtl";
    this.egretThemes = this.themeService.egretThemes;
    this.itemForm = this.fb.group({
     
      Auction_Title: [],
      Chassis_No: [],
      Mobile_Number: [],
      Contract_Number: [],
      Email_Id: [],
      Inventory_Title: [],
      Total_Bid_Count: [],
      WINNING_BID_AMOUNT: [],
      Winner_Name: [],
      Year_of_manufacture: [],
      start_at:[],
      end_at:[]
    })
  }

  special_number(event) {
    var k;
    k = event.charCode;
    return ((k >= 48 && k <= 57));
  }


  reset() {
    this.itemForm.reset();
    this.messageEvent.emit(this.itemForm.value)
    this.isCustomizerOpen = false;
  }


  Search() {
    if (this.itemForm.value.start_at !== null || this.itemForm.value.end_at !== null) {
      if (this.itemForm.value.start_at == null && this.itemForm.value.end_at !== null) {
        Swal.fire('Select From Date');
       return false
      }
      else if (this.itemForm.value.start_at !== null && this.itemForm.value.end_at == null) {
        Swal.fire('Select To Date');
        return false
      }
    }

    if (this.itemForm.value.start_at !== null && this.itemForm.value.end_at !== null) {
      var d1 = Date.parse(this.datepipe.transform(this.itemForm.value.start_at, 'yyyy-MM-dd'));
      var d2 = Date.parse(this.datepipe.transform(this.itemForm.value.end_at, 'yyyy-MM-dd'));
      if (d1 > d2) {
        Swal.fire('From-Date Should be Less Than To-Date.');
        return false
      }

    }
    this.messageEvent.emit(this.itemForm.value)
    this.isCustomizerOpen = false;
  }
}

