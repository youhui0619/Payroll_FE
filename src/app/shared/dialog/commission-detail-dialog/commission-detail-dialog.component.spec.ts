import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionDetailDialogComponent } from './commission-detail-dialog.component';

describe('CommissionDetailDialogComponent', () => {
  let component: CommissionDetailDialogComponent;
  let fixture: ComponentFixture<CommissionDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommissionDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommissionDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
