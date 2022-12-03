import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'app/shared/services/MyServices/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-obs-filter',
  templateUrl: './obs-filter.component.html',
  styleUrls: ['./obs-filter.component.scss']
})
export class ObsFilterComponent implements OnInit {
  public itemForm: FormGroup;
  isCustomizerOpen: boolean = false;
  viewMode: 'options' | 'json' = 'options';


  constructor(private fb: FormBuilder, private commonService: CommonService ,  private datepipe: DatePipe) { }

  @Output() messageEvent = new EventEmitter<string>();
  ngOnInit() {
    this.itemForm = this.fb.group({
      // open_auction_type: [],
      // auction_status: [],
      from_date: [],
      to_date: [],
      contract_no: []
      // auction_title: [],
      // auction_type: [],
    })
  }

  reset() {
    this.itemForm.reset();
    this.messageEvent.emit(this.itemForm.value)

    this.isCustomizerOpen = false;
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
