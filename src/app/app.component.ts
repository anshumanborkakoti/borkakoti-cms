import { Component, OnInit } from '@angular/core';
import { SideNavMenuService } from './services/side-nav-menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'borkakoti-cms';
  menuItems = null;
  constructor(private sidenavService: SideNavMenuService) { }
  ngOnInit() {
    this.menuItems = this.sidenavService.getMenuItemsForRole('admin');
  }
}
