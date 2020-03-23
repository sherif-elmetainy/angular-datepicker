# @code-art/angular-datepicker

## About the library

The `@code-art/angular-datepicker` library is a javascript library that a datepicker for [Angular 8](https://angular.io). 

## Consuming the library

## 1. Installing the library
The library depends on [angular-globalize](https://github.com/code-art-eg/angular-globalize) and [globalize](https://github.com/globalizejs/globalize) for localization and date formatting functionality. Please refer to the documentation of those packages for usage.

To install the library in your Angular application you need to run the following commands:

```bash
$ ng add @code-art/angular-globalize
$ npm install @code-art/angular-datepicker
```

Or

```bash
$ ng add @code-art/angular-globalize
$ yarn add @code-art/angular-datepicker
```

## 2. Import the angular module

After getting the library from npm you can use it in your Angular `AppModule`:

```typescript

import { AngularDatepickerModule } from '@code-art/angular-datepicker';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularDatepickerModule,
    FormsModule, // imported to use ngModel directive
  ],
  bootstrap: [AppComponent],
})
export class AppModule { 
    constructor() {
    }
}
```

## 3. Use the library components and directives in your app


```html
<!-- You can now use the library component in app.component.html -->
<h1>
  {{title}}
</h1>

<!-- Time Picker standalone component !-->
<cadp-timepicker [(ngModel)]="date"></cadp-timepicker>

<!-- Time Picker attached as a popup to a text input !-->
<input class='form-control' cadpTimePicker [(ngModel)]="time" />

<!-- Date range picker standalone component !-->
<cadp-daterangepicker  [(ngModel)]="range"></cadp-daterangepicker>

<!-- Date range Picker attached to a popup to a text input !-->
<input class='form-control' cadpDateRangePicker [(ngModel)]="range" />

<!-- Date/Time Picker standalone component !-->
<cadp-datetimepicker [(ngModel)]="datetime"></cadp-datetimepicker>

<!-- Date/Time Picker attached to a popup to a text input !-->
<input class='form-control' cadpDateTimePicker [(ngModel)]="datetime" />

<!-- Date Picker standalone component !-->
<cadp-datepicker [(ngModel)]="datetime"></cadp-datepicker>

<!-- Date/Time Picker attached to a popup to a text input !-->
<input class='form-control' cadpDatePicker [(ngModel)]="date" />
``` 

## TODO

The library needs better documentation, more samples and a demo site. 

## License

MIT © Sherif Elmetainy \(Code Art\)
