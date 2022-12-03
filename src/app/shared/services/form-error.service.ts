import { Injectable } from '@angular/core';
import { FormControl, FormGroup, AbstractControl, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AppFormErrorService {
  displayFormErrors(form: FormGroup) {
    Object.keys(form.controls).forEach((key) => {
      form.get(key).markAsDirty();
    });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: false });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((element) => {
          this.validateAllFormFields(element as FormGroup);
        });
      }
    });
  }

  hasInvalidEmailError(input: FormControl | AbstractControl): boolean {
    return (
      (input.hasError('required') || input.hasError('email')) && input.dirty
    );
  }

  hasPasswordMismatchError(form: FormGroup) {
    return form.hasError('ocMatchFields');
  }

  hasRequiredError(controlName: string, form: FormGroup) {
    return (
      form.get(controlName).hasError('required') && form.get(controlName).dirty
    );
  }

  hasDateError(controlName: string, form: FormGroup) {
    return (
      form.get(controlName).hasError('DateError') && form.get(controlName).dirty
    );
  }

  hasPatternError(controlName: string, form: FormGroup) {
    return (
      form.get(controlName).hasError('pattern') && form.get(controlName).dirty
    );
  }

  getProductQuantityError(
    controlName: string,
    form: FormGroup
  ): { message: string; outOfStock: boolean } {
    return form.get(controlName).getError('ProductQuantityError');
  }

  hasStrongPasswordError(controlName: string, form: FormGroup) {
    return form.get(controlName).hasError('strongPassword');
  }

  hasMinLengthError(controlName: string, form: FormGroup) {
    return (
      form.get(controlName).hasError('minlength') && form.get(controlName).dirty
    );
  }
}
