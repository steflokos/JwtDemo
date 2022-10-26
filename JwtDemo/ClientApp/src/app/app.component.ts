import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from './models/role';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  signedIn$: Observable<boolean> = this.authService.signedIn$;
  adminRole = [Role.Admin];
  userRole = [Role.User];

  title = 'app';
  constructor(private authService: AuthService,) {
   }
}

