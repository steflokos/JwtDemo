import { Component, OnInit } from '@angular/core';
import { SidenavService } from 'src/app/_services/sidenav.service';

@Component({
  selector: 'app-visitor-nav-menu',
  templateUrl: './visitor-nav-menu.component.html',
  styleUrls: ['./visitor-nav-menu.component.css']
})
export class VisitorNavMenuComponent implements OnInit {
  isExpanded = false;
  constructor(private sidenav: SidenavService) { }

  ngOnInit(): void {
  }
  
  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.sidenav.toggle();
  }
}
