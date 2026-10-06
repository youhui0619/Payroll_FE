import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show collapse icon when sidebar is open', () => {
    component.sidebarOpen = true;
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('i-tabler');
    expect(icon.name).toBe('layout-sidebar-left-collapse');
  });
});
