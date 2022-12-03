import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Page } from 'app/shared/models/PaginationPage';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CommonService } from 'app/shared/services/MyServices/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExcelService } from 'app/shared/services/excel.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-obs-approval',
  templateUrl: './obs-approval.component.html',
  styleUrls: ['./obs-approval.component.scss']
})
export class ObsApprovalComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) mydatatable5: DatatableComponent;
  items: any[];
  allCheckboxIds: any[];
  selectedIDs: any[];
  TotalCount: any;
  isdiableeporrt: boolean = true;
  page = new Page();
  remarks: any;
  constructor(private commonService: CommonService,
    private loader: AppLoaderService,
    private excelService: ExcelService,
    private datepipe: DatePipe) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.page.totalElements = 0;
    this.allCheckboxIds = [];
    this.selectedIDs = [];
   }

  ngOnInit() {
    const ListInput1: Input = {} as Input;
    ListInput1.size = 10
    ListInput1.offset = 0
    ListInput1.auction_type = "list"
    this.getOBSList(ListInput1);
  }

  tableOffset: number = 0;
  setPage(pageInfo) {
    this.tableOffset = pageInfo.offset;
    this.page.totalElements = 0;
    const ListInput1: Input = {} as Input;
    ListInput1.size = (pageInfo.offset * 10) + 10;
    ListInput1.offset = (pageInfo.offset * 10);
    ListInput1.action_type = "list"
    this.getOBSList(ListInput1);
  }

  from_date: any;
  to_date: any;
  auction_title: any;
  inventory_title: any;
  contract_no : any;
  registration_number :any
  mobile_number: any;
  email_id: any;
  full_name: any;
  bidder_code:any;
  auction_code: any;
  bid_type:any
  receiveMessage($event) {
    this.contract_no = $event.contract_no
    var fromdate = this.datepipe.transform($event.from_date, 'yyyy-MM-dd')
    var todate = this.datepipe.transform($event.to_date, 'yyyy-MM-dd')
    this.from_date = fromdate
    this.to_date = todate

    const ListInput1: Input = {} as Input;
    ListInput1.size = 10
    ListInput1.offset = 0
    if (this.from_date) { ListInput1.from_date = fromdate } else { ListInput1.from_date = "" }
    if (this.to_date) { ListInput1.to_date = todate } else { ListInput1.to_date = "" }
    if (this.contract_no) { ListInput1.contract_no = this.contract_no } else { ListInput1.contract_no = "" }
    ListInput1.auction_type = "list"
    this.getOBSList(ListInput1);
  }

  getOBSList(json) {
    this.items = []
    this.FilterStrings(json);
    this.loader.open()
    this.commonService.getApproval(json).subscribe(res => {
      if (res.success == true) {
        this.loader.close()
          this.items = res.data;
          this.page.pageNumber = 0;
          this.page.size = 10;
          this.page.totalElements = res.count
          this.TotalCount = res.count
          this.mydatatable5.offset = (json.offset)/10;
      } else {
        this.loader.close()
        Swal.fire("Oops...", res.data.message, "error");
        this.items = [];
        this.page.pageNumber = 0;
        this.page.size = 0;
        this.page.totalElements = 0
       this.mydatatable5.offset = (json.offset)/10;
      }
    }, (err) => {
      this.mydatatable5.offset = (json.offset)/10;
       this.loader.close()
       Swal.fire("Oops...", err.error.data.message, "error");
     });
  }

  checkbox(event: any, index: any, id: any) {
    if (event.target.checked === true) {
      if(!this.allCheckboxIds.includes(id)){
        this.allCheckboxIds.push(id);
      }
    } else if (event.target.checked === false) {
        let removeIndex = this.allCheckboxIds.indexOf(id);
        if (index > -1) {
          this.allCheckboxIds.splice(removeIndex, 1);
      }
    }
  }

  allCheckbox(ele: any, event: any) {
    const data = ele;
    if (event.target.checked === true) {
      data.forEach(el => {
        if(!this.allCheckboxIds.includes(el.id)){
          this.allCheckboxIds.push(el.id);
        }
      });
    } else {
      this.allCheckboxIds = [];
    }
    var checkboxes = document.getElementsByTagName('input'), val = null;
    for (var i = 0; i < checkboxes.length; i++)
    {
        if (checkboxes[i].type == 'checkbox')
        {
            if (val === null) {
              val = checkboxes[i].checked;
            } else {
              checkboxes[i].checked = val;
            }
        }
    }
    console.log('check', this.allCheckboxIds);
  }

  save(status) {
    if (this.allCheckboxIds.length === 0) {
      Swal.fire("Please select at least 1 checkbox to update approval");
      return;
    }
    if((this.remarks === '' || this.remarks === undefined || this.remarks === null) && status === "NOT_APPROVED"){
      Swal.fire({
        title: 'Remarks is mandatory to reject',
        icon: 'warning',
        confirmButtonText: 'Okay'
      });
      return;
    }
    Swal.fire({
      title: 'Are you sure want to update?',
      text: "You will not be able to do after submit!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',  
      cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.value) {
              this.submitData(status);
            }
            else {
              this.remarks = null;
            }
      });
  }

  submitData(status) {
    // if (this.allCheckboxIds.length === 0) {
    //   Swal.fire("Please select at least 1 checkbox to update approval");
    //   return;
    // }
    const params = {
      action_type:"approval",
      ids: this.allCheckboxIds,
      approval_type: status,
      remarks: (this.remarks === '' || this.remarks === undefined || this.remarks === null) ? '' : this.remarks 
    };
    this.commonService.getApproval(params).subscribe(res => {
      if (res.success == true) {
        this.allCheckboxIds = [];
        this.remarks = null;
        Swal.fire("Success", res.data.message, "success");
      } else {
        Swal.fire("Oops...", res.data.message, "error");
      }
      this.remarks = null;
    }, (err) => {
      Swal.fire("Oops...", err.error.data.message, "error");
      this.remarks = null;
    });
  }

  FilterString: any
  FilterStrings(ListInput) {
    this.FilterString = "";
    if (ListInput.from_date == "" || ListInput.from_date == undefined || ListInput.from_date == null) {
    }
    else { this.FilterString = ' <b>From Date: </b>' + this.datepipe.transform(ListInput.from_date, 'dd-MM-yyyy') }
    if (ListInput.to_date == "" || ListInput.to_date == undefined || ListInput.to_date == null) {
    } else { this.FilterString = this.FilterString + ' <b>To Date: </b>' + this.datepipe.transform(ListInput.to_date, 'dd-MM-yyyy') }
    // if (ListInput.auction_title == "" || ListInput.auction_title == undefined || ListInput.auction_title == null) {
    // } else { this.FilterString = this.FilterString + ' <b>Auction Title: </b>' + ListInput.auction_title; }
    // if (ListInput.inventory_title == "" || ListInput.inventory_title == undefined || ListInput.inventory_title == null) {
    // } else { this.FilterString = this.FilterString + ' <b>Inventory Title: </b>' + ListInput.inventory_title; }
    // if (ListInput.auction_code == "" || ListInput.auction_code == undefined || ListInput.auction_code == null) {
    // } else { this.FilterString = this.FilterString + ' <b>Auction Code: </b>' + ListInput.auction_code; }
    // if (ListInput.full_name == "" || ListInput.full_name == undefined || ListInput.full_name == null) {
    // } else { this.FilterString = this.FilterString + ' <b>Full Name: </b>' + ListInput.full_name; }
    // if (ListInput.email_id == "" || ListInput.email_id == undefined || ListInput.email_id == null) {
    // } else { this.FilterString = this.FilterString + ' <b>Email Id: </b>' + ListInput.email_id; }
    // if (ListInput.mobile_number == "" || ListInput.mobile_number == undefined || ListInput.mobile_number == null) {
    // } else { this.FilterString = this.FilterString + ' <b>Mobile Number: </b>' + ListInput.mobile_number; }
    if (ListInput.contract_no == "" || ListInput.contract_no == undefined || ListInput.contract_no == null) {
    }    else { this.FilterString = this.FilterString + ' <b>Contract Number: </b>' + ListInput.contract_no; }

    // if (ListInput.registration_number == "" || ListInput.registration_number == undefined || ListInput.registration_number == null) {
    // }    else { this.FilterString = this.FilterString + ' <b>Registration Number: </b>' + ListInput.registration_number; }
   
    // if (ListInput.bidder_code == "" || ListInput.bidder_code == undefined || ListInput.bidder_code == null) {
    // }    else { this.FilterString = this.FilterString + ' <b>Bidder Code: </b>' + ListInput.bidder_code; }
   
    

    if (ListInput.bid_type == "" || ListInput.bid_type == undefined || ListInput.bid_type == null) {
      // this.FilterString = this.FilterString + ' <b>Type: </b>' + 'Winner';
    } else { this.FilterString = this.FilterString  + ' <b>Type: </b>' + ListInput.bid_type.toUpperCase()   + ' BIDDER'; }

  


  }

  pendingcount: any = 0;
  TempDownloadarray = [];

  reportDownload() {
    this.isdiableeporrt = false
    this.TempDownloadarray = []
    this.pendingcount = 0
    const ListInput1: Input = {} as Input;
    ListInput1.size = this.TotalCount
    ListInput1.offset = 0
    ListInput1.action_type = "list"
    
    // ListInput1.bid_type = this.bid_type ? this.bid_type : '';
    this.commonService.getApproval(ListInput1).subscribe(data => {
      if (data instanceof HttpErrorResponse) {
        return;
      }
      if (data.success = true) {

        for (let entry of data.data) {
          var Json = {
            "Bid Amount":entry.bid_amount,
            "Chassis Invoice Value":entry.inventory.chassis_invoice_value,
            "Contract No": entry.inventory.contract_no,
            "Avg Sale Price" : entry.inventory.average_sale_price,
            "Finance Approve Status": entry.finance_approval_status,
            "Next Approval Level": entry.next_approval_level,
            "Final Approval": entry.is_final_approval
          }
          this.TempDownloadarray.push(Json)
          this.pendingcount = this.TempDownloadarray.length;
        }
        this.excelService.exportAsExcelFile(this.TempDownloadarray, 'Bidder');
        this.isdiableeporrt = true
      }
      else {
        this.loader.close()
        Swal.fire(data.data.msg, 'Error')
      }
    });
  }
}

export class Input {
  size: number
  offset: number
  from_date: string
  to_date: string
  auction_title: string
  auction_type: string
  inventory_title: string
  auction_detail_id: any;
  auction_detail_code: any;
  auction_id: any;
  mobile_number: any;
  full_name: any;
  bidder_code:any;
  email_id: any;
  row_id:any;
  bid_amount:any;
  contract_no:any;
  auction_code: any;
  inventory_id: any;
  bid_type : any;
  registration_number:string
  action_type: string;
}
