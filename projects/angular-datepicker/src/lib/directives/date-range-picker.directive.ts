import { ComponentFactory, ComponentFactoryResolver, Directive, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseDatePickerComponentDirective } from '../components/base-date-picker-component-directive';
import { DateRangePickerComponent } from '../components/date-picker/date-range-picker.component';
import { BaseDatePickerDirective } from './base-date-picker-directive';
import { Popup } from './popup';

@Popup()
@Directive({
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateRangePickerDirective),
  }],
  selector: '[cadpDateRangePicker]',
})
export class DateRangePickerDirective extends BaseDatePickerDirective {
  public rangeSelection = true;

  public resolveFactory(resolver: ComponentFactoryResolver): ComponentFactory<BaseDatePickerComponentDirective> {
    return resolver.resolveComponentFactory(DateRangePickerComponent);
  }
}
