import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularGlobalizeModule } from '@code-art/angular-globalize';

import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { DateRangePickerComponent } from './components/date-picker/date-range-picker.component';
import { DateTimePickerComponent } from './components/datetime-picker/datetime-picker.component';
import { ICON_COMPONENTS } from './components/icons/index';
import { PopupComponent } from './components/popup/popup.component';
import { SelectionScrollComponent } from './components/selection-scroll/selection-scroll.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { BaseDatePickerDirective } from './directives/base-date-picker-directive';
import { DatePickerDirective } from './directives/date-picker.directive';
import { DateRangePickerDirective } from './directives/date-range-picker.directive';
import { DateTimePickerDirective } from './directives/datetime-picker.directive';
import { PopupHostDirective } from './directives/popup-host.directive';
import { PopupImplentation } from './directives/popup-implementation';
import { TimePickerDirective } from './directives/time-picker.directive';
import { applyMixins } from './util';

@NgModule({
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
  entryComponents: [
    PopupComponent,
    DatePickerComponent,
    DateRangePickerComponent,
    DateTimePickerComponent,
    TimePickerComponent,
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
  imports: [
    AngularGlobalizeModule, CommonModule, FormsModule,
  ],
})
export class AngularDatepickerModule {
  constructor() {
  }
}
