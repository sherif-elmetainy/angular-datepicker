import { ChangeDetectorRef, Inject, Input } from '@angular/core';
import { CurrentCultureService, TypeConverterService } from '@code-art/angular-globalize';

import { BaseValueAccessor } from './base-value-accessor';
import { IDateRangeOptions } from './interfaces';
import { isPlainObject } from './util';
import { isEqual } from 'date-fns';

export abstract class BaseDateRangeAccessor<T extends IDateRangeOptions>
  extends BaseValueAccessor<T> implements IDateRangeOptions {

  private static readonly maximumYear = 2100;
  private static readonly minimumYear = 1900;

  private readonly defaultMaxDate: Date;
  private readonly defaultMinDate: Date;

  private _rangeSelection = false;
  private _minDate: Date | null = null;
  private _maxDate: Date | null = null;

  constructor(cultureService: CurrentCultureService,
    protected readonly converterService: TypeConverterService,
    @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef) {
    super(cultureService, changeDetector);
    this.defaultMinDate = new Date(BaseDateRangeAccessor.minimumYear, 0, 1);
    this.defaultMaxDate = new Date(BaseDateRangeAccessor.maximumYear, 11, 31);
  }

  public set rangeSelection(val: boolean) {
    if (val !== this._rangeSelection) {
      this._rangeSelection = val;
    }
  }

  public get rangeSelection(): boolean {
    return this._rangeSelection;
  }

  @Input() public set minDate(val: Date) {
    if (this.parent) {
      this.parent.minDate = val;
      return;
    }
    val = val || null;
    this._minDate = val;
  }

  public get minDate(): Date {
    if (this.parent) {
      return this.parent.minDate;
    }
    return this._minDate || this.defaultMinDate;
  }

  @Input() public set maxDate(val: Date) {
    if (this.parent) {
      this.parent.maxDate = val;
      return;
    }
    val = val || null;
    this._maxDate = val;
  }

  public get maxDate(): Date {
    if (this.parent) {
      return this.parent.maxDate;
    }
    return this._maxDate || this.defaultMaxDate;
  }

  public get selectionStart(): Date | null {
    if (this.parent) {
      return this.parent.selectionStart;
    }
    const val = this.value;
    if (val instanceof Date) {
      return val;
    }
    return val ? val.from as Date : null;
  }

  public set selectionStart(val: Date | null) {
    if (this.parent) {
      this.parent.selectionStart = val;
      return;
    }
    val = val || null;
    if (!this.rangeSelection) {
      this.value = val;
    } else {
      const v = this.value;
      if (!v && !val) {
        return;
      }
      this.value = { from: val, to: v ? v.to : null };
    }
  }

  public get selectionEnd(): Date | null {
    if (this.parent) {
      return this.parent.selectionEnd;
    }
    if (!this.rangeSelection) {
      return null;
    }
    const v = this.value;
    return v ? v.to : null;
  }

  public set selectionEnd(val: Date | null) {
    if (this.parent) {
      this.parent.selectionEnd = val;
      return;
    }
    if (!this.rangeSelection) {
      return;
    }
    const v = this.value;
    if (!v && !val) {
      return;
    }
    this.value = { from: v ? v.from : null, to: val };
  }

  public compareValues(v1: any, v2: any): boolean {
    if (v1 instanceof Date && v2 instanceof Date) {
      return isEqual(v1, v2);
    }
    if (v1 && v2 && isPlainObject(v1) && isPlainObject(v2)) {
      return isEqual(v1.from, v2.from) && isEqual(v1.to, v2.to);
    }
    return false;
  }

  public coerceValue(val: any): any {
    let s: Date | null = null;
    let e: Date | null = null;
    if (val !== null && val !== undefined) {
      if (Array.isArray(val)) {
        s = val.length > 0 ? this.converterService.convertToDate(val[0], this.effectiveLocale) : null;
        e = val.length > 1 ? this.converterService.convertToDate(val[1], this.effectiveLocale) : null;
      } else if (isPlainObject(val)) {
        s = this.converterService.convertToDate(val.from, this.effectiveLocale) || null;
        e = this.converterService.convertToDate(val.to, this.effectiveLocale) || null;
      } else {
        try {
          s = this.converterService.convertToDate(val, this.effectiveLocale);
        } catch {
          s = null;
        }
      }
    }

    if (!this.rangeSelection) {
      return s;
    } else if (s || e) {
      if (s && e && this.rangeSelection && e.valueOf() < s.valueOf()) {
        throw new Error('From date must be before or at to date.');
      }
      return {
        from: s,
        to: e,
      };
    } else {
      return null;
    }
  }
}
