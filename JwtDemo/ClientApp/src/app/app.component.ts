import { AfterContentChecked, AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from './models/role';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  //signedIn$!: Observable<boolean>;
  adminRole = [Role.Admin];
  userRole = [Role.User];
  emptyRoleArray: Role[] = [];

  title = 'app';
  constructor(private authService: AuthService,) {

    // if (typeof Worker !== 'undefined') {
    //   // Create a new
    //   const worker = new Worker(new URL('./auth.worker', import.meta.url));
    //   worker.onmessage = ({ data }) => {
    //     console.log(`page got message: ${data+1}`);
    //   };
    //   worker.postMessage('hello');
    // } else {
    //   // Web Workers are not supported in this environment.
    //   // You should add a fallback so that your program still executes correctly.
    // }
  }



}



