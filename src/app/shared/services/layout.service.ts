import { Injectable, Renderer2 } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { getQueryParam } from "../helpers/url.helper";
import { ThemeService } from "./theme.service";

export interface ILayoutConf {
  navigationPos?: string; // side, top
  sidebarStyle?: string; // full, compact, closed
  sidebarCompactToggle?: boolean; // sidebar expandable on hover
  sidebarColor?: string; // Sidebar background color http://demos.ui-lib.com/egret-doc/#egret-colors
  dir?: string; // ltr, rtl
  isMobile?: boolean; // updated automatically
  useBreadcrumb?: boolean; // Breadcrumb enabled/disabled
  breadcrumb?: string; // simple, title
  topbarFixed?: boolean; // Fixed header
  footerFixed?: boolean; // Fixed Footer
  topbarColor?: string; // Header background color http://demos.ui-lib.com/egret-doc/#egret-colors
  footerColor?: string // Header background color http://demos.ui-lib.com/egret-doc/#egret-colors
  matTheme?: string; // material theme. egret-blue, egret-navy, egret-dark-purple, egret-dark-pink
  perfectScrollbar?: boolean;
}
export interface ILayoutChangeOptions {
  duration?: number;
  transitionClass?: boolean;
}
interface IAdjustScreenOptions {
  browserEvent?: any;
  route?: string;
}

@Injectable({
  providedIn: "root"
})
export class LayoutService {
  private _layoutConf: ILayoutConf;
  public get layoutConf(): ILayoutConf {
    return this._layoutConf;
  }
  public set layoutConf(value: ILayoutConf) {
    this._layoutConf = value;
  }
  layoutConfSubject = new BehaviorSubject<ILayoutConf>(this.layoutConf);
  layoutConf$ = this.layoutConfSubject.asObservable();
  public isMobile: boolean;
  public currentRoute: string;
  public fullWidthRoutes = ["shop"];
  IlayoutConf: ILayoutConf;

  constructor(private themeService: ThemeService) { 
    this.setAppLayout(
      //******** SET YOUR LAYOUT OPTIONS HERE *********
      // {
        // navigationPos: "side", // side, top
        // sidebarStyle: "full", // full, compact, closed
        // sidebarColor: "purple", // http://demos.ui-lib.com/egret-doc/#egret-colors
        // sidebarCompactToggle: false, // applied when "sidebarStyle" is "compact"
        // dir: "ltr", // ltr, rtl
        // useBreadcrumb: true,
        // topbarFixed: false,
        // // footerFixed: false,
        // topbarColor: "white", // http://demos.ui-lib.com/egret-doc/#egret-colors
        // footerColor: "slate", // http://demos.ui-lib.com/egret-doc/#egret-colors
        // matTheme: "egret-navy", // egret-blue, egret-navy, egret-light-purple, egret-dark-purple, egret-dark-pink
        // breadcrumb: "simple", // simple, title
        // perfectScrollbar: true
      // }
      {
        "navigationPos": "side",
        "sidebarStyle": "full",
        "sidebarColor": "purple",
        "topbarColor": "white",
        "footerColor": "slate",
        "dir": "ltr",
        "useBreadcrumb": false,
        "topbarFixed": false,
        "breadcrumb": "simple",
        "matTheme": "egret-navy",
        "isMobile": false
      }
    );
  }

  setAppLayout(layoutConf: ILayoutConf) {
    this.layoutConf = { ...this.layoutConf, ...layoutConf };
    this.applyMatTheme(this.layoutConf.matTheme);

    //******* Only for demo purpose ***
    this.setLayoutFromQuery();
    //**********************
  }

  publishLayoutChange(lc: ILayoutConf, opt: ILayoutChangeOptions = {}) {
    if (this.layoutConf.matTheme !== lc.matTheme && lc.matTheme) {
      this.themeService.changeTheme(this.layoutConf.matTheme, lc.matTheme);
    }

    this.layoutConf = Object.assign(this.layoutConf, lc);
    this.layoutConfSubject.next(this.layoutConf);
  }

  applyMatTheme(theme) {
    this.themeService.applyMatTheme(this.layoutConf.matTheme);
  }

  setLayoutFromQuery() {
    let layoutConfString = getQueryParam("layout");
    let prevTheme = this.layoutConf.matTheme;
    try {
      this.layoutConf = JSON.parse(layoutConfString);
      this.themeService.changeTheme(prevTheme, this.layoutConf.matTheme);
    } catch (e) {}
  }

  adjustLayout(options: IAdjustScreenOptions = {}) {
    let sidebarStyle: string;
    this.isMobile = this.isSm();
    this.currentRoute = options.route || this.currentRoute;
    sidebarStyle = this.isMobile ? "closed" : "full";

    if (this.currentRoute) {
      this.fullWidthRoutes.forEach(route => {
        if (this.currentRoute.indexOf(route) !== -1) {
          sidebarStyle = "closed";
        }
      });
    }

    this.publishLayoutChange({
      isMobile: this.isMobile,
      sidebarStyle: sidebarStyle
    });
  }
  isSm() {
    return window.matchMedia(`(max-width: 959px)`).matches;
  }
}
