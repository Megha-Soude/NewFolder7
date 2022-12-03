import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-show-image-popup',
  templateUrl: './show-image-popup.component.html',
  styleUrls: ['./show-image-popup.component.scss']
})
export class ShowImagePopupComponent implements OnInit {
  imagesrc: string;
  InventoryImages = [];
  myThumbnail: any;
  myFullresImage: any;
  constructor(public dialogRef: MatDialogRef<ShowImagePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog) { this.InventoryImages = data; }

  slideConfig = { "slidesToShow": 1, "slidesToScroll": 1, "infinite": true, autoplay: true, "fade": true, "arrows": false, };

  slideConfigThumb = { "slidesToShow": 3, "slidesToScroll": 1, autoplay: true, "infinite": true, vertical: true, "arrows": true, }   /* "asNavFor":"abc" */

  ngOnInit() {
    this.myThumbnail = this.InventoryImages;
    this.myFullresImage = this.InventoryImages;
  }

  close() {
    this.InventoryImages = [];
    this.imagesrc = null;
    this.dialogRef.close('close');
  }

  imageZoom() {
    this.zoomIn();
  }

  zoomIn() {
    ZoomIn(event);
    function ZoomIn(event) {
      var element = document.getElementById("overlay");
      element.style.display = "inline-block";
      var img = document.getElementById("imgZoom");
      var getimd = (<HTMLImageElement>img).src
      element.style.backgroundImage = "url('" + getimd + "')";
      var posX = event.offsetX ? (event.offsetX) : event.pageX - img.offsetLeft;
      var posY = event.offsetY ? (event.offsetY) : event.pageY - img.offsetTop;
      element.style.backgroundPosition = (-posX * 0.41) + "px " + (-posY * 0.34) + "px";
    }
  }

  zoomOut() {
    var element = document.getElementById("overlay");
    element.style.display = "none";
  }

}
