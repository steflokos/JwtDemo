import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorLandingPageComponent } from './visitor-landing-page.component';

describe('VisitorLandingPageComponent', () => {
  let component: VisitorLandingPageComponent;
  let fixture: ComponentFixture<VisitorLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorLandingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
