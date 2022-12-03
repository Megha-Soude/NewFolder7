import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { ThemeService } from "../../services/theme.service";
import { Subscription } from "rxjs";
import { ILayoutConf, LayoutService } from "app/shared/services/layout.service";
import { AuthorizeService } from '../../../shared/services/MyServices/authorize.service';
import { CommonService } from '../../../shared/services/MyServices/common.service';
import { AdminNavigationService } from "../../../shared/services/admin-navigation.service";

@Component({
  selector: "app-sidebar-side",
  templateUrl: "./sidebar-side.component.html"
})
export class SidebarSideComponent implements OnInit, OnDestroy, AfterViewInit {
  public menuItems: any[];
  public hasIconTypeMenuItem: boolean;
  public iconTypeMenuTitle: string;
  private menuItemsSub: Subscription;
  public layoutConf: ILayoutConf;
  loginName: string
  LoginType : any ;
  RoleType : any;
  SessionData:any | null;

  constructor(
    private AdminnavService: AdminNavigationService,
    private navService: NavigationService,
    public themeService: ThemeService,
    private layout: LayoutService,
    private AuthService: AuthorizeService,private CommonService:CommonService
  ) {}
 
  ngOnInit() {
   // this.loginName = this.CommonService.getFullName();
    this.LoginType=localStorage.getItem('UserName');
    this.loginName=localStorage.getItem('LoginName');
    this.SessionData = this.CommonService.getUserDetails(); 
    //this.RoleType=this.SessionData.user_type ; 
    this.RoleType=this.SessionData.party_sub_type_name;

  
    
// if(this.RoleType == 'Seller')
// {
//   this.RoleType='Dealer';
// }
// else{
//   this.RoleType='Admin';
// }



  //  if(this.LoginType=='UY1_1000870' || this.LoginType=='PJJ530169' )
  if( this.RoleType=='Dealer' )
{

  this.iconTypeMenuTitle = this.AdminnavService.iconTypeMenuTitle;
  this.menuItemsSub = this.AdminnavService.menuItems$.subscribe(menuItem => {
    this.menuItems = menuItem;
    //Checks item list has any icon type.
    this.hasIconTypeMenuItem = !!this.menuItems.filter(
      item => item.type === "icon"
    ).length;
  });
}
else
{
  this.iconTypeMenuTitle = this.navService.iconTypeMenuTitle;
  this.menuItemsSub = this.navService.menuItems$.subscribe(menuItem => {
    this.menuItems = menuItem;
    //Checks item list has any icon type.
    this.hasIconTypeMenuItem = !!this.menuItems.filter(
      item => item.type === "icon"
    ).length;
  });

}
    this.layoutConf = this.layout.layoutConf;
  }

  // ngOnInit() {
  //   this.loginName = this.CommonService.getFullName();
  //   this.iconTypeMenuTitle = this.navService.iconTypeMenuTitle;
  //   this.menuItemsSub = this.navService.menuItems$.subscribe(menuItem => {
  //     this.menuItems = menuItem;
  //     //Checks item list has any icon type.
  //     this.hasIconTypeMenuItem = !!this.menuItems.filter(
  //       item => item.type === "icon"
  //     ).length;
  //   });
  //   this.layoutConf = this.layout.layoutConf;
  // }
  ngAfterViewInit() {}
  ngOnDestroy() {
    if (this.menuItemsSub) {
      this.menuItemsSub.unsubscribe();
    }
  }
  toggleCollapse() {
    if (
      this.layoutConf.sidebarCompactToggle
    ) {
        this.layout.publishLayoutChange({
        sidebarCompactToggle: false
      });
    } else {
        this.layout.publishLayoutChange({
            // sidebarStyle: "compact",
            sidebarCompactToggle: true
          });
    }
  }
}
