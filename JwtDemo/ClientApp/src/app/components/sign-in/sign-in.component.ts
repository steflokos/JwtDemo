import { Component, Injectable, NgModule, OnDestroy, OnInit } from '@angular/core';
import { SignInRequest } from 'src/app/models/sign-in-request';
import { AuthService } from 'src/app/_services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { Role } from 'src/app/models/role';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkerManagerService } from 'src/app/_services/worker-manager.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
@Injectable({
  providedIn: 'root'
})

export class SignInComponent implements OnInit, OnDestroy {


  hidePassword: boolean = true;
  signInFailed: boolean = false;
  signedIn = this.authService.signedIn$;
  errorMessage: string = '';
  signInSubscription: Subscription = Subscription.EMPTY;

  userRoles$ = this.authService.userRoles$;
  authUsername = this.authService.getWhoAmI();
  signInForm: FormGroup = this.formBuilder.group({
    username: new FormControl('', [Validators.minLength(2), Validators.required]),
    password: new FormControl('', [Validators.minLength(2), Validators.required])
  });
  returnUrl: string = '/';


  constructor(private router: Router, private authService: AuthService, private formBuilder: FormBuilder, private tokenStorage: TokenStorageService, private route: ActivatedRoute, private workerService: WorkerManagerService) {

  }



  ngOnInit() {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    console.log("sto init", this.returnUrl);
  }

  async onSubmit() {

    var signInRequest: SignInRequest = new SignInRequest(<SignInRequest>this.signInForm.value);
    this.signInSubscription = this.authService.signIn(signInRequest)
      .subscribe({
        next: (roles: any): void => {

          this.authService.userRolesSetNext(roles);
          this.signInFailed = false;
          this.signedIn = of(true);
          this.authService.signedInSetNext(true);

          if (this.returnUrl === "/") {
            console.log("returnurl", this.returnUrl);
            if (!roles || roles.length <= 0) {
              this.router.navigate(['/visitor'], {});
            }
            else if (roles.includes(Role.Admin)) {
              this.router.navigate(['/admin'], {});
            }
            else if (roles.includes(Role.User)) {
              this.router.navigate(['/user'], {});
            }
          }
          else {
            console.log("return url", this.returnUrl);
            this.router.navigateByUrl(this.returnUrl);
          }
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          this.signInFailed = true;
        },

      });

  }

  ngOnDestroy(): void {
    this.signInSubscription.unsubscribe();
  }


  getUsernameErrorMessage() {
    if (this.username?.hasError('required')) {
      return 'You must enter a value.';
    }
    else if (this.username?.hasError('minlength')) {
      return 'Username must be at least 3 characters.';
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

  get username() {
    return this.signInForm.get('username'); //kanonika gia to value prostheteis .value
  }

  get password() {
    return this.signInForm.get('password');
  }

}
