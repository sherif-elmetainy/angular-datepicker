import { ChangeDetectorRef, Directive, HostListener, Injectable, OnDestroy } from '@angular/core';
import { CurrentCultureService, GlobalizationService, TypeConverterService } from '@code-art/angular-globalize';
import { addDays, isWithinRange } from 'date-fns';

import { takeUntilDestroyed, TakeUntilDestroyed } from '@code-art/rx-helpers';
import { BaseDatePickerAccessorDirective } from '../base-date-picker-accessor-directive';
import { IDatePicker } from '../interfaces';
import {
  formatYear,
  getMonthYear,
  IMonthYearSelection,
  KEY_CODE,
  sevenArray,
  sixArray,
  ViewType,
} from '../util';

@TakeUntilDestroyed()
@Directive()
export abstract class BaseDatePickerComponentDirective extends BaseDatePickerAccessorDirective<IDatePicker> implements OnDestroy {

  public view: ViewType = 'days';
  private _month?: number;
  private _year?: number;
  private _startEndToggle = false;

  public readonly sevenArray = sevenArray;
  public readonly sixArray = sixArray;
  public monthFormatter!: (n: number) => string;
  public yearFormatter!: (n: number) => string;
  public monthPickerVisible = false;
  public yearPickerVisible = false;

  private _calculated: boolean;
  private _viewStartDate!: Date;
  private _viewEndDate!: Date;
  private _startDate!: Date;
  private _allDays!: Date[];
  private _focusDate: Date | null;

  constructor(
    cultureService: CurrentCultureService,
    converterService: TypeConverterService,
    changeDetector: ChangeDetectorRef,
    globalizationService: GlobalizationService,
  ) {
    super(cultureService, converterService, changeDetector);
    this._calculated = false;
    this._focusDate = null;
    this.valueChange
      .pipe(takeUntilDestroyed(this))
      .subscribe(() => this._calculated = false);
    this.cultureService.cultureObservable
    .pipe(takeUntilDestroyed(this))
    .subscribe((_) => {
      this.monthFormatter = (m) => globalizationService.getMonthName(m, this.effectiveLocale, 'wide');
      this.yearFormatter = (y) => formatYear(globalizationService, y, this.effectiveLocale);
    });
  }

  @HostListener('window:keyup', ['$event'])
  public keyEvent(event: KeyboardEvent): void {
    if (!this.handleKeyboardEvents) {
      return;
    }
    if (event.key === KEY_CODE.LEFT_ARROW) {
      this.addFocusDate(this.cultureService.isRightToLeft(this.locale) ? 1 : -1);
    } else if (event.key === KEY_CODE.RIGHT_ARROW) {
      this.addFocusDate(this.cultureService.isRightToLeft(this.locale) ? -1 : 1);
    } else if (event.key === KEY_CODE.UP_ARROW) {
      this.addFocusDate(-7);
    } else if (event.key === KEY_CODE.DOWN_ARROW) {
      this.addFocusDate(7);
    } else if (event.key === KEY_CODE.ENTER && this._focusDate) {
      if (this.onDayClick(this._focusDate)) {
        this._focusDate = null;
      }
    }
  }

  public goHome(): void {
    this.month = this.todayDate.getMonth();
    this.year = this.todayDate.getFullYear();
  }

  public reset(): void {
    this.value = null;
    this._startEndToggle = false;
    this.monthPickerVisible = false;
    this.yearPickerVisible = false;
  }

  public onDayClick(date: Date): boolean {
    if (this.disabled || !isWithinRange(date, this.minDate, this.maxDate)) {
      return false;
    }
    this.monthPickerVisible = false;
    this.yearPickerVisible = false;
    if (!this.rangeSelection) {
      this.selectionStart = date;
    } else {
      let s = this.selectionStart;
      let e = this.selectionEnd;
      if (!s) {
        if (!e) {
          s = date;
          e = date;
          this._startEndToggle = false;
        } else {
          if (date.valueOf() < e.valueOf()) {
            s = date;
          } else if (date.valueOf() > e.valueOf()) {
            s = e;
            e = date;
          } else {
            e = null;
          }
          this._startEndToggle = false;
        }
      } else if (!e) {
        if (date.valueOf() < s.valueOf()) {
          e = s;
          s = date;
        } else if (date.valueOf() > s.valueOf()) {
          e = date;
        } else {
          s = null;
        }
        this._startEndToggle = false;
      } else {
        if (s.valueOf() === e.valueOf()) {
          if (date.valueOf() < s.valueOf()) {
            s = date;
            this._startEndToggle = true;
          } else if (date.valueOf() > s.valueOf()) {
            e = date;
            this._startEndToggle = false;
          } else {
            s = null;
            e = null;
            this._startEndToggle = false;
          }
        } else {
          if (date.valueOf() < s.valueOf()) {
            s = date;
            this._startEndToggle = true;
          } else if (date.valueOf() > e.valueOf()) {
            e = date;
            this._startEndToggle = true;
          } else if (date.valueOf() > s.valueOf() && date.valueOf() < e.valueOf()) {
            if (this._startEndToggle) {
              e = date;
              this._startEndToggle = false;
            } else {
              s = date;
              this._startEndToggle = true;
            }
          }
        }
      }
      this.value = s === null || e === null ? null : { from: s, to: e };
    }
    this.raiseOnTouch();
    return true;
  }

  public onCommand(evt: IMonthYearSelection): void {
    if (this.disabled) {
      return;
    }
    if (typeof (evt.month) === 'number') {
      this.month = evt.month;
    }
    if (typeof (evt.year) === 'number') {
      this.year = evt.year;
    }
    if (evt.view) {
      if (evt.view === 'home') {
        this.view = 'days';
        if (this.todayDate) {
          this.month = this.todayDate.getMonth();
          this.year = this.todayDate.getFullYear();
        }
      } else {
        this.view = evt.view;
      }
    }
    if (evt.reset) {
      this.value = null;
      this._startEndToggle = false;
    }
    this.raiseOnTouch();
  }

  public get allDays(): Date[] {
    this.calculate();
    return this._allDays;
  }

  public set month(val: number) {
    if (typeof val === 'number') {
      const [m, y] = getMonthYear(val, this.year);
      if (y < this.minYear || y > this.maxYear) {
        return;
      }
      this._month = m;
      this._year = y;
    } else {
      this._month = undefined;
    }
    this.monthPickerVisible = false;
    this.yearPickerVisible = false;
    this._calculated = false;
  }

  public get month(): number {
    return typeof this._month === 'number' ? this._month :
      (this.selectionStart || this.selectionEnd || this.todayDate).getMonth();
  }

  public set year(val: number) {
    if (typeof val === 'number') {
      this._year = Math.max(this.minYear, Math.min(this.maxYear, val));
    } else {
      this._year = undefined;
    }
    this.monthPickerVisible = false;
    this.yearPickerVisible = false;
    this._calculated = false;
  }

  public get year(): number {
    return typeof this._year === 'number' ? this._year :
      (this.selectionStart || this.selectionEnd || this.todayDate).getFullYear();
  }

  public get maxYear(): number {
    return this.maxDate.getFullYear();
  }

  public get minYear(): number {
    return this.minDate.getFullYear();
  }

  public getClasses(date: Date): { [key: string]: boolean } {
    const classes: { [key: string]: boolean } = { day: true };
    if (date.getMonth() !== this.month
      || date.getFullYear() !== this.year
    ) {
      classes.other = true;
    }
    if (!isWithinRange(date, this.minDate, this.maxDate)) {
      classes.disabled = true;
    }
    if (this.selectionStart && this.selectionEnd &&
      date.valueOf() === this.selectionEnd.valueOf() && date.valueOf() !== this.selectionStart.valueOf()) {
      classes['selection-end'] = true;
      if (this.selectionStart && this.selectionEnd.valueOf() !== this.selectionStart.valueOf()) {
        classes.multi = true;
      }
    } else if (this.selectionStart &&
      date.valueOf() === this.selectionStart.valueOf()) {
      classes['selection-start'] = true;
      if (this.selectionEnd && this.selectionEnd.valueOf() !== this.selectionStart.valueOf()) {
        classes.multi = true;
      }
    }
    if (this.selectionStart && this.selectionEnd && isWithinRange(date, this.selectionStart, this.selectionEnd)) {
      classes.selected = true;
    }
    if (this.todayHighlight && this.todayDate && date.valueOf() === this.todayDate.valueOf()) {
      classes.today = true;
    }
    // tslint:disable-next-line: no-bitwise
    if (this.highlightDays & (1 << date.getDay())) {
      classes.highlight = true;
    }
    if (this._focusDate && this._focusDate.valueOf() === date.valueOf()) {
      classes.focused = true;
    }
    return classes;
  }

  public get isRtl(): boolean {
    return this.cultureService.isRightToLeft(this.locale);
  }

  private addFocusDate(days: number): void {
    if (this._focusDate) {
      this._focusDate = addDays(this._focusDate, days);
    } else if (this.selectionStart && isWithinRange(this.selectionStart, this._viewStartDate, this._viewEndDate)) {
      this._focusDate = this.selectionStart;
    } else if (this.todayDate && isWithinRange(this.todayDate, this._viewStartDate, this._viewEndDate)) {
      this._focusDate = this.todayDate;
    } else {
      this._focusDate = this._startDate;
    }
    if (this._focusDate && !isWithinRange(this._focusDate, this._viewStartDate, this._viewEndDate)) {
      this.onCommand({
        month: this._focusDate.getMonth(),
        year: this._focusDate.getFullYear(),
      });
    }
  }

  private calculate() {
    if (!this._calculated) {
      this._startDate = new Date(this.year, this.month, 1);
      const diff = (this._startDate.getDay() - this.weekStart + 7) % 7;
      if (diff === 0) {
        this._viewStartDate = this._startDate;
      } else {
        this._viewStartDate = addDays(this._startDate, -diff);
      }
      this._viewEndDate = addDays(this._viewStartDate, 41);

      this._allDays = [];
      let d = this._viewStartDate;
      for (let i = 0; i < 42; i++) {
        this._allDays.push(d);
        d = addDays(d, 1);
      }
      if (this._focusDate && !isWithinRange(this._focusDate, this._viewStartDate, this._viewEndDate)) {
        this._focusDate = null;
      }
      this._calculated = true;
    }
  }
}
