
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { RouterLink } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { DropzoneComponent } from '../../../../shared/dropzone/dropzone.component';
import { employees } from '../../../../data/employees';

@Component({
  selector: 'app-list',
  imports: [...MaterialImports, FormsModule, ReactiveFormsModule, ToastrModule, RouterLink],
  providers: [...MaterialProviders, ToastrService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  readonly employees = employees;
}
