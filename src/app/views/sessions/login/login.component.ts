import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { Router } from '@angular/router';
import { AuthorizeService } from "../../../shared/services/MyServices/authorize.service";
//import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: egretAnimations
})
export class LoginComponent implements OnInit {

  signupForm: FormGroup;

  constructor(private router: Router,private fb: FormBuilder, private AuthService: AuthorizeService) {}

  ngOnInit() {

    const password = new FormControl('', Validators.required);
    const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

    this.signupForm = this.fb.group(
      {
        username: ["", Validators.required],
        password: ["", Validators.required],
        device_id: "87946545616461316846169845161148461616844616",
        app_version: "0.01",
        app_name: "com.tatamotors.egurucrm"
      }
    );
  }

  onSubmit() {
    
    if (!this.signupForm.invalid) {
      this.AuthService.loginAuth(this.signupForm.value).subscribe(
        data => {
          
          if (data.data.length > 0) {
            this.setSession(data)
          }
          else {
           // Swal.fire('Oops...', 'incorrect username or password!', 'error')
          }
        }, (err) => {
         
        //  Swal.fire('Oops...',err.error.msg, 'error')
        }
      );
    }
  }
  setSession(data) {
    localStorage.setItem('TMFLAtoken', data.token.access_token);
    const time_to_login = Date.now() + data.token.expires_in; 
    localStorage.setItem('timer', JSON.stringify(time_to_login));
    localStorage.setItem('loginData', JSON.stringify(data.data));
    this.router.navigate(['others/blank'])
  }
}
