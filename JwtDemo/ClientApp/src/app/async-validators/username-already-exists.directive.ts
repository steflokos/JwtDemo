import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { map, Observable } from 'rxjs';


export function usernameAlreadyExistsValidator(authService: AuthService):AsyncValidatorFn {

  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return authService.checkAlreadyExistingUsername(control.value).pipe(
      map((result: boolean) => { return result ? { alreadyExists: true } : null; }));

    // const forbidden = this.authService.checkForbiddenUsername(control.value).subscribe();
    // return forbidden ? { forbiddenName: { value: control.value } } : null;
  };

}
