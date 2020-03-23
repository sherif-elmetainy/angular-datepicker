import { NgModule } from '@angular/core';
import { AngularGlobalizeModule } from '@code-art/angular-globalize';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ICON_COMPONENTS } from './components/icons/index';
import { PopupHostDirective } from './directives/popup-host.directive';
import { PopupComponent } from './components/popup/popup.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { DateRangePickerComponent } from './components/date-picker/date-range-picker.component';
import { DateTimePickerComponent } from './components/datetime-picker/datetime-picker.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { DatePickerDirective } from './directives/date-picker.directive';
import { DateRangePickerDirective } from './directives/date-range-picker.directive';
import { DateTimePickerDirective } from './directives/datetime-picker.directive';
import { TimePickerDirective } from './directives/time-picker.directive';
import { PopupImplentation } from './directives/popup-implementation';
import { applyMixins } from './util';
import { BaseDatePickerDirective } from './directives/base-date-picker-directive';
import { SelectionScrollComponent } from './components/selection-scroll/selection-scroll.component';


@NgModule({
  imports: [
    AngularGlobalizeModule, CommonModule, FormsModule
  ],
  declarations: [
    ICON_COMPONENTS,
    PopupHostDirective,
    PopupComponent,
    DatePickerComponent,
    DateRangePickerComponent,
    DateTimePickerComponent,
    TimePickerComponent,
    DatePickerDirective,
    DateRangePickerDirective,
    DateTimePickerDirective,
    TimePickerDirective,
    SelectionScrollComponent,
  ],
  exports: [
    DatePickerComponent,
    DateRangePickerComponent,
    DateTimePickerComponent,
    TimePickerComponent,
    DatePickerDirective,
    DateRangePickerDirective,
    DateTimePickerDirective,
    TimePickerDirective,
  ],
  entryComponents: [
    PopupComponent,
    DatePickerComponent,
    DateRangePickerComponent,
    DateTimePickerComponent,
    TimePickerComponent,
  ]
})
export class AngularDatepickerModule {
  constructor() {
  }
}
