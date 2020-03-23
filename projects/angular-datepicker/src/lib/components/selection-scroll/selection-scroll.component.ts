import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
  HostListener,
} from '@angular/core';
import { IShowDateTimePickerTime } from '../../util';

@Component({
  selector: 'cadp-selection-scroll',
  templateUrl: './selection-scroll.component.html',
  styleUrls: ['./selection-scroll.component.scss']
})
export class SelectionScrollComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() public minValue = 0;
  @Input() public maxValue = 1;
  @Input() formatter: (n: number) => string;
  @Input() public value: number | undefined;
  @Output() public valueChange = new EventEmitter<number>();
  @Output() public dismissed = new EventEmitter<boolean>();
  @Output() public scrolling = new EventEmitter<IShowDateTimePickerTime>();
  @ViewChild('selectionContainer', { static: true }) public selectionContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('optionsContainer', { static: true }) public optionsContainer!: ElementRef<HTMLDivElement>;

  private _selection: number | undefined;

  public displayArray: HTMLDivElement[] = [];

  constructor(
    private readonly renderer: Renderer2,
  ) {
    this.formatter = (i) => i.toString();
  }

  @HostListener('window:keyup', ['$event'])
  public onKeyup(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.dismissed.emit(true);
    }
  }

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {

  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.minValue || changes.maxValue) {
      this.rebuildArray();
      this.setSelection();
      this.scrollToSelection();
    } else {
      if (changes.value) {
        this.setSelection();
        this.scrollToSelection();
      }
      if (changes.formatter) {
        this.changeTexts();
      }
    }
  }

  private scrollToSelection() {
    window.setTimeout(() => {
      const h1 = this.optionsContainer.nativeElement.offsetHeight;
      const h2 = this.selectionContainer.nativeElement.offsetHeight;
      let val = this.value === undefined ? null : this.value;
      const evt: IShowDateTimePickerTime = {
        scrollToTime: val,
      };
      this.scrolling.emit(evt);
      val = evt.scrollToTime;
      if (h1 > h2 && val !== null && val !== undefined) {
        this.selectionContainer.nativeElement.scrollTop
          = (h1 / this.maxSize) * (val - this.minValue) - h2 / 2;
      }
    }, 10);
  }

  public setValue(val: number): void {
    this.valueChange.emit(val);
  }

  private changeTexts(): void {
    for (let i = 0; i < this.displayArray.length; i++) {
      this.displayArray[i].innerText = this.formatter(this.minValue + i);
    }
  }

  private setSelection(): void {
    if (this._selection !== undefined && this._selection < this.displayArray.length) {
      this.renderer.removeClass(this.displayArray[this._selection], 'selected');
    }
    if (this.value !== null && this.value !== undefined && this.value >= this.minValue && this.value <= this.maxValue) {
      this._selection = this.value - this.minValue;
      this.renderer.addClass(this.displayArray[this._selection], 'selected');
    }
  }

  private rebuildArray(): void {
    const ms = this.maxSize;
    for (let i = 0; i < ms; i++) {
      let div: HTMLDivElement;
      if (this.displayArray.length === i) {
        div = this.renderer.createElement('div');
        this.renderer.addClass(div, 'selection');
        this.renderer.appendChild(this.optionsContainer.nativeElement, div);
        this.displayArray.push(div);
        div.addEventListener('click', (e) => {
          e.stopPropagation();
          this.setValue(i + this.minValue);
        },
        );
      } else {
        div = this.displayArray[i];
      }
      div.innerText = this.formatter(i + this.minValue);
    }
    for (let j = ms; j < this.displayArray.length; j++) {
      this.renderer.removeChild(this.optionsContainer.nativeElement, this.displayArray[j]);
    }
    if (this.displayArray.length > ms) {
      this.displayArray.splice(ms, this.displayArray.length - ms);
    }
  }

  private get maxSize(): number {
    return (this.maxValue - this.minValue + 1);
  }
}
