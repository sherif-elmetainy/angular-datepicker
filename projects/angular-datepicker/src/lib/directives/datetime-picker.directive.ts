import {
  ChangeDetectorRef, ComponentFactory, ComponentFactoryResolver, Directive, ElementRef,
  EventEmitter, forwardRef, HostListener, Injector, Input, OnDestroy, OnInit, Output, ViewContainerRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CurrentCultureService, GlobalizationService, TypeConverterService } from '@code-art/angular-globalize';
import { DateFormatterOptions } from 'globalize';
import { Subscription } from 'rxjs';
import { BaseDatePickerAccessorDirective } from '../base-date-picker-accessor-directive';
import { DateTimePickerComponent } from '../components/datetime-picker/datetime-picker.component';
import { IBaseValueAccessor, IDateTimePicker, IPopupDirective } from '../interfaces';
import { IShowDateTimePickerTime } from '../util';
import { Popup } from './popup';

@Popup()
@Directive({
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateTimePickerDirective),
  }],
  selector: '[cadpDateTimePicker]',
})
export class DateTimePickerDirective extends BaseDatePickerAccessorDirective<IDateTimePicker>
  implements IPopupDirective<IDateTimePicker>, IDateTimePicker, OnInit, OnDestroy {

  @HostListener('focus') public onFocus?: () => void;
  @HostListener('blur') public onBlur?: () => void;
  @Output() public readonly showTime = new EventEmitter<IShowDateTimePickerTime>();
  @Input() public orientTop: boolean | undefined;
  @Input() public orientRight: boolean | undefined;
  @Input() public format!: string;
  @Input() public minutesStep = 15;
  public parent: (IBaseValueAccessor<IDateTimePicker> & IDateTimePicker) | undefined;

  private _sub: Subscription|undefined;
  public initPopupDirective!: (resolver: ComponentFactoryResolver,
                               viewContainerRef: ViewContainerRef,
                               el: ElementRef,
                               injector: Injector) => void;

  constructor(resolver: ComponentFactoryResolver,
              viewContainerRef: ViewContainerRef,
              el: ElementRef,
              injector: Injector,
              cultureService: CurrentCultureService,
              private readonly globalizationService: GlobalizationService,
              changeDetector: ChangeDetectorRef,
              converterService: TypeConverterService) {
    super(cultureService, converterService, changeDetector);
    this.initPopupDirective(resolver, viewContainerRef, el, injector);
  }

  public getDefaultFormat(): string {
    return 'short';
  }

  public resolveFactory(resolver: ComponentFactoryResolver): ComponentFactory<DateTimePickerComponent> {
    return resolver.resolveComponentFactory(DateTimePickerComponent);
  }

  public addBoundChild(child: IBaseValueAccessor<IDateTimePicker> & IDateTimePicker): void {
    if (this._sub) {
      this._sub.unsubscribe();
      this._sub = undefined;
    }
    if (child && child.showTime) {
      this._sub = child.showTime.subscribe((e: IShowDateTimePickerTime) => this.showTime.emit(e));
    }
    super.addBoundChild(child);
  }

  public formatValue(val: any, locale: string, format: string): string {
    if (val === undefined || val === null) {
      return '';
    }
    if (val instanceof Date) {
      return this.formatDate(val, locale, format);
    }
    return '';
  }

  public ngOnInit(): void {
    // Do nothing
  }

  public ngOnDestroy(): void {
    if (this._sub) {
      this._sub.unsubscribe();
      this._sub = undefined;
    }
  }

  private formatDate(val: Date, locale: string, format: string) {
    format = format || 'short';
    let options: DateFormatterOptions;
    switch (format) {
      case 'short':
      case 'medium':
      case 'long':
      case 'full':
        options = { datetime: format };
        break;
      default:
        if (format.indexOf('raw:')) {
          options = { raw: format.substr(4) };
        } else {
          options = { skeleton: format };
        }
        break;
    }
    return this.globalizationService.formatDate(val, locale, options);
  }
}
