import { Component, OnInit, Input, Renderer2, EventEmitter, Output, ViewEncapsulation } from "@angular/core";
import { NavigationService } from "../../../../../shared/services/navigation.service";

import PerfectScrollbar from "perfect-scrollbar";
import { CustomizerService } from "app/shared/services/customizer.service";
import { ThemeService, ITheme } from "app/shared/services/theme.service";

import { FormGroup, FormBuilder } from "@angular/forms";
import { CommonService } from "app/shared/services/MyServices/common.service";
import { AuthorizeService } from "app/shared/services/MyServices/authorize.service";
import Swal from "sweetalert2";
import { DatePipe } from "@angular/common";
import { LayoutService } from "app/shared/services/layout.service";
@Component({
  selector: 'app-emdtrasaction-filter',
  templateUrl: './emdtrasaction-filter.component.html',
  styleUrls: ['./emdtrasaction-filter.component.scss']
})
export class EMDTrasactionFilterComponent implements OnInit {
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
    private navService: NavigationService,public layout: LayoutService,
    private themeService: ThemeService,public customizer: CustomizerService,
    private renderer: Renderer2, private fb: FormBuilder, 
    private commonService: CommonService ,  private datepipe: DatePipe, private Auth: AuthorizeService,
  ) { }
  @Output() messageEvent = new EventEmitter<string>();
  Accountpk: any;
  ngOnInit() {
    this.Accountpk = this.Auth.GetAccountPk()
    // this.GetPPt();
    this.layoutConf = this.layout.layoutConf;
    this.selectedLayout = this.layoutConf.navigationPos;
    this.isTopbarFixed = this.layoutConf.topbarFixed;
    this.isRTL = this.layoutConf.dir === "rtl";
    this.egretThemes = this.themeService.egretThemes;
    this.itemForm = this.fb.group({
      from_date: [],
      to_date: [],
      full_name: [],
      bidder_code:[],
      mobile_number: [],
      // inventory_id = data.get('inventory_id', None)
      // inventory_code = data.get('inventory_code', None)

      // auction_id = data.get('auction_id', None)
      // auction_code = data.get('auction_code', None)  
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


  PPTDATA: any;
  // GetPPt() {
  //   this.PPTDATA = []
  //   this.commonService.GetPPt().subscribe(
  //     (res) => {
  //       if (res.success == true) {

  //         this.PPTDATA = res.data

  //       } else {
  //         // Swal.fire("Oops...", res.msg, "error");
  //       }
  //     },
  //     (err) => {
  //       //  Swal.fire("Oops...", err.msg, "error");
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
    this.messageEvent.emit(this.itemForm.value)
    this.isCustomizerOpen = false;
  }
}
