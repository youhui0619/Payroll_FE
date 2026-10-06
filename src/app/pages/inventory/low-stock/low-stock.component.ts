import { Component } from '@angular/core';
import { MaterialImports, MaterialProviders } from '../../../shared/material-imports';

@Component({
  selector: 'app-low-stock',
  standalone: true,
  imports: [...MaterialImports],
  providers: [...MaterialProviders],
  templateUrl: './low-stock.component.html',
  styleUrl: './low-stock.component.scss'
})
export class LowStockComponent {

}
