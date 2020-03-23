import { ChangeDetectorRef, Component, forwardRef, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CurrentCultureService, TypeConverterService, GlobalizationService } from '@code-art/angular-globalize';

import { BaseDatePickerAccessorDirective } from '../../base-date-picker-accessor-directive';
import { IDateTimePicker } from '../../interfaces';
import { startOfToday } from 'date-fns';
import { takeUntilDestroyed, TakeUntilDestroyed } from '@code-art/rx-helpers';
import { IShowDateTimePickerTime } from '../../util';

@TakeUntilDestroyed()
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
  extends BaseDatePickerAccessorDirective<IDateTimePicker> implements OnDestroy, IDateTimePicker {

  @Input() public minutesStep: number;
  @Output() public readonly showTime = new EventEmitter<IShowDateTimePickerTime>();

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
      dateValue = new Date(dateValue.valueOf());
      const tempValue = new Date(new Date(2000, 0, 1).valueOf() + val);
      dateValue.setHours(tempValue.getHours());
      dateValue.setMinutes(tempValue.getMinutes());
      dateValue.setSeconds(tempValue.getSeconds());
      dateValue.setMilliseconds(tempValue.getMilliseconds());
      this.value = dateValue;
    }
  }

  public get timeValue(): number | null {
    const d = this.value;
    if (d instanceof Date) {
      return ((d.getHours() * 60 + d.getMinutes()) * 60 + d.getSeconds()) * 1000 + d.getMilliseconds();
    }
    return null;
  }

  public get timeSelectionValue(): number | null {
    return this.timeToSelection(this.timeValue);
  }

  public set timeSelectionValue(val: number | null) {
    this.timeValue = this.selectionToTime(val);
  }

  public onTimeScrolling($event: IShowDateTimePickerTime): void {
    const v = this.selectionToTime($event.scrollToTime);
    const evt: IShowDateTimePickerTime = {
      scrollToTime: v,
    };
    this.showTime.emit(evt);
    $event.scrollToTime = this.timeToSelection(evt.scrollToTime);
  }

  private selectionToTime(v: number|null): number|null {
    if (v === null) {
      return null;
    } else {
      return v * this.minutesStep * 60_000;
    }
  }

  private timeToSelection(v: number | null): number | null {
    if (v === null) {
      return null;
    }
    const t = v / (this.minutesStep * 60_000);
      if (Math.round(t) !== t) {
        return null;
      }
      return t;
  }
}


