import { Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';

import {
  CANG_LOCALE_PROVIDER,
  StorageLocaleProviderService, CANG_DEFAULT_LOCALE_KEY,
  CANG_LOCALE_STORAGE_KEY, AngularGlobalizeModule
} from '@code-art/angular-globalize';

import { ICON_COMPONENTS } from '../lib/components/icons';
import { GlobalizeDataModule } from '../../../../src/app/globalize-data/globalize-data.module';
import { GlobalizeDataEnGBModule } from '../../../../src/app/globalize-data/globalize-data-en-gb.module';
import { GlobalizeDataArEGModule } from '../../../../src/app/globalize-data/globalize-data-ar-eg.module';
import { GlobalizeDataDeModule } from '../../../../src/app/globalize-data/globalize-data-de.module';

export async function initComponentTest(...args: Type<any>[]): Promise<any> {
  localStorage.clear();
  return TestBed.configureTestingModule({
    imports: [
      AngularGlobalizeModule,
      CommonModule,
      FormsModule,
      GlobalizeDataModule,
      GlobalizeDataEnGBModule,
      GlobalizeDataDeModule,
      GlobalizeDataArEGModule,
      AngularGlobalizeModule.forRoot(['en-GB', 'de', 'ar-EG']),
    ],
    providers: [
      {
        provide: CANG_LOCALE_PROVIDER, useClass: StorageLocaleProviderService, multi: true,
      },
      { provide: CANG_LOCALE_STORAGE_KEY, useValue: CANG_DEFAULT_LOCALE_KEY },
    ],
    declarations: [...args.concat(ICON_COMPONENTS)],
  }).compileComponents();
}
