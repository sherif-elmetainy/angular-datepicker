import { TestBed, ComponentFixture } from '@angular/core/testing';
import { initComponentTest } from 'projects/angular-datepicker/src/test/init-test-env';
import { DateTimePickerComponent } from './datetime-picker.component';
import { TimePickerComponent } from '../time-picker/time-picker.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { SelectionScrollComponent } from '../selection-scroll/selection-scroll.component';


describe('DateTimePickerComponent', () => {
  let fixture: ComponentFixture<DateTimePickerComponent>;
  let component: DateTimePickerComponent;
  beforeEach(async () => {
    initComponentTest(DatePickerComponent, TimePickerComponent, DateTimePickerComponent, SelectionScrollComponent);
    fixture = TestBed.createComponent(DateTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('inits correctly', () => {
    expect(component).toBeTruthy();
  });

  it('handles dates correctly', () => {
    const date = new Date(2019, 9, 28, 21, 0, 0);
    component.value = date;
    expect(component.timeValue).toBe(21 * 3600_000);
  });
});
