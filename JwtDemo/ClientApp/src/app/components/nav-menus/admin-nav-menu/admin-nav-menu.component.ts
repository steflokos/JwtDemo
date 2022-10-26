import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/models/role';
import { AuthService } from 'src/app/_services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { SidenavService } from 'src/app/_services/sidenav.service';

@Component({
  selector: 'app-admin-nav-menu',
  templateUrl: './admin-nav-menu.component.html',
  styleUrls: ['./admin-nav-menu.component.css']
})
export class AdminNavMenuComponent implements OnInit {
  
  isExpanded = false;
  adminRole = Role.Admin;
  signedIn$ = this.authService.signedIn$;
  subscriptions: Subscription[] = [];

  constructor(private authService: AuthService,private sidenav: SidenavService) {

  }

  ngOnInit() {

  };

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  toggle() {
    this.sidenav.toggle();
  }

}

