import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-full',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbComponent
],
  templateUrl: './full.component.html',
  styleUrl: './full.component.scss'
})
export class FullComponent {

  sidebarCollapsed = false;
  mobileSidebarOpen = false;
  sidebarSubheader = 'Administration';

  // sidebar menu is managed inside SidebarComponent

  private routerSub?: Subscription;
  private readonly MOBILE_BREAKPOINT = 768;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateCollapsed(window.innerWidth);

    this.routerSub = this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        // close sidebar on navigation when on small screens
        if (window.innerWidth < this.MOBILE_BREAKPOINT) {
          this.sidebarCollapsed = true;
          this.mobileSidebarOpen = false;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    const w = (event.target as Window).innerWidth;
    this.updateCollapsed(w);
  }

  private updateCollapsed(width: number): void {
    this.sidebarCollapsed = width < this.MOBILE_BREAKPOINT;
    if (this.sidebarCollapsed) this.mobileSidebarOpen = false;
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleMobileSidebar(): void {
    this.mobileSidebarOpen = !this.mobileSidebarOpen;
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen = false;
  }
}