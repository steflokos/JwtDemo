import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";


export class ParentErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

      const isSubmitted = !!(form && form.submitted);
      const controlTouched = !!(control && (control.dirty || control.touched));
      const controlInvalid = !!(control && control.invalid);
      const parentInvalid = !!(control && control.parent && control.parent.invalid );
      return  (controlTouched && (controlInvalid || parentInvalid)) ; //isSubmitted || 

      //return controlTouched && parentInvalid ;
  }
}
