import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpaEditComponent } from './tpa-edit.component';

describe('TpaEditComponent', () => {
  let component: TpaEditComponent;
  let fixture: ComponentFixture<TpaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpaEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TpaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
