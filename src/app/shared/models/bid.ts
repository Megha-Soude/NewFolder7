
export interface Bid {
    user_code: string;
    dealer_code: string;
}


export interface BidList {
    pin_code: string;
    deposit_amount: number;
    first_name: string;
    transaction_id: number;
    auction_detail_code: string;
    last_name: string;
    address2: string;
    mobile_no: string;
    address1: string;
    min_bid_amount: number;
    district: string;
    bid_amount: number;
    state: string;
    status: string;
    is_winner: boolean;
    user_id: number;
    city: string;
    bid_created_at: string;
    max_bid_amount: number;
   }

   export interface BidWinnerList {
    auction_detail_code: string;
    first_name: string;
    mode: string;
    dealer_distributor_code: string;
    dealer_user_code: string;
    dealer_status: string;
    dealer_remarks: string;
    status: string;
    dealer_position: string;
    dealer_remark_id: number;
    mobile_no: string;
    created_at: string;
    buyer_remark_id: number;
    is_settle: boolean;
    payable_amount: number;
    tran_number: string;
    buyer_user_code: string;
    inventory_title: string;
    email_id: string;
    deposit_amount: number;
    dealer_username: string;
    bid_document_path: string;
    dealer_remark_drp_value: string;
    inventory_code: string;
    buyer_status: string;
    last_name: string;
    buyer_remarks: string;
    bid_winner_id:number;
    buyer_remark_drp_value: string;
    bid_amount: number;
    }

//    "auction_detail_code":"AUDE00006",
//    "first_name":"Tushar",
//    "mode":null,
//    "dealer_distributor_code":"DISTCODE",
//    "dealer_user_code":"CUST00063",
//    "dealer_status":null,
//    "dealer_remarks":null,
//    "status":"BID_WINNER",
//    "dealer_position":"manager",
//    "dealer_remark_id":1,
//    "mobile_no":"6666666666",
//    "created_at":"2020-03-25T15:24:20.107003Z",
//    "buyer_remark_id":1,
//    "is_settle":false,
//    "payable_amount":0.0,
//    "tran_number":null,
//    "buyer_user_code":"CUST00081",
//    "inventory_title":"Tata Ace 2012 Model",
//    "email_id":"vaghdharer123456@gmail.com",
//    "deposit_amount":25000.0,
//    "dealer_username":"UY1_1000870",
//    "bid_document_path":"",
//    "dealer_remark_drp_value":"None",
//    "inventory_code":"INVE00008",
//    "buyer_status":null,
//    "last_name":"Vaghdhare",
//    "buyer_remarks":null,
//    "bid_winner_id":131,
//    "buyer_remark_drp_value":"None",
//    "bid_amount":130000.0
