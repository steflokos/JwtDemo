import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {

    var accessToken = window.sessionStorage.getItem(environment.accessToken);
    var refreshToken = window.sessionStorage.getItem(environment.refreshToken);

    if (!!accessToken && !!refreshToken) {

      const response$ = this.authService.checkRefreshTokenExpiration(refreshToken);
      const isActive = await lastValueFrom(response$);

      if (isActive === false) {
        //this.eventBusService.emit(new EventData('logout', null)); //me to event bus, den to exo dokimasei, mporei na doulepsei
        return this.handleUnauthorizedRouting(state,!!accessToken && !!refreshToken);
      }
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    return this.handleUnauthorizedRouting(state,!!accessToken && !!refreshToken);
  }

  private handleUnauthorizedRouting(state: RouterStateSnapshot,tokens:boolean): boolean {


    if(tokens) {
      this.authService.signOut();
    }
    console.log("ston auth guard", state.url);
    //this.authService.signOut(); //TODO EDO KATI PAIZEI OTAN KANEI REQ KAI DEN EINAI SIGNED IN, MPAINEI STO REDIS ME "" KAI MPLOKAREI OLO TO SISTIMA
    this.router.navigate(['/sign-in'], { queryParams: { returnUrl: state.url } }); //edo na mpei se env

    return false;
  }

}
