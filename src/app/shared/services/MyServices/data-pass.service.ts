import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataPassService {

  private data = {};
  private stockdata = {};
  private DepositeDatadata = {};
  private Userdata = {};
  private BidInventory = {};

  private BidSettelMentData = {};

  private RefundData = {};
  private BankData = {};


  setOption(value) {
    this.data = value;
  }

  getOption() {
    return this.data;
  }

  resetOption() {
    this.data = "";
  }


  setStockData(value) {
    this.stockdata = value;
  }

  getStockData() {
    return this.stockdata;
  }

  resetStockData() {
    this.stockdata = "";
  }

  Auctiondata: any;

  setAuctioncode(value) {
    this.Auctiondata = value;
  }
  getAuctioncode() {
    return this.Auctiondata;
  }


  //Deposite Data 

  setDepositeData(value) {
    this.DepositeDatadata = value;
  }

  getDepositeData() {
    return this.DepositeDatadata;
  }


  //Refund Data 
  setRefundData(value) {
    this.RefundData = value;
  }

  getRefundData() {
    return this.RefundData;
  }


  //BidSettelMent Master 

  setBidSettelmentData(value) {
    this.BidSettelMentData = value;
  }

  getsetBidSettelmentData() {
    return this.BidSettelMentData;
  }


  //UserData (DLR/ADdmin)


  setUserData(value) {
    this.Userdata = value;
  }

  getUserData() {
    return this.Userdata;
  }


  //Pass data Bid List To BidInventory

  vehicleData = []
  setVehiceldetail(value) {
    this.vehicleData = value;
  }

  getVehiceldetail() {
    return this.vehicleData;
  }


  BidderData: any
  AuctionType: any
  DisplayAcutionTitle: any
  setBiiderData(value, type, DisplayAcutionTitle) {
    this.BidderData = value;
    this.AuctionType = type;
    this.DisplayAcutionTitle = DisplayAcutionTitle
  }

  UserData: any
  SetGetUserInfo(Data) {
    this.UserData = Data
  }


  GetUserInfo() {
    return this.UserData
  }

  getDisplayTitle() {
    return this.DisplayAcutionTitle;
  }

  getBiiderData() {
    return this.BidderData;
  }

  getBiiderType() {
    return this.AuctionType;
  }

  setBidInventoryata(value) {
    this.BidInventory = value;
  }

  sGetBidInventoryata() {
    return this.BidInventory;
  }

  //Bank Detail Data 
  setBankDetailData(value) {
    this.BankData = value;
  }

  getBankDetailData() {
    return this.BankData;
  }
  resetBankDetailData() {
    return "";
  }




  private approvalStageMessage = new BehaviorSubject('');
  currentApprovalStageMessage = this.approvalStageMessage.asObservable();
  cast = this.approvalStageMessage.asObservable();

  constructor() { }
  updateApprovalMessage(message: string) {
    this.approvalStageMessage.next(message)
  }


  getAuditButtonStatus(data) {
    this.approvalStageMessage.next(data);
  }

  public GetPageVlidation(value) {
    var Valid;
    Valid = false
    var list = JSON.parse(localStorage.getItem('PageDetails'))
    for (let entry1 of list) {
      for (let entry2 of entry1.page_detail) {
        if (entry2.page_url == value) {
          Valid = true
        }
      }

    }

    return Valid

  }


  public Permission(value) {
    var Valid;
    Valid = false
    var list = JSON.parse(localStorage.getItem('PageDetails'))
    var data2 = list.filter(book => book.page_url === '/' + value);
    return data2[0].page_detail
  }

}