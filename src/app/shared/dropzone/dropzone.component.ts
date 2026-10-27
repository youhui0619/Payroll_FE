
import { Component, EventEmitter, forwardRef, Input, OnDestroy, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';
import { TablerIconComponent } from '@tabler/icons-angular';


type DropzoneValue = File | string | Array<File | string>;

@Component({
  selector: 'app-dropzone',
  standalone: true,
  imports: [NgxDropzoneModule, TablerIconComponent],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DropzoneComponent), multi: true }],
  templateUrl: './dropzone.component.html',
  styleUrl: './dropzone.component.scss'
})
export class DropzoneComponent implements ControlValueAccessor, OnDestroy {
  @Input() accept = '*';
  @Input() multiple = false;
  @Input() maxSize = 0;
  @Input() maxLength = 0;
  @Input() headline = 'Drop or select files';
  @Input() description = 'Drop files here or click to';
  @Output() change = new EventEmitter<NgxDropzoneChangeEvent>();
  value: File[] = [];
  existingPaths: string[] = [];
  disabled = false;
  previewUrls = new Map<File, string>();
  limitError = '';

  private onChange: (value: DropzoneValue) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: DropzoneValue | null): void {
    const items = Array.isArray(value) ? value : value ? [value] : [];
    this.existingPaths = items.filter((item): item is string => typeof item === 'string');
    this.value = items.filter((item): item is File => this.isFile(item));
    this.syncPreviewUrls();
  }

  registerOnChange(fn: (value: DropzoneValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  onFilesChanged(event: NgxDropzoneChangeEvent): void {
    const candidates = event.addedFiles.filter(file => !this.value.includes(file));
    const availableCount = this.maxLength > 0
      ? Math.max(this.maxLength - (this.multiple ? this.value.length + this.existingPaths.length : 0), 0)
      : candidates.length;
    const acceptedFiles = candidates.slice(0, availableCount);
    this.limitError = acceptedFiles.length < candidates.length
      ? `You can upload a maximum of ${this.maxLength} file${this.maxLength === 1 ? '' : 's'}.`
      : '';
    this.value = this.multiple
      ? [...this.value, ...acceptedFiles]
      : acceptedFiles.slice(0, 1);
    if (!this.multiple && acceptedFiles.length) this.existingPaths = [];
    this.syncPreviewUrls();
    this.emitValue();
    this.onTouched();
    this.change.emit(event);
  }

  removeFile(file: File): void {
    this.value = this.value.filter(item => item !== file);
    this.syncPreviewUrls();
    this.emitValue();
    this.onTouched();
  }

  removeExistingPath(path: string): void {
    this.existingPaths = this.existingPaths.filter(item => item !== path);
    this.emitValue();
    this.onTouched();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const units = ['Bytes', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
  }

  ngOnDestroy(): void {
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
    this.previewUrls.clear();
  }

  private syncPreviewUrls(): void {
    for (const [file, url] of this.previewUrls) {
      if (!this.value.includes(file)) {
        URL.revokeObjectURL(url);
        this.previewUrls.delete(file);
      }
    }
    for (const file of this.value) {
      if (this.isFile(file) && !this.previewUrls.has(file)) {
        const previewUrl = this.createPreviewUrl(file);
        if (previewUrl) this.previewUrls.set(file, previewUrl);
      }
    }
  }

  private isFile(value: unknown): value is File {
    return typeof File !== 'undefined'
      && typeof Blob !== 'undefined'
      && value instanceof File
      && value instanceof Blob;
  }

  private createPreviewUrl(file: File): string | undefined {
    try {
      return URL.createObjectURL(file);
    } catch {
      return undefined;
    }
  }

  private emitValue(): void {
    if (this.multiple) {
      this.onChange([...this.existingPaths, ...this.value]);
      return;
    }

    this.onChange(this.value[0] ?? this.existingPaths[0] ?? '');
  }
}
