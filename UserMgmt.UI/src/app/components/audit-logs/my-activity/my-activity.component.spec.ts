import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyActivityComponent } from './my-activity.component';

describe('MyActivityComponent', () => {
  let component: MyActivityComponent;
  let fixture: ComponentFixture<MyActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyActivityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyActivityComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
