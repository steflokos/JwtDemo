import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/models/role';
import { AuthService } from 'src/app/_services/auth.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
const emptyRoleArray: Role[] = [];
@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.css']
})
export class SignOutComponent implements OnInit {

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    console.log("apo sign out");
    this.authService.signOut();
    this.router.navigate(['/sign-in'], {});
  }

}
