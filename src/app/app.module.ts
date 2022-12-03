import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GestureConfig, MatSidenavModule, MatSlideToggleModule } from '@angular/material';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './shared/inmemory-db/inmemory-db.service';
import { rootRouterConfig } from './app.routing';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ErrorHandlerService } from './shared/services/error-handler.service';
import { AppinterceptorService } from '../app/shared/services/MyServices/appinterceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { PagesModule } from './views/pages/pages.module';
import { NgxImageCompressService } from 'ngx-image-compress';
import { LocationStrategy } from '@angular/common';
import { CustomLocationStrategy } from './custom-location-strategy';


// AoT requires an exported function for factories
// export function HttpLoaderFactory(httpClient: HttpClient) {
//   return new TranslateHttpLoader(httpClient);
// }

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function HttpLoaderFactory(httpClient: HttpClient) { return new TranslateHttpLoader(httpClient, "./assets/i18n/", ".json"); }


//export function HttpLoaderFactory(httpClient: HttpClient) { return new TranslateHttpLoader(httpClient, "../../assets/i18n/", ".json"); }


// export function HttpLoaderFactory(httpClient: HttpClient) { return new TranslateHttpLoader(httpClient, "./assets/i18n/", ".json"); }
// export function HttpLoaderFactory(httpClient: HttpClient) { return new TranslateHttpLoader(httpClient, "./assets/i18n/", ".json"); }


// export function init_app(
//   appStateService: AppStateService,
// ) {
//       appStateService.showSearch.next(true);
//       return () => true;
//   }
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    BrowserModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    SharedModule,
    MatSlideToggleModule,
    HttpClientModule,
    PerfectScrollbarModule,
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] }
    }),
    InMemoryWebApiModule.forRoot(InMemoryDataService, { passThruUnknownUrl: true }),
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    PagesModule
  ],
  declarations: [AppComponent],
  providers: [NgxImageCompressService,
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: HTTP_INTERCEPTORS, useClass: AppinterceptorService, multi: true },
    { provide: LocationStrategy, useClass: CustomLocationStrategy },
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
