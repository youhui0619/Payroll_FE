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
    { label: 'Dashboard', icon: 'ant-design:dashboard-outlined', route: '/dashboard', badge: 10 },
    
    
    { header: 'Workforce' },
    { label: 'Employees', icon: 'ci:users', route: '/workforce/employees/list' },
    { label: 'Organization', icon: 'akar-icons:shipping-box-01', children: [
        { label: 'Departments', icon: 'codex:dot-circle', route: '/organization/departments/overview' },
        { label: 'Positions', icon: 'codex:dot-circle', route: '/inventory/list', badge: 10 },
        { label: 'Work Locations', icon: 'codex:dot-circle', route: '/inventory/list', badge: 10 },
       ]
    },
    
    { header: 'Time & Leave' },
    { label: 'Attendance', icon: 'akar-icons:shipping-box-01', children: [
        { label: 'Overview', icon: 'codex:dot-circle', route: '/time-leave/attendance/overview' },
        { label: 'Attendance Adjustments', icon: 'codex:dot-circle', route: '/inventory/list', badge: 10 },
       ]
    },
    { label: 'Leave', icon: 'akar-icons:shipping-box-01', children: [
        { label: 'Overview', icon: 'codex:dot-circle', route: '/time-leave/leave/overview' },
        { label: 'Leave Applications', icon: 'codex:dot-circle', route: '/inventory/list', badge: 10 },
        { label: 'Leave Approvals', icon: 'codex:dot-circle', route: '/inventory/list', badge: 10 },
      ]
    },
    { label: 'Overtime', icon: 'akar-icons:shipping-box-01', children: [
        { label: 'Overview', icon: 'codex:dot-circle', route: '/inventory/list', badge: 10 },
        { label: 'OT Approvals', icon: 'codex:dot-circle', route: '/inventory/list', badge: 10 },
        { label: 'OT History', icon: 'codex:dot-circle', route: '/inventory/list', badge: 10 },
      ]
    },
    
    { header: 'Payroll' },
    { label: 'Payroll', icon: 'akar-icons:shipping-box-01', children: [
        { label: 'Overview', icon: 'codex:dot-circle', route: '/payroll/overview' },
       ]
    },
    { label: 'Payslips List', icon: 'ant-design:shop-outlined', route: '/warehouses/list', badge: 10 },
    { label: 'Tax & PCB', icon: 'akar-icons:shipping-box-01', children: [
        { label: 'PCB Calculation', icon: 'codex:dot-circle', route: '/inventory/list', badge: 10 },
        { label: 'PCB Records', icon: 'codex:dot-circle', route: '/inventory/list', badge: 10 },
        { label: 'Tax', icon: 'codex:dot-circle', route: '/inventory/list', badge: 10 },
      ]
    },

    { header: 'Statutory' },
    { label: 'EPF', icon: 'ant-design:shop-outlined', route: '/warehouses/list', badge: 10 },
    { label: 'SOCSO', icon: 'ant-design:shop-outlined', route: '/warehouses/list', badge: 10 },
    { label: 'LHDN', icon: 'ant-design:shop-outlined', route: '/warehouses/list', badge: 10 },
    
    
    { header: 'Reports' },
    { label: 'Payroll Reports', icon: 'ant-design:shop-outlined', route: '/warehouses/list', badge: 10 },
    { label: 'Attendance Reports', icon: 'ant-design:shop-outlined', route: '/warehouses/list', badge: 10},
    { label: 'Leave Reports', icon: 'ant-design:shop-outlined', route: '/warehouses/list', badge: 10 },
    { label: 'Statutory Reports', icon: 'ant-design:shop-outlined', route: '/warehouses/list', badge: 10 },
    

    { header: 'Setting' },
    { label: 'Company', icon: 'solar:magnifer-line-duotone', children: [
        { label: 'Company Profile', icon: 'codex:dot-circle', route: '/settings/company/profile' },
        { label: 'Work Schedule', icon: 'codex:dot-circle', route: '/roles/create', badge: 10 },
        { label: 'Public Holidays', icon: 'codex:dot-circle', route: '/settings/public-holidays/list' },
        { label: 'Leave Settings', icon: 'codex:dot-circle', route: '/settings/leave-settings/overview' },
        { label: 'Payroll Settings', icon: 'codex:dot-circle', route: '/roles/create', badge: 10 }
      ] 
    },
    { label: 'Access Control', icon: 'solar:magnifer-line-duotone', children: [
        { label: 'Users', icon: 'codex:dot-circle', route: '/roles', badge: 10 },
        { label: 'Roles & Permissions', icon: 'codex:dot-circle', route: '/roles/create', badge: 10 },
      ] 
    }
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