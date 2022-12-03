import { Component, Input, OnInit, ViewEncapsulation,ViewChild, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatTabChangeEvent } from '@angular/material';
import { Page } from 'app/shared/models/PaginationPage';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CommonService } from 'app/shared/services/MyServices/common.service';
import Swal from 'sweetalert2';

import { SettingsLogsComponent } from './settings-logs/settings-logs.component'



@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'], encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit {
   
  @Output() selectedTabChange:  EventEmitter<MatTabChangeEvent> 

  [x: string]: any;
  page = new Page();
  constructor(private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private commonService: CommonService, private loader: AppLoaderService,) { }
  NoofBidsAllow = '';
  Form: FormGroup;
  Percentage = '';
  ngOnInit() {

    const ListInput1: Input = {} as Input;

    this.getPercentagelog()
    this.getNoofbidlog()
    this.Form = this.formBuilder.group({
      Percentage: [''],
      NoOfbids: ['']
    })
  }

  onFolderSelected(event) {
    if (event.target.files.length > 0) {
      let files = event.target.files;
    }
  }
  beforeunloadHandler(event) {
    alert('By refreshing this page you may lost all data.');
  }


  Showerror: boolean = false;
  ChangePercentage(event) {

    var val = event.target.value;

    if (val == 0) {
      this.Showerror = true;
    }
    else if (val < 100) {
      this.Showerror = false;
    }
    else {
      this.Showerror = true;
    }

    if (this.Showerror) {
      Swal.fire('Opss', 'Please enter a value between 0.1 and 100', 'error')
    }
    
      
  }


  Submit(Type) {
    if (Type == 'Percentage1') {
      if (this.Form.value.Percentage == '') {
        Swal.fire('Opss', 'Enter Value', 'error')
        return false
      }
      if (Number(this.Form.value.Percentage) == 0) {
        Swal.fire('Opss', 'Please enter a value between 0.1 and 100', 'error')
        return false
      }
      else if (Number(this.Form.value.Percentage) > 100) {
        Swal.fire('Opss', 'Please enter a value between 0.1 and 100', 'error')
        return false

      }



      var json = {
        "action_type": "UPDATE",
        "env_variable": "Markup Percentage",
        "env_value": this.Form.value.Percentage
      }



    }

    if (Type == 'NoofBidsAllow1') {


      if (this.Form.value.NoOfbids == '') {
        Swal.fire('Opss', 'Enter Value', 'error')
        return false
      }
      var json = {
        "action_type": "UPDATE",
        "env_variable": "Allow Bids",
        "env_value": this.Form.value.NoOfbids
      }






    }



    this.commonService.Settings(json).subscribe(
      (res) => {
        if (res.success == true) {
          this.loader.close()
          this.getPercentagelog()
          this.getNoofbidlog()
          Swal.fire("Success", res.data.message, "success");
          this.Form.reset();

        } else {
          this.loader.close()
          Swal.fire("Oops...", res.data.message, "error");




        }
      },
      (err) => {
        this.loader.close()
        // Swal.fire("Oops...", err.msg, "error");
        Swal.fire("Oops...", err.error.data.message, "error");
      }
    );
  }

  isNumberKey(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46 && event.srcElement.value.split('.').length > 1) {
      return false;
    }
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;

  }


  LastPercentage: any
  Percentagelog: any
  getPercentagelog() {
    var Json = {
      "action_type": "LOGS",
      "user_type": "Customer",
      "offset": 0,
      "size": 10,
      "env_variable": "Markup Percentage",
    }
    this.commonService.Settings(Json).subscribe(
      (res) => {
        if (res.success == true) {
          // this.loader.close()
          //
          this.LastPercentage = res.data[0].env_value
          this.Percentagelog = res.data;
          //Swal.fire("Success", res.data.message, "success");
          // this.Form.reset();

        } else {
          //this.loader.close()
          //Swal.fire("Oops...", res.data.message, "error");




        }
      },
      (err) => {
        // this.loader.close()
        // Swal.fire("Oops...", err.msg, "error");
        Swal.fire("Oops...", err.error.data.message, "error");
      }
    );
  }


  lastNoofbids: any
  Noofbidlog: any;
  getNoofbidlog() {

    var Json = {
      "action_type": "LOGS",
      "user_type": "Buyer",
      "offset": 0,
      "size": 10,
      "env_variable": "Allow Bids"
    }


    this.commonService.Settings(Json).subscribe(
      (res) => {
        if (res.success == true) {
          this.loader.close()
          this.lastNoofbids = res.data[0].env_value
          this.Noofbidlog = res.data
          // Swal.fire("Success", res.data.message, "success");
          // this.Form.reset();

        } else {
          // this.loader.close()
          // Swal.fire("Oops...", res.data.message, "error");




        }
      },
      (err) => {
        this.loader.close()
        // Swal.fire("Oops...", err.msg, "error");
        Swal.fire("Oops...", err.error.data.message, "error");
      }
    );
  }

  DataPass: any;
  ViewLogs(data: any = {}) {
    this.DataPass = []
    let title = '';
    if (data != '') {
      //this.data.setOption(data);
      if (data == 'Percentage') {
        this.DataPass = this.Percentagelog;
        title = 'Percentage Log'
      }
      else {
        this.DataPass = this.Noofbidlog;
        title = 'No. of bid attempts  Log'
      }

     
      let dialogRef: MatDialogRef<any> = this.dialog.open(SettingsLogsComponent, {
        width: '700px',
        disableClose: false,
        data: { title: title, payload: this.DataPass }
      })
    }
    else {
      // this.router.navigate(['pages/RuleSetup']);

    }
  }

  tabChange (changeEvent: MatTabChangeEvent){
    this.Form.reset();
    console.log('Index: ' + changeEvent.index);
  }

 

  }

   
  
  





