import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-bid-logs',
  templateUrl: './bid-logs.component.html',
  styleUrls: ['./bid-logs.component.scss'],animations: egretAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class BidLogsComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  @ViewChild('tableWrapper',{static:false}) tableWrapper;
  @ViewChild(DatatableComponent,{static:false}) table: DatatableComponent;
  DisplayData :any
  private currentComponentWidth;
  ngOnInit() {
    window.dispatchEvent(new Event('resize'));
    this.DisplayData = []
    this.DisplayData = this.data.payload.bid_logs;
    this.recalculateData()
  }


  rows:any
  recalculateData() {
    this.rows = [...this.DisplayData];
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      }, 250);
  }
}
