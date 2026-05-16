import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsDashboardComponent } from './logs-dashboard.component';

describe('LogsDashboardComponent', () => {
  let component: LogsDashboardComponent;
  let fixture: ComponentFixture<LogsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogsDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogsDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
