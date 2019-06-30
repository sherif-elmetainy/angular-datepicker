import {
  Component, ElementRef,
  forwardRef, ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseTimeValueAccessor } from '../../base-time-value-accessor';


@Component({
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TimePickerComponent),
  }],
  selector: 'cadp-timepicker',
  styleUrls: ['./time-picker.component.scss'],
  templateUrl: './time-picker.component.html',
})
export class TimePickerComponent extends BaseTimeValueAccessor {

  public isPopup = false;
  @ViewChild('timepickerSelect', { static: true }) timerpickerSelect?: ElementRef<HTMLSelectElement>;
}
