import { ChangeDetectorRef, Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CurrentCultureService, TypeConverterService, GlobalizationService } from '@code-art/angular-globalize';

import { BaseDatePickerAccessor } from '../../base-date-picker-accessor';
import { IDateTimePicker } from '../../interfaces';
import { startOfToday } from 'date-fns';
import { takeUntilDestroyed } from '@code-art/rx-helpers';
import { formatTimeComponent } from '../../util';

@Component({
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateTimePickerComponent),
  }],
  selector: 'cadp-datetimepicker',
  styleUrls: ['./datetime-picker.component.scss'],
  templateUrl: './datetime-picker.component.html',
})
export class DateTimePickerComponent
  extends BaseDatePickerAccessor<IDateTimePicker> implements OnDestroy, IDateTimePicker {

  @Input() public minutesStep: number;

  public timeFormatter!: (v: number) => string;
  public time = false;

  constructor(cultureService: CurrentCultureService,
    converterService: TypeConverterService,
    changeDetector: ChangeDetectorRef,
    globalizationService: GlobalizationService,
  ) {
    super(cultureService, converterService, changeDetector);
    this.minutesStep = 15;
    this.rangeSelection = false;
    this.cultureService.cultureObservable
      .pipe(takeUntilDestroyed(this))
      .subscribe((_) => {
        this.timeFormatter = (m) => globalizationService.formatDate(
            new Date(new Date(2000, 0, 1).valueOf() + m * this.minutesStep * 60_000), this.effectiveLocale, { time: 'short'});
      });
  }

  public get dateValue(): Date | null {
    const d = this.value;
    if (d instanceof Date) {
      const newD = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      if (newD.getFullYear() !== d.getFullYear()) {
        newD.setFullYear(d.getFullYear());
      }
      return newD;
    }
    return null;
  }

  public set dateValue(val: Date | null) {
    if (val instanceof Date) {
      const d = new Date(val.getFullYear(), val.getMonth(), val.getDate());
      if (d.getFullYear() !== val.getFullYear()) {
        d.setFullYear(val.getFullYear());
      }
      const oldVal = this.value;
      if (oldVal instanceof Date) {
        d.setHours(oldVal.getHours());
        d.setMinutes(oldVal.getMinutes());
        d.setSeconds(oldVal.getSeconds());
        d.setMilliseconds(oldVal.getMilliseconds());
      }
      this.value = d;
    } else {
      this.value = null;
    }
  }

  public set timeValue(val: number | null) {
    if (val === null) {
      this.value = null;
    } else {
      let dateValue = this.dateValue;
      if (dateValue === null) {
        dateValue = startOfToday();
      }
      dateValue = new Date(dateValue.getTime() + val);
      this.value = dateValue;
    }
  }

  public get timeValue(): number | null {
    const d = this.value;
    if (d instanceof Date) {
      return ((d.getHours() * 60 + d.getMinutes()) * 60 + d.getSeconds()) * 1000;
    }
    return null;
  }

  public get timeSelectionValue(): number | null {
    if (this.timeValue === null) {
      return null;
    } else {
      const v = this.timeValue / (this.minutesStep * 60_000);
      if (Math.round(v) !== v) {
        return null;
      }
      return v;
    }
  }

  public set timeSelectionValue(val: number | null) {
    if (val === null) {
      this.timeValue = null;
    } else {
      this.timeValue = val * this.minutesStep * 60_000;
    }
  }
}


