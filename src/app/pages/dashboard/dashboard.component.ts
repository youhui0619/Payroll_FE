
import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ValidatorFn, FormControl, ValidationErrors, UntypedFormArray, NgForm, FormGroup, FormArray,FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox'
import {MatRadioModule} from '@angular/material/radio';
import {provideNativeDateAdapter} from '@angular/material/core';
import {DateRange, MatDatepickerModule} from '@angular/material/datepicker';
import { TablerIconComponent } from '@tabler/icons-angular';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import { MatDropzone } from '@ngx-dropzone/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatStepperModule } from '@angular/material/stepper';
import { FileInputDirective } from '@ngx-dropzone/cdk';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ChartOptions, NgApexchartsModule } from '../../shared/chart-imports';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TablerIconComponent, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatCheckboxModule, MatRadioModule, MatDatepickerModule, MatSort, MatPaginator, MatMenuModule, MatSlideToggleModule, MatTabsModule, MatAutocompleteModule, NgxDropzoneModule, MatStepperModule, NgApexchartsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  readonly years = Array.from({ length: 5 }, (_, index) => new Date().getFullYear() - index);
  public chartOptions: Partial<ChartOptions> = {
    series: [
      { name: 'Present', data: [112, 116, 114, 119, 121, 118, 120, 117, 123, 119, 125, 112] },
      { name: 'Annual leave', data: [8, 6, 9, 5, 4, 7, 5, 8, 3, 6, 2, 5] },
      { name: 'Unpaid leave', data: [3, 2, 4, 2, 3, 2, 1, 3, 2, 2, 1, 3] },
    ],
    chart: {
      type: 'bar',
      height: 320,
      stacked: true,
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: '#74808b',
      fontFamily: 'inherit',
    },
    colors: ['#2e7d32', '#03a9f4', '#e53935'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '48%',
        borderRadius: 3,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      title: { text: 'Employees' },
      labels: { formatter: (value) => `${Math.round(value)}` },
    },
    grid: { borderColor: '#e9ecef', strokeDashArray: 4 },
    legend: { position: 'bottom', horizontalAlign: 'left', offsetY: 4 },
    fill: { opacity: 1 },
    tooltip: { shared: true, intersect: false },
    responsive: [
      {
        breakpoint: 576,
        options: {
          chart: { height: 280 },
          plotOptions: { bar: { columnWidth: '60%' } },
          yaxis: { title: { text: undefined } },
        },
      },
    ],
  };
}
