import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initComponentTest } from 'projects/angular-datepicker/src/test/init-test-env';
import { SelectionScrollComponent } from '../selection-scroll/selection-scroll.component';
import { DatePickerComponent } from './date-picker.component';

describe('DatePickerComponent', () => {
  let fixture: ComponentFixture<DatePickerComponent>;
  let component: DatePickerComponent;
  beforeEach(async () => {
    initComponentTest(DatePickerComponent, SelectionScrollComponent);
    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('inits correctly', () => {
    expect(component).toBeTruthy();
  });
});
