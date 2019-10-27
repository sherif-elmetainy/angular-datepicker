import { Component } from '@angular/core';
import { IShowDateTimePickerTime } from 'projects/angular-datepicker/src/lib/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public valdr: any;
  public valpr: any;
  public vald = new Date(2019, 9, 28, 21, 0);
  public valp: any;
  public valt: number|null = null;
  public valts: number|null = null;
  public valdd: Date|null = null;

  public showTime($event: IShowDateTimePickerTime): void {
    if ($event.scrollToTime === null || $event.scrollToTime === undefined) {
      $event.scrollToTime = 12 * 3_600_000;
    }
  }
}
