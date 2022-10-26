import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorNavMenuComponent } from './visitor-nav-menu.component';

describe('VisitorNavMenuComponent', () => {
  let component: VisitorNavMenuComponent;
  let fixture: ComponentFixture<VisitorNavMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorNavMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorNavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
