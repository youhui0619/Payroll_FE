import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  id?: number;
  header?: string;
  label?: string;
  icon?: string;
  badge?: number | string;
  route?: string;
  children?: MenuItem[];
}
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})


export class SidebarComponent implements OnInit, OnChanges {

  @Input() collapsed = false;
  @Input() mobileOpen = false;
  @Input() title = 'Admin Dashboard';

  @Output() closeMobile = new EventEmitter<void>();

  // dynamic menu
  @Input() menu?: MenuItem[];

  // map of open submenu states by item id
  openMap: Record<number, boolean> = {};
  private defaultMenu: MenuItem[] = [
    { header: 'Dashboard' },
    { label: 'Dashboard', icon: 'ant-design:dashboard-outlined', route: '/dashboard', badge: 1 },
    
    
    { header: 'Inventory' },
    { label: 'Inventory Management', icon: 'akar-icons:shipping-box-01', children: [
        { label: 'Inventory List', icon: 'codex:dot-circle', route: '/inventory/list', badge: 10 },
        { label: 'Inventory Adjustment', icon: 'codex:dot-circle', route: '/inventory/adjustment' },
        { label: 'Inventory Transfer', icon: 'codex:dot-circle', route: '/inventory/transfer' },
        { label: 'Low Stock Alert', icon: 'codex:dot-circle', route: '/inventory/low-stock' }
      ]
    },
    
    { header: 'Parties' },
    { label: 'Vendors', icon: 'ci:users', route: '/parties/vendors/list' },
    { label: 'Customers', icon: 'ci:users', route: '/parties/customers/list' },
    

    { header: 'Location & Storage' },
    { label: 'Warehouses', icon: 'ant-design:shop-outlined', route: '/warehouses/list' },
    
    
    { header: 'Main' },
    { label: 'Staff', icon: 'solar:magnifer-line-duotone', route: '/staff' },
    { label: 'Roles', icon: 'solar:magnifer-line-duotone', children: [
        { label: 'Role List', icon: 'codex:dot-circle', route: '/roles', badge: 10 },
        { label: 'Create Role', icon: 'codex:dot-circle', route: '/roles/create' }
      ] },
    { label: 'Reports', icon: 'solar:magnifer-line-duotone', route: '/reports' },
    {
      label: 'Settings',
      icon: 'solar:magnifer-line-duotone',
      children: [
        { label: 'Profile', icon: 'codex:dot-circle', route: '/settings/profile' },
        { label: 'System', icon: 'codex:dot-circle', route: '/settings/system' },
        { label: 'Integrations', icon: 'codex:dot-circle', route: '/settings/integrations' }
      ]
    },
    { header: 'Main' },
    { label: 'Staff', icon: 'solar:magnifer-line-duotone', route: '/staff' },
    { label: 'Roles', icon: 'solar:magnifer-line-duotone', children: [
        { label: 'Role List', icon: 'codex:dot-circle', route: '/roles' },
        { label: 'Create Role', icon: 'codex:dot-circle', route: '/roles/create' }
      ] },
    { label: 'Reports', icon: 'solar:magnifer-line-duotone', route: '/reports' },
  ];
  constructor(private router: Router) {}

  ngOnInit(): void {
    if (!this.menu || this.menu.length === 0) {
      this.menu = this.defaultMenu;
    }
    this.assignIds(this.menu);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collapsed'] && changes['collapsed'].currentValue) {
      // close all submenus when sidebar collapses
      this.openMap = {};
    }
    if (changes['mobileOpen'] && !changes['mobileOpen'].currentValue) {
      // close mobile-opened submenus when mobile menu closed
      this.openMap = {};
    }
  }

  private assignIds(items: MenuItem[] | undefined, startId = 0): number {
    if (!items) return startId;
    let id = startId;
    for (const it of items) {
      // only assign ids to actual menu items (skip headers)
      if (it.label) {
        it.id = id++;
      }
      if (it.children) {
        id = this.assignIds(it.children, id);
      }
    }
    return id;
  }

  isOpen(id?: number): boolean {
    return !!(id != null && this.openMap[id]);
  }

  hasChildBadge(item: MenuItem): boolean {
    return !!(item.children && item.children.some(c => c.badge != null && c.badge !== '' && c.badge !== 0 && c.badge !== '0'));
  }

  isItemActive(item: MenuItem): boolean {
    // Prefer Router.isActive for robust matching (handles query/fragments)
    try {
      if (item.route) {
        if (this.router.isActive(item.route, true)) return true; // exact match
        if (this.router.isActive(item.route, false)) return true; // startsWith style
      }
      if (item.children) {
        return item.children.some(c => c.route != null && (this.router.isActive(c.route as string, true) || this.router.isActive(c.route as string, false)));
      }
      return false;
    } catch (e) {
      // fallback to simple string compare
      const url = this.router.url || '';
      if (item.route && url === item.route) return true;
      if (item.children) return item.children.some(c => c.route != null && url.startsWith(c.route as string));
      return false;
    }
  }

  toggleSubmenu(id?: number, event?: Event): void {
    if (event) event.stopPropagation();
    if (id == null) return;
    const currentlyOpen = !!this.openMap[id];
    if (!currentlyOpen) {
      // close other submenus and open the requested one
      this.openMap = {};
      this.openMap[id] = true;
    } else {
      // close this submenu
      this.openMap[id] = false;
    }
  }

  onMenuClick(): void {
    if (this.mobileOpen) this.closeMobile.emit();
  }
}