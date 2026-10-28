import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FileInputDirective } from '@ngx-dropzone/cdk';
import { MatDropzone } from '@ngx-dropzone/material';
import { RegionalCurrencySymbolPipe } from './pipes/regional-format.pipes';

import * as TablerIcons from '@tabler/icons-angular';

const tablerIcons = [
  TablerIcons.IconAdjustments, TablerIcons.IconAlertTriangle, TablerIcons.IconArrowNarrowRight, TablerIcons.IconArrowRight,
  TablerIcons.IconArrowsExchange, TablerIcons.IconArticle, TablerIcons.IconBox, TablerIcons.IconBuilding,
  TablerIcons.IconBuildingWarehouse, TablerIcons.IconCalendarDue, TablerIcons.IconCalendarEvent, TablerIcons.IconChartBar,
  TablerIcons.IconChartDonut, TablerIcons.IconCheck, TablerIcons.IconChevronLeft, TablerIcons.IconCircleCheck,
  TablerIcons.IconCircleDashed, TablerIcons.IconClipboardCheck, TablerIcons.IconClipboardList, TablerIcons.IconClock,
  TablerIcons.IconClock24, TablerIcons.IconCopy, TablerIcons.IconCreditCard, TablerIcons.IconCurrencyDollar,
  TablerIcons.IconDimensions, TablerIcons.IconDownload, TablerIcons.IconEdit, TablerIcons.IconEye,
  TablerIcons.IconEyeOff, TablerIcons.IconFile, TablerIcons.IconFileDescription, TablerIcons.IconFileTypePdf,
  TablerIcons.IconForklift, TablerIcons.IconGridDots, TablerIcons.IconHandClick, TablerIcons.IconHome,
  TablerIcons.IconLanguage, TablerIcons.IconLayoutSidebarLeftCollapse, TablerIcons.IconLayoutSidebarLeftExpand, TablerIcons.IconLoader,
  TablerIcons.IconMailQuestion, TablerIcons.IconMap, TablerIcons.IconMap2, TablerIcons.IconMapPin,
  TablerIcons.IconNumber, TablerIcons.IconPackage, TablerIcons.IconPackageImport, TablerIcons.IconPlus,
  TablerIcons.IconProgressCheck, TablerIcons.IconSearch, TablerIcons.IconSettings, TablerIcons.IconShieldCheck,
  TablerIcons.IconStar, TablerIcons.IconTable, TablerIcons.IconTransfer, TablerIcons.IconTransferIn,
  TablerIcons.IconTransferOut, TablerIcons.IconTrash, TablerIcons.IconTruckDelivery, TablerIcons.IconUpload,
  TablerIcons.IconUserCheck, TablerIcons.IconUserOff, TablerIcons.IconUsers, TablerIcons.IconX,
];

const tablerIconRegistry = Object.fromEntries(
  tablerIcons.map(icon => [
    `Icon${icon.name.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join('')}`,
    icon
  ])
) as TablerIcons.TablerIcons;

export const MaterialIconProviders = TablerIcons.provideTablerIcons(tablerIconRegistry);

export const MaterialImports = [
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatChipsModule,
  MatRadioModule,
  MatDatepickerModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatStepperModule,
  MatTooltipModule,
  MatAutocompleteModule,
  MatSort,
  MatPaginator,
  FileInputDirective,
  MatDropzone,
  TablerIcons.TablerIconComponent,
  RegionalCurrencySymbolPipe,
];

export const MaterialProviders = [
  provideNativeDateAdapter(),
];
