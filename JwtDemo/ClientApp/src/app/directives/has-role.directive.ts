import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { Role } from 'src/app/models/role';
import { Router } from '@angular/router';


const emptyRoleArray: Role[] = [];
@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit, OnDestroy {



  @Input() appHasRole: Role[] = emptyRoleArray;

  isVisible: boolean = false;
  userRoles: Role[] = [];

  constructor(private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>, private authService: AuthService, private router: Router) {

  }

  ngOnInit(): void {
    // var roles: Role[] = this.tokenStorage.getUserRoles();

    this.authService.userRoles$.subscribe((data) => {

      this.userRoles = data;
      if (!this.userRoles) {
        console.log("mpike edoo");
        
        this.viewContainerRef.clear();
      }

      else if (this.areEqual(this.userRoles, this.appHasRole)) {//this.userRoles.includes(this.appHasRole)
        // If it is already visible (which can happen if
        // his roles changed) we do not need to add it a second time
        //console.log(this.userRoles.includes(this.appHasRole!));
        if (!this.isVisible) {
          // We update the `isVisible` property and add the 
          // templateRef to the view using the 
          // 'createEmbeddedView' method of the viewContainerRef
          this.isVisible = true;
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      } else {
        // If the user does not have the role, 
        // we update the `isVisible` property and clear
        // the contents of the viewContainerRef
        
        this.isVisible = false;
        this.viewContainerRef.clear();
        
      }


    });



  }


  private areEqual(array1: any[], array2: any[]) {
    if (array1.length === array2.length) {
      return array1.every((element: any) => {
        if (array2.includes(element)) {
          return true;
        }

        return false;
      });
    }

    return false;
  }
  ngOnDestroy(): void {

  }

}







