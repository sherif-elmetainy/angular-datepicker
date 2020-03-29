import { Component, forwardRef } from '@angular/core';
import type { OnDestroy } from '@angular/core';

import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseDatePickerComponentDirective } from '../base-date-picker-component-directive';

@Component({
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateRangePickerComponent),
  }],
  selector: 'cadp-daterangepicker',
  styleUrls: ['./date-picker.component.scss'],
  templateUrl: './date-picker.component.html',
})
export class DateRangePickerComponent extends BaseDatePickerComponentDirective implements OnDestroy {
  public rangeSelection = true;
}
