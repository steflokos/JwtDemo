import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from 'src/app/_services/sidenav.service';

@Component({
  selector: 'app-visitor-sidenav',
  templateUrl: './visitor-sidenav.component.html',
  styleUrls: ['./visitor-sidenav.component.css']
})
export class VisitorSidenavComponent implements OnInit,AfterViewInit {

  @ViewChild('visitorSidenav') public sidenav!: MatSidenav;
  constructor(private sidenavService:SidenavService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

}
