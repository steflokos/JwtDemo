import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLandingPageComponent } from './admin-landing-page.component';

describe('AdminComponent', () => {
  let component:  AdminLandingPageComponent;
  let fixture: ComponentFixture< AdminLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [  AdminLandingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent( AdminLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
