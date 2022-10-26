import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';



export function latitudeValidator(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
        const latitude = control.value;
        return (isFinite(latitude) && Math.abs(latitude) <= 90) ? null : { latitude: true };
    };
}