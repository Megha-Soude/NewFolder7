import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from 'app/shared/services/MyServices/authorize.service';
import { DataPassService } from 'app/shared/services/MyServices/data-pass.service';
import Swal from 'sweetalert2';

import { CommonService } from '../../../../shared/services/MyServices/common.service'

import { Page } from '../../../../../../src/app/shared/models/PaginationPage'

@Component({
  selector: 'app-bid-winners',
  templateUrl: './bid-winners.component.html',
  styleUrls: ['./bid-winners.component.scss']
})
export class BidWinnersComponent implements OnInit {

  constructor(
    private DataPassServic: DataPassService,
    private CommonService: CommonService,
    private Auth: AuthorizeService,) { }
    Accountpk:any
  ngOnInit() {
    this.Accountpk = this.Auth.GetAccountPk()

   // this.getBidList()
  }

}
