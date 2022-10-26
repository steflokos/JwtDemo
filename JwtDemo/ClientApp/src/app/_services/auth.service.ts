import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SignUpRequest } from 'src/app/models/sign-up-request';
import { SignInRequest } from 'src/app/models/sign-in-request';
import { Role } from 'src/app/models/role';
import { TokenStorageService } from './token-storage.service';
import { JsonWebToken } from 'src/app/models/json-web-token';
import { Router } from '@angular/router';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  
};
const emptyRoleArray: Role[] = [];




@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService, private router: Router) { }

  tokensExist = this.tokenStorage.getAccessToken() !== null && this.tokenStorage.getRefreshToken() !== null;
  private _signedIn = new BehaviorSubject(this.tokensExist);
  private _signedIn$ = this._signedIn.asObservable();

  private _userRoles = new BehaviorSubject(this.getUserRoles());
  private _userRoles$ = this._userRoles.asObservable();


  signIn(signInRequest: SignInRequest) {

    return this.http.post(environment.accountAPI + 'sign-in', JSON.stringify(signInRequest), httpOptions);
  }

  signUp(signUpRequest: SignUpRequest) {

    return this.http.post(environment.accountAPI + 'sign-up', JSON.stringify(signUpRequest), httpOptions);
  }

  signOut() {
    return this.cancelToken();
  }


  refreshToken(token: string) {
    return this.http.post(environment.refreshTokenAPI + 'refresh/' + token, JSON.stringify(token), httpOptions);
  }

  cancelToken() {
    return this.http.post(environment.accessTokenAPI + 'cancel', httpOptions);
  }

  revokeToken(token: string) {
    return this.http.post(environment.refreshTokenAPI + 'revoke/' + token, {
      refreshToken: token
    }, httpOptions);
  }


  checkRefreshTokenExpiration(token: string): Observable<boolean> {
    return this.http.get<boolean>(environment.refreshTokenAPI + 'is-active/' + token, httpOptions);
  }

  checkAlreadyExistingUsername(username: string): Observable<boolean> {

    return this.http.get<boolean>(environment.userManagementAPI + 'already-used/' + username, httpOptions);
  }

  getUserRoles() {
    const accessToken = this.tokenStorage.getAccessToken();
    if (accessToken) {
      let decodedJwt: JsonWebToken = this.parseJwt(accessToken);
      return decodedJwt.role;
    }
    else return emptyRoleArray;
  }


  getWhoAmI() {
    return this.http.get(environment.userManagementAPI + 'who-am-i',{responseType: 'text' as 'text'});
  }



  private parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload) as JsonWebToken;
  };



  public get signedIn$() {
    // return of((this.tokenStorage.getAccessToken() !== null && this.tokenStorage.getRefreshToken() !== null));

    return this._signedIn$;
  }

  public signedInSetNext(value: boolean) {
    this._signedIn.next(value);
  }

  public get userRoles$() {
    return this._userRoles$;
  }


  public userRolesSetNext(value: Role[]) {
    this._userRoles.next(value);
  }
}