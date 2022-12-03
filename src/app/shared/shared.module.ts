import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
// SERVICES
import { ThemeService } from './services/theme.service';
import { NavigationService } from "./services/navigation.service";
import { RoutePartsService } from './services/route-parts.service';
import { AuthGuard } from './services/auth/auth.guard';
import { AppConfirmService } from './services/app-confirm/app-confirm.service';
import { AppLoaderService } from './services/app-loader/app-loader.service';


import { SharedPipesModule } from './pipes/shared-pipes.module';
import { SharedDirectivesModule } from './directives/shared-directives.module';

import { AuthorizeService } from './services/MyServices/authorize.service';
import { CommonService } from './services/MyServices/common.service';
import { InventoryService } from './services/MyServices/inventory.service';
import { AuctionService } from './services/MyServices/auction.service';
import { ShopService } from './services/shop.service';

import {AppinterceptorService,FileAppinterceptorService} from '../shared/services/MyServices/appinterceptor.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedComponentsModule } from './components/shared-components.module';

 
@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    SharedComponentsModule,
    SharedPipesModule,
    SharedDirectivesModule 
  ],
  providers: [
    ThemeService,
    NavigationService,
    RoutePartsService,
    AuthGuard,ShopService,
    AppConfirmService,
    AppLoaderService,
    AuthorizeService,
    CommonService,
    InventoryService,
    AuctionService,
    {provide: HTTP_INTERCEPTORS, useClass: AppinterceptorService, multi: true},
   {provide: HTTP_INTERCEPTORS,useClass: FileAppinterceptorService,  multi: true,}
  ],
  exports: [
    SharedComponentsModule,
    SharedPipesModule,
    SharedDirectivesModule
  ]
})
export class SharedModule { }
