import { NgModule } from '@angular/core';

import 'globalize/number';
// Uncomment the following line to include currency parsing/formatting functionality
// import 'globalize/currency';
import 'globalize/date';
// Uncomment the following line to include plural data for formatting currency with name or code options
// import 'globalize/plural';
import Globalize from 'globalize';

import likelySubtags from 'cldr-data/supplemental/likelySubtags.json';
import numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
// Uncomment the following line to include currency CLDR data
// import currencyData from 'cldr-data/supplemental/currencyData.json';


// Uncomment the following line to include plural data for formatting currency with name or code options
import plurals from 'cldr-data/supplemental/plurals.json';

import metaZones from 'cldr-data/supplemental/metaZones.json';
import timeData from 'cldr-data/supplemental/timeData.json';
import weekData from 'cldr-data/supplemental/weekData.json';


/*
 * Module to add support for globalize
 */
@NgModule()
export class GlobalizeDataModule {
  constructor() {
    Globalize.load(likelySubtags);
    Globalize.load(numberingSystems);

    // Uncomment the following line to load CLDR data for currencies
    // Globalize.load(currencyData);

    // Uncomment the following line to load CLDR data for plural (used for currency formatting)
    // Globalize.load(plurals);

    Globalize.load(metaZones);
    Globalize.load(timeData);
    Globalize.load(weekData);

  }
}
