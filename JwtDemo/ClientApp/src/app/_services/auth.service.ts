import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, from, lastValueFrom, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SignUpRequest } from 'src/app/models/sign-up-request';
import { SignInRequest } from 'src/app/models/sign-in-request';
import { Role } from 'src/app/models/role';
import { TokenStorageService } from './token-storage.service';
import { JsonWebToken } from 'src/app/models/json-web-token';
import { Router } from '@angular/router';
import { WorkerManagerService } from './worker-manager.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

};
const emptyRoleArray: Role[] = [];




@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnInit {

  private _signedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _signedIn$: Observable<boolean> = this._signedIn.asObservable();

  private _userRoles: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>(emptyRoleArray);
  private _userRoles$: Observable<Role[]> = this._userRoles.asObservable();
  //this.workerService.getRoles()
  // from(new Promise<Role[]>(resolve => resolve(emptyRoleArray)));;
  constructor(private http: HttpClient, private router: Router, private workerService: WorkerManagerService) {

    this.workerService.tokenExist().then(
      (tokenExist: boolean) => {
        this._signedIn.next(tokenExist);// = new BehaviorSubject<boolean>();
        //this._signedIn$ = this._signedIn.asObservable();
      }
    );

    this.workerService.getRoles().then(

      (roles: Role[]) => {
        //console.log("apo constr");
        this._userRoles.next(roles);//new BehaviorSubject<Role[]>(roles);
        // this._userRoles$ = this._userRoles.asObservable();
      }
    );
  }

  ngOnInit(): void {
    // console.log("mpike");

    // this.workerService.tokenExist().then(
    //   (tokenExist: boolean) => {
    //     this._signedIn = new BehaviorSubject<boolean>(tokenExist);
    //     this._signedIn$ = this._signedIn.asObservable();
    //   }
    // )

    // this.workerService.getRoles().then(
    //   (roles: Role[]) => {
    //     this._userRoles = new BehaviorSubject<Role[]>(roles);
    //     this._userRoles$ = this._userRoles.asObservable();
    //   }
    // )



  }


  signIn(signInRequest: SignInRequest) {

    return this.workerService.signIn(signInRequest);
    // await new Promise(f => setTimeout(f, 1000));
    //return this.http.post(environment.accountAPI + 'sign-in', JSON.stringify(signInRequest), httpOptions);
  }

  signUp(signUpRequest: SignUpRequest) {
    return this.http.post(environment.accountAPI + 'sign-up', JSON.stringify(signUpRequest), httpOptions);
  }

  async signOut() {
    // const refreshToken = this.tokenStorage.getRefreshToken()!;



    // this.cancelAccessToken().subscribe({
    //   next: () => {

    //     this.revokeRefreshToken(refreshToken).subscribe({
    //       error: (err) => { console.error(err); }
    //     });
    //   },
    //   error: (err) => { console.error(err); }
    // });

    // this.tokenStorage.clearStorage();

    await this.workerService.signOut();

    this.signedInSetNext(false);
    this.userRolesSetNext(emptyRoleArray);

  }


  refreshToken(token: string) {
    return this.http.post(environment.refreshTokenAPI + 'refresh/' + token, JSON.stringify(token), httpOptions);
  }

  cancelAccessToken() {
    return this.http.post(environment.accessTokenAPI + 'cancel', httpOptions);
  }

  revokeRefreshToken(token: string) {
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

  // getUserRoles() {
  //   const accessToken = this.tokenStorage.getAccessToken();
  //   if (accessToken) {
  //     let decodedJwt: JsonWebToken = this.parseJwt(accessToken);
  //     return decodedJwt.roles;
  //   }

  //   else return emptyRoleArray;
  // }


  getWhoAmI() {
    return this.http.get(environment.userManagementAPI + 'who-am-i', { responseType: 'text' as 'text' });
  }





  public get signedIn$() {
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