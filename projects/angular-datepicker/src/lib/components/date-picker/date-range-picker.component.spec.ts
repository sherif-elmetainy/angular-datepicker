import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initComponentTest } from 'projects/angular-datepicker/src/test/init-test-env';
import { SelectionScrollComponent } from '../selection-scroll/selection-scroll.component';
import { DateRangePickerComponent } from './date-range-picker.component';

describe('DateRangePickerComponent', () => {
  let fixture: ComponentFixture<DateRangePickerComponent>;
  let component: DateRangePickerComponent;
  beforeEach(async () => {
    initComponentTest(DateRangePickerComponent, SelectionScrollComponent);
    fixture = TestBed.createComponent(DateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('inits correctly', () => {
    expect(component).toBeTruthy();
  });
});
