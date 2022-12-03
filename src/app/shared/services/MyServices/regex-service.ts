import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
// These regular expressions are all used for form validation
export class RegexService {
  constructor() { }

  // used for FirstName, LastName, City
  get HumanName() {
    return "^[a-zA-Z0-9-.'\\s]*$"; // only alphanumic and space . '
  }
  get Email() {
    return '^.+@.+\\..+$'; // contains @ and . with text surrounding
  }

  get Phone() {
    return '^[6-9][0-9]{9}$'; // max 20 chars, numbers and -
  }

  get Percentage() {
    return '^(100([\.][0]{1,})?$|[0-9]{1,2}([\.][0-9]{1,})?)$'
  }

  get Date() {
    return '^[0-9]{2}-[0-9]{2}-[0-9]{4}$'; // mm-dd-yyyy, all numbers
  }

  get Aadhar() {
    //return '[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$';
    return '[0-9]{12}';
  }
  get chequeNumber() {
    return '[0-9]{6}';
  }
  getZip(countryCode = 'US') {
    switch (countryCode) {
      case 'CA':
        return '^[A-Za-z]\\d[A-Za-z][ -]?\\d[A-Za-z]\\d$';
      case 'US':
        return '^[0-9]{5}$'; // US zip - five numbers
    }
  }
  get Pan(){
    return '^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$'
    //return '^[A-Za-z]{5}\d{4}[A-Za-z]{1}?$'
  }
  get Ifsc(){
    return '^[A-Za-z]{4}[a-zA-Z0-9]{7}$'
  }
  
  get GstNo(){
  return '^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}Z[0-9a-zA-Z]{1}$'
  //return '^[0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1}'
  }
}
