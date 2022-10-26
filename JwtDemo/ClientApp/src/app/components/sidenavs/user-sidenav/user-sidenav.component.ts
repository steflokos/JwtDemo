import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { SidenavService } from 'src/app/_services/sidenav.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-sidenav',
  templateUrl: './user-sidenav.component.html',
  styleUrls: ['./user-sidenav.component.css']
})
export class UserSidenavComponent implements OnInit,AfterViewInit {
  @ViewChild('userSidenav') public sidenav!: MatSidenav;
  constructor(private sidenavService:SidenavService,private router:Router,private authService:AuthService) { }
  username$: Observable<string> = this.authService.getWhoAmI();
  ngOnInit(): void {
  }

  
  ngAfterViewInit(): void {
    
    this.sidenavService.setSidenav(this.sidenav);
  }

 

}
