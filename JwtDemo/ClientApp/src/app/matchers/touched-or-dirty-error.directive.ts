import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";


export class TouchedOrDirtyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

      const isSubmitted = !!(form && form.submitted);
      const controlTouched = !!(control && (control.dirty || control.touched));
      const controlInvalid = !!(control && control.invalid);
      return  isSubmitted || (controlTouched && controlInvalid ) ;//isSubmitted || petouse kokkina me to pou ekane submit 
      //return controlTouched && parentInvalid ;
  }
}