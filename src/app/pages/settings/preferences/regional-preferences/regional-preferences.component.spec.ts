import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionalPreferencesComponent } from './regional-preferences.component';

describe('RegionalPreferencesComponent', () => {
  let component: RegionalPreferencesComponent;
  let fixture: ComponentFixture<RegionalPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionalPreferencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionalPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
