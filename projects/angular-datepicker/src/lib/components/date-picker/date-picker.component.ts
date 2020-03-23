import { Component, forwardRef, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseDatePickerComponentDirective } from '../base-date-picker-component-directive';

@Component({
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerComponent),
  }],
  selector: 'cadp-datepicker',
  styleUrls: ['./date-picker.component.scss'],
  templateUrl: './date-picker.component.html',
})
export class DatePickerComponent extends BaseDatePickerComponentDirective implements OnDestroy {
  public rangeSelection = false;
}
