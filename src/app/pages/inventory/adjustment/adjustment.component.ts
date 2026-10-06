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
import { MatDropzone } from '@ngx-dropzone/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FileInputDirective } from '@ngx-dropzone/cdk';

@Component({
  selector: 'app-adjustment',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TablerIconComponent, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatCheckboxModule, MatRadioModule, MatDatepickerModule, MatSort, MatPaginator,MatMenuModule, MatSlideToggleModule, MatTabsModule, MatAutocompleteModule, FileInputDirective, MatDropzone],
  providers: [provideNativeDateAdapter(), provideTablerIcons(TablerIcons)],
  templateUrl: './adjustment.component.html',
  styleUrl: './adjustment.component.scss'
})
export class AdjustmentComponent {

}
