import { BaseDateRangeAccessor } from './base-date-range-accessor';
import { IDatePicker } from './interfaces';
import { Input } from '@angular/core';
import { startOfToday } from 'date-fns';

export abstract class BaseDatePickerAccessor<T extends IDatePicker>
  extends BaseDateRangeAccessor<T> implements IDatePicker {

  private _homeButton = true;
  private _resetButton = true;
  private _handleKeyboardEvents = true;
  private _todayHighlight = true;
  private _todayDate: Date | null = null;
  private _highlightDays = 0;

  @Input() public set homeButton(val: boolean) {
    if (this.parent) {
      this.parent.homeButton = val;
      return;
    }
    if (val !== this._homeButton) {
      this._homeButton = val;
    }
  }

  public get homeButton(): boolean {
    if (this.parent) {
      return this.parent.homeButton;
    }
    return this._homeButton;
  }

  @Input() public set resetButton(val: boolean) {
    if (this.parent) {
      this.parent.resetButton = val;
      return;
    }
    if (val !== this._resetButton) {
      this._resetButton = val;
    }
  }

  public get resetButton(): boolean {
    if (this.parent) {
      return this.parent.resetButton;
    }
    return this._resetButton;
  }

  @Input() public set handleKeyboardEvents(val: boolean) {
    if (this.parent) {
      this.parent.handleKeyboardEvents = val;
      return;
    }
    if (val !== this._handleKeyboardEvents) {
      this._handleKeyboardEvents = val;
    }
  }

  public get handleKeyboardEvents(): boolean {
    if (this.parent) {
      return this.parent.handleKeyboardEvents;
    }
    return this._handleKeyboardEvents;
  }

  @Input() public set todayHighlight(val: boolean) {
    if (this.parent) {
      this.parent.todayHighlight = val;
    }
    if (val !== this._todayHighlight) {
      this._todayHighlight = val;
    }
  }

  public get todayHighlight(): boolean {
    if (this.parent) {
      return this.parent.todayHighlight;
    }
    return this._todayHighlight;
  }

  @Input() public set todayDate(val: Date) {
    if (this.parent) {
      this.parent.todayDate = val;
      return;
    }
    val = val || null;
    this._todayDate = val;
  }

  public get todayDate(): Date {
    if (this.parent) {
      return this.parent.todayDate;
    }
    if (this._todayDate) {
      return this._todayDate;
    }
    return startOfToday();
  }

  @Input() public set highlightDays(val: number) {
    if (this.parent) {
      this.parent.highlightDays = val;
      return;
    }
    val = val || 0;
    if (val !== this._highlightDays) {
      this._highlightDays = val;
    }
  }

  public get highlightDays(): number {
    if (this.parent) {
      return this.parent.highlightDays;
    }
    return this._highlightDays;
  }
}
