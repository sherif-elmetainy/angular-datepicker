import { TestBed, ComponentFixture } from '@angular/core/testing';
import { initComponentTest } from 'projects/angular-datepicker/src/test/init-test-env';
import { DatePickerComponent } from './date-picker.component';
import { SelectionScrollComponent } from '../selection-scroll/selection-scroll.component';


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
