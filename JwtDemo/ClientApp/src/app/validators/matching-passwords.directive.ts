
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';



export function matchingPasswordsValidator(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {

        var password = control.get('password')?.value;
        var passwordConfirmation = control.get('passwordConfirmation')?.value;
        return (password === passwordConfirmation) ? null : { notMatchingPasswords: true };
    };

}

//password strength we will see
// const value = control.value;

// if (!value) {
//     return null;
// }

// const hasUpperCase = /[A-Z]+/.test(value);

// const hasLowerCase = /[a-z]+/.test(value);

// const hasNumeric = /[0-9]+/.test(value);

// const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

// return !passwordValid ? { passwordStrength: true } : null;