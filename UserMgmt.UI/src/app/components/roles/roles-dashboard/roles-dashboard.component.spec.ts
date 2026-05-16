import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesDashboardComponent } from './roles-dashboard.component';

describe('RolesDashboardComponent', () => {
  let component: RolesDashboardComponent;
  let fixture: ComponentFixture<RolesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RolesDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RolesDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
