import { Routes } from '@angular/router';
import { ListComponent as WarehouseListComponent } from './list/list.component';
import { CreateComponent as WarehouseCreateComponent } from './create/create.component';
import { FloorComponent } from './floor/floor.component';
import { RackComponent } from './floor/rack/rack.component';


export const WAREHOUSES_ROUTES: Routes = [
  {
    path: 'list',
    component: WarehouseListComponent
  },
  {
    path: 'create',
    component: WarehouseCreateComponent
  },
  {
    path: ':warehouseId/floor/:floorId/zone/:zoneId/rack/:rackId',
    component: RackComponent
  },
];