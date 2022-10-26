import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorSidenavComponent } from './visitor-sidenav.component';

describe('VisitorSidenavComponent', () => {
  let component: VisitorSidenavComponent;
  let fixture: ComponentFixture<VisitorSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorSidenavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
