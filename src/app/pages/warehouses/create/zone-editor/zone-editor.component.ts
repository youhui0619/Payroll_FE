import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SafeHtml } from '@angular/platform-browser';
import { TablerIconComponent, provideTablerIcons } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { MatOption, MatSelect } from '@angular/material/select';


interface Point { x:   number; y: number; }
interface Circle { center: Point; radius: number; }
interface Zone { id: number; name: string; color: string; points: Point[]; circle?: Circle; }

@Component({
  selector: 'app-zone-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, TablerIconComponent, MatOption, MatSelect],
  providers: [provideTablerIcons(TablerIcons)],
  templateUrl: './zone-editor.component.html',
  styleUrl: './zone-editor.component.scss'
})
export class ZoneEditorComponent implements OnInit {
  @Input() layout: SafeHtml = '';
  zones: Zone[] = [];
  tool: 'select' | 'rectangle' | 'polygon' | 'circle' = 'select';
  draft: Point[] = [];
  draftCircle: Circle | null = null;
  selectedId: number | null = null;
  name = '';
  color = '#ff4d18';
  message = '';
  private nextId = 1;
  private start: Point | null = null;
  private pointerId: number | null = null;

  ngOnInit(): void {
    // Native color inputs and downloaded SVGs need a concrete color value.
    const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    if (primary) this.color = primary;
  }

  points(points: Point[]): string { return points.map(p => `${p.x},${p.y}`).join(' '); }
  labelPosition(zone: Zone): Point {
    if (zone.circle) return zone.circle.center;
    return { x: zone.points.reduce((sum, p) => sum + p.x, 0) / zone.points.length,
      y: zone.points.reduce((sum, p) => sum + p.y, 0) / zone.points.length };
  }
  setTool(tool: 'select' | 'rectangle' | 'polygon' | 'circle'): void {
    this.cancel();
    this.tool = tool;
    this.selectedId = null;
    this.name = '';
  }
  private position(event: PointerEvent): Point | null {
    const svg = event.currentTarget as SVGSVGElement;
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: Math.max(0, Math.min(1849.07, point.x)), y: Math.max(0, Math.min(1018.09, point.y)) };
  }
  pointerDown(event: PointerEvent): void {
    if (this.tool === 'select' || !event.isPrimary || event.button !== 0 || this.pointerId !== null) return;
    const point = this.position(event);
    if (!point) return;
    event.preventDefault();
    this.message = '';
    if (this.tool === 'polygon') {
      this.draft = [...this.draft, point];
    } else {
      this.start = point;
      this.draft = [];
      this.draftCircle = null;
      this.pointerId = event.pointerId;
      (event.currentTarget as SVGSVGElement).setPointerCapture(event.pointerId);
    }
  }
  pointerMove(event: PointerEvent): void {
    if (!this.start || event.pointerId !== this.pointerId) return;
    const point = this.position(event);
    if (point && this.tool === 'circle') {
      this.draftCircle = {
        center: { ...this.start },
        radius: Math.min(Math.hypot(point.x - this.start.x, point.y - this.start.y),
          this.start.x, this.start.y, 1849.07 - this.start.x, 1018.09 - this.start.y)
      };
      return;
    }
    if (point) this.draft = [this.start, { x: point.x, y: this.start.y }, point, { x: this.start.x, y: point.y }];
  }
  pointerUp(event: PointerEvent): void {
    if (event.pointerId !== this.pointerId) return;
    this.pointerMove(event);
    this.start = null;
    this.pointerId = null;
    const svg = event.currentTarget as SVGSVGElement;
    if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
  }
  cancel(): void { this.draft = []; this.draftCircle = null; this.start = null; this.pointerId = null; this.message = ''; }
  undo(): void { this.draft = this.draft.slice(0, -1); }
  select(zone: Zone): void {
    if (this.tool !== 'select') return;
    this.selectedId = zone.id;
    this.name = zone.name;
    this.color = zone.color;
    this.message = '';
  }
  save(): void {
    const name = this.name.trim();
    if (!name) { this.message = 'Enter a zone name.'; return; }
    if (this.zones.some(z => z.id !== this.selectedId && z.name.toLowerCase() === name.toLowerCase())) {
      this.message = 'Use a unique zone name.'; return;
    }
    const selected = this.zones.find(z => z.id === this.selectedId);
    if (selected) {
      selected.name = name;
      selected.color = this.color;
    } else {
      const area = this.draftCircle ? Math.PI * this.draftCircle.radius ** 2 : Math.abs(this.draft.reduce((sum, p, i, points) => {
        const next = points[(i + 1) % points.length];
        return sum + p.x * next.y - next.x * p.y;
      }, 0)) / 2;
      if ((!this.draftCircle && this.draft.length < 3) || area < 25) { this.message = 'Draw a larger zone. Polygons need at least three corners.'; return; }
      const zone = { id: this.nextId++, name, color: this.color, points: [...this.draft], circle: this.draftCircle ? { center: { ...this.draftCircle.center }, radius: this.draftCircle.radius } : undefined };
      this.zones = [...this.zones, zone];
      this.selectedId = zone.id;
    }
    this.cancel();
    this.tool = 'select';
    this.message = 'Zone saved in this form. Download SVG to keep a copy.';
  }
  remove(zone: Zone): void {
    this.zones = this.zones.filter(z => z.id !== zone.id);
    if (this.selectedId === zone.id) { this.selectedId = null; this.name = ''; }
  }
  download(background: HTMLElement): void {
    const original = background.querySelector('svg');
    if (!original) return;
    const svg = original.cloneNode(true) as SVGSVGElement;
    const ns = 'http://www.w3.org/2000/svg';
    for (const zone of this.zones) {
      const group = document.createElementNS(ns, 'g');
      group.setAttribute('data-zone-id', String(zone.id));
      group.setAttribute('data-zone-name', zone.name);
      const shape = document.createElementNS(ns, zone.circle ? 'circle' : 'polygon');
      if (zone.circle) {
        shape.setAttribute('cx', String(zone.circle.center.x));
        shape.setAttribute('cy', String(zone.circle.center.y));
        shape.setAttribute('r', String(zone.circle.radius));
      } else {
        shape.setAttribute('points', this.points(zone.points));
      }
      shape.setAttribute('fill', zone.color);
      shape.setAttribute('fill-opacity', '0.25');
      shape.setAttribute('stroke', zone.color);
      shape.setAttribute('stroke-width', '1');
      const text = document.createElementNS(ns, 'text');
      const position = this.labelPosition(zone);
      text.setAttribute('x', String(position.x));
      text.setAttribute('y', String(position.y));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '24');
      text.setAttribute('fill', '#111827');
      text.textContent = zone.name;
      group.append(shape, text);
      svg.append(group);
    }
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'warehouse-zones.svg';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
