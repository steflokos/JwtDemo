import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visitor-landing-page',
  templateUrl: './visitor-landing-page.component.html',
  styleUrls: ['./visitor-landing-page.component.css']
})
export class VisitorLandingPageComponent implements OnInit {

  constructor(private router: Router) { }
  

  ngOnInit(): void {
    this.router.navigate(["/"]);
  }

}
