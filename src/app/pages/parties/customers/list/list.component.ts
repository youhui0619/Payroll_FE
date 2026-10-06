import { Component } from '@angular/core';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [...MaterialImports, RouterLink],
  providers: [...MaterialProviders],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
}
