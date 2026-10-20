import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { positions } from '../../../../data/positions';
import { departments } from '../../../../data/departments';
import { employees } from '../../../../data/employees';
import type { Position, PositionJobLevel } from '../../../../models/position.model';

@Component({
  selector: 'app-overview',
  imports: [CommonModule, FormsModule, ...MaterialImports, RouterLink],
  providers: [...MaterialProviders],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  readonly positions = positions;
  readonly departments = departments;
  readonly employees = employees;
  readonly jobLevels: PositionJobLevel[] = ['ENTRY', 'INTERMEDIATE', 'SENIOR', 'LEAD', 'MANAGER', 'DIRECTOR'];

  searchTerm = '';
  selectedDepartmentIds: string[] = [];
  selectedJobLevels: PositionJobLevel[] = [];

  get filteredPositions(): Position[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.positions.filter(position => {
      const matchesSearch = !query || [position.code, position.title, position.description, position.reportsTo ?? '']
        .some(value => value.toLowerCase().includes(query));
      const matchesDepartment = this.selectedDepartmentIds.length === 0
        || this.selectedDepartmentIds.includes(position.departmentId);
      const matchesLevel = this.selectedJobLevels.length === 0
        || this.selectedJobLevels.includes(position.jobLevel);
      return matchesSearch && matchesDepartment && matchesLevel;
    });
  }

  get activePositionCount(): number {
    return this.positions.filter(position => this.isActive(position)).length;
  }

  get inactivePositionCount(): number {
    return this.positions.length - this.activePositionCount;
  }

  departmentName(departmentId: string): string {
    return this.departments.find(department => department.id === departmentId)?.name ?? '-';
  }

  employeeCount(position: Position): number {
    return this.employees.filter(employee => employee.position === position.title).length;
  }

  jobLevelLabel(jobLevel: PositionJobLevel): string {
    return jobLevel.charAt(0) + jobLevel.slice(1).toLowerCase();
  }

  isActive(position: Position): boolean {
    return !position.effectiveTo || position.effectiveTo >= this.todayKey();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedDepartmentIds = [];
    this.selectedJobLevels = [];
  }

  private todayKey(): string {
    const today = new Date();
    return [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
  }

}
