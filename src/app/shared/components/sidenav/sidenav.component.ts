import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.template.html'
})
export class SidenavComponent {

  public PageDetails = [];
  InventoryImages = [];
  Permission: []
  public ServiceFinalData: any[];
  public ServicemenuItems: any[]
  FinaldataData = [];
  @Input('items') public menuItems: any[] = [];
  @Input('hasIconMenu') public hasIconTypeMenuItem: boolean;
  @Input('iconMenuTitle') public iconTypeMenuTitle: string;

  constructor() { }
  ngOnInit() {
    var list = JSON.parse(localStorage.getItem('PageDetails'))
    // list.forEach(function (x) { delete x.is_active });
    //list.forEach(function (x) { delete x.role_id });
    this.ServicemenuItems = list;

    var Final = this.ServicemenuItems.map(item => item.page_display_name)
      .filter((value, index, self) => self.indexOf(value) === index)

  

    for (let entry of Final) {

      this.InventoryImages = [];
      this.Permission = []
      for (let entryDetail of this.ServicemenuItems) {

        if (entry == entryDetail.page_display_name) {
          this.InventoryImages.push(this.formDetailData(entryDetail.page_name
            , entryDetail.page_url, entryDetail.page_detail));

          //   this.Permission.push(this.PermissionArray(entryDetail.page_detail))
        }


      }



      this.FinaldataData.push(this.formData(entry,
        'dropDown',
        'History',
        'reorder',
        'pages',
        this.InventoryImages
      ));



      

      this.InventoryImages = [];
    }
    this.addServiceMenu();
  }

  formDataMaster(name, type, tooltip, icon, state): Page {
    const PageData: Page = {} as Page;
    PageData.icon = icon
    PageData.name = name;
    PageData.state = state;

    PageData.tooltip = tooltip;
    PageData.type = type;
    return PageData;
  }

  formData(name, type, tooltip, icon, state, sub: any): Page {
    const PageData: Page = {} as Page;
    PageData.icon = icon
    PageData.name = name;
    PageData.state = state;
    PageData.sub = sub;
    PageData.tooltip = tooltip;
    PageData.type = type;
    return PageData;
  }
  formDetailData(name, state, Permission): sub {
    const subData: sub = {} as sub;
    subData.name = name;
    subData.state = state;
    subData.Permission = Permission
    return subData;
  }


  PermissionArray(Data): Permission {
    const subData1: Permission = {} as Permission;
    subData1.Data = Data;

    return subData1;
  }

  addServiceMenu() {
    this.menuItems = this.FinaldataData;
    

  }

  // Only for demo purpose
  addMenuItem() {
    this.menuItems.push({
      name: 'ITEM',
      type: 'dropDown',
      tooltip: 'Item',
      icon: 'done',
      state: 'material',
      sub: [
        { name: 'SUBITEM', state: 'cards' },
        { name: 'SUBITEM', state: 'buttons' }
      ]
    });
  }
}

export class Page {

  name: string;
  type: string;
  tooltip: string;
  icon: string;
  state: string;
  sub: sub[];
  pageNumber: number;
  size: number;
  totalElements: number;

}


export class sub {
  name: string;
  state: string;
  Permission: []
}


export class Permission {
  Data: any;

}