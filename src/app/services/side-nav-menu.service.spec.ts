import { TestBed } from '@angular/core/testing';

import { SideNavMenuService } from './side-nav-menu.service';

describe('SideNavMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SideNavMenuService = TestBed.get(SideNavMenuService);
    expect(service).toBeTruthy();
  });

   it('Admin role should return all menu items', () => {
    const service: SideNavMenuService = TestBed.get(SideNavMenuService);
    const items:string[] = service.getMenuItemsForRole('admin');
    expect(items.length).toEqual(4);
  });
});
