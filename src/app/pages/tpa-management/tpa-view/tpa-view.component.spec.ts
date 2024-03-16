import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpaViewComponent } from './tpa-view.component';

describe('TpaViewComponent', () => {
  let component: TpaViewComponent;
  let fixture: ComponentFixture<TpaViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpaViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TpaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
