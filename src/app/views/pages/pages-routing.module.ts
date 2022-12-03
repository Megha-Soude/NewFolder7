import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../shared/services/auth/auth.guard';

import { AddinventoryComponent } from './addinventory/addinventory.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { AddAuctionComponent } from './add-auction/add-auction.component';

import { AuctionListComponent } from './auction-list/auction-list.component';
import { BidListComponent } from './bid-list/bid-list.component';
import { ClosedBidListComponent } from './Bids/closed-bid-list/closed-bid-list.component';
import { BidderComponent } from './Bids/bidder/bidder.component';
import { CurrentBidlistComponent } from './Bids/current-bidlist/current-bidlist.component';


import { RolePageMappingComponent } from './User Managment/role-page-mapping/role-page-mapping.component';
import { PatyMasterComponent } from './User Managment/paty-master/paty-master.component';
import { UserlistComponent } from './User Managment/userlist/userlist.component';
import { UserRegistrationComponent } from './User Managment/user-registration/user-registration.component';
import { BuyerRegistrationListComponent } from './User Managment/buyer-registration-list/buyer-registration-list.component';
import { CustomerRegisterationListComponent } from './User Managment/customer-registeration-list/customer-registeration-list.component';

import { AuctionList1Component } from './auction-list1/auction-list1.component';
import { AddFeeComponent } from './EMD managment/add-fee/add-fee.component';
import { FeelistComponent } from './EMD managment/feelist/feelist.component';
import { AddEMDComponent } from './EMD managment/add-emd/add-emd.component';
import { EMDListComponent } from './EMD managment/emdlist/emdlist.component'

import { UpdateInventoryComponent } from './update-inventory/update-inventory.component';
import { SettingsComponent } from './Settings/settings/settings.component';
import { UpdateInventoryImagesComponent } from './update-inventory-images/update-inventory-images.component';
import { OBSExcelUploadComponent } from './Bids/obs-excel-upload/obs-excel-upload.component';
import { BidWinnerListComponent } from './Bids/bid-winner-list/bid-winner-list.component';
import { MISReportComponent } from './MIS Reports/misreport/misreport.component'
import { AcrReportComponent } from './ACR Reports/acr-report.component'
import { LeadreportComponent } from './leadreport/leadreport.component';
import { ObsApprovalComponent } from './OBS/obs-approval/obs-approval.component';

const routes: Routes = [
  {path:'Addinventory',component:AddinventoryComponent,canActivate:[AuthGuard],data: { title: 'Addinventory', breadcrumb: 'Addinventory' }},
  {path:'InventoryList',component:InventoryListComponent,canActivate:[AuthGuard],data: { title: 'InventoryList', breadcrumb: 'InventoryList' }},
  {path:'AddAuction',component:AddAuctionComponent,canActivate:[AuthGuard],data: { title: 'AddAuction', breadcrumb: 'AddAuction' }},
  {path:'AuctionList1',component:AuctionListComponent,canActivate:[AuthGuard],data: { title: 'AuctionList', breadcrumb: 'AuctionList' }},
  {path:'AuctionList',component:AuctionList1Component,canActivate:[AuthGuard],data: { title: 'AuctionList', breadcrumb: 'AuctionList' }},
 
 
 
  {path:'BidList',component:BidListComponent,canActivate:[AuthGuard],data: { title: 'BidList', breadcrumb: 'BidList' }},



  {path:'ClosedBidList',component:ClosedBidListComponent,canActivate:[AuthGuard],data: { title: 'ClosedBidList', breadcrumb: 'ClosedBidList' }},
  {path:'CurrentBidList',component:CurrentBidlistComponent,canActivate:[AuthGuard],data: { title: 'CurrentBidlist', breadcrumb: 'CurrentBidlist' }},
  {path:'Bidder',component:BidderComponent,canActivate:[AuthGuard],data: { title: 'CurrentBidlist', breadcrumb: 'BidderComponent' }},


  {path:'PartTypemaster',component:PatyMasterComponent,canActivate:[AuthGuard],data: { title: 'PartTypemaster', breadcrumb: 'PartTypemaster' }},
  {path:'AccessManagment',component:RolePageMappingComponent,canActivate:[AuthGuard],data: { title: 'AccessManagment', breadcrumb: 'AccessManagment' }},


  {path:'UserList',component:UserlistComponent,canActivate:[AuthGuard],data: { title: 'UserList', breadcrumb: 'UserList' }},
  // {path:'UserRegistration',component:UserRegistrationComponent,canActivate:[AuthGuard],data: { title: 'UserRegistration', breadcrumb: 'UserRegistration' }},

  {path:'Cutomeruser',component:CustomerRegisterationListComponent,canActivate:[AuthGuard],data: { title: 'CustomerUser', breadcrumb: 'CustomerUser' }},
 
  {path:'BuyerUser',component:BuyerRegistrationListComponent,canActivate:[AuthGuard],data: { title: 'UserRegistration', breadcrumb: 'UserRegistration' }},


  {path:'EMDList',component:EMDListComponent,canActivate:[AuthGuard],data: { title: 'EMDList', breadcrumb: 'EMDList' }},

  {path:'AddEMD',component:AddEMDComponent,canActivate:[AuthGuard],data: { title: 'AddEMD', breadcrumb: 'AddEMD' }},

  {path:'UpdateInventory',component:UpdateInventoryComponent,canActivate:[AuthGuard],data: { title: 'UpdateInventory', breadcrumb: 'UpdateInventory' }},
  {path:'UpdateInventoryImages',component:UpdateInventoryImagesComponent,canActivate:[AuthGuard],data: { title: 'UpdateInventory', breadcrumb: 'UpdateInventory' }},



  {path:'Settings',component:SettingsComponent,canActivate:[AuthGuard],data: { title: 'Settings', breadcrumb: 'Settings' }},
  {path:'OBSUpload',component:OBSExcelUploadComponent,canActivate:[AuthGuard],data: { title: 'OBS Upload', breadcrumb: 'OBS Upload' }},
  {path:'WinnerList',component:BidWinnerListComponent,canActivate:[AuthGuard],data: { title: 'Winner List', breadcrumb: 'Winner List' }},

  {path:'OBSApproval',component:ObsApprovalComponent,canActivate:[AuthGuard],data: { title: 'OBS Approval', breadcrumb: 'OBS Approval' }},

  {path:'AddFee',component:AddFeeComponent,canActivate:[AuthGuard],data: { title: 'AddFee', breadcrumb: 'AddFee' }},
  {path:'Feelist',component:FeelistComponent,canActivate:[AuthGuard],data: { title: 'Feelist', breadcrumb: 'Feelist' }},
  {path:'AddRegisterationFee',component:AddFeeComponent,canActivate:[AuthGuard],data: {title: 'AddFee',breadcrumb:'AddFee'}},

  {path:'LEADReport',component:LeadreportComponent,canActivate:[AuthGuard],data: { title: 'LEADReport', breadcrumb: 'LEADReport' }},
  {path:'MISReport',component:MISReportComponent,canActivate:[AuthGuard],data: { title: 'MISReport', breadcrumb: 'MISReport' }},
  {path:'ACRReport',component:AcrReportComponent,canActivate:[AuthGuard],data: { title: 'ACRReport', breadcrumb: 'ACRReport' }},





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
