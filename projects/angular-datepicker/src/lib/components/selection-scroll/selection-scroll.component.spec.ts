import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionScrollComponent } from './selection-scroll.component';

describe('SelectionScrollComponent', () => {
  let component: SelectionScrollComponent;
  let fixture: ComponentFixture<SelectionScrollComponent>;

  beforeEach(async(() => {
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
