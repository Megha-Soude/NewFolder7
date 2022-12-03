import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-settings-logs',
  templateUrl: './settings-logs.component.html',
  styleUrls: ['./settings-logs.component.scss'], animations: egretAnimations,
  encapsulation: ViewEncapsulation.None,
})


export class SettingsLogsComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) ngxDatatable: DatatableComponent;
  @ViewChild('table', { static: false }) table: DatatableComponent;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {

  }
  DisplayData: any;
  Title: any;
  ngOnInit() {
    this.DisplayData = []
    this.DisplayData = this.data.payload;
    this.Title = this.data.title;
    this.recalculateData()
    //  this.ngxDatatable.recalculate(); //ngx-datatable reference
  }

  rows: any
  recalculateData() {
    this.rows = [...this.DisplayData];

    setTimeout(() => {

      window.dispatchEvent(new Event('resize'));
    }, 250);



  }

}



