
import {
  formatYear, getMonthYear,
  isPlainObject, numArray,
  sevenArray, sixArray
} from './util';
import { initComponentTest } from '../test/init-test-env';
import { GlobalizationService } from '@code-art/angular-globalize';
import { TestBed } from '@angular/core/testing';

class Test {
  public v = 3;
}

describe('isPlainObject', () => {
  it('returns false when not plain object', () => {
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
    expect(isPlainObject(0)).toBe(false);
    expect(isPlainObject(1)).toBe(false);
    expect(isPlainObject(/x/)).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(() => { /* */ })).toBe(false);
    expect(isPlainObject('test')).toBe(false);
    expect(isPlainObject([0])).toBe(false);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(['0'])).toBe(false);
    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject(false)).toBe(false);
    expect(isPlainObject(new Test())).toBe(false);
  });

  it('returns true when plain object', () => {
    expect(isPlainObject(Object.create({}))).toBe(true);
    expect(isPlainObject(Object.create(Object.prototype))).toBe(true);
    expect(isPlainObject({ x: 1 })).toBe(true);
    expect(isPlainObject({})).toBe(true);
  });
});


describe('Util formatYear', () => {
  let service: GlobalizationService;
  beforeEach(async () => {
    await initComponentTest();
    service = TestBed.get(GlobalizationService);
  });

  it('formats latin', () => {
    expect(formatYear(service, 2000)).toBe('2000');
    expect(formatYear(service, 2000, 'de')).toBe('2000');
    expect(formatYear(service, 2000, 'en-GB')).toBe('2000');
  });

  it('formats non latin', () => {
    expect(formatYear(service, 2000, 'ar-EG')).toBe('٢٠٠٠');
  });

  it('adds trailing zeros ', () => {
    expect(formatYear(service, 200, 'ar-EG')).toBe('٠٢٠٠');
    expect(formatYear(service, 200, 'de')).toBe('0200');
    expect(formatYear(service, 200, 'en-GB')).toBe('0200');
    expect(formatYear(service, 200)).toBe('0200');
    expect(formatYear(service, 0, 'ar-EG')).toBe('٠٠٠٠');
    expect(formatYear(service, 0, 'de')).toBe('0000');
    expect(formatYear(service, 0, 'en-GB')).toBe('0000');
    expect(formatYear(service, 0)).toBe('0000');
  });
});


describe('Util numArray', () => {
  it('returns correct length', () => {
    const x = 13;
    const res = numArray(x);
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(x);
    for (let i = 0; i < res.length; i++) {
      expect(res[i]).toBe(i);
    }
  });

  it('built in correct lengths', () => {
    expect(Array.isArray(sevenArray)).toBe(true);
    expect(Array.isArray(sixArray)).toBe(true);

    expect(sevenArray.length).toBe(7);
    expect(sixArray.length).toBe(6);
  });
});

describe('getMonthYear', () => {
  it('returns null when m === null', () => {
    const [m, y] = getMonthYear(undefined, 2000);
    expect(m).toBeUndefined();
    expect(y).toBe(2000);
  });

  it('returns same values when month in range', () => {
    let [m, y] = getMonthYear(0, 2000);
    expect(m).toBe(0);
    expect(y).toBe(2000);

    [m, y] = getMonthYear(11, 2000);
    expect(m).toBe(11);
    expect(y).toBe(2000);

    [m, y] = getMonthYear(7, 2000);
    expect(m).toBe(7);
    expect(y).toBe(2000);
  });

  it('decreases year when month is negative', () => {
    let [m, y] = getMonthYear(-1, 2000);
    expect(m).toBe(11);
    expect(y).toBe(1999);

    [m, y] = getMonthYear(-4, 2000);
    expect(m).toBe(8);
    expect(y).toBe(1999);

    [m, y] = getMonthYear(-13, 2000);
    expect(m).toBe(11);
    expect(y).toBe(1998);

    [m, y] = getMonthYear(-100, 2000);
    expect(m).toBe(8);
    expect(y).toBe(1991);
  });

  it('increases year when month is big', () => {
    let [m, y] = getMonthYear(13, 2000);
    expect(m).toBe(1);
    expect(y).toBe(2001);

    [m, y] = getMonthYear(23, 2000);
    expect(m).toBe(11);
    expect(y).toBe(2001);

    [m, y] = getMonthYear(100, 2000);
    expect(m).toBe(4);
    expect(y).toBe(2008);
  });
});
