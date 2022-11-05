
import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { TokenStorageService } from '../_services/token-storage.service';
import { AuthService } from '../_services/auth.service';

import { BehaviorSubject, Observable, throwError, lastValueFrom, from } from 'rxjs';
import { catchError, filter, switchMap, take, map, first, last } from 'rxjs/operators';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Role } from 'src/app/models/role';
import { WorkerManagerService } from '../_services/worker-manager.service';




const emptyRoleArray: Role[] = [];

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService, private router: Router, private workerService: WorkerManagerService) {
  }


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log("mpike interc");
    return from(this.handleRequest(request, next));
   // return this.handleRequest(request, next)

  }

  async handleRequest(req: HttpRequest<any>, next: HttpHandler) {

    let authRequest = req;

    const actExists = await this.workerService.accessTokenExists();
    console.log("act exists",actExists);
    if (actExists) {
      console.log("req before",authRequest);
      authRequest = await this.addTokenHeader(req);
      
      console.log("req after",authRequest);
    }
    console.log("eftase edo");
    
    return await lastValueFrom(next.handle(authRequest)
      .pipe(catchError((error) => {
        console.log("mpike edo prin to 401",error)

        if (error instanceof HttpErrorResponse && !authRequest.url.includes('account/sign-in') && error.status === 401) {
          console.log("mpike 401");
          this.handle401Error(authRequest, next);
        }
        else if (error instanceof HttpErrorResponse && error.status === 403) {
       
          this.handle403Error(authRequest, next);
        }
        console.log("eftase prin to throw")
        return throwError(error);
      }
      )));

 


  }


  //   use refreshTokenSubject to track the current refresh token value. It is null if no token is currently available.
  // For example, when the refresh progress is processing (isRefreshing = true),
  // we will wait until refreshTokenSubject has a non-null value (new Access Token is ready and we can retry the request again).

  private async handle401Error(request: HttpRequest<any>, next: HttpHandler) {

    if (!this.isRefreshing) {

      this.isRefreshing = true;
      this.refreshTokenSubject.next(false);

      const tokenExists = await this.workerService.refreshTokenExists();

      if (tokenExists) {
        await this.workerService.refreshToken();
        this.isRefreshing = false;
        this.refreshTokenSubject.next(true);

        const newReq =await this.addTokenHeader(request);
        return next.handle(newReq);

        // return this.authService.refreshToken(token).pipe(
        //   switchMap((token: any) => {
        //     this.isRefreshing = false;
        //     this.refreshTokenSubject.next(true);
        //     return next.handle(this.addTokenHeader(request));
        //   }),
        //   catchError((err) => {
        //     this.isRefreshing = false;
        //     this.authService.signOut();
        //     this.router.navigate(['/sign-in'], {});
        //     return throwError(() => new Error(err));
        //   })
        // );
      }
      else {
        this.isRefreshing = false;
        this.router.navigate(["sign-in"]);
      }

    }

    console.log("mpike edo ");

    return next.handle(request);

    // return this.refreshTokenSubject.pipe(
    //   filter(token => token !== null),
    //   first(),
    //   switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    // );
  }

 
  private async handle403Error(request: HttpRequest<any>, next: HttpHandler) {
    console.log("mpike 403");
    await this.authService.signOut();
    this.router.navigate(['/sign-in'], {});
    return next.handle(request);
  }



  private addTokenHeader(request: HttpRequest<any>) {

    return this.workerService.setHeaders(request);
    //return request.clone({ headers: request.headers.set(environment.tokenHeader, environment.bearerHeader + ' ' + token) });
  }
}



export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];