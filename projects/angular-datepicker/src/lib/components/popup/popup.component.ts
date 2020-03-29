import {
  Component, ComponentFactoryResolver,
  ElementRef, HostListener, Inject, ViewChild,
} from '@angular/core';
import type { ComponentRef } from '@angular/core';
import { PopupHostDirective } from '../../directives/popup-host.directive';
import { IBaseValueAccessor, IPopupComponent, IPopupDirective } from '../../interfaces';

@Component({
  styleUrls: ['./popup.component.scss'],
  templateUrl: './popup.component.html',
})
export class PopupComponent implements IPopupComponent<any> {
  public hostedElement!: ElementRef;
  public popupDirective!: IPopupDirective<any>;
  @ViewChild('inputhost') public inputHost?: ElementRef;

  private _mouseIn = false;
  private componentRef?: ComponentRef<IBaseValueAccessor<any>>;
  private _show = false;
  private _componenthost?: PopupHostDirective;
  private _mouseOutTimeOut: any;

  constructor(@Inject(ComponentFactoryResolver) private readonly resolver: ComponentFactoryResolver) {
    this._mouseOutTimeOut = null;
  }

  @ViewChild(PopupHostDirective) public set componenthost(val: PopupHostDirective | undefined) {
    if (val !== this._componenthost) {
      if (this.componentRef) {
        this.componentRef.destroy();
        this.componentRef = undefined;
      }
      this._componenthost = val;
      if (this._componenthost) {
        this.componentRef =
          this._componenthost.viewContainerRef.createComponent(
            this.popupDirective.resolveFactory(this.resolver));
        (this.componentRef.instance as any).isPopup = true;
        this.popupDirective.addBoundChild(this.componentRef.instance);
      }
    }
  }

  public get componenthost(): PopupHostDirective | undefined {
    return this._componenthost;
  }

  @HostListener('mouseenter')
  public mouseEnter(): void {
    this._mouseIn = true;
    if (this._mouseOutTimeOut) {
      clearTimeout(this._mouseOutTimeOut);
      this._mouseOutTimeOut = null;
    }
  }

  @HostListener('mouseleave')
  public mouseLeave(): void {
    this._mouseOutTimeOut = setTimeout(() => {
      this._mouseIn = false;
      this._mouseOutTimeOut = null;
    }, 200);
  }

  public set show(val: boolean) {
    if (this._show !== val) {
      this._show = val;
    }
  }

  public get show(): boolean {
    return this._show;
  }

  public get isVisible(): boolean {
    return this._show || this._mouseIn;
  }

  public get orientTop(): boolean | undefined {
    return this.popupDirective.orientTop;
  }

  public get orientRight(): boolean | undefined {
    return this.popupDirective.orientRight;
  }

  public get bottom(): string | null {
    if (!this.orientTop) {
      return null;
    }
    const el = this.hostedElement.nativeElement as HTMLElement;
    if (!el) {
      return null;
    }
    const parent = el.offsetParent as HTMLElement;
    if (!parent) {
      return null;
    }
    const bottom = parent.offsetHeight - el.offsetTop;
    return `${bottom}px`;
  }

  public get top(): string | null {
    if (this.orientTop) {
      return null;
    }
    const el = this.hostedElement.nativeElement as HTMLElement;
    if (!el) {
      return null;
    }
    const top = el.offsetTop + el.offsetHeight;
    return `${top}px`;
  }

  public get right(): string | null {
    if (!this.orientRight) {
      return null;
    }
    const el = this.hostedElement.nativeElement as HTMLElement;
    if (!el) {
      return null;
    }
    const parent = el.offsetParent as HTMLElement;
    if (!parent) {
      return null;
    }
    const right = parent.offsetWidth - (el.offsetLeft + el.offsetWidth);
    return `${right}px`;
  }

  public get left(): string | null {
    if (this.orientRight) {
      return null;
    }
    const el = this.hostedElement.nativeElement as HTMLElement;
    if (!el) {
      return null;
    }
    const left = el.offsetLeft;
    return `${left}px`;
  }
}
