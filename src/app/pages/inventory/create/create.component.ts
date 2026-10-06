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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { DropzoneComponent } from '../../../shared/dropzone/dropzone.component';

@Component({
  selector: 'app-create',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TablerIconComponent, DropzoneComponent, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatCheckboxModule, MatRadioModule, MatDatepickerModule, MatSort, MatPaginator,MatMenuModule, MatSlideToggleModule, MatTabsModule, ToastrModule, MatAutocompleteModule, MatChipsModule],
  providers: [provideNativeDateAdapter(), provideTablerIcons(TablerIcons), ToastrService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  constructor(
    private toastr: ToastrService
  ) {}

  form = new FormGroup({
    name: new FormControl('', [Validators.required] ),
    sku: new FormControl('', [Validators.required] ),
    barcodeRef: new FormControl('', { nonNullable: true }),
    batchNo: new FormControl('', [Validators.required] ),
    serialNo: new FormControl('', [Validators.required] ),
    qrCodeRef: new FormControl('', { nonNullable: true }),
    uom: new FormControl('', [Validators.required] ),
    brand: new FormControl('', [Validators.required] ),
    model: new FormControl('', [Validators.required] ),
    description: new FormControl('', { nonNullable: true }),
    quantity: new FormControl<number | null>(null, [Validators.required]),
    maxQuantity: new FormControl<number | null>(null, [Validators.required]),
    expiryTracking: new FormControl(false, { nonNullable: true }),
    lowStockAlert: new FormControl(false, { nonNullable: true }),
    reorderLevel: new FormControl<number | null>(null, [Validators.required]),
    defaultLocation: new FormControl('', [Validators.required] ),
    warehouse: new FormControl('', [Validators.required] ),
    zone: new FormControl('', [Validators.required] ),
    rack: new FormControl('', [Validators.required] ),
    bin: new FormControl('', [Validators.required] ),
    location: new FormControl('', [Validators.required] ),
    supplier: new FormControl('', [Validators.required] ),
    unitPrice: new FormControl<number | null>(null, [Validators.required]),
    sellingPrice: new FormControl<number | null>(null, [Validators.required]),
    taxIncluded: new FormControl(false, { nonNullable: true }),
    taxType: new FormControl('', [Validators.required] ),
    taxRate: new FormControl<number | null>(null, [Validators.required]),
    totalValue: new FormControl<number | null>(null, [Validators.required]),
    notes: new FormControl('', { nonNullable: true }),
    category: new FormControl<string[]>([], { nonNullable: true }),
    image: new FormControl<File[]>([], { nonNullable: true }),
    files: new FormControl<File[]>([], { nonNullable: true }),
  });
  get tags(): string[] {
    return this.form.controls.category.value;
  }

  selectTag(tag: string): void {
    const value = tag.trim();
    if (value && !this.tags.includes(value)) {
      this.form.controls.category.setValue([...this.tags, value]);
      this.form.controls.category.markAsDirty();
    }
  }

  addTagFromInput(event: MatChipInputEvent): void {
    this.selectTag(event.value);
    event.chipInput.clear();
  }

  removeTag(tag: string): void {
    this.form.controls.category.setValue(this.tags.filter(value => value !== tag));
    this.form.controls.category.markAsDirty();
  }

  submit(){
    this.toastr.success("error success", "success", {
      timeOut: 30000,
    });
    // this.toastr.warning("error warning", "warning", {
    //   timeOut: 30000,
    // });
    // this.toastr.info("error info", "info", {
    //   timeOut: 30000,
    // });
    // this.toastr.error("error message", "error", {
    //   timeOut: 30000,
    // });
  }
}
