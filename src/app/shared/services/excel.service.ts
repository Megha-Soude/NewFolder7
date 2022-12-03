import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { AppLoaderService } from './app-loader/app-loader.service';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor(private loader: AppLoaderService) { }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    this.loader.close();
   // worksheet['!cols'].push({ width: 20 })
   var wscols = [
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:30}
    
];

worksheet['!cols'] = wscols;

this.loader.close()
 
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportAsExcelFileTracking(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
   
    this.loader.close()
   // worksheet['!cols'].push({ width: 20 })

   var wscols = [
    {wch:30},
    {wch:30},
    {wch:50},
    {wch:15},
    {wch:10},
    {wch:50},
    {wch:10},
    {wch:50},
    {wch:20},
    {wch:20},
    {wch:20},

    
    
];

worksheet['!cols'] = wscols;


 
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  public exportAllAsExcelFileTracking(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
   
    this.loader.close()
   // worksheet['!cols'].push({ width: 20 })

   var wscols = [
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:50},
    {wch:50},
    {wch:20},
    {wch:20},
    {wch:20},
    {wch:20},
    {wch:20},
    {wch:20},

    
    
];

worksheet['!cols'] = wscols;


 
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }


  public exportCancellationAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    this.loader.close();
    
   // worksheet['!cols'].push({ width: 20 })

   var wscols = [
    {wch:30},
    {wch:30},
    {wch:50},
    {wch:30},
    {wch:30},
    {wch:30},
    {wch:50},
    {wch:50},
    {wch:20},
    {wch:20},
    {wch:30},
    {wch:50},
    {wch:50},
    {wch:50},
    {wch:50},
    {wch:50},
    {wch:50},
    {wch:50},
    {wch:50},
    {wch:50},
    {wch:50},
    {wch:50},
    {wch:50},
    {wch:50},
    {wch:50},
    {wch:50},
    {wch:50},
    {wch:50},
    {wch:50},
    {wch:50},
    
];

worksheet['!cols'] = wscols;

this.loader.close()
 
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    this.loader.close()
     const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
     FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }
  }
