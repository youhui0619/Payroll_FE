import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { departments } from '../../../../data/departments';
import { employees } from '../../../../data/employees';
import { positions } from '../../../../data/positions';
import type { EmployeeRecord } from '../../../../models/employee.model';
import type { Position } from '../../../../models/position.model';

interface PositionTreeNode {
  position: Position;
  children: PositionTreeNode[];
}

@Component({
  selector: 'app-view',
  imports: [CommonModule, ...MaterialImports, RouterLink],
  providers: [...MaterialProviders],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  position!: Position;
  departmentName = '—';
  employees: EmployeeRecord[] = [];
  organizationTree: PositionTreeNode[] = [];

  constructor(route: ActivatedRoute) {
    route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const positionId = params.get('id');
      const position = positions.find(item => item.id === positionId) ?? positions[0];
      if (!position) return;

      this.position = position;
      this.departmentName = departments.find(item => item.id === position.departmentId)?.name ?? '—';
      this.employees = employees.filter(employee => employee.position === position.title);
      this.organizationTree = this.buildOrganizationTree();
    });
  }

  get status(): 'Active' | 'Inactive' {
    const today = this.todayKey();
    return !this.position.effectiveTo || this.position.effectiveTo >= today ? 'Active' : 'Inactive';
  }

  get jobLevelLabel(): string {
    return this.position.jobLevel.charAt(0) + this.position.jobLevel.slice(1).toLowerCase();
  }

  positionEmployeeCount(position: Position): number {
    return employees.filter(employee => employee.position === position.title).length;
  }

  employeeStatusClass(status: string): string {
    switch (status.toLocaleLowerCase()) {
      case 'active': return 'bg-light-primary text-primary';
      case 'probation': return 'bg-light-warning text-warning';
      default: return 'bg-light-secondary text-secondary';
    }
  }

  positionStatus(position: Position): 'Active' | 'Inactive' {
    return !position.effectiveTo || position.effectiveTo >= this.todayKey() ? 'Active' : 'Inactive';
  }

  private buildOrganizationTree(): PositionTreeNode[] {
    const buildNode = (position: Position, visited: Set<string>): PositionTreeNode => {
      const nextVisited = new Set(visited);
      nextVisited.add(position.id);

      return {
        position,
        children: positions
          .filter(item => item.reportsTo === position.title && !nextVisited.has(item.id))
          .map(child => buildNode(child, nextVisited))
      };
    };

    return [buildNode(this.position, new Set())];
  }

  private todayKey(): string {
    const today = new Date();
    return [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
  }
}
