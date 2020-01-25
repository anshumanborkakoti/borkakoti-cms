import { Injectable } from '@angular/core';
import { ROLES } from '../common/util/constants';

@Injectable({
  providedIn: 'root'
})
export class SideNavMenuService {
  private menuItems: { label: string, routerLink: string, icon: string, authRoles: string[] }[] = [
    {
      label: 'Users',
      routerLink: 'users',
      icon: 'person',
      authRoles: [ROLES.ADMIN]
    },
    {
      label: 'Issues',
      routerLink: 'issues',
      icon: 'book',
      authRoles: [ROLES.CHIEF_EDITOR, ROLES.ADMIN]
    },
    {
      label: 'Categories',
      routerLink: 'categories',
      icon: 'label',
      authRoles: [ROLES.CHIEF_EDITOR, ROLES.ADMIN]
    },
    {
      label: 'Authors',
      routerLink: 'authors',
      icon: 'people',
      authRoles: [ROLES.CHIEF_EDITOR, ROLES.ADMIN, ROLES.EDITOR]
    },
    {
      label: 'Posts',
      routerLink: 'posts',
      icon: 'notes',
      authRoles: [ROLES.CHIEF_EDITOR, ROLES.ADMIN, ROLES.EDITOR]
    },
    {
      label: 'Comments',
      routerLink: 'comments',
      icon: 'comment',
      authRoles: [ROLES.CHIEF_EDITOR, ROLES.ADMIN]
    },
  ];
  constructor() { }

  isRoleAuthorizedForPath(aRoles: string[], aPath: string) {
    const path = this.menuItems.find(aMenuItem => aPath.startsWith(aMenuItem.routerLink));
    return path.authRoles.some(aAuthRole => aRoles.some(aUserRole => aAuthRole === aUserRole));
  }

  getMenuItemsForRole(userRoles: string[]) {
    return this.menuItems.filter(item => {
      return userRoles.some(aUserRole => item.authRoles.some(aAuthRole => aAuthRole === aUserRole));
    });
  }
}
