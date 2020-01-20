import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideNavMenuService {
  private menuItems: { label: string, routerLink: string, icon: string, authRoles: string[] }[] = [
    {
      label: 'Users',
      routerLink: 'users',
      icon: 'person',
      authRoles: ['admin']
    },
    {
      label: 'Issues',
      routerLink: 'issues',
      icon: 'book',
      authRoles: ['Chief editor', 'admin']
    },
    {
      label: 'Categories',
      routerLink: 'categories',
      icon: 'label',
      authRoles: ['Chief editor', 'admin']
    },
    {
      label: 'Authors',
      routerLink: 'authors',
      icon: 'people',
      authRoles: ['Chief editor', 'admin', 'editor']
    },
    {
      label: 'Posts',
      routerLink: 'posts',
      icon: 'notes',
      authRoles: ['Chief editor', 'admin', 'editor']
    },
    {
      label: 'Comments',
      routerLink: 'comments',
      icon: 'comment',
      authRoles: ['Chief editor', 'admin']
    },
  ];
  constructor() { }

  getMenuItemsForRole(role: string) {
    return this.menuItems.filter(item => {
      return item.authRoles.find(r => r === role);
    });
  }
}
