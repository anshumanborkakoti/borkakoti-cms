import { Component, OnInit, OnDestroy } from '@angular/core';
import { SideNavMenuService } from './services/side-nav-menu.service';
import { AuthenticationService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'borkakoti-cms';

  menuItems = null;
  sideOpened = false;
  isAuthenticated = false;
  loggedInUser = '';

  private authSubs = new Subscription();
  private userSubs = new Subscription();


  constructor(
    private sidenavService: SideNavMenuService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.sideOpened = this.isAuthenticated = this.authService.isAuthenticated();
    this.authSubs = this.authService.getIsUserAuthenticated().subscribe(aIsAuth => this.sideOpened = this.isAuthenticated = !!aIsAuth);
    this.userSubs = this.authService.getLoggedInUserId().subscribe(auserid => {
      this.loggedInUser = auserid;
      this.menuItems = this.sidenavService.getMenuItemsForRole(this.authService.getLoggedInUser().roles);
    });
    this.authService.autoRestoreAuthSession();
  }

  ngOnDestroy(): void {
    this.authSubs.unsubscribe();
    this.userSubs.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }
}
