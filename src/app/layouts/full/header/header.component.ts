 import { Component, Output, EventEmitter, ElementRef, HostListener, Input } from '@angular/core';

import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { TablerIconComponent, provideTablerIcons } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [BreadcrumbComponent, DropdownComponent, TablerIconComponent, MatButtonModule],
  providers: [
    provideTablerIcons(TablerIcons)
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  // dropdown open state controlled by header
  isDropdownOpen = false;

  // profile dropdown state
  isProfileOpen = false;

  @Input() sidebarOpen = true;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() toggleMobileSidebar = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onToggle(): void {
    this.toggleSidebar.emit();
  }

  onToggleMobile(): void {
    this.toggleMobileSidebar.emit();
  }

  // notifications data owned by header
  dropdownList = [
    { id: 1, title: 'New user signed up', time: '2m', unread: true },
    { id: 2, title: 'Server CPU high', time: '1h', unread: true },
    { id: 3, title: 'Backup completed', time: '1d', unread: false }
  ];

  
  
  markAllRead(): void {
    this.dropdownList = this.dropdownList.map(n => ({ ...n, unread: false }));
  }

  get unreadCount(): number {
    return (this.dropdownList || []).filter(n => n.unread).length;
  }

  get toggleIconName(): string {
    return !this.sidebarOpen ? 'layout-sidebar-left-expand' : 'layout-sidebar-left-collapse';
  }

  toggleProfile(event?: Event): void {
    if (event) event.stopPropagation();
    this.isProfileOpen = !this.isProfileOpen;
    if (this.isProfileOpen) {
      this.isDropdownOpen = false;
    }
  }

  toggleNotifications(event?: Event): void {
    if (event) event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.isProfileOpen = false;
    }
  }

  onLogout(): void {
    this.logout.emit();
    this.isProfileOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isProfileOpen = false;
    }
  }

  constructor(private el: ElementRef) {}

}