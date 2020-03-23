import { ComponentFactory, ComponentFactoryResolver, Directive, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseDatePickerComponentDirective } from '../components/base-date-picker-component-directive';
import { DatePickerComponent } from '../components/date-picker/date-picker.component';
import { BaseDatePickerDirective } from './base-date-picker-directive';
import { Popup } from './popup';

@Popup()
@Directive({
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerDirective),
  }],
  selector: '[cadpDatePicker]',
})
export class DatePickerDirective extends BaseDatePickerDirective {
  public rangeSelection = false;

  public resolveFactory(resolver: ComponentFactoryResolver): ComponentFactory<BaseDatePickerComponentDirective> {
    return resolver.resolveComponentFactory(DatePickerComponent);
  }
}
