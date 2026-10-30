
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

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TablerIconComponent, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatCheckboxModule, MatRadioModule, MatDatepickerModule, MatSort, MatPaginator, MatMenuModule, MatSlideToggleModule, MatTabsModule, MatAutocompleteModule, NgxDropzoneModule, MatStepperModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class DashboardComponent {
  hide: boolean = true;
  files: File[] = [];
  filePreviewUrls: string[] = [];
  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }

  form = new FormGroup({
    name: new FormControl({ value: '', disabled: true }, [Validators.required]),
    password: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    remark: new FormControl('', [Validators.required]),
    autocomplete: new FormControl('', [Validators.required]),
    isActive: new FormControl(false),
    image: new FormControl<File[]>([])
  });

  firstFormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    });
    secondFormGroup = new FormGroup({
    secondCtrl: new FormControl('', [Validators.required]),
    });


  onSelect(event: any): void {
    if (!event.addedFiles?.length) {
        return;
    }

    const newFiles: File[] = event.addedFiles;

    this.files = [
        ...this.files,
        ...newFiles
    ];

    const newPreviewUrls = newFiles.map((file: File) =>
        URL.createObjectURL(file)
    );

    this.filePreviewUrls = [
        ...this.filePreviewUrls,
        ...newPreviewUrls
    ];

    this.form.controls.image.setValue(this.files);
}

onRemove(index: number): void {
    URL.revokeObjectURL(this.filePreviewUrls[index]);

    this.files.splice(index, 1);
    this.filePreviewUrls.splice(index, 1);

    this.files = [...this.files];
    this.filePreviewUrls = [...this.filePreviewUrls];

    this.form.controls.image.setValue(this.files);
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
