import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideNavMenuService {
  private menuItems: { label: string, routerLink: string, icon: string, authRoles: string[] }[] = [
    {
      label: 'Users',
      routerLink: 'users',
      icon: 'home',
      authRoles: ['admin']
    },
    {
      label: 'Issues',
      routerLink: 'issues',
      icon: 'folder',
      authRoles: ['Chief editor', 'admin']
    },
    {
      label: 'Categories',
      routerLink: 'categories',
      icon: 'folder',
      authRoles: ['Chief editor', 'admin']
    },
    {
      label: 'Posts',
      routerLink: 'posts',
      icon: 'folder',
      authRoles: ['Chief editor', 'admin', 'editor']
    },
  ];
  constructor() { }

  getMenuItemsForRole(role: string) {
    return this.menuItems.filter(item => {
      return item.authRoles.find(r => r === role);
    });
  }
}
