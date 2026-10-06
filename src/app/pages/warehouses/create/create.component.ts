import { UploadLayoutComponent } from './upload-layout/upload-layout.component';
import { ZoneEditorComponent } from './zone-editor/zone-editor.component';
import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
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
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { FileInputDirective } from '@ngx-dropzone/cdk';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-create',
  imports: [MatSidenavModule, ZoneEditorComponent, UploadLayoutComponent, CommonModule, FormsModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatCheckboxModule, MatRadioModule, MatDatepickerModule, MatSort, MatPaginator, MatMenuModule, MatSlideToggleModule, MatTabsModule, FileInputDirective, MatDropzone, MatAutocompleteModule, NgxDropzoneModule, TablerIconComponent],
  providers: [provideNativeDateAdapter(), provideTablerIcons(TablerIcons)],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  constructor(
      private sanitizer: DomSanitizer, 
      private renderer: Renderer2,
  ) {
    this.warehouse = {
      name: 'warehouse 1',
      code: 'WH-A',
      layout: this.sanitizer.bypassSecurityTrustHtml(this.svgString)
    };
  }
  
  sidebar:any = {};
  warehouse: any;
  form = new FormGroup({
    code: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    addressLine1: new FormControl('', [Validators.required]),
    addressLine2: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    postcode: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    remark: new FormControl(''),
    personInCharge: new FormControl(''),
    contactNo: new FormControl(''),
    isPrimary: new FormControl(false),
    isReceiving: new FormControl(false),
    isPutaway: new FormControl(false),
    isPicking: new FormControl(false),
    isPacking: new FormControl(false),
    isShippingReturns: new FormControl(false),
    email: new FormControl('', [Validators.email, Validators.required]),
    floor: new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]),
    length: new FormControl(null, [Validators.required, Validators.min(0.01)]),
    weight: new FormControl(null, [Validators.required, Validators.min(0.01)]),
    height: new FormControl(null, [Validators.required, Validators.min(0.01)]),
  });

  get totalFloors(): number {
    const floors = Number(this.form.controls.floor.value);
    return Number.isInteger(floors) && floors > 0 ? floors : 0;
  }

  floorDetails: Array<{ name: string; layout: File | null; length: number | null; weight: number | null; height: number | null }> = [];

  onFloorsChange(floors: typeof this.floorDetails): void {
    this.floorDetails = floors;
    console.log('uploadForm.floors', floors);
  }

  nextInformation(stepper: MatStepper): void {
    console.log('form.value', this.form.value);
    stepper.next();
  }

  svgString = `<?xml version="1.0" encoding="UTF-8"?>
    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1849.07 1018.09">
      <defs>
        <style>
          .cls-1 {
            stroke-width: .99px;
          }

          .cls-1, .cls-2, .cls-3, .cls-4 {
            fill: none;
            stroke: #666;
            stroke-miterlimit: 10;
          }

          .cls-5 {
            isolation: isolate;
          }

          .cls-6 {
            fill: #444;
          }

          .cls-6, .cls-7 {
            stroke-width: 0px;
          }

          .cls-7 {
            fill: #e1e1e1;
          }

          .cls-2 {
            stroke-width: .7px;
          }

          .cls-3 {
            stroke-width: .69px;
          }
        </style>
      </defs>
      <g id="z1">
        <rect id="Z1-A-01" class="cls-7" x="1674.9" y="126.46" width="61.22" height="61.22"/>
        <rect id="Z1-B-01" class="cls-7" x="1674.9" y="190.46" width="61.22" height="61.22"/>
        <rect id="Z1-A-02" class="cls-7" x="1610.9" y="126.46" width="61.22" height="61.22"/>
        <rect id="Z1-B-02" class="cls-7" x="1610.9" y="190.46" width="61.22" height="61.22"/>
        <rect id="Z1-A-03" class="cls-7" x="1546.9" y="126.46" width="61.22" height="61.22"/>
        <rect id="Z1-B-03" class="cls-7" x="1546.9" y="190.46" width="61.22" height="61.22"/>
        <rect id="Z1-A-04" class="cls-7" x="1482.9" y="126.46" width="61.22" height="61.22"/>
        <rect id="Z1-B-04" class="cls-7" x="1482.9" y="190.46" width="61.22" height="61.22"/>
        <rect id="Z1-A-05" class="cls-7" x="1418.9" y="126.46" width="61.22" height="61.22"/>
        <rect id="Z1-B-05" class="cls-7" x="1418.9" y="190.46" width="61.22" height="61.22"/>
        <rect id="Z1-A-06" class="cls-7" x="1354.9" y="126.46" width="61.22" height="61.22"/>
        <rect id="Z1-B-06" class="cls-7" x="1354.9" y="190.46" width="61.22" height="61.22"/>
        <rect id="Z1-A-07" class="cls-7" x="1290.9" y="126.46" width="61.22" height="61.22"/>
        <rect id="Z1-B-07" class="cls-7" x="1290.9" y="190.46" width="61.22" height="61.22"/>
        <rect id="Z1-A-08" class="cls-7" x="1226.9" y="126.46" width="61.22" height="61.22"/>
        <rect id="Z1-B-08" class="cls-7" x="1226.9" y="190.46" width="61.22" height="61.22"/>
        <rect id="Z1-A-09" class="cls-7" x="1162.9" y="126.46" width="61.22" height="61.22"/>
        <rect id="Z1-B-09" class="cls-7" x="1162.9" y="190.46" width="61.22" height="61.22"/>
        <rect id="Z1-A-10" class="cls-7" x="1098.9" y="126.46" width="61.22" height="61.22"/>
        <rect id="Z1-B-10" class="cls-7" x="1098.9" y="190.46" width="61.22" height="61.22"/>
        <rect id="Z1-A-11" class="cls-7" x="1034.9" y="126.46" width="61.22" height="61.22"/>
        <rect id="Z1-B-11" class="cls-7" x="1034.9" y="190.46" width="61.22" height="61.22"/>
        <rect id="Z1-C-01" class="cls-7" x="1674.9" y="296.59" width="61.22" height="61.22"/>
        <rect id="Z1-D-01" class="cls-7" x="1674.9" y="360.59" width="61.22" height="61.22"/>
        <rect id="Z1-C-02" class="cls-7" x="1610.9" y="296.59" width="61.22" height="61.22"/>
        <rect id="Z1-D-02" class="cls-7" x="1610.9" y="360.59" width="61.22" height="61.22"/>
        <rect id="Z1-C-03" class="cls-7" x="1546.9" y="296.59" width="61.22" height="61.22"/>
        <rect id="Z1-D-03" class="cls-7" x="1546.9" y="360.59" width="61.22" height="61.22"/>
        <rect id="Z1-C-04" class="cls-7" x="1482.9" y="296.59" width="61.22" height="61.22"/>
        <rect id="Z1-D-04" class="cls-7" x="1482.9" y="360.59" width="61.22" height="61.22"/>
        <rect id="Z1-C-05" class="cls-7" x="1418.9" y="296.59" width="61.22" height="61.22"/>
        <rect id="Z1-D-05" class="cls-7" x="1418.9" y="360.59" width="61.22" height="61.22"/>
        <rect id="Z1-C-06" class="cls-7" x="1354.9" y="296.59" width="61.22" height="61.22"/>
        <rect id="Z1-D-06" class="cls-7" x="1354.9" y="360.59" width="61.22" height="61.22"/>
        <rect id="Z1-C-07" class="cls-7" x="1290.9" y="296.59" width="61.22" height="61.22"/>
        <rect id="Z1-D-07" class="cls-7" x="1290.9" y="360.59" width="61.22" height="61.22"/>
        <rect id="Z1-C-08" class="cls-7" x="1226.9" y="296.59" width="61.22" height="61.22"/>
        <rect id="Z1-D-08" class="cls-7" x="1226.9" y="360.59" width="61.22" height="61.22"/>
        <rect id="Z1-C-09" class="cls-7" x="1162.9" y="296.59" width="61.22" height="61.22"/>
        <rect id="Z1-D-09" class="cls-7" x="1162.9" y="360.59" width="61.22" height="61.22"/>
        <rect id="Z1-C-10" class="cls-7" x="1098.9" y="296.59" width="61.22" height="61.22"/>
        <rect id="Z1-D-10" class="cls-7" x="1098.9" y="360.59" width="61.22" height="61.22"/>
        <rect id="Z1-C-11" class="cls-7" x="1034.9" y="296.59" width="61.22" height="61.22"/>
        <rect id="Z1-D-11" class="cls-7" x="1034.9" y="360.59" width="61.22" height="61.22"/>
      </g>
      <g id="z2">
        <rect id="Z2-E-01" class="cls-7" x="1674.9" y="596.33" width="61.22" height="61.22"/>
        <rect id="Z2-F-01" class="cls-7" x="1674.9" y="660.33" width="61.22" height="61.22"/>
        <rect id="Z2-E-02" class="cls-7" x="1610.9" y="596.33" width="61.22" height="61.22"/>
        <rect id="Z2-F-02" class="cls-7" x="1610.9" y="660.33" width="61.22" height="61.22"/>
        <rect id="Z2-E-03" class="cls-7" x="1546.9" y="596.33" width="61.22" height="61.22"/>
        <rect id="Z2-F-03" class="cls-7" x="1546.9" y="660.33" width="61.22" height="61.22"/>
        <rect id="Z2-E-04" class="cls-7" x="1482.9" y="596.33" width="61.22" height="61.22"/>
        <rect id="Z2-F-04" class="cls-7" x="1482.9" y="660.33" width="61.22" height="61.22"/>
        <rect id="Z2-E-05" class="cls-7" x="1418.9" y="596.33" width="61.22" height="61.22"/>
        <rect id="Z2-F-05" class="cls-7" x="1418.9" y="660.33" width="61.22" height="61.22"/>
        <rect id="Z2-E-06" class="cls-7" x="1354.9" y="596.33" width="61.22" height="61.22"/>
        <rect id="Z2-F-06" class="cls-7" x="1354.9" y="660.33" width="61.22" height="61.22"/>
        <rect id="Z2-E-07" class="cls-7" x="1290.9" y="596.33" width="61.22" height="61.22"/>
        <rect id="Z2-F-07" class="cls-7" x="1290.9" y="660.33" width="61.22" height="61.22"/>
        <rect id="Z2-E-08" class="cls-7" x="1226.9" y="596.33" width="61.22" height="61.22"/>
        <rect id="Z2-F-08" class="cls-7" x="1226.9" y="660.33" width="61.22" height="61.22"/>
        <rect id="Z2-E-09" class="cls-7" x="1162.9" y="596.33" width="61.22" height="61.22"/>
        <rect id="Z2-F-09" class="cls-7" x="1162.9" y="660.33" width="61.22" height="61.22"/>
        <rect id="Z2-E-10" class="cls-7" x="1098.9" y="596.33" width="61.22" height="61.22"/>
        <rect id="Z2-F-10" class="cls-7" x="1098.9" y="660.33" width="61.22" height="61.22"/>
        <rect id="Z2-E-11" class="cls-7" x="1034.9" y="596.33" width="61.22" height="61.22"/>
        <rect id="Z2-F-11" class="cls-7" x="1034.9" y="660.33" width="61.22" height="61.22"/>
        <rect id="Z2-G-01" class="cls-7" x="1674.9" y="766.46" width="61.22" height="61.22"/>
        <rect id="Z2-H-01" class="cls-7" x="1674.9" y="830.46" width="61.22" height="61.22"/>
        <rect id="Z2-G-02" class="cls-7" x="1610.9" y="766.46" width="61.22" height="61.22"/>
        <rect id="Z2-H-02" class="cls-7" x="1610.9" y="830.46" width="61.22" height="61.22"/>
        <rect id="Z2-G-03" class="cls-7" x="1546.9" y="766.46" width="61.22" height="61.22"/>
        <rect id="Z2-H-03" class="cls-7" x="1546.9" y="830.46" width="61.22" height="61.22"/>
        <rect id="Z2-G-04" class="cls-7" x="1482.9" y="766.46" width="61.22" height="61.22"/>
        <rect id="Z2-H-04" class="cls-7" x="1482.9" y="830.46" width="61.22" height="61.22"/>
        <rect id="Z2-G-05" class="cls-7" x="1418.9" y="766.46" width="61.22" height="61.22"/>
        <rect id="Z2-H-05" class="cls-7" x="1418.9" y="830.46" width="61.22" height="61.22"/>
        <rect id="Z2-G-06" class="cls-7" x="1354.9" y="766.46" width="61.22" height="61.22"/>
        <rect id="Z2-H-06" class="cls-7" x="1354.9" y="830.46" width="61.22" height="61.22"/>
        <rect id="Z2-G-07" class="cls-7" x="1290.9" y="766.46" width="61.22" height="61.22"/>
        <rect id="Z2-H-07" class="cls-7" x="1290.9" y="830.46" width="61.22" height="61.22"/>
        <rect id="Z2-G-08" class="cls-7" x="1226.9" y="766.46" width="61.22" height="61.22"/>
        <rect id="Z2-H-08" class="cls-7" x="1226.9" y="830.46" width="61.22" height="61.22"/>
        <rect id="Z2-G-09" class="cls-7" x="1162.9" y="766.46" width="61.22" height="61.22"/>
        <rect id="Z2-H-09" class="cls-7" x="1162.9" y="830.46" width="61.22" height="61.22"/>
        <rect id="Z2-G-10" class="cls-7" x="1098.9" y="766.46" width="61.22" height="61.22"/>
        <rect id="Z2-H-10" class="cls-7" x="1098.9" y="830.46" width="61.22" height="61.22"/>
        <rect id="Z2-G-11" class="cls-7" x="1034.9" y="766.46" width="61.22" height="61.22"/>
        <rect id="Z2-H-11" class="cls-7" x="1034.9" y="830.46" width="61.22" height="61.22"/>
      </g>
      <g id="z3">
        <rect id="Z3-L-01" class="cls-7" x="546.51" y="146.46" width="61.22" height="61.22"/>
        <rect id="Z3-K-01" class="cls-7" x="610.51" y="146.46" width="61.22" height="61.22"/>
        <rect id="Z3-L-02" class="cls-7" x="546.51" y="210.46" width="61.22" height="61.22"/>
        <rect id="Z3-K-02" class="cls-7" x="610.51" y="210.46" width="61.22" height="61.22"/>
        <rect id="Z3-L-03" class="cls-7" x="546.51" y="274.46" width="61.22" height="61.22"/>
        <rect id="Z3-K-03" class="cls-7" x="610.51" y="274.46" width="61.22" height="61.22"/>
        <rect id="Z3-L-04" class="cls-7" x="546.51" y="338.46" width="61.22" height="61.22"/>
        <rect id="Z3-K-04" class="cls-7" x="610.51" y="338.46" width="61.22" height="61.22"/>
        <rect id="Z3-L-05" class="cls-7" x="546.51" y="402.46" width="61.22" height="61.22"/>
        <rect id="Z3-K-05" class="cls-7" x="610.51" y="402.46" width="61.22" height="61.22"/>
        <rect id="Z3-L-06" class="cls-7" x="546.51" y="466.46" width="61.22" height="61.22"/>
        <rect id="Z3-K-06" class="cls-7" x="610.51" y="466.46" width="61.22" height="61.22"/>
        <rect id="Z3-L-07" class="cls-7" x="546.51" y="530.46" width="61.22" height="61.22"/>
        <rect id="Z3-K-07" class="cls-7" x="610.51" y="530.46" width="61.22" height="61.22"/>
        <rect id="Z3-L-08" class="cls-7" x="546.51" y="594.46" width="61.22" height="61.22"/>
        <rect id="Z3-K-08" class="cls-7" x="610.51" y="594.46" width="61.22" height="61.22"/>
        <rect id="Z3-L-09" class="cls-7" x="546.51" y="658.46" width="61.22" height="61.22"/>
        <rect id="Z3-K-09" class="cls-7" x="610.51" y="658.46" width="61.22" height="61.22"/>
        <rect id="Z3-L-10" class="cls-7" x="546.51" y="722.46" width="61.22" height="61.22"/>
        <rect id="Z3-K-10" class="cls-7" x="610.51" y="722.46" width="61.22" height="61.22"/>
        <rect id="Z3-L-11" class="cls-7" x="546.51" y="786.46" width="61.22" height="61.22"/>
        <rect id="Z3-K-11" class="cls-7" x="610.51" y="786.46" width="61.22" height="61.22"/>
        <rect id="Z3-L-12" class="cls-7" x="546.51" y="850.46" width="61.22" height="61.22"/>
        <rect id="Z3-K-12" class="cls-7" x="610.51" y="850.46" width="61.22" height="61.22"/>
        <rect id="Z3-J-01" class="cls-7" x="726.63" y="146.46" width="61.22" height="61.22"/>
        <rect id="Z3-I-01" class="cls-7" x="790.63" y="146.46" width="61.22" height="61.22"/>
        <rect id="Z3-J-02" class="cls-7" x="726.63" y="210.46" width="61.22" height="61.22"/>
        <rect id="Z3-I-02" class="cls-7" x="790.63" y="210.46" width="61.22" height="61.22"/>
        <rect id="Z3-J-03" class="cls-7" x="726.63" y="274.46" width="61.22" height="61.22"/>
        <rect id="Z3-I-03" class="cls-7" x="790.63" y="274.46" width="61.22" height="61.22"/>
        <rect id="Z3-J-04" class="cls-7" x="726.63" y="338.46" width="61.22" height="61.22"/>
        <rect id="Z3-I-04" class="cls-7" x="790.63" y="338.46" width="61.22" height="61.22"/>
        <rect id="Z3-J-05" class="cls-7" x="726.63" y="402.46" width="61.22" height="61.22"/>
        <rect id="Z3-I-05" class="cls-7" x="790.63" y="402.46" width="61.22" height="61.22"/>
        <rect id="Z3-J-06" class="cls-7" x="726.63" y="466.46" width="61.22" height="61.22"/>
        <rect id="Z3-I-06" class="cls-7" x="790.63" y="466.46" width="61.22" height="61.22"/>
        <rect id="Z3-J-07" class="cls-7" x="726.63" y="530.46" width="61.22" height="61.22"/>
        <rect id="Z3-I-07" class="cls-7" x="790.63" y="530.46" width="61.22" height="61.22"/>
        <rect id="Z3-J-08" class="cls-7" x="726.63" y="594.46" width="61.22" height="61.22"/>
        <rect id="Z3-I-08" class="cls-7" x="790.63" y="594.46" width="61.22" height="61.22"/>
        <rect id="Z3-J-09" class="cls-7" x="726.63" y="658.46" width="61.22" height="61.22"/>
        <rect id="Z3-I-09" class="cls-7" x="790.63" y="658.46" width="61.22" height="61.22"/>
        <rect id="Z3-J-10" class="cls-7" x="726.63" y="722.46" width="61.22" height="61.22"/>
        <rect id="Z3-I-10" class="cls-7" x="790.63" y="722.46" width="61.22" height="61.22"/>
        <rect id="Z3-J-11" class="cls-7" x="726.63" y="786.46" width="61.22" height="61.22"/>
        <rect id="Z3-I-11" class="cls-7" x="790.63" y="786.46" width="61.22" height="61.22"/>
        <rect id="Z3-J-12" class="cls-7" x="726.63" y="850.46" width="61.22" height="61.22"/>
        <rect id="Z3-I-12" class="cls-7" x="790.63" y="850.46" width="61.22" height="61.22"/>
      </g>
      <g id="z4">
        <rect id="Z4-Q-01" class="cls-7" x="72.72" y="136.46" width="61.22" height="61.22"/>
        <rect id="Z4-P-01" class="cls-7" x="136.72" y="136.46" width="61.22" height="61.22"/>
        <rect id="Z4-Q-02" class="cls-7" x="72.72" y="200.46" width="61.22" height="61.22"/>
        <rect id="Z4-P-02" class="cls-7" x="136.72" y="200.46" width="61.22" height="61.22"/>
        <rect id="Z4-Q-03" class="cls-7" x="72.72" y="264.46" width="61.22" height="61.22"/>
        <rect id="Z4-P-03" class="cls-7" x="136.72" y="264.46" width="61.22" height="61.22"/>
        <rect id="Z4-Q-04" class="cls-7" x="72.72" y="328.46" width="61.22" height="61.22"/>
        <rect id="Z4-P-04" class="cls-7" x="136.72" y="328.46" width="61.22" height="61.22"/>
        <rect id="Z4-P-05" class="cls-7" x="72.72" y="392.46" width="61.22" height="61.22"/>
        <rect id="Z4-Q-05" class="cls-7" x="136.72" y="392.46" width="61.22" height="61.22"/>
        <rect id="Z4-N-01" class="cls-7" x="252.85" y="136.46" width="61.22" height="61.22"/>
        <rect id="Z4-M-01" class="cls-7" x="316.85" y="136.46" width="61.22" height="61.22"/>
        <rect id="Z4-N-02" class="cls-7" x="252.85" y="200.46" width="61.22" height="61.22"/>
        <rect id="Z4-M-02" class="cls-7" x="316.85" y="200.46" width="61.22" height="61.22"/>
        <rect id="Z4-N-03" class="cls-7" x="252.85" y="264.46" width="61.22" height="61.22"/>
        <rect id="Z4-M-03" class="cls-7" x="316.85" y="264.46" width="61.22" height="61.22"/>
        <rect id="Z4-N-04" class="cls-7" x="252.85" y="328.46" width="61.22" height="61.22"/>
        <rect id="Z4-M-04" class="cls-7" x="316.85" y="328.46" width="61.22" height="61.22"/>
        <rect id="Z4-N-05" class="cls-7" x="252.85" y="392.46" width="61.22" height="61.22"/>
        <rect id="Z4-M-05" class="cls-7" x="316.85" y="392.46" width="61.22" height="61.22"/>
      </g>
      <g id="z5">
        <rect id="Z5-U-01" class="cls-7" x="72.72" y="548.46" width="61.22" height="61.22"/>
        <rect id="Z5-T-01" class="cls-7" x="136.72" y="548.46" width="61.22" height="61.22"/>
        <rect id="Z5-U-02" class="cls-7" x="72.72" y="612.46" width="61.22" height="61.22"/>
        <rect id="Z5-T-02" class="cls-7" x="136.72" y="612.46" width="61.22" height="61.22"/>
        <rect id="Z5-U-03" class="cls-7" x="72.72" y="676.46" width="61.22" height="61.22"/>
        <rect id="Z5-T-03" class="cls-7" x="136.72" y="676.46" width="61.22" height="61.22"/>
        <rect id="Z5-U-04" class="cls-7" x="72.72" y="740.46" width="61.22" height="61.22"/>
        <rect id="Z5-T-04" class="cls-7" x="136.72" y="740.46" width="61.22" height="61.22"/>
        <rect id="Z5-U-05" class="cls-7" x="72.72" y="804.46" width="61.22" height="61.22"/>
        <rect id="Z5-T-05" class="cls-7" x="136.72" y="804.46" width="61.22" height="61.22"/>
        <rect id="Z5-S-01" class="cls-7" x="252.85" y="548.46" width="61.22" height="61.22"/>
        <rect id="Z5-R-01" class="cls-7" x="316.85" y="548.46" width="61.22" height="61.22"/>
        <rect id="Z5-S-02" class="cls-7" x="252.85" y="612.46" width="61.22" height="61.22"/>
        <rect id="Z5-R-02" class="cls-7" x="316.85" y="612.46" width="61.22" height="61.22"/>
        <rect id="Z5-S-03" class="cls-7" x="252.85" y="676.46" width="61.22" height="61.22"/>
        <rect id="Z5-R-03" class="cls-7" x="316.85" y="676.46" width="61.22" height="61.22"/>
        <rect id="Z5-S-04" class="cls-7" x="252.85" y="740.46" width="61.22" height="61.22"/>
        <rect id="Z5-R-04" class="cls-7" x="316.85" y="740.46" width="61.22" height="61.22"/>
        <rect id="Z5-S-05" class="cls-7" x="252.85" y="804.46" width="61.22" height="61.22"/>
        <rect id="Z5-R-05" class="cls-7" x="316.85" y="804.46" width="61.22" height="61.22"/>
      </g>
      <g id="aisle_name" data-name="aisle name">
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M1758.25,161.35l-1.89,5.72h-2.43l6.21-18.19h2.81l6.21,18.19h-2.51l-1.94-5.72h-6.45ZM1764.24,159.52l-1.81-5.24c-.41-1.19-.67-2.27-.94-3.32h-.05c-.27,1.05-.54,2.19-.92,3.29l-1.78,5.26h5.51Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M1756.51,209.15c1.03-.24,2.67-.41,4.29-.41,2.35,0,3.86.41,4.97,1.32.95.7,1.54,1.78,1.54,3.21,0,1.78-1.19,3.32-3.08,3.99v.08c1.73.41,3.75,1.84,3.75,4.54,0,1.57-.62,2.78-1.57,3.64-1.24,1.16-3.29,1.7-6.26,1.7-1.62,0-2.86-.11-3.64-.22v-17.87ZM1758.86,216.6h2.13c2.46,0,3.91-1.32,3.91-3.08,0-2.11-1.59-2.97-3.97-2.97-1.08,0-1.7.08-2.08.16v5.88ZM1758.86,225.29c.49.08,1.13.11,1.97.11,2.43,0,4.67-.89,4.67-3.54,0-2.46-2.13-3.51-4.7-3.51h-1.94v6.94Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M1767.55,340.03c-.84.43-2.59.86-4.8.86-5.13,0-8.96-3.24-8.96-9.23s3.86-9.56,9.5-9.56c2.24,0,3.7.49,4.32.81l-.59,1.92c-.86-.43-2.13-.76-3.64-.76-4.26,0-7.1,2.73-7.1,7.5,0,4.48,2.56,7.32,6.96,7.32,1.46,0,2.92-.3,3.86-.76l.46,1.89Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M1754.39,382.67c1.43-.24,3.13-.41,4.99-.41,3.37,0,5.78.81,7.37,2.27,1.65,1.48,2.59,3.59,2.59,6.53s-.94,5.4-2.62,7.07c-1.73,1.7-4.54,2.62-8.07,2.62-1.7,0-3.08-.08-4.26-.22v-17.87ZM1756.74,398.76c.59.08,1.46.11,2.38.11,5.05,0,7.75-2.81,7.75-7.72.03-4.29-2.4-7.02-7.37-7.02-1.21,0-2.13.11-2.75.24v14.39Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M1766.75,633.86h-7.04v6.56h7.88v1.97h-10.26v-18.19h9.85v1.97h-7.48v5.75h7.04v1.94Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M1757.42,684.2h9.8v1.97h-7.42v6.05h6.86v1.94h-6.86v8.23h-2.38v-18.19Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M1768.6,808.87c-1.05.4-3.16,1-5.61,1-2.75,0-5.02-.7-6.8-2.4-1.57-1.51-2.54-3.94-2.54-6.77,0-5.43,3.75-9.39,9.85-9.39,2.11,0,3.78.46,4.56.84l-.59,1.92c-.97-.46-2.19-.78-4.02-.78-4.43,0-7.32,2.75-7.32,7.32s2.75,7.34,7.02,7.34c1.54,0,2.59-.22,3.13-.49v-5.43h-3.67v-1.89h5.99v8.75Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M1756.98,851.49v7.61h8.8v-7.61h2.38v18.19h-2.38v-8.53h-8.8v8.53h-2.38v-18.19h2.38Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M824.47,109.76v18.19h-2.38v-18.19h2.38Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M756.58,109.76h2.38v12.17c0,4.83-2.38,6.32-5.51,6.32-.89,0-1.94-.19-2.51-.43l.32-1.92c.49.19,1.19.35,2,.35,2.11,0,3.32-.95,3.32-4.51v-11.99Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M629.94,109.76h2.35v8.77h.08c.49-.7.97-1.35,1.43-1.94l5.56-6.83h2.92l-6.59,7.72,7.1,10.47h-2.78l-5.97-8.93-1.75,2v6.94h-2.35v-18.19Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M569.11,109.76h2.38v16.22h7.77v1.97h-10.15v-18.19Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M348.26,109.96c-.13-2.54-.3-5.61-.3-7.85h-.05c-.65,2.11-1.38,4.4-2.29,6.91l-3.21,8.83h-1.78l-2.97-8.66c-.86-2.59-1.57-4.91-2.08-7.07h-.05c-.05,2.27-.19,5.29-.35,8.04l-.49,7.8h-2.24l1.27-18.19h3l3.1,8.8c.76,2.24,1.35,4.24,1.84,6.13h.05c.49-1.83,1.13-3.83,1.94-6.13l3.24-8.8h3l1.13,18.19h-2.32l-.43-7.99Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M272.43,117.95v-18.19h2.59l5.8,9.21c1.32,2.13,2.4,4.05,3.24,5.91l.08-.03c-.22-2.43-.27-4.64-.27-7.48v-7.61h2.21v18.19h-2.38l-5.78-9.23c-1.27-2.02-2.48-4.1-3.37-6.07l-.08.03c.13,2.29.16,4.48.16,7.5v7.77h-2.21Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M158.58,99.98c1.13-.19,2.62-.35,4.51-.35,2.32,0,4.02.54,5.1,1.51.97.86,1.59,2.19,1.59,3.81s-.49,2.94-1.4,3.89c-1.27,1.32-3.27,2-5.56,2-.7,0-1.35-.03-1.89-.16v7.29h-2.35v-17.98ZM160.93,108.75c.51.13,1.16.19,1.94.19,2.83,0,4.56-1.4,4.56-3.86s-1.73-3.59-4.29-3.59c-1.03,0-1.81.08-2.21.19v7.07Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M108.91,120.62c-2.46-.65-4.86-1.38-6.96-2.11-.41-.13-.76-.27-1.11-.27-4.35-.16-8.02-3.35-8.02-9.23s3.54-9.58,8.45-9.58,8.18,3.83,8.18,9.2c0,4.7-2.16,7.67-5.18,8.75v.11c1.81.46,3.78.89,5.32,1.16l-.67,1.97ZM106.96,108.78c0-3.67-1.89-7.42-5.75-7.42s-5.91,3.67-5.91,7.61,2.11,7.37,5.83,7.37,5.83-3.43,5.83-7.56Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M337.48,889c1.19-.22,2.92-.38,4.51-.38,2.51,0,4.16.49,5.26,1.48.89.81,1.43,2.05,1.43,3.48,0,2.38-1.51,3.97-3.4,4.62v.08c1.38.49,2.21,1.78,2.65,3.67.59,2.54,1.03,4.29,1.4,4.99h-2.43c-.3-.54-.7-2.08-1.19-4.35-.54-2.51-1.54-3.46-3.67-3.54h-2.21v7.88h-2.35v-17.95ZM339.83,897.29h2.4c2.51,0,4.1-1.38,4.1-3.46,0-2.35-1.7-3.37-4.18-3.37-1.13,0-1.92.08-2.32.19v6.64Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M274.95,904.09c1.05.67,2.56,1.19,4.18,1.19,2.4,0,3.81-1.27,3.81-3.1,0-1.67-.97-2.67-3.43-3.59-2.97-1.08-4.8-2.64-4.8-5.18,0-2.83,2.35-4.94,5.88-4.94,1.84,0,3.21.43,4,.89l-.65,1.92c-.57-.35-1.78-.86-3.43-.86-2.48,0-3.43,1.49-3.43,2.73,0,1.7,1.11,2.54,3.62,3.51,3.08,1.19,4.62,2.67,4.62,5.34,0,2.81-2.05,5.26-6.34,5.26-1.75,0-3.67-.54-4.64-1.19l.62-1.97Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M162.63,890.76h-5.53v-2h13.47v2h-5.56v16.2h-2.38v-16.2Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M96.97,888.76v10.8c0,4.05,1.81,5.78,4.24,5.78,2.67,0,4.43-1.78,4.43-5.78v-10.8h2.38v10.64c0,5.59-2.94,7.85-6.88,7.85-3.73,0-6.53-2.11-6.53-7.77v-10.72h2.38Z"/>
          </g>
        </g>
      </g>
      <g id="zone">
        <rect id="Z1" class="cls-4" x="979.77" y="77.21" width="833.73" height="399.87"/>
        <rect id="Z2" class="cls-1" x="979.77" y="541.07" width="833.73" height="395.39"/>
        <rect id="Z3" class="cls-4" x="503.36" y="77.21" width="392.15" height="859.25"/>
        <rect id="Z4" class="cls-3" x="34.91" y="77.2" width="392.15" height="410.5"/>
        <rect id="Z5" class="cls-2" x="33.91" y="522.2" width="392.15" height="414.25"/>
      </g>
      <g id="zone_name" data-name="zone name">
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M1385.54,52.81l10.82-15.87v-.09h-9.89v-2.12h13.2v1.54l-10.79,15.81v.09h10.94v2.12h-14.27v-1.48Z"/>
            <path class="cls-6" d="M1407.55,37.82h-.06l-3.28,1.77-.49-1.94,4.12-2.2h2.17v18.85h-2.47v-16.48Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M1385.54,972.81l10.82-15.87v-.09h-9.89v-2.12h13.2v1.54l-10.79,15.81v.09h10.94v2.12h-14.27v-1.48Z"/>
            <path class="cls-6" d="M1402.01,974.29v-1.57l2-1.94c4.82-4.58,7.02-7.02,7.02-9.86,0-1.92-.9-3.68-3.71-3.68-1.71,0-3.13.87-4,1.59l-.81-1.8c1.28-1.07,3.16-1.92,5.31-1.92,4.06,0,5.77,2.79,5.77,5.48,0,3.48-2.52,6.29-6.5,10.12l-1.48,1.39v.06h8.44v2.12h-12.04Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M686.6,52.81l10.82-15.87v-.09h-9.89v-2.12h13.2v1.54l-10.79,15.81v.09h10.94v2.12h-14.27v-1.48Z"/>
            <path class="cls-6" d="M703.68,51.39c.73.43,2.38,1.16,4.18,1.16,3.25,0,4.29-2.06,4.26-3.66-.03-2.64-2.41-3.77-4.87-3.77h-1.42v-1.92h1.42c1.86,0,4.21-.96,4.21-3.19,0-1.51-.96-2.84-3.31-2.84-1.51,0-2.96.67-3.77,1.25l-.7-1.86c1.02-.72,2.93-1.45,4.96-1.45,3.71,0,5.4,2.21,5.4,4.5,0,1.97-1.19,3.63-3.48,4.47v.06c2.32.43,4.18,2.18,4.21,4.82,0,3.02-2.38,5.66-6.87,5.66-2.12,0-3.97-.67-4.9-1.28l.7-1.94Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M208.81,52.81l10.82-15.87v-.09h-9.89v-2.12h13.2v1.54l-10.79,15.81v.09h10.94v2.12h-14.27v-1.48Z"/>
            <path class="cls-6" d="M233.17,54.29v-5.16h-8.76v-1.65l8.41-12.04h2.76v11.72h2.64v1.97h-2.64v5.16h-2.41ZM233.17,47.16v-6.29c0-.99.03-1.97.09-2.96h-.09c-.58,1.1-1.04,1.91-1.57,2.78l-4.61,6.41v.06h6.18Z"/>
          </g>
        </g>
        <g class="cls-5">
          <g class="cls-5">
            <path class="cls-6" d="M208.81,972.81l10.82-15.87v-.09h-9.89v-2.12h13.2v1.54l-10.79,15.81v.09h10.94v2.12h-14.27v-1.48Z"/>
            <path class="cls-6" d="M236.53,957.59h-7.19l-.73,4.84c.44-.06.84-.09,1.54-.09,1.48,0,2.9.29,4.06,1.02,1.48.81,2.7,2.47,2.7,4.82,0,3.68-2.93,6.44-7.02,6.44-2.06,0-3.77-.58-4.7-1.16l.64-1.94c.78.46,2.32,1.04,4.06,1.04,2.38,0,4.47-1.57,4.44-4.09,0-2.44-1.65-4.15-5.4-4.15-1.1,0-1.94.09-2.64.17l1.22-9.05h9.02v2.15Z"/>
          </g>
        </g>
      </g>
    </svg>`

    onSvgClick(event: any, ) {
    event.stopPropagation();
    
    // Find the actual SVG element that was clicked
    let target = event.target;
    let rectElement = null;
    
    // Traverse up the DOM to find a RECT element (not just any element with ID)
    while (target && target !== event.currentTarget) {
      if (target.tagName === 'rect' && target.hasAttribute('id')) {
        rectElement = target;
        break;
      }
      target = target.parentNode;
    }
    
    // If no rect element found, exit
    if (!rectElement || rectElement.tagName !== 'rect') {
      return;
    }
    
    // Remove highlight from previously selected element
    if (this.sidebar.highlightedElement) {
      this.renderer.removeClass(this.sidebar.highlightedElement, 'warehouse-highlight');
    }
    
    // Set new selection
    this.sidebar.selectedElement = {
      id: rectElement.id || 'N/A',
      tagName: rectElement.tagName,
      className: rectElement.className || rectElement.getAttribute('class') || 'N/A'
    };
    
    // Highlight the selected element
    this.sidebar.highlightedElement = rectElement;
    this.renderer.addClass(this.sidebar.highlightedElement, 'warehouse-highlight');
    
    // Open sidebar if not already open
    if (!this.sidebar.open) {
      this.sidebar.open = true;
    }
  }
}
