import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role } from '../models/role';

import { AuthService } from '../_services/auth.service';
import { WorkerManagerService } from '../_services/worker-manager.service';


const emptyRoleArray: Role[] = [];

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private router: Router, private workerService: WorkerManagerService, private authService: AuthService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {

    const bothExist = await this.workerService.tokensExist();

    if (bothExist === true) {

      const isActive = await this.workerService.checkRefreshTokenExpiration();

      if (isActive === false) {
        return this.handleUnauthorizedRouting(state, bothExist);
      }
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    return this.handleUnauthorizedRouting(state, bothExist);
  }

  private handleUnauthorizedRouting(state: RouterStateSnapshot, tokensExist: boolean): boolean {


    if (tokensExist) {
      this.authService.signOut().subscribe({
        next: () => {
          this.authService.signedInSetNext(false);
          this.authService.userRolesSetNext(emptyRoleArray);
        },
        error: (err) => { console.error(err); }
      });
    }

    this.router.navigate(['/sign-in'], { queryParams: { returnUrl: state.url } });

    return false;
  }

}
