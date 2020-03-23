import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AngularGlobalizeModule, CANG_SUPPORTED_CULTURES } from '@code-art/angular-globalize';

import { AppComponent } from './app.component';

import { AngularDatepickerModule } from '@code-art/angular-datepicker';
import { LanguageSwitchComponent } from './components/language-switch/language-switch.component';

import { GlobalizeDataEnGBModule } from './globalize-data/globalize-data-en-gb.module';
import { GlobalizeDataDeModule } from './globalize-data/globalize-data-de.module';
import { GlobalizeDataArEGModule } from './globalize-data/globalize-data-ar-eg.module';
import { GlobalizeDataModule } from './globalize-data/globalize-data.module';

@NgModule({
  declarations: [
    AppComponent,
    LanguageSwitchComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AngularGlobalizeModule,
    AngularDatepickerModule,
    AngularGlobalizeModule.forRoot(['en-GB', 'de', 'ar-EG']),
    GlobalizeDataEnGBModule,
    GlobalizeDataDeModule,
    GlobalizeDataArEGModule,
    GlobalizeDataModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
