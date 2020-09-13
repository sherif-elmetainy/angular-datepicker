import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectionScrollComponent } from './selection-scroll.component';

describe('SelectionScrollComponent', () => {
  let component: SelectionScrollComponent;
  let fixture: ComponentFixture<SelectionScrollComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionScrollComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
