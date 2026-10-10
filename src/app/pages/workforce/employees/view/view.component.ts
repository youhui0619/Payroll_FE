import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { RouterLink } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { DropzoneComponent } from '../../../../shared/dropzone/dropzone.component';
import { FullCalendarModule, CalendarOptions } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/angular/daygrid';
import interactionPlugin from '@fullcalendar/angular/interaction';
import themePlugin from "@fullcalendar/angular/themes/monarch"; 

@Component({
  selector: 'app-view',
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule,  ToastrModule, FullCalendarModule],
  providers: [...MaterialProviders, ToastrService],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  selectedTabIndex = 0;

  get isWideTab(): boolean {
    return this.selectedTabIndex >= 3 && this.selectedTabIndex <= 5;
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, themePlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth',
    },
    fixedWeekCount: false,
    height: 'auto',
    contentHeight: 'auto',
    events: [],
    // eventContent: (arg) => this.renderEventContent(arg),
    // dateClick: (info) => {
    //   this.setSelectedByDate(info.dateStr);
    // },
    // eventClick: (info) => {
    //   const dateStr = info.event.startStr;
    //   this.setSelectedByDate(dateStr);
    // }
  };
}
