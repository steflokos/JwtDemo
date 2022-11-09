import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/models/role';
import { AuthService } from 'src/app/_services/auth.service';

const emptyRoleArray: Role[] = [];
@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.css']
})
export class SignOutComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {

  }

  ngOnInit() {
    this.authService.signOut().subscribe({
      next: () => {

        this.authService.userRolesSetNext(emptyRoleArray);
        this.authService.signedInSetNext(false);
        this.router.navigate(['/sign-in']);

      },
      error: (err) => { console.error(err); }
    });
    
  }

}
