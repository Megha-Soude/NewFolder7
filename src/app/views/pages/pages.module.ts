import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatIconModule,
  MatCardModule,
  MatMenuModule,
  MatButtonModule,
  MatChipsModule,
  MatListModule,
  MatTooltipModule,
  MatDialogModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatRadioModule,
  MatCheckboxModule,
  MatStepperModule,
  MatSelectModule, MatGridListModule,
  MatExpansionModule,
  MatTabsModule,
  MatTableModule, MatFormFieldModule
} from '@angular/material';
import { TranslateLoader } from '@ngx-translate/core';
import { AgmCoreModule } from '@agm/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
//import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PagesRoutingModule } from './pages-routing.module';
//import { InventoryMasterComponent } from '../../views/pages/inventory-master/inventory-master.component';

import { QuillModule } from 'ngx-quill';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


import { ChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';
import { DatePipe } from '@angular/common';
import { SharedDirectivesModule } from '../../shared/directives/shared-directives.module';

import { FileUploadsModule } from 'app/file-upload/file-uploads.module';


import { NgxPaginationModule } from 'ngx-pagination';




import { TataServiceModule } from 'app/TataService/tata-service/tata-service.module';



import { LogUotConfirmation } from 'app/shared/services/app-confirm/LogOutConfirmation';
import { LogUotConfirmationWithtext } from 'app/shared/services/app-confirm/Confirmationpopup';


import { MatSliderModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import {AddEMDBalanceComponent} from './User Managment/buyer-registration-list/add-emd-balance/add-emd-balance.component'
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';
import { HttpLoaderFactory } from 'app/app.module';
import { HttpClient } from '@angular/common/http';
import { AddinventoryComponent } from './addinventory/addinventory.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { AdvancedFilterComponent } from './inventory-list/advanced-filter/advanced-filter.component';
import { AddAuctionComponent } from './add-auction/add-auction.component';
import { AuctionListComponent } from './auction-list/auction-list.component';
import { BidListComponent } from './bid-list/bid-list.component';
import { BidLogsComponent } from './bid-list/bid-logs/bid-logs.component';
import { CurrentBidlistComponent } from './Bids/current-bidlist/current-bidlist.component';
import { RolePageMappingComponent } from './User Managment/role-page-mapping/role-page-mapping.component';
import { PatyMasterComponent } from './User Managment/paty-master/paty-master.component';
import { ClosedBidListComponent } from './Bids/closed-bid-list/closed-bid-list.component';
import { BidderComponent } from './Bids/bidder/bidder.component';
import { BidWinnersComponent } from './Bids/bid-winners/bid-winners.component';
import { UserRegistrationComponent } from './User Managment/user-registration/user-registration.component';
import { UserlistComponent } from './User Managment/userlist/userlist.component';
import { BuyerRegistrationListComponent } from './User Managment/buyer-registration-list/buyer-registration-list.component';
import { AuctionList1Component } from './auction-list1/auction-list1.component';
import { BulkUploadInventoryComponent } from './inventory-list/bulk-upload-inventory/bulk-upload-inventory.component';
import { AuctionFiltersComponent } from './auction-list1/auction-filters/auction-filters.component';
import { FilterAdminBuyerUsersComponent } from './User Managment/filter-admin-buyer-users/filter-admin-buyer-users.component';
import { AdvanceFilterClosedCurrentBidlistComponent } from './Bids/advance-filter-closed-current-bidlist/advance-filter-closed-current-bidlist.component';
import { AddEMDComponent } from './EMD managment/add-emd/add-emd.component';
import { EMDListComponent } from './EMD managment/emdlist/emdlist.component';
import { EMDTrasactionFilterComponent } from './EMD managment/emdlist/emdtrasaction-filter/emdtrasaction-filter.component';
import { UpdateInventoryComponent } from './update-inventory/update-inventory.component';
import { SettingsComponent } from './Settings/settings/settings.component';
import { UpdateInventoryImagesComponent } from './update-inventory-images/update-inventory-images.component';
import { SettingsLogsComponent } from './Settings/settings/settings-logs/settings-logs.component';
import { UpdateCategoryLimitComponent } from './User Managment/buyer-registration-list/update-category-limit/update-category-limit.component';
import { UpdateBuyerUserComponent } from './User Managment/buyer-registration-list/update-buyer-user/update-buyer-user.component';
import { OBSExcelUploadComponent } from './Bids/obs-excel-upload/obs-excel-upload.component';
import { BidWinnerListComponent } from './Bids/bid-winner-list/bid-winner-list.component';
import { AdvanceFilterComponent } from './Bids/bid-winner-list/advance-filter/advance-filter.component';
import { ShowImagePopupComponent } from './show-image-popup/show-image-popup.component';
import { AddFeeComponent } from './EMD managment/add-fee/add-fee.component';
import { FeelistComponent } from './EMD managment/feelist/feelist.component';
import  {FeelistFilterComponent} from './EMD managment/feelist/feelist-filter/feelist-filter.component';
import { MISReportComponent } from './MIS Reports/misreport/misreport.component'
import { AcrReportComponent } from './ACR Reports/acr-report.component'
import { AcrReportFilterComponent } from './ACR Reports/acr-report-filter/acr-report-filter.component';
import { LeadreportComponent } from './leadreport/leadreport.component';
import { ObsApprovalComponent } from './OBS/obs-approval/obs-approval.component';
import { ObsFilterComponent } from './OBS/obs-filter/obs-filter.component';
import { CustomerRegisterationListComponent } from './User Managment/customer-registeration-list/customer-registeration-list.component';
import { AddEmdBalanceComponent } from './User Managment/customer-registeration-list/add-emd-balance/add-emd-balance.component';
import { UpdateCustomerUserComponent } from './User Managment/customer-registeration-list/update-customer-user/update-customer-user.component';
import {UpdateCustomerLimitComponent} from './/User Managment/customer-registeration-list/update-customer-limit/update-customer-limit.component';



@NgModule({
  providers: [DatePipe,
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },],
  declarations: [AddEMDBalanceComponent,AddFeeComponent,FeelistComponent,
    AddinventoryComponent, LogUotConfirmation,LogUotConfirmationWithtext,InventoryListComponent,FilterAdminBuyerUsersComponent,
    AdvancedFilterComponent,AddAuctionComponent,AuctionListComponent,BidListComponent,BidLogsComponent,CurrentBidlistComponent,
    RolePageMappingComponent,PatyMasterComponent,ClosedBidListComponent,BidderComponent,BidWinnersComponent,
    UserRegistrationComponent,UserlistComponent,BuyerRegistrationListComponent,AuctionList1Component,
    BulkUploadInventoryComponent,AuctionFiltersComponent, AdvanceFilterClosedCurrentBidlistComponent, AddEMDComponent,
    EMDListComponent, EMDTrasactionFilterComponent, UpdateInventoryComponent, SettingsComponent,
    UpdateInventoryImagesComponent, SettingsLogsComponent, UpdateCategoryLimitComponent, UpdateBuyerUserComponent, 
    OBSExcelUploadComponent, BidWinnerListComponent, AdvanceFilterComponent, ShowImagePopupComponent,FeelistFilterComponent,LeadreportComponent,
     MISReportComponent,AcrReportComponent,AcrReportFilterComponent, ObsApprovalComponent, ObsFilterComponent, CustomerRegisterationListComponent, AddEmdBalanceComponent, UpdateCustomerUserComponent,UpdateCustomerLimitComponent
  ],
  entryComponents: [BulkUploadInventoryComponent,UserRegistrationComponent,FilterAdminBuyerUsersComponent,ShowImagePopupComponent,
    UpdateCategoryLimitComponent,LogUotConfirmationWithtext,LogUotConfirmation,BidLogsComponent,
    SettingsLogsComponent,UpdateBuyerUserComponent],
  imports: [ NgxPaginationModule, MatFormFieldModule, TataServiceModule,
    CommonModule, FormsModule, ChartsModule, NgxEchartsModule, SharedPipesModule, SharedDirectivesModule,
    RouterModule, ReactiveFormsModule, FileUploadsModule,FlexLayoutModule,NgxDatatableModule,MatInputModule,MatIconModule,
    MatToolbarModule,MatCardModule,MatMenuModule,MatSliderModule,MatButtonModule,MatSidenavModule,MatChipsModule,
    MatListModule,MatTooltipModule,MatDialogModule,MatAutocompleteModule,MatSnackBarModule,MatSlideToggleModule,TranslateModule,
    // SharedModule,
    PerfectScrollbarModule,MatDatepickerModule,MatNativeDateModule,MatProgressBarModule,MatRadioModule,MatCheckboxModule,
    MatSelectModule,MatStepperModule, QuillModule,NgxDatatableModule,FileUploadModule, OwlDateTimeModule,
    OwlNativeDateTimeModule, MatGridListModule,MatExpansionModule,MatTabsModule,MatTableModule,
    //RouterModule.forChild(PagesRoutingModule)
    PagesRoutingModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyBcGudZMXCMmd9uHo-WXYrBGplcWvCNOZU' }),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ]
})
export class PagesModule { }
