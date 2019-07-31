import { Component } from '@angular/core';

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
}
