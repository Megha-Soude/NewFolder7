import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomizerService } from 'app/shared/services/customizer.service';
import { LayoutService } from 'app/shared/services/layout.service';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { CommonService } from 'app/shared/services/MyServices/common.service';
import { NavigationService } from 'app/shared/services/navigation.service';
import { ITheme, ThemeService } from 'app/shared/services/theme.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-feelist-filter',
  templateUrl: './feelist-filter.component.html',
  styleUrls: ['./feelist-filter.component.scss']
})
export class FeelistFilterComponent implements OnInit {

  isCustomizerOpen: boolean = false;
  public itemForm: FormGroup;
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
  
  constructor(
    private navService: NavigationService,public layout: LayoutService,
    private themeService: ThemeService,public customizer: CustomizerService,
    private renderer: Renderer2, private fb: FormBuilder, 
    private commonService: CommonService ,  private datepipe: DatePipe, private Auth: AuthorizeService,
  ) { }

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
