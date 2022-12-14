import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-confirm',
  template: `<h1 matDialogTitle class="mb-05">{{ data.title }}</h1>
    <div mat-dialog-content class="mb-1">{{ data.message }}</div>
    

    <div mat-dialog-actions>
   
    <button 
    type="button" 
    mat-raised-button
    color="primary" 
    (click)="dialogRef.close(true)">Yes</button>
    &nbsp;
    <span fxFlex></span>
    <button 
    type="button"
    color="accent"
    mat-raised-button 
    (click)="dialogRef.close(false)">No</button>
    </div>`,
})
export class LogUotConfirmationWithtext {
  constructor(
    public dialogRef: MatDialogRef<LogUotConfirmationWithtext>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {}
}

// <label for="fname">Enter Remark:</label>
//     <input type="text" id="fname" name="fname">