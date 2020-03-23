import {
  ComponentFactory, ComponentFactoryResolver, ComponentRef,
  ElementRef, EventEmitter, Injector, ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CurrentCultureService } from '@code-art/angular-globalize';
import { combineLatest, Observable, BehaviorSubject } from 'rxjs';
import { PopupComponent } from '../components/popup/popup.component';
import { IBaseValueAccessor, IPopupComponent, IPopupDirective, IPopupEvents } from '../interfaces';
import { takeUntilDestroyed, TakeUntilDestroyed } from '@code-art/rx-helpers';

@TakeUntilDestroyed()
export abstract class PopupImplentation<T> implements IPopupDirective<T>, IPopupEvents {
  public parent?: IBaseValueAccessor<T> & T;
  public value: any;
  public valueChange!: EventEmitter<any>;
  public disabled!: boolean;
  public locale?: string;
  public effectiveLocale?: string;
  public parseValue?: (val: string) => any;
  public cultureService!: CurrentCultureService;

  private componentRef?: ComponentRef<IPopupComponent<T>>;
  private _el!: ElementRef;
  private _controlValueAccessor?: ControlValueAccessor;
  private _viewContainerRef!: ViewContainerRef;
  private _orientRight?: boolean;
  private _orientTop?: boolean;
  private _formatObservable!: Observable<string>;
  private _formatSubject!: BehaviorSubject<string>;
  private _injector!: Injector;
  private _controlValue: any;
  private _resolver!: ComponentFactoryResolver;

  public abstract resolveFactory(): ComponentFactory<IBaseValueAccessor<T>>;

  public abstract coerceValue(val: any): any;

  public abstract compareValues(v1: any, v2: any): boolean;

  public abstract raiseOnTouch(): void;

  public abstract raiseOnChange(val: any): void;

  public abstract addBoundChild(child: IBaseValueAccessor<T> & T): void;

  public abstract removeBoundChild(child: IBaseValueAccessor<T> & T): void;

  public abstract writeValue(val: any): void;

  public abstract registerOnChange(fn: any): void;

  public abstract registerOnTouched(fn: any): void;

  public abstract getDefaultFormat(): string;

  public abstract formatValue(val: any, locale: string, format: string): string;

  public initPopupDirective(
    resolver: ComponentFactoryResolver,
    viewContainerRef: ViewContainerRef,
    el: ElementRef, injector: Injector,
  ): void {
    this._viewContainerRef = viewContainerRef;
    this._orientRight = undefined;
    this._orientTop = undefined;
    this._injector = injector;
    this._formatSubject = new BehaviorSubject(this.getDefaultFormat());
    this._formatObservable = this._formatSubject.asObservable();
    this._controlValue = null;
    this._el = el;
    this._resolver = resolver;
  }

  public setDisabledState(isDisabled: boolean): void {
    if (this._controlValueAccessor && typeof this._controlValueAccessor.setDisabledState === 'function') {
      this._controlValueAccessor.setDisabledState(isDisabled);
    }
  }

  public popupOnInit(): void {
    this.destroyInternal();
    this.selectAccessor();
    this.createComponent();
  }

  public popupOnDestroy(): void {
    this.destroyInternal();
  }

  public createComponent(): void {
    const factory = this._resolver.resolveComponentFactory<IPopupComponent<T>>(PopupComponent);
    this.componentRef = this._viewContainerRef.createComponent(factory);
    this.componentRef.instance.hostedElement = this._el;
    this.componentRef.instance.popupDirective = this;
  }

  public onFocus() {
    if (this.componentRef && this.componentRef.instance) {
      this.componentRef.instance.show = true;
    }
  }

  public onBlur() {
    if (this.componentRef && this.componentRef.instance) {
      this.componentRef.instance.show = false;
    }
  }

  set orientTop(val: boolean) {
    if (this._orientTop !== val) {
      this._orientTop = val;
    }
  }

  get orientTop(): boolean {
    if (this._orientTop === undefined || this._orientTop === null) {
      if (this._el && this._el.nativeElement) {
        const htmlEl = this._el.nativeElement as HTMLElement;
        if (typeof htmlEl.getBoundingClientRect === 'function' && window) {
          const rect = htmlEl.getBoundingClientRect();
          const winHeight = window.innerHeight;
          if (typeof winHeight === 'number'
            && rect && typeof (rect.top) === 'number' && typeof (rect.bottom) === 'number') {
            return rect.top > winHeight - rect.bottom;
          }
        }
      }
    }
    return false;
  }

  public set orientRight(val: boolean | undefined) {
    if (this._orientRight !== val) {
      this._orientRight = val;
    }
  }

  public get orientRight(): boolean | undefined {
    return this._orientRight === undefined || this._orientRight === null ?
      this.cultureService.isRightToLeft(this.effectiveLocale) : this._orientRight;
  }

  set format(val: string) {
    this._formatSubject.next(val);
  }

  get format(): string {
    return this._formatSubject.value;
  }

  private destroyInternal(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
    if (this._controlValueAccessor) {
      this._controlValueAccessor.registerOnChange(null);
      this._controlValueAccessor.registerOnTouched(null);
      this._controlValueAccessor = undefined;
    }
  }

  private selectAccessor(): void {
    let accessors = this._injector.get<ControlValueAccessor | ControlValueAccessor[]>(NG_VALUE_ACCESSOR);
    if (accessors) {
      accessors = Array.isArray(accessors) ? accessors : [accessors];
      for (let i = 0; i < accessors.length; i++) {
        if (accessors[i] !== this) {
          if (this._controlValueAccessor && accessors[i] !== this._controlValueAccessor) {
            throw new Error(`More than one control value accessor is provider.`);
          }
          this._controlValueAccessor = accessors[i];
        }
      }
    }
    if (!this._controlValueAccessor) {
      throw new Error(`No ControlValueAccessor available for the control. `
        + `Make sure FormsModule from @angular/forms is imported in your application.`);
    }
    this._controlValueAccessor.registerOnChange((v: any) => {
      this._controlValue = v;
      if (v === null || v === undefined || /^\s*$/.test(v)) {
        v = null;
      }
      const val = v === null ? null : typeof this.parseValue === 'function' ? this.parseValue(v) : v;
      const coercedValue = val === null ? val : this.coerceValue(val);
      if (v !== null) {
        if (coercedValue) {
          this.value = val;
        } else {
          this.raiseOnChange(v);
        }
      } else {
        this.value = null;
      }
    });
    combineLatest([this.cultureService.cultureObservable,
    this.valueChange.asObservable(), this._formatObservable])
    .pipe(takeUntilDestroyed(this))
    .subscribe((v) => {
      if (this._controlValueAccessor) {
        const [l, val, f] = v;
        if (typeof val === 'string') {
          this._controlValueAccessor.writeValue(val);
        } else {
          const locale = this.locale || l;
          const coercedValue = this.coerceValue(this._controlValue);
          if (!this.compareValues(coercedValue, val)) {
            this._controlValueAccessor.writeValue(this.formatValue(val, locale, f));
          }
        }
      }
    });
    this._controlValueAccessor.registerOnTouched(() => {
      this.raiseOnTouch();
    });
    if (this._controlValueAccessor && typeof this._controlValueAccessor.setDisabledState === 'function') {
      this._controlValueAccessor.setDisabledState(this.disabled);
    }
  }
}
