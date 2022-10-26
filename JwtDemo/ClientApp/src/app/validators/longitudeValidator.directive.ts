import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';



export function longitudeValidator(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
        const longitude = control?.value;
        return (isFinite(longitude) && Math.abs(longitude) <= 180) ? null : { longitude: true };
    };
}