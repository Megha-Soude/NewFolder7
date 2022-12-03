import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { Router } from '@angular/router';
import { AuthorizeService } from "../../../shared/services/MyServices/authorize.service";
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-signin4',
  templateUrl: './signin4.component.html',
  styleUrls: ['./signin4.component.scss'],
  animations: egretAnimations
})
export class Signin4Component implements OnInit {
  ToDate: any;
  FromDate: any;
  signupForm: FormGroup;


  constructor(private router: Router, private datepipe: DatePipe, private loader: AppLoaderService,
    private fb: FormBuilder, private AuthService: AuthorizeService, public snackBar: MatSnackBar,) { }

  ngOnInit() {

    this.Otpid = ""
    // this.login_();
    const password = new FormControl('', Validators.required);
    const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

    this.signupForm = this.fb.group(
      {
        username: ["", Validators.required],
        password: ["", Validators.required],
      }
    );
    this.First = true;
    this.Second = false;
    this.isMobile = false;
  }
  login_() {
    throw new Error('Method not implemented.');
  }

  setTataSession(data) {
    localStorage.setItem('TataToken', data.token.access_token);
  }

  DisplayName: string
  First: boolean = true
  Second: boolean = false
  isMobile: boolean = false

  onSubmit1() {
    if (!this.signupForm.value.username) {
      Swal.fire('Please Enter UserName/MobileNumber')
      return false

    }
    const test = /^[7896][0-9]{9}$/;
    let inputChar = String.fromCharCode(this.signupForm.value.username);



    if (test.test(this.signupForm.value.username)) {
      this.isMobile = true
      this.DisplayName = "Enter OTP"

      this.sendOpt(this.signupForm.value.username)
    }
    else {
      this.isMobile = false
      this.DisplayName = "Enter Password"

      this.First = false
      this.Second = true
    }







  }

  //test

  bcktoUsername() {

    this.First = true
    this.Second = false
    this.signupForm.reset();
  }

  Otpid: any
  sendOpt(MobileNumber) {
    var json = { "mobile_number": MobileNumber }
    this.AuthService.SendOTP(json).subscribe(
      data => {
        if (data.success == true) {
          this.Otpid = data.data.otp_id;
          this.snackBar.open('OTP Send to Registered Mobile Number', '', {
            duration: 5000,
            panelClass: ["custom-style"], verticalPosition: "top", // Allowed values are  'top' | 'bottom'
            horizontalPosition: "right" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right' 
          });

          this.First = false
          this.Second = true

        } else {
          this.loader.close()
          Swal.fire('Oops...', 'Failed ', 'error')
        }
      }, (err) => {
        this.loader.close()
        

        this.snackBar.open(err.error.data.message, '', {
          duration: 5000,
          panelClass: ["custom-styleRed"], verticalPosition: "top", // Allowed values are  'top' | 'bottom'
          horizontalPosition: "right" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right' 
        });
        this.First = true
        this.Second = false

      }
    );
  }
  onSubmit() {

    if (this.isMobile) {


      if (this.signupForm.invalid) {
        Swal.fire('Oops...', 'Enter Valid OTP!', 'error')
        return;
      }

      //   username: this.signupForm.value.username,
      //   password: this.signupForm.value.password

      // }

      let request = {
        "username": this.signupForm.value.username,
        "otp": this.signupForm.value.password,
        "otp_id": this.Otpid
      }
      this.loader.open()
      this.AuthService.loginOTP(request).subscribe(
        data => {
          if (data.success == true) {
            this.loader.close()

            this.setSession(data.data)
            this.router.navigate(['pages/InventoryList'])
          } else {
            this.loader.close()
            Swal.fire('Oops...', 'incorrect username or password!', 'error')
          }
        }, (err) => {
          this.loader.close()
          Swal.fire(err.error.data.message);
          console.log('error occured', err);
        }
      );
    }
    else {


      if (this.signupForm.invalid) {
        Swal.fire('Oops...', 'Enter username or password!', 'error')
        return;
      }
      let request = {
        username: this.signupForm.value.username,
        password: this.signupForm.value.password
        // ,
        // user_type: "ADMIN",
      }
      this.loader.open()
      this.AuthService.loginAuth(request).subscribe(
        data => {
          if (data.success == true) {
            this.loader.close()

            this.setSession(data.data)
            // alert('pages' + data.data.pages[0].page_url)

            var pageUrl = 'pages' + data.data.pages[0].page_url

            this.router.navigate([pageUrl])
            //this.router.navigate(['pages/InventoryList'])
          } else {
            this.loader.close()
            Swal.fire('Oops...', 'incorrect username or password!', 'error')
          }
        }, (err) => {
          this.loader.close()
          Swal.fire(err.error.data.message);
          console.log('error occured', err);
        }
      );

    }



  }
  time_to_login: any;
  setSession(data) {
    localStorage.setItem('TMFLAtoken', data.token.access_token);
    localStorage.setItem('TataToken', data.token.access_token);
    localStorage.setItem('id', data.id);
    let organizationDetails = {
      'dealerName': data["organization_name"], 'mobile_no': data["mobile_no"], 'city': data["city"],
      'district': data["district"], 'taluka': data["taluka"], 'pinCode': data["pin_code"], 'state': data["state"]
    }

    localStorage.setItem('PageDetails', JSON.stringify(data.pages));

    localStorage.setItem('loginData', JSON.stringify(data));


    localStorage.setItem('dealerDetails', JSON.stringify(organizationDetails));
    let Minutes = data.token.expires_in * 1000; // convert 2 minutes to milliseconds
    //  let Minutes = 120 * 1000; // convert 2 minutes to milliseconds
    let date1 = new Date();
    let date2 = new Date(date1.getTime() + Minutes);
    localStorage.setItem('timer', JSON.stringify(date2));

    var d = new Date(); // today!
    var x = 30; // go back 30 days!
    d.setDate(d.getDate() - x);




  }

  ResendOtp() {
    this.sendOpt(this.signupForm.value.username)

  }
}
