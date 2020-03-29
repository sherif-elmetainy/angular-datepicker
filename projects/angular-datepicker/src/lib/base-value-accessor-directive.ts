import { ChangeDetectorRef, Directive, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';

import { CurrentCultureService } from '@code-art/angular-globalize';
import { takeUntilDestroyed, TakeUntilDestroyed } from '@code-art/rx-helpers';
import { IBaseValueAccessor, ICompositeObject } from './interfaces';

@TakeUntilDestroyed()
@Directive()
export abstract class BaseValueAccessorDirective<T> implements OnDestroy, IBaseValueAccessor<T>, ICompositeObject<T> {
  @Output() public readonly valueChange: EventEmitter<any> = new EventEmitter<any>();

  private readonly _boundChildren: Array<IBaseValueAccessor<T> & T> = [];
  private readonly _subs: Subscription[] = [];
  private readonly _localeSubject = new BehaviorSubject<string|undefined>(undefined);
  private _parent?: IBaseValueAccessor<T> & T;
  private _effectiveLocale?: string;
  private _disabled = false;
  private _onchange?: (val: any) => void;
  private _ontouch?: () => void;
  private _value: any = null;

  constructor(readonly cultureService: CurrentCultureService, readonly changeDetector: ChangeDetectorRef) {
    this.effectiveLocale = this.cultureService.currentCulture;
    combineLatest([this._localeSubject, this.cultureService.cultureObservable])
      .pipe(takeUntilDestroyed(this))
      .subscribe({
        next: (vals) => {
          const [localeVal, cultureVal] = vals;
          this.effectiveLocale = localeVal || cultureVal;
        },
      });
  }

  public addBoundChild(child: IBaseValueAccessor<T> & T): void {
    const thisT = this as IBaseValueAccessor<T> as (IBaseValueAccessor<T> & T);
    if (child === thisT) {
      throw new Error(`Cannot bind to self`);
    }
    if (child.parent === thisT || this._boundChildren.indexOf(child) >= 0) {
      return;
    }

    this._boundChildren.push(child);
    child.value = this.value;
    this._subs.push(this.valueChange.asObservable().subscribe((v) => {
      child.valueChange.emit(v);
    }));
    child.parent = thisT;
    if (child.changeDetector) {
      child.changeDetector.detectChanges();
    }
  }

  public removeBoundChild(child: IBaseValueAccessor<T> & T): void {
    const thisT = this as unknown as (IBaseValueAccessor<T> & T);
    const index = this._boundChildren.indexOf(child);
    if (index >= 0) {
      this._subs[index].unsubscribe();
      this._subs.splice(index, 1);
      this._boundChildren.splice(index, 1);
    }
    if (child.parent === thisT) {
      child.parent = undefined;
    }
  }

  public get parent(): (IBaseValueAccessor<T> & T) | undefined {
    return this._parent;
  }

  public set parent(val: (IBaseValueAccessor<T> & T) | undefined) {
    this._parent = val;
  }

  public get effectiveLocale(): string | undefined {
    if (this.parent) {
      return this.parent.effectiveLocale;
    }
    return this._effectiveLocale;
  }

  public set effectiveLocale(val: string | undefined) {
    if (this.parent) {
      this.parent.effectiveLocale = val;
      return;
    }
    this._effectiveLocale = val;
  }

  @Input() public set disabled(val: boolean) {
    if (this.parent) {
      this.parent.disabled = val;
      return;
    }
    this._disabled = val;
  }

  public get disabled(): boolean {
    if (this.parent) {
      return this.parent.disabled;
    }
    return this._disabled;
  }

  @Input() public set locale(val: string | undefined) {
    if (this.parent) {
      this.parent.locale = val;
      return;
    }
    if (this._localeSubject.value !== val) {
      this._localeSubject.next(val);
    }
  }

  public get locale(): string | undefined {
    if (this.parent) {
      return this.parent.locale;
    }
    return this._localeSubject.value;
  }

  public writeValue(val: any): void {
    this.value = val;
  }

  public get value(): any {
    if (this.parent) {
      return this.parent.value;
    }
    return this._value;
  }

  @Input() public set value(val: any) {
    if (this.parent) {
      this.parent.value = val;
      return;
    }
    const newVal = this.coerceValue(val);
    if (this.compareValuesInternal(this._value, newVal)) {
      return;
    }
    this._value = newVal;
    this.raiseOnChange(newVal);
  }

  public raiseOnChange(val: any): void {
    if (typeof this._onchange === 'function') {
      this._onchange(val);
    }
    this.valueChange.emit(val);
  }

  public ngOnDestroy() {
    const thisT = this as unknown as (IBaseValueAccessor<T> & T);
    if (this._parent) {
      this._parent.removeBoundChild(thisT);
    }
    for (let i = 0; i < this._boundChildren.length; i++) {
      this._subs[i].unsubscribe();
      this._boundChildren[i].parent = undefined;
    }
    this._subs.splice(0, this._subs.length);
    this._boundChildren.splice(0, this._boundChildren.length);
  }

  public registerOnChange(fn: any): void {
    if (typeof fn === 'function') {
      this._onchange = fn;
    }
  }

  public registerOnTouched(fn: any): void {
    if (typeof fn === 'function') {
      this._ontouch = fn;
    }
  }

  public raiseOnTouch(): void {
    if (typeof this._ontouch === 'function') {
      this._ontouch();
    }
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public coerceValue(val: any): any {
    return val;
  }

  public compareValues(v1: any, v2: any): boolean {
    return v1 === v2;
  }

  protected onIsRtlChanged(): void {
    // Do nothing
  }

  private compareValuesInternal(v1: any, v2: any): boolean {
    if (v1 === v2) {
      return true;
    }
    if (v1 === null || v1 === undefined) {
      return false;
    }
    if (v2 === null || v2 === undefined) {
      return false;
    }
    if (typeof v1 !== typeof v2) {
      return false;
    }
    return this.compareValues(v1, v2);
  }
}
