import {
  ChangeDetectorRef, ComponentFactoryResolver, Directive, ElementRef,
  forwardRef, HostListener, Injector, Input, ViewContainerRef,
} from '@angular/core';
import type { ComponentFactory, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateFormatterOptions } from 'globalize';

import { CurrentCultureService, GlobalizationService } from '@code-art-eg/angular-globalize';
import { BaseTimeValueAccessorDirective } from '../base-time-value-accessor-directive';
import { TimePickerComponent } from '../components/time-picker/time-picker.component';
import { IPopupDirective, ITimePicker } from '../interfaces';
import { Popup } from './popup';

@Popup()
@Directive({
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TimePickerDirective),
  }],
  selector: '[cadpTimePicker]',
})
export class TimePickerDirective extends BaseTimeValueAccessorDirective
  implements IPopupDirective<ITimePicker>, ITimePicker, OnInit, OnDestroy {

  @HostListener('focus') public onFocus?: () => void;
  @HostListener('blur') public onBlur?: () => void;
  @Input() public orientTop!: boolean;
  @Input() public orientRight!: boolean;
  @Input() public format!: string;
  public initPopupDirective!: (resolver: ComponentFactoryResolver,
                               viewContainerRef: ViewContainerRef,
                               el: ElementRef, injector: Injector) => void;

  constructor(resolver: ComponentFactoryResolver,
              viewContainerRef: ViewContainerRef,
              el: ElementRef,
              injector: Injector,
              cultureService: CurrentCultureService,
              private readonly globalizationService: GlobalizationService,
              changeDetector: ChangeDetectorRef) {
    super(cultureService, globalizationService, changeDetector);
    this.initPopupDirective(resolver, viewContainerRef, el, injector);
  }

  public formatValue(val: number, locale: string, format: string): string {
    if (val === null || val === undefined) {
      return '';
    }
    const d = new Date(2000, 1, 1);
    d.setTime(val + d.valueOf());
    const d2 = new Date();

    d2.setHours(d.getHours());
    d2.setMinutes(d.getMinutes());
    d2.setSeconds(d.getSeconds());
    d2.setMilliseconds(d.getMilliseconds());

    format = format || 'short';
    let options: DateFormatterOptions;
    switch (format) {
      case 'short':
      case 'medium':
      case 'long':
      case 'full':
        options = { time: format };
        break;
      default:
        if (format.indexOf('raw:')) {
          options = { raw: format.substr(4) };
        } else {
          options = { skeleton: format };
        }
        break;
    }
    return this.globalizationService.formatDate(d2, locale, options);
  }

  public getDefaultFormat(): string {
    return 'short';
  }

  public resolveFactory(resolver: ComponentFactoryResolver): ComponentFactory<TimePickerComponent> {
    return resolver.resolveComponentFactory(TimePickerComponent);
  }

  public ngOnInit(): void {
    // Do nothing
  }

  public ngOnDestroy(): void {
    // Do nothing
  }
}
