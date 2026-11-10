import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.scss'
})
export class SkeletonLoaderComponent {
  @Input() rows = 6;
  @Input() columns = 5;
  @Input() summaryCards = 0;
  @Input() firstColumnWidth = '';
  @Input() columnWidth = 'minmax(0, 1fr)';
  @Input() variant: 'table' | 'chart' | 'list' | 'calendar' = 'table';
  @Input() chartType: 'bar' | 'donut' = 'bar';
  @Input() items = 4;

  get gridTemplateColumns(): string {
    const columnCount = Math.max(1, this.columns);
    if (!this.firstColumnWidth) return `repeat(${columnCount}, ${this.columnWidth})`;
    if (columnCount === 1) return this.firstColumnWidth;
    return `${this.firstColumnWidth} repeat(${columnCount - 1}, ${this.columnWidth})`;
  }

  get rowItems(): number[] {
    return Array.from({ length: Math.max(0, this.rows) }, (_, index) => index);
  }

  get columnItems(): number[] {
    return Array.from({ length: Math.max(0, this.columns) }, (_, index) => index);
  }

  get summaryCardItems(): number[] {
    return Array.from({ length: Math.max(0, this.summaryCards) }, (_, index) => index);
  }

  get listItems(): number[] {
    return Array.from({ length: Math.max(0, this.items) }, (_, index) => index);
  }
}
