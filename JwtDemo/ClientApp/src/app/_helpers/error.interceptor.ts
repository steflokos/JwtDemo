
import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { AuthService } from '../_services/auth.service';

import { BehaviorSubject, Observable, throwError, lastValueFrom, from } from 'rxjs';
import { catchError, filter, switchMap, take, map, first, last } from 'rxjs/operators';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Role } from 'src/app/models/role';
import { WorkerManagerService } from '../_services/worker-manager.service';




const emptyRoleArray: Role[] = [];

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {


  constructor(private authService: AuthService, private router: Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {


    return next.handle(request)
      .pipe(catchError(error => {
        if (error instanceof HttpErrorResponse && ((!request.url.includes('account/sign-in') && !request.url.includes('account/sign-out') && error.status === 401) || error.status === 403)) {
          this.handleUnauthorized();
   
        }
        return throwError(error);

        //return throwError(() => new Error(error.message));
      }));


  }

  private handleUnauthorized() {
    this.authService.signOut().subscribe({
      next: () => {
        this.authService.signedInSetNext(false);
        this.authService.userRolesSetNext(emptyRoleArray);
        this.router.navigate(['/sign-in'], {});
      },
      error: (err) => { console.error(err); }
    });

  }
}


export const errorInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
];