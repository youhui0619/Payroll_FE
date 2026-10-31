import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MaterialImports, MaterialProviders } from '../../material-imports';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [...MaterialImports, CommonModule],
  providers: [...MaterialProviders],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {

  @Input() title = 'Alert';
  @Input() message = '';
  @Input() approveLabel = 'Approve';
  @Input() rejectLabel = 'Reject';

  @Output() closed = new EventEmitter<void>();
  @Output() approved = new EventEmitter<void>();
  @Output() rejected = new EventEmitter<void>();


  close(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
