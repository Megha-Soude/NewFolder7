import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthorizeService } from '../MyServices/authorize.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public authToken;
  private isAuthenticated = true; // Set this value dynamically
  
  constructor(private router: Router, private authenticationService: AuthorizeService) {}

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  //   if (this.isAuthenticated) {
  //     return true
  //   }
  //   this.router.navigate(['/sessions/signin']);
  //   return false;
  // }

  canActivate():boolean{
    
    if(this.authenticationService.loggedIn()  )
    {
      return true
    }
    else
    {
  
      this.router.navigate(['/login'])
      return false;
    }
  }
}