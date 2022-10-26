import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { SidenavService } from 'src/app/_services/sidenav.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-user-nav-menu',
  templateUrl: './user-nav-menu.component.html',
  styleUrls: ['./user-nav-menu.component.css']
})
export class UserNavMenuComponent implements OnInit,OnDestroy {

  constructor(private authService: AuthService,private sidenav:SidenavService) { }

  isExpanded = false;

  signedIn$ = this.authService.signedIn$;
  subscriptions: Subscription[] = [];

  

  ngOnInit(): void {
  }
  collapse() {
    this.isExpanded = false;
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  toggle() {
    this.sidenav.toggle();
  }
}
