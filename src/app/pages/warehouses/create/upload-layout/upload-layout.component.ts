import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepper } from '@angular/material/stepper';
import { TablerIconComponent, provideTablerIcons } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { NgxDropzoneModule } from 'ngx-dropzone';

type FloorGroup = FormGroup<{
  name: FormControl<string>;
  layout: FormControl<File | null>;
  length: FormControl<number | null>;
  weight: FormControl<number | null>;
  height: FormControl<number | null>;
}>;

@Component({
  selector: 'app-upload-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, NgxDropzoneModule, TablerIconComponent],
  providers: [provideTablerIcons(TablerIcons)],
  templateUrl: './upload-layout.component.html',
  styleUrl: './upload-layout.component.scss'
})
export class UploadLayoutComponent implements OnDestroy {
  private floorLimit = 0;
  @Input() set totalFloors(value: number) {
    this.floorLimit = value;
    this.floorDetails?.updateValueAndValidity();
  }
  get totalFloors(): number { return this.floorLimit; }
  @Input() stepper!: MatStepper;
  @Output() floorsChange = new EventEmitter<Array<{ name: string; layout: File | null; length: number | null; weight: number | null; height: number | null }>>();

  floorDetails = new FormArray<FloorGroup>([]);
  layoutPreviews: { url: string; failed: boolean }[] = [];
  uploadError = '';
  uploadForm = new FormGroup({ floors: this.floorDetails });

  constructor() {
    this.floorDetails.setValidators(control => {
      const floors = control as FormArray;
      if (floors.length === 0) return { required: true };
      return floors.length > this.totalFloors ? { maxLayouts: true } : null;
    });
    this.floorDetails.setAsyncValidators(this.validateFloorLayouts);
  }

  ngOnDestroy(): void {
    this.layoutPreviews.forEach(preview => URL.revokeObjectURL(preview.url));
  }

  private readonly validateFloorLayouts = async (control: AbstractControl): Promise<ValidationErrors | null> => {
    const floors = control as FormArray;
    for (const floor of floors.controls) {
      const file = floor.get('layout')?.value as File | null;
      if (!file) return { required: true };
      if (!file.name.toLowerCase().endsWith('.svg')) return { svgFile: true };
      if (file.size > 5 * 1024 * 1024) return { fileSize: true };
      try {
        const document = new DOMParser().parseFromString(await file.text(), 'image/svg+xml');
        if (document.querySelector('parsererror') || document.documentElement.localName !== 'svg'
          || document.documentElement.namespaceURI !== 'http://www.w3.org/2000/svg') return { svgFile: true };
      } catch {
        return { fileRead: true };
      }
    }
    return null;
  };

  onLayoutSelected(event: { addedFiles: File[]; rejectedFiles: File[] }): void {
    this.floorDetails.markAsTouched();
    this.floorDetails.markAsDirty();
    this.uploadError = '';
    if (event.rejectedFiles.length) {
      this.uploadError = 'Choose SVG files up to 5 MB each.';
      return;
    }
    if (this.floorDetails.length + event.addedFiles.length > this.totalFloors) {
      this.uploadError = `You can upload a maximum of ${this.totalFloors} SVG layouts. Remove a file or increase Total Floors.`;
      return;
    }
    for (const file of event.addedFiles) {
      this.floorDetails.push(new FormGroup({
        name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
        layout: new FormControl<File | null>(file, [Validators.required]),
        length: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
        weight: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
        height: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)])
      }));
      this.layoutPreviews.push({ url: URL.createObjectURL(new Blob([file], { type: 'image/svg+xml' })), failed: false });
    }
    this.floorDetails.updateValueAndValidity();
  }

  removeLayout(index: number): void {
    const preview = this.layoutPreviews[index];
    if (!preview) return;
    URL.revokeObjectURL(preview.url);
    this.layoutPreviews.splice(index, 1);
    this.floorDetails.removeAt(index);
    this.floorDetails.markAsTouched();
    this.floorDetails.markAsDirty();
    this.floorDetails.updateValueAndValidity();
    this.uploadError = '';
  }

  next(stepper: MatStepper): void {
    this.uploadForm.markAllAsTouched();
    console.log('uploadForm.value', this.uploadForm.value);
    if (this.uploadForm.valid) {
      this.floorsChange.emit(this.floorDetails.getRawValue());
      stepper.next();
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) {
      return '0 Bytes';
    }

    const units = ['Bytes', 'KB', 'MB', 'GB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
  }
}
