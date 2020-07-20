import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AngularGlobalizeModule } from '@code-art-eg/angular-globalize';

import { AppComponent } from './app.component';

import { AngularDatepickerModule } from '@code-art-eg/angular-datepicker';
import { LanguageSwitchComponent } from './components/language-switch/language-switch.component';

import { GlobalizeDataArEGModule } from './globalize-data/globalize-data-ar-eg.module';
import { GlobalizeDataDeModule } from './globalize-data/globalize-data-de.module';
import { GlobalizeDataEnGBModule } from './globalize-data/globalize-data-en-gb.module';
import { GlobalizeDataModule } from './globalize-data/globalize-data.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    LanguageSwitchComponent,
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
})
export class AppModule {
}
