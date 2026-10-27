import { Component, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  // open state is controlled by the parent (header)
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

    @Input() notifications: Array<{id:number,title:string,time:string,unread?:boolean}> = [];
    /** 'notifications' renders the built-in notifications panel; 'custom' uses projected content */
    @Input() mode: 'notifications' | 'custom' = 'notifications';
  @Output() markAllRead = new EventEmitter<void>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      if (this.isOpen) {
        this.isOpenChange.emit(false);
      }
    }
  }

  onMarkAllRead(): void {
    this.markAllRead.emit();
  }

  constructor(private el: ElementRef) {}
}
