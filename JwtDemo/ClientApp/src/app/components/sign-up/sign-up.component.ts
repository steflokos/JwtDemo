import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';

import { usernameAlreadyExistsValidator } from 'src/app/async-validators/username-already-exists.directive';
import { ParentErrorStateMatcher } from 'src/app/matchers/parent-error.directive';
import { TouchedOrDirtyErrorStateMatcher } from 'src/app/matchers/touched-or-dirty-error.directive';

import { SignUpRequest } from 'src/app/models/sign-up-request';
import { matchingPasswordsValidator } from 'src/app/validators/matching-passwords.directive';
import { AuthService } from 'src/app/_services/auth.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit {

  signUpForm: FormGroup = this.formBuilder.group({
    username: new FormControl('', [Validators.minLength(2), Validators.required,], [usernameAlreadyExistsValidator(this.authService)]),
    passwordGroup: this.formBuilder.group({
      password: new FormControl('', [Validators.minLength(2), Validators.required]),
      passwordConfirmation: new FormControl('', []),//Validators.minLength(2), Validators.required
    }, { validators: matchingPasswordsValidator() }),
    firstName: new FormControl('', [Validators.minLength(2), Validators.required]),
    lastName: new FormControl('', [Validators.minLength(2), Validators.required]),
    contactNumber: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]),
    email: new FormControl('', [Validators.email, Validators.required]),
  },
  );

  signedIn = this.authService.signedIn$;
  errorMessage: string = '';
  signUpFailed: boolean = false;
  signedUp: boolean = false;
  hidePassword: boolean = true;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) {
    // this.signUpRequest.role = [Role.Visitor];

  }

  ngOnInit(): void {

  };

  onSubmit(): void {

    var formValue = this.signUpForm.value;
    var spreadedForm = { ...formValue };
    spreadedForm.password = formValue.passwordGroup.password;
    spreadedForm.passwordGroup = null;


    var signUpRequest: SignUpRequest = new SignUpRequest(<SignUpRequest>spreadedForm);


    this.authService.signUp(signUpRequest).subscribe({
      next: () => {

        this.signedUp = true;
        this.signUpFailed = false;

      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.signUpFailed = true;

      }
    });
  };

  parentErrorStateMatcher = new ParentErrorStateMatcher();
  touchedOrDirtyErrorStateMatcher = new TouchedOrDirtyErrorStateMatcher();

  getUsernameErrorMessage() {

    if (this.username?.hasError('required')) {
      return 'You must enter a value.';
    }
    else if (this.username?.hasError('minlength')) {
      return 'Username must be at least 3 characters.';
    }
    else if (this.username?.hasError('alreadyExists')) {
      return 'Username already exists.';
    }
    return '';
  }

  getPasswordErrorMessage() {

    if (this.password?.hasError('required')) {
      return 'You must enter a value.';
    }
    else if (this.password?.hasError('minlength')) {
      return 'Password must be at least 3 characters.';
    }
    return '';
  }

  getPasswordConfirmationErrorMessage() {



    // if (this.passwordConfirmation?.hasError('required')) {
    //   return 'You must enter a value.';
    // }
    // else if (this.passwordConfirmation?.hasError('minlength')) {
    //   return 'Password must be at least 3 characters.';
    // }

    if (this.signUpForm?.get('passwordGroup')?.hasError('notMatchingPasswords')) {

      return 'Passwords do not match.';
    }

    return '';
  }


  getFirstNameErrorMessage() {
    if (this.firstName?.hasError('required')) {
      return 'You must enter a value.';
    }
    else if (this.firstName?.hasError('minlength')) {
      return 'First name must be at least 3 characters.';
    }
    return '';
  }


  getLastNameErrorMessage() {

    if (this.lastName?.hasError('required')) {
      return 'You must enter a value.';
    }
    else if (this.lastName?.hasError('minlength')) {
      return 'Last name must be at least 3 characters.';
    }
    return '';
  }

  getEmailErrorMessage() {

    if (this.email?.hasError('required')) {
      return 'You must enter a value.';
    }
    else if (this.email?.hasError('email')) {
      return 'Invalid email was given.';
    }
    return '';
  }

  getContactNumberErrorMessage() {

    if (this.contactNumber?.hasError('required')) {
      return 'You must enter a value.';
    }
    else if (this.contactNumber?.hasError('minlength') || this.contactNumber?.hasError('maxlength')) {
      return 'Number must be 10 digits.';
    }
    else if (this.contactNumber?.hasError('pattern')) {
      return 'invalid number format was given.';
    }
    return '';
  }


  get username() {
    return this.signUpForm.get('username');
  }
  get password() {
    return this.signUpForm.get('passwordGroup.password');
  }

  get passwordConfirmation() {
    return this.signUpForm.get('passwordGroup.passwordConfirmation');
  }
  get firstName() {
    return this.signUpForm.get('firstName');
  }
  get lastName() {
    return this.signUpForm.get('lastName');
  }
  get contactNumber() {
    return this.signUpForm.get('contactNumber');
  }
  get email() {
    return this.signUpForm.get('email');
  }
  
}


