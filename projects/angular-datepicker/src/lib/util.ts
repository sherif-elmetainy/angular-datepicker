import { GlobalizationService } from '@code-art/angular-globalize';

// tslint:disable-next-line: ban-types
export function applyMixins(derivedCtor: Function, ...baseCtors: Function[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      if (name === 'constructor') {
        return;
      }
      const pd = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
      if (pd && typeof pd.value === 'function' && !pd.get && !pd.set) {
        const fb1 = pd.value;
        const fd1 = derivedCtor.prototype[name];
        if (typeof fd1 === 'function') {
          derivedCtor.prototype[name] = function () {
            const args = [];
            for (let i = 0; i < arguments.length; i++) {
              args[i] = arguments[i];
            }
            fb1.apply(this, args);
            fd1.apply(this, args);
          };
        } else {
          derivedCtor.prototype[name] = fb1;
        }
      } else if (pd) {
        Object.defineProperty(derivedCtor.prototype, name, pd);
      }
    });
  });
}

export function isPlainObject(val: any): boolean {
  if (!val) {
    return false;
  }
  return typeof val === 'object'
    && val.constructor === Object;
}

export function formatYear(service: GlobalizationService, year: number, locale?: string): string {
  let res = service.formatNumber(year, locale, { useGrouping: false });
  if (res.length < 4) {
    const zero = service.formatNumber(0, locale, { useGrouping: false });
    while (res.length < 4) {
      res = zero + res;
    }
  }
  return res;
}

export function formatTimeComponent(service: GlobalizationService, val: number, locale?: string): string {
  let res = service.formatNumber(val, locale, { useGrouping: false });
  if (res.length < 2) {
    const zero = service.formatNumber(0, locale, { useGrouping: false });
    res = zero + res;
  }
  return res;
}

export function numArray(length: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < length; i++) {
    result.push(i);
  }
  return result;
}

export function getMonthYear(month: number | undefined, year: number): [number | undefined, number] {
  if (month === null || month === undefined) {
    return [undefined, year];
  }
  if (month < 0 || month > 11) {
    const dy = Math.floor(month / 12);
    month = month - dy * 12;
    year += dy;
  }
  return [month, year];
}

export type ViewType = 'days' | 'home';
export type NextPrevAction = 'next' | 'prev' | 'home' | 'reset';

export interface IMonthYearSelection {
  month?: number;
  year?: number;
  view?: ViewType;
  reset?: boolean;
}

export const sevenArray = numArray(7);
export const sixArray = numArray(6);

export enum KEY_CODE {
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft',
  UP_ARROW = 'ArrowUp',
  DOWN_ARROW = 'ArrowDown',
  ENTER = 'Enter',
}

export interface IDateRange {
  from: Date;
  to: Date;
}
