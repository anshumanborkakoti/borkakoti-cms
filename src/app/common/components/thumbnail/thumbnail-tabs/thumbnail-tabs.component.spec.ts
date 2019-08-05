import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailTabsComponent } from './thumbnail-tabs.component';

describe('ThumbnailTabsComponent', () => {
  let component: ThumbnailTabsComponent;
  let fixture: ComponentFixture<ThumbnailTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThumbnailTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbnailTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
