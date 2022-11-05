import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

import { AuthService } from '../_services/auth.service';
import { WorkerManagerService } from '../_services/worker-manager.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private router: Router,private workerService: WorkerManagerService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {

    const bothExist = await this.workerService.tokenExist();

    if (bothExist) {
      const isActive = await this.workerService.checkRefreshTokenExpiration();
      console.log("auth fuard active token",isActive);
      if (isActive === false) {
        return this.handleUnauthorizedRouting(state, bothExist);
      }
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    return this.handleUnauthorizedRouting(state, bothExist);
  }

  private handleUnauthorizedRouting(state: RouterStateSnapshot, tokens: boolean): boolean {


    if (tokens) {
      this.workerService.signOut();
    }

    this.router.navigate(['/sign-in'], { queryParams: { returnUrl: state.url } }); //edo na mpei se env

    return false;
  }

}
