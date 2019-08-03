import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnaildialogComponent } from './thumbnaildialog.component';

describe('ThumbnaildialogComponent', () => {
  let component: ThumbnaildialogComponent;
  let fixture: ComponentFixture<ThumbnaildialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThumbnaildialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbnaildialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
