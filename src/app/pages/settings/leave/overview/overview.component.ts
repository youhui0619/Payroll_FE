import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { RouterLink } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-overview',
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule, ToastrModule, RouterLink],
  providers: [...MaterialProviders, ToastrService],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
