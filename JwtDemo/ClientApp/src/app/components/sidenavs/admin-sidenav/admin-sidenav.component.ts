import { FlatTreeControl } from '@angular/cdk/tree';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { AuthService } from 'src/app/_services/auth.service';

import { SidenavService } from 'src/app/_services/sidenav.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-admin-sidenav',
  templateUrl: './admin-sidenav.component.html',
  styleUrls: ['./admin-sidenav.component.css']
})
export class AdminSidenavComponent implements OnInit, AfterViewInit {

  @ViewChild('adminSidenav') public sidenav!: MatSidenav;

  username$: Observable<string> = this.authService.getWhoAmI();

  constructor(private sidenavService: SidenavService,private authService:AuthService) {

  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

  
  ngOnInit(): void {
  }

  

  

}

