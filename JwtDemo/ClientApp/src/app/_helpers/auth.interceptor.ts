
import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { TokenStorageService } from '../_services/token-storage.service';
import { AuthService } from '../_services/auth.service';

import { BehaviorSubject, Observable, throwError, lastValueFrom } from 'rxjs';
import { catchError, filter, switchMap, take, map, first } from 'rxjs/operators';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Role } from 'src/app/models/role';



const emptyRoleArray: Role[] = [];

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private tokenService: TokenStorageService, private authService: AuthService, private router: Router) {

  }


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let authRequest = request;

    const token = this.tokenService.getAccessToken();

    if (token != null) {
      authRequest = this.addTokenHeader(request, token);
    }

    return next.handle(authRequest).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && !authRequest.url.includes('account/sign-in') && error.status === 401) {
        console.error("mpike edo");
        return this.handle401Error(authRequest, next);
      }
      else if (error instanceof HttpErrorResponse && error.status === 403) {
        this.handle403Error();
      }


      return throwError(error);
      //return throwError(() => new Error(error.message));
    }));

  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token = this.tokenService.getRefreshToken();
      if (token) {

        return this.authService.refreshToken(token).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.tokenService.saveAccessToken(token.accessToken);
            this.refreshTokenSubject.next(token.accessToken);
            return next.handle(this.addTokenHeader(request, token.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.authService.signOut();
            this.router.navigate(['/sign-in'],{});
            return throwError(() => new Error(err));
          })
        );
      }
      else {
        this.isRefreshing = false;
        this.router.navigate(["sign-in"]);
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      first(),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private handle403Error() {
    console.log("mpike 403");

    this.authService.signOut();
    this.router.navigate(['/sign-in'], {});
  }



  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({ headers: request.headers.set(environment.tokenHeader, environment.bearerHeader + ' ' + token) });
  }
}



export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];