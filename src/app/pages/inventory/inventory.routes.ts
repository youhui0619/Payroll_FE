import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { CreateComponent } from './create/create.component';
import { AdjustmentComponent } from './adjustment/adjustment.component';
import { CreateComponent as AdjustmentCreateComponent } from './adjustment/create/create.component';
import { ViewComponent as AdjustmentViewComponent } from './adjustment/view/view.component';
import { TransferComponent } from './transfer/transfer.component';
import { CreateComponent as TransferCreateComponent } from './transfer/create/create.component';
import { ViewComponent as TransferViewComponent } from './transfer/view/view.component';
import { LowStockComponent } from './low-stock/low-stock.component';


export const INVENTORY_ROUTES: Routes = [
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'view',
    component: ViewComponent
  },
  {
    path: 'create',
    component: CreateComponent
  },
  {
    path: 'adjustment',
    component: AdjustmentComponent
  },
  {
    path: 'adjustment/create',
    component: AdjustmentCreateComponent
  },
  {
    path: 'adjustment/view',
    component: AdjustmentViewComponent
  },
  {
    path: 'transfer',
    component: TransferComponent
  },
  {
    path: 'transfer/create',
    component: TransferCreateComponent
  },
  {
    path: 'transfer/view',
    component: TransferViewComponent
  },
  {
    path: 'low-stock',
    component: LowStockComponent
  },

];