import {
  Component,
  OnInit,
  Inject,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Router } from "@angular/router";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";

import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { DataPassService } from "app/shared/services/MyServices/data-pass.service";
import { CommonService } from "app/shared/services/MyServices/common.service";
import { AuthorizeService } from "app/shared/services/MyServices/authorize.service";

@Component({
  selector: 'app-paty-master',
  templateUrl: './paty-master.component.html',
  styleUrls: ['./paty-master.component.scss']
})
export class PatyMasterComponent implements OnInit {
  color;
  checked;
  CheckedLable: string;
  disabled;
  RoleTypeDisabled: boolean;
  isApprove: boolean;
  btnSave: boolean;
  btnupdate: boolean;
  btnUpdate: boolean;
  DstCOdeDisabled: boolean;
  rows = [];
  selected = [];
  @ViewChild("input1", { static: false }) inputEl: ElementRef;
  isDisplayTable: boolean;
  public itemForm: FormGroup;
  party_sub_type_id: any;

  constructor(
    private data: DataPassService,
    private CommonService: CommonService,
    private snack: MatSnackBar,
    private router: Router,private Auth:AuthorizeService,

    private fb: FormBuilder) { }


    public datas: any;
    RoleType: any[];
    Position: any[];
  
    click: Subscription;
  
    href: any;
    pagevalid: boolean;
    Role: any;
    Accountpk:any;
  ngOnInit() {
    this.Accountpk =this.Auth.GetAccountPk()
    var RoleName = this.CommonService.getRole();
    this.Role = RoleName;

    this.href = this.router.url;

    var splitted = this.href.split("/", 3);

    // this.pagevalid = this.data.GetPageVlidation(splitted[2])
    this.pagevalid = true;

    if (this.pagevalid == true) {
      this.RoleTypeDisabled = false;
      this.selected = [];
      this.isDisplayTable = false;
      // this.rows = json;

      this.btnSave = true;
      this.btnupdate = false;

      // this.datas = this.data.getOption();
      this.GetPartyType();

      this.buildItemForm("");
    } else {
      this.router.navigate(["pages/NOTFound"]);
    }
  }

  omit_special_char(event) {
    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    );
  }

  PartyTypeArray: any[];
  GetPartyType() {
    var json= {"account_pk":this.Accountpk}
    this.CommonService.BindPartyType(json).subscribe(
      (data) => {
        if (data.success == true) {
          this.PartyTypeArray = data.data;
        } else {
        }
      },
      (err) => {}
    );
  }

  

  buildItemForm(row) {

    // var X = "true";

    // this.checked = false;
    // this.CheckedLable = "Inactive";
    this.itemForm = this.fb.group({
      party_type: [row.party_type || "", Validators.required],
      party_sub_type_name: [row.name || "", Validators.required],
    });
    if (this.Role == "Distributor") {
      this.itemForm.get("role_id").setValue(2);
      this.RoleTypeDisabled = true;
      var input = this.itemForm.value;
    
    }
  }

  OnselectedParty(value) {
    this.btnSave = true;
    this.btnupdate = false;
    this.rows = [];
    //var input = this.itemForm.value;
    this.GetSubPartyType(value);
   
  }
  

  submit() {}

  oncalcel() {
    ///this.router.navigate(['pages/RegistrationList']);
  }

  save() {
    if (this.itemForm.invalid) {
      return;
    }
    const Final: Updateinfo = {} as Updateinfo;
    Final.party_type_id = this.itemForm.value.party_type;
    Final.action_type = "add";
    Final.name = this.itemForm.value.party_sub_type_name;
    // Final.status = "insert";

    this.insertupdatePosition(Final);
  }
  Reset() {
    this.itemForm.reset();
    this.btnSave = true;
    this.btnupdate = false;
    this.RoleTypeDisabled = false;
    this.rows = [];
    this.GetPartyType();
    //this.router.navigate(['pages/Positionmaster']);
  }

  Edit(row) {
    setTimeout(() => this.inputEl.nativeElement.focus());
    this.RoleTypeDisabled = true;
    this.btnSave = false;
    this.btnupdate = true;
    this.buildItemForm(row);
    this.party_sub_type_id=row.id;
  }

  update() {
    if (this.itemForm.invalid) {
      return;
    }
    const Final: Updateinfo = {} as Updateinfo;
    Final.party_type_id = this.itemForm.value.party_type;
    Final.action_type = "update";
    Final.name = this.itemForm.value.party_sub_type_name;
    Final.party_sub_type_id = this.party_sub_type_id;

    // Final.status = "update";
    this.insertupdatePosition(Final);
  }

  insertupdatePosition(Final) {
    this.CommonService.InsertUpdateSubpartyMapping(Final).subscribe(
      (data) => {
        if (data.success == true) {
          Swal.fire({
            title: data.data.message,
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.value) {
              this.itemForm.reset();
              this.itemForm.reset();
              this.btnSave = true;
              this.btnupdate = false;
              this.RoleTypeDisabled = false;
              this.rows = [];
              this.GetPartyType();

              if (this.Role == "Distributor") {
                this.buildItemForm("");
              }
            } else {
              this.itemForm.reset();
              this.itemForm.reset();
              this.btnSave = true;
              this.btnupdate = false;
              this.RoleTypeDisabled = false;
              this.rows = [];
              this.GetPartyType();
              if (this.Role == "Distributor") {
                this.buildItemForm("");
              }
            }
          });
        } else {
          Swal.fire(data.error.data.message);
        }
      },
      (err) => {
        Swal.fire("Exception Occured!");
      }
    );
  }

  CheckStatus(row) {
    return row;
  }


  SubPartyTypeArray: any[];
  GetSubPartyType(partytypeid) {
    var Json = {
      "party_type": partytypeid
    }
    this.rows = [];
    this.CommonService.BindSubPartyType(Json).subscribe(
      data => {
        if (data.success == true) {
          this.rows = data.data;
        }
        else {
        }
      }, (err) => {
      });
  }


}

export class Updateinfo {
  status: string;
  party_sub_type_name: string;
  party_type: string;
  party_sub_type_id:string;
  party_type_id:any;
  action_type: string;
  name:string;
}
