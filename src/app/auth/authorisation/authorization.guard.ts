import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ROLES } from 'src/app/common/util/constants';
import { MatDialog } from '@angular/material';
import { UnauthorizedComponent } from './unauthorized.component';
import { SideNavMenuService } from 'src/app/services/side-nav-menu.service';
import { AuthenticationService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private sidenavService: SideNavMenuService,
    private dialog: MatDialog
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const loggedInUser = this.authService.getLoggedInUser();
    if (!loggedInUser) {
      this.dialog.open(UnauthorizedComponent, { data: { message: 'You are not authorized to do this!' } });
      this.authService.logout();
      return false;
    }
    if (!this.sidenavService.isRoleAuthorizedForPath(loggedInUser.roles, state.url.substr(1))) {
      this.dialog.open(UnauthorizedComponent, { data: { message: 'You are not authorized to do this!' } });
      return false;
    }
    return true;
  }
}
