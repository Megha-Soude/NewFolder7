import { DateTimeAdapter } from "ng-pick-datetime";

export interface SubCategoryDetails {
  cat_id: number;
  subcat_id: number;
}


export interface ElementData {
  element_id: number;
  element_name: string;
}

export interface ControlBind {
  catId: number;
  subcat_id: number;
  subcat_detail_id: number;
}


export interface CotrolData {
  Id: number;
  ControlName: string;
}

//  export interface InventoryMaster {
//   user_id: number;
//   cat_id: number;
//   sub_cat_id: number;
//   control_details: ControlDetail[];
//   CreatedBy: string;
//   }

export interface InventoryMaster {
  id:number;
  user_id: number;
  cat_id: number;
  sub_cat_id: number;
  sub_cat_detail_id: number;
  control_details: ControlDetail[];
  CreatedBy: string;
  is_editable:string;
  vc_number:string;
}



export interface ControlDetail {
  cat_mapid: number;
  control_detail_id: number;
  control_detail_value: string;
  element_detail_value: string;
}

export interface InventoryList {
  user_id: number;
  action_type: string;
  first_name: string;
  last_name: string;
  cat_id: number;
  cat_name: string;
  subcat_id: number;
  subcat_name: string;
  user_category: string;
  inventory_status: string;
  approved_status: string;
  inventory_id: number;
  inventory_code: string;
  control_detail: ControlDetails[];
  offset: number;
  visibility:string;
}
export interface ControlDetails {
  control_detailid: number;
  control_detail_value: string;
}

// export interface InventoryDocument {
//   inventory_code: string;
//   user_code: string;
//   contract_type: string;
//   cover_image: string;
//   images_or_documents: string;
//   }



export interface AuctionMaster {
  user_id: number;
  auction_id: number;
  auction_code: string;
  auction_title: string;
  auction_type: string;
  start_at: string;
  end_at: string;
  start_time: string;
  end_time: string;
  pincode:string;
  mobile_number:string;
  min_bid_amount:string;
  max_bid_amount:string;
  location_address: string;
  city: string;
  state: string;
  district: string;
  taluka: string;
  postal_code: string;
  contact_no: string;
  auction_status: string;
  auction_remark: string;
  auction_price_type: string;
  bid_type: string;
  deposit_amount: string;
  auction_details: auction_details[];
  offset: number;
}

export interface auction_details {
  auction_detail_id?: number;
  auction_detail_code?: string;
  auction?: number;
  inventory_id:number;
  auction_code?: string;
  inventory?: string;
  inventory_code?: string;
  min_bid_amount?: string;
  max_bid_amount?: string;
  start_at?: string;
  end_at?: string;
}
export interface UploadDocument {
  code: string;
  contract_type: string;
  image: string;
  document: string;

}

export interface InventoyDataList {
  inventory_id: number;
  catid: number;
  cat_name: string;
  sub_cat_id: number;
  sub_cat_name: string;
  user_id: number;
  first_name: string;
  last_name: string;
  auction_type: string;
  approved_status: string;
  inventory_documents: InventoryDocuments[]
  control_detail: ControlDetails[]
}

export interface InventoryDocuments {
  alt: string;
  file_type: string;
  is_cover: boolean;
  path: string;
}


export interface ControlDetails {
  element_detail_value: string;
  control_detail_id: string;
  control_detail_value: string;
}

export interface ApproveData {
  id: string;
}


export interface FormArrayForFile {
  stage: string;
  formData: any[];
}

export interface VehicleData {
  vehicle_info: VehicleInfo;
}

export interface VehicleInfo {
  asset_refur_status: string;
  contact_id: string;
  ppl: string;
  contact_first_name: string;
  vc_id: string;
  lob: string;
  contact_cell_phone_number: string;
  asset_pr_rep_manl_flag: string;
  vc_engine_standard: string;
  vehicle_account: string;
  asset_ref_logical_status: string;
  pl: string;
  asset_rto_fitness_certificate: string;
  jdp_flg: string;
  asset_road_tax_valid_date: string;
  contact_email: string;
  vehicle_registered_by: string;
  asset_road_tax_type: string;
  asset_supplier_ou_id: string;
  asset_tm_ntml_pl: string;
  name: string;
  contact_last_name: string;
  asset_cfg_valdn_stat_cd: string;
  asset_insurance_type: string;
  asset_fuel_cd: string;
  asset_ref_order_id: string;
  vc_number: string;
  asset_atx_build_date: string;
  last_service_km: string;
  asset_insurance_valid_date: string;
  account_id: string;
  asset_permit: string;
  fuel_type: string;
  asset_regis_date: string;
  asset_rto_fitness_valid_date: string;
  asset_hrs_reading: string;
  asset_rc_book: string;
  chassis_num: string;
  account_main_phone_number: string;
  first_sale_dt: string;
  bu: string;
  registration_num: string;
  asset_place: string;
  vehicle_type: string;
  asset_body_type: string;
  asset_efficiency_ratings: string;
  vc_description: string;
}

export interface AuctionCartData {
  inventory_id: number;
  auction_detail_code:string
  inventory_code: string;
  inventory_title: string;
  cover_image: string;
  interval:any;
  inv_type: string
  category_type: string;
  subcategory_type: string;
  inventory_status: string;
  approved_status: string;
  start_at: string;
  actual_end_at: string
  min_bid_amount: string;
  max_bid_amount: string;
  total_bids:string;
  disabled:boolean;
}

export interface AuctionInventoryList {
  inventory_id: number;
  inventory_code: string;
  inventory_title: string;
  inv_type: string
  category_type: string;
  subcategory_type: string;
  start_at: string;
  start_time: string;
  end_at: string
  min_bid_amount: string;
  max_bid_amount: string
  approved_status: string;
  inventory_status: string
  cover_image: string;
  created_at: string

}
export interface AddAuctionInventoryList {
  cover_image: string;
  inventory_id: string;
  inventory_code: string;
  inventory_title: string;
  category_type: string;
  subcategory_type: string;
  start_at: string;
  start_time: string;
  end_at: string
  min_bid_amount: string;
  max_bid_amount: string
}


export interface ApproveRefundData {
  deposit_id: number;
  status:string;
}