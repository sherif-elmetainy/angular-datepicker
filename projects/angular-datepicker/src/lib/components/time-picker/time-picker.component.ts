import {
  Component, ElementRef,
  forwardRef, ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseTimeValueAccessorDirective } from '../../base-time-value-accessor-directive';

@Component({
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TimePickerComponent),
  }],
  selector: 'cadp-timepicker',
  styleUrls: ['./time-picker.component.scss'],
  templateUrl: './time-picker.component.html',
})
export class TimePickerComponent extends BaseTimeValueAccessorDirective {

  public isPopup = false;
  @ViewChild('timepickerSelect', { static: true }) public timerpickerSelect?: ElementRef<HTMLSelectElement>;
}
