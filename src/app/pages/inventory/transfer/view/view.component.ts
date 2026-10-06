import { CommonModule } from '@angular/common';
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
import { TablerIconComponent, provideTablerIcons } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-view',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TablerIconComponent, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatCheckboxModule, MatRadioModule, MatDatepickerModule, MatSort, MatPaginator,MatMenuModule, MatSlideToggleModule, MatTabsModule, MatTooltipModule],
  providers: [provideNativeDateAdapter(), provideTablerIcons(TablerIcons)],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {

}
