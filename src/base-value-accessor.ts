import { OnDestroy, Input, Output, EventEmitter, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Subscription } from "rxjs/Subscription";
import 'rxjs/add/observable/combineLatest';

import { ICultureService } from '@code-art/angular-globalize';
import { IBaseValueAccessor, ICompositeObject  } from "./interfaces";


export abstract class BaseValueAccessor<T> implements OnDestroy, IBaseValueAccessor<T>, ICompositeObject<T> {

    private readonly _boundChildren: (IBaseValueAccessor<T> & T)[] = [];
    private readonly _subs: Subscription[] = [];
    private readonly _localeSubject = new ReplaySubject<string>();
    private readonly _localeObservable = this._localeSubject.asObservable();
    private _parent: IBaseValueAccessor<T> & T = null;
    private _effectiveLocale: string = null;
    private _disabled = false;
    private _locale: string = undefined;
    private _onchange: (val: any) => void = null;
    private _ontouch: () => void = null;
    private _value: any = null;
    private _valueSet: boolean = false;
    
    private readonly _localeSubscription = Observable.combineLatest(this._localeObservable, this.cultureService.cultureObservable)
        .subscribe({
            next: vals => {
                const [localeVal, cultureVal] = vals;
                this.effectiveLocale = localeVal || cultureVal;
            }
        });

    constructor(readonly cultureService: ICultureService, readonly changeDetector: ChangeDetectorRef) {
        this.effectiveLocale = this.cultureService.currentCulture;
        this.locale = null;

    }

    addBoundChild(child: IBaseValueAccessor<T> & T): void {
        let thisT = this as IBaseValueAccessor<T> as (IBaseValueAccessor<T> & T);
        if (child === thisT) {
            throw `Cannot bind to self`;
        }
        if (child.parent === thisT || this._boundChildren.indexOf(child) >= 0) {
            return;
        }

        this._boundChildren.push(child);
        child.value = this.value;
        this._subs.push(this.valueChange.asObservable().subscribe(v => {
            child.valueChange.emit(v);
        }));
        child.parent = thisT;
        if (child.changeDetector) {
            child.changeDetector.detectChanges();
        }
    }

    removeBoundChild(child: IBaseValueAccessor<T> & T): void {
        let thisT = this as IBaseValueAccessor<T> as (IBaseValueAccessor<T> & T);
        const index = this._boundChildren.indexOf(child);
        if (index >= 0) {
            this._subs[index].unsubscribe();
            this._subs.splice(index, 1);
            this._boundChildren.splice(index, 1);
        }
        if (child.parent === thisT) {
            child.parent = null;
        }
    }

    get parent(): IBaseValueAccessor<T> & T {
        return this._parent;
    }

    set parent(val: IBaseValueAccessor<T> & T) {
        this._parent = val;
    }

    get effectiveLocale(): string {
        if (this.parent) {
            return this.parent.effectiveLocale;
        }
        return this._effectiveLocale;
    }

    set effectiveLocale(val: string) {
        if (this.parent) {
            this.parent.effectiveLocale = val;
            return;
        }
        this._effectiveLocale = val;
    }

    @Input() set disabled(val: boolean) {
        if (this.parent) {
            this.parent.disabled = val;
            return;
        }
        this._disabled = !!val;
    }

    get disabled(): boolean {
        if (this.parent) {
            return this.parent.disabled;
        }
        return this._disabled;
    }

    @Input() set locale(val: string) {
        if (this.parent) {
            this.parent.locale = val;
            return;
        }
        if (this._locale !== val) {
            this._locale = val;
            this._localeSubject.next(val);
        }
    }

    get locale(): string {
        if (this.parent) {
            return this.parent.locale;
        }
        return this._locale;
    }

    writeValue(val: any): void {
        this.value = val;
    }

    get value(): any {
        if (this.parent) {
            return this.parent.value;
        }
        return this._value;
    }

    @Input() set value(val: any) {
        if (this.parent) {
            this.parent.value = val;
            return;
        }
        const newVal = this.coerceValue(val);
        if (this.compareValuesInternal(this._value, newVal)) {
            return;
        }
        this._value = newVal;
        this.raiseOnChange(newVal);
    }

    @Output() readonly valueChange: EventEmitter<any> = new EventEmitter<any>();

    protected onIsRtlChanged(): void {

    }

    ngOnDestroy() {
        this._localeSubscription.unsubscribe();
        let thisT = this as IBaseValueAccessor<T> as (IBaseValueAccessor<T> & T);
        if (this._parent) {
            this._parent.removeBoundChild(thisT);
        }
        for (let i = 0; i < this._boundChildren.length; i++) {
            this._subs[i].unsubscribe();
            this._boundChildren[i].parent = null;
        }
        this._subs.splice(0, this._subs.length);
        this._boundChildren.splice(0, this._boundChildren.length);
    }


    registerOnChange(fn: any): void {
        if (typeof fn === 'function') {
            this._onchange = fn;
        }
    }

    private raiseOnChange(val: any): void {
        if (typeof this._onchange === 'function') {
            this._onchange(val);
        }
        this.valueChange.emit(val)
    }

    registerOnTouched(fn: any): void {
        if (typeof fn === 'function') {
            this._ontouch = fn;
        }
    }

    raiseOnTouch(): void {
        if (typeof this._ontouch === 'function') {
            this._ontouch();
        }
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = !!isDisabled;
    }

    coerceValue(val: any): any {
        return val;
    }

    compareValues(v1: any, v2: any): boolean {
        return v1 === v2;
    }

    private compareValuesInternal(v1: any, v2: any): boolean {
        if (v1 === v2) {
            return true;
        }
        if (v1 === null || v1 === undefined) return false;
        if (v2 === null || v2 === undefined) return false;
        if (typeof v1 !== typeof v2) return false;
        return this.compareValues(v1, v2);
    }
}
