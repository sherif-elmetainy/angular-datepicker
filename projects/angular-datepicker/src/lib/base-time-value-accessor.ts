import { ChangeDetectorRef, Inject, Input } from '@angular/core';
import { DateFormatterOptions } from 'globalize';
import { CurrentCultureService, GlobalizationService } from '@code-art/angular-globalize';

import { BaseValueAccessor } from './base-value-accessor';
import { ITimePicker } from './interfaces';

interface TimeOption {
  val: number;
  date: Date;
}

export abstract class BaseTimeValueAccessor extends BaseValueAccessor<ITimePicker> implements ITimePicker {
  private static readonly maximumValue = 24 * 3600 * 1000 - 1;
  private static readonly minimumValue = 0;
  private static readonly formats: DateFormatterOptions[] =
    [{ time: 'short' }, { time: 'medium' }, { time: 'long' }, { time: 'full' }];

  public timeOptions!: TimeOption[];
  private _minTime: number = BaseTimeValueAccessor.minimumValue;
  private _maxTime: number = BaseTimeValueAccessor.maximumValue;
  private _minutesStep = 15;

  constructor(cultureService: CurrentCultureService,
    protected readonly globalizeService: GlobalizationService,
    @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef) {
    super(cultureService, changeDetector);
    this.updateTimeOptions();
  }

  @Input() public set minutesStep(val: number) {
    if (!val || typeof val !== 'number') {
      throw new Error(`Minutes steps must be a positive integer and a divisor of 60.`);
    }
    if (isNaN(val) || Math.round(val) !== val || Math.round(60 / val) !== 60 / val) {
      throw new Error(`Minutes steps must be a positive integer and a divisor of 60.`);
    }
    if (val < 0) {
      throw new Error(`Minutes steps must be a positive integer and a divisor of 60.`);
    }
    this._minutesStep = 0;
    this.updateTimeOptions();
  }

  public get minutesStep(): number {
    return this._minutesStep;
  }

  @Input() set minTime(val: number) {
    if (this.parent) {
      this.parent.minTime = val;
      return;
    }
    val = this.coerceValue(val);
    if (this._minTime !== val) {
      this._minTime = val;
      this.updateTimeOptions();
    }
  }

  get minTime(): number {
    if (this.parent) {
      return this.parent.minTime;
    }
    return this._minTime || BaseTimeValueAccessor.minimumValue;
  }

  @Input() set maxTime(val: number) {
    if (this.parent) {
      this.parent.maxTime = val;
      return;
    }
    val = this.coerceValue(val);
    if (this._maxTime !== val) {
      this._maxTime = val;
      this.updateTimeOptions();
    }
  }

  get maxTime(): number {
    if (this.parent) {
      return this.parent.maxTime;
    }
    return this._maxTime || BaseTimeValueAccessor.maximumValue;
  }

  public coerceValue(val: any): any {
    let d: Date | null = null;
    if (typeof val === 'number') {
      return Math.round(Math.min(BaseTimeValueAccessor.maximumValue,
        Math.max(BaseTimeValueAccessor.minimumValue, val)));
    } else if (typeof val === 'string') {

      for (let i = 0; i < BaseTimeValueAccessor.formats.length; i++) {
        d = this.globalizeService.parseDate(val, this.effectiveLocale, BaseTimeValueAccessor.formats[i]);
        if (d) {
          break;
        }
      }
    } else if (val instanceof Date) {
      d = val;
    }
    if (d !== null) {
      return 1000 * (d.getSeconds() + (d.getMinutes() + d.getHours() * 60) * 60);
    }
    return null;
  }

  private updateTimeOptions(): void {
    this.timeOptions = [];
    let val = this.minTime;
    let date = new Date(new Date(1970, 0, 1, 0, 0, 0, 0).valueOf() + this.minTime);
    const inc = this.minutesStep * 60_000;
    while (val <= this.maxTime) {
      this.timeOptions.push({
        val,
        date,
      });
      date = new Date(date.valueOf() + inc);
      val += inc;
    }
  }
}
