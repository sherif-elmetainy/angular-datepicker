import { NgModule } from '@angular/core';

import Globalize from 'globalize';
import numbers from 'cldr-data/main/ar-EG/numbers.json';

import calendar from 'cldr-data/main/ar-EG/ca-gregorian.json';
import timeZones from 'cldr-data/main/ar-EG/timeZoneNames.json';

// uncomment the following line to include currency data
// import currency from 'cldr-data/main/ar-EG/currencies.json';

/*
 * Module to add support for the ar-EG culture
 */
@NgModule()
export class GlobalizeDataArEGModule {
  constructor() {
    Globalize.load(numbers);

    // uncomment the following line to include currency data
    // Globalize.load(currency);


    Globalize.load(calendar);
    Globalize.load(timeZones);
  }
}
