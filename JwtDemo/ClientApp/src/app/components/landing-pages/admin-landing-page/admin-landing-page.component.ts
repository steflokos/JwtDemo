import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/models/role';
import { AuthService } from 'src/app/_services/auth.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-landing-page',
  templateUrl: './admin-landing-page.component.html',
  styleUrls: ['./admin-landing-page.component.css']
})
export class AdminLandingPageComponent implements OnInit {

  adminRole = Role.Admin;
  signedIn$ = this.authService.signedIn$;
  subscriptions: Subscription[] = [];

  constructor(private authService: AuthService,private router:Router ) {
  }

  ngOnInit() {
    this.router.navigate(["/"]);
  };



}
