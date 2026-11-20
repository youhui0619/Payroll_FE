var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// src/app/pages/settings/preferences/notifications/notifications.component.ts
import { Component, DestroyRef, inject as inject2 } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

// src/app/shared/material-imports.ts
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginator } from "@angular/material/paginator";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSort } from "@angular/material/sort";
import { MatTabsModule } from "@angular/material/tabs";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from "@angular/material/core";
import { FileInputDirective } from "@ngx-dropzone/cdk";
import { MatDropzone } from "@ngx-dropzone/material";

// src/app/shared/pipes/regional-format.pipes.ts
import { DatePipe, DecimalPipe, getCurrencySymbol as getCurrencySymbol2, registerLocaleData } from "@angular/common";
import localeDe from "@angular/common/locales/de";
import { Pipe, inject } from "@angular/core";

// src/app/services/regional-preferences.service.ts
import { getCurrencySymbol } from "@angular/common";
import { Injectable } from "@angular/core";

// src/app/data/settings/regional-preferences.data.ts
var REGIONAL_PREFERENCE_VALUES = {
  language: "en",
  timeZone: "UTC+08:00",
  dateFormat: "dd/MM/yyyy",
  timeFormat: "24h",
  currency: "MYR",
  numberFormat: "1,234.56"
};

// src/app/services/regional-preferences.service.ts
var RegionalPreferencesService = class {
  storageKey = "regional-preferences";
  values = this.load();
  get currency() {
    return this.values["currency"];
  }
  get currencySymbol() {
    return getCurrencySymbol(this.currency, "narrow", "en-US");
  }
  get numberFormat() {
    return this.values["numberFormat"];
  }
  get dateFormat() {
    return this.values["dateFormat"];
  }
  get timeFormat() {
    return this.values["timeFormat"];
  }
  get timeZone() {
    return this.values["timeZone"];
  }
  getValue(id) {
    return this.values[id] ?? "";
  }
  save(values) {
    this.values = { ...REGIONAL_PREFERENCE_VALUES, ...values };
    localStorage.setItem(this.storageKey, JSON.stringify(this.values));
  }
  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(this.storageKey) ?? "{}");
      return { ...REGIONAL_PREFERENCE_VALUES, ...saved };
    } catch {
      return { ...REGIONAL_PREFERENCE_VALUES };
    }
  }
};
RegionalPreferencesService = __decorateClass([
  Injectable({ providedIn: "root" })
], RegionalPreferencesService);

// src/app/shared/pipes/regional-format.pipes.ts
registerLocaleData(localeDe);
function localeFor(numberFormat) {
  return numberFormat === "1.234,56" ? "de-DE" : "en-US";
}
function offsetFor(timeZone) {
  return timeZone.replace("UTC", "").replace("\u2212", "-").replace("\xB1", "+");
}
var RegionalNumberPipe = class {
  preferences = inject(RegionalPreferencesService);
  pipe = new DecimalPipe("en-US");
  transform(value, digitsInfo = "1.0-3") {
    return this.pipe.transform(value, digitsInfo, localeFor(this.preferences.numberFormat));
  }
};
RegionalNumberPipe = __decorateClass([
  Pipe({ name: "regionalNumber", standalone: true, pure: false })
], RegionalNumberPipe);
var RegionalCurrencyPipe = class {
  preferences = inject(RegionalPreferencesService);
  numberPipe = new DecimalPipe("en-US");
  transform(value, digitsInfo = "1.2-2", currency = this.preferences.currency) {
    const amount = this.numberPipe.transform(value, digitsInfo, localeFor(this.preferences.numberFormat));
    if (amount === null) return null;
    const symbol = getCurrencySymbol2(currency, "narrow", localeFor(this.preferences.numberFormat));
    return `${symbol}\xA0${amount}`;
  }
};
RegionalCurrencyPipe = __decorateClass([
  Pipe({ name: "regionalCurrency", standalone: true, pure: false })
], RegionalCurrencyPipe);
var RegionalCurrencySymbolPipe = class {
  preferences = inject(RegionalPreferencesService);
  transform(_value) {
    return getCurrencySymbol2(this.preferences.currency, "narrow", localeFor(this.preferences.numberFormat));
  }
};
RegionalCurrencySymbolPipe = __decorateClass([
  Pipe({ name: "regionalCurrencySymbol", standalone: true, pure: false })
], RegionalCurrencySymbolPipe);
var RegionalDatePipe = class {
  preferences = inject(RegionalPreferencesService);
  pipe = new DatePipe("en-US");
  transform(value, format) {
    const pattern = format ?? `${this.preferences.dateFormat} ${this.preferences.timeFormat === "12h" ? "h:mm a" : "HH:mm"}`;
    return this.pipe.transform(value, pattern, offsetFor(this.preferences.timeZone), localeFor(this.preferences.numberFormat));
  }
};
RegionalDatePipe = __decorateClass([
  Pipe({ name: "regionalDate", standalone: true, pure: false })
], RegionalDatePipe);
var RegionalTimePipe = class {
  preferences = inject(RegionalPreferencesService);
  pipe = new DatePipe("en-US");
  transform(value, format) {
    const pattern = format ?? (this.preferences.timeFormat === "12h" ? "h:mm a" : "HH:mm");
    return this.pipe.transform(value, pattern, offsetFor(this.preferences.timeZone), localeFor(this.preferences.numberFormat));
  }
};
RegionalTimePipe = __decorateClass([
  Pipe({ name: "regionalTime", standalone: true, pure: false })
], RegionalTimePipe);

// src/app/shared/material-imports.ts
import * as TablerIcons from "@tabler/icons-angular";
var tablerIcons = [
  TablerIcons.IconAdjustments,
  TablerIcons.IconAlertCircle,
  TablerIcons.IconAlertTriangle,
  TablerIcons.IconArrowLeft,
  TablerIcons.IconArrowNarrowRight,
  TablerIcons.IconArrowRight,
  TablerIcons.IconArrowsExchange,
  TablerIcons.IconArticle,
  TablerIcons.IconBox,
  TablerIcons.IconBuilding,
  TablerIcons.IconBriefcase,
  TablerIcons.IconBuildingWarehouse,
  TablerIcons.IconBell,
  TablerIcons.IconCalendar,
  TablerIcons.IconCalendarDue,
  TablerIcons.IconCalendarEvent,
  TablerIcons.IconCash,
  TablerIcons.IconChartBar,
  TablerIcons.IconChartDonut,
  TablerIcons.IconCheck,
  TablerIcons.IconChevronLeft,
  TablerIcons.IconCircleCheck,
  TablerIcons.IconCircleDashed,
  TablerIcons.IconCircleDot,
  TablerIcons.IconClipboardCheck,
  TablerIcons.IconClipboardList,
  TablerIcons.IconClock,
  TablerIcons.IconClock24,
  TablerIcons.IconCopy,
  TablerIcons.IconCreditCard,
  TablerIcons.IconCurrencyDollar,
  TablerIcons.IconDimensions,
  TablerIcons.IconDownload,
  TablerIcons.IconEdit,
  TablerIcons.IconEye,
  TablerIcons.IconEyeOff,
  TablerIcons.IconFile,
  TablerIcons.IconFileDescription,
  TablerIcons.IconFileTypePdf,
  TablerIcons.IconFileText,
  TablerIcons.IconForklift,
  TablerIcons.IconGridDots,
  TablerIcons.IconHandClick,
  TablerIcons.IconHome,
  TablerIcons.IconHourglassEmpty,
  TablerIcons.IconInfoCircle,
  TablerIcons.IconLanguage,
  TablerIcons.IconLayoutSidebarLeftCollapse,
  TablerIcons.IconLayoutSidebarLeftExpand,
  TablerIcons.IconLoader,
  TablerIcons.IconMedicalCross,
  TablerIcons.IconArrowNarrowUp,
  TablerIcons.IconList,
  TablerIcons.IconArrowNarrowDown,
  TablerIcons.IconLogs,
  TablerIcons.IconMailQuestion,
  TablerIcons.IconMap,
  TablerIcons.IconMap2,
  TablerIcons.IconMapPin,
  TablerIcons.IconNumber,
  TablerIcons.IconPackage,
  TablerIcons.IconPackageImport,
  TablerIcons.IconPlus,
  TablerIcons.IconProgressCheck,
  TablerIcons.IconReceipt,
  TablerIcons.IconSearch,
  TablerIcons.IconSettings,
  TablerIcons.IconShieldCheck,
  TablerIcons.IconStar,
  TablerIcons.IconTable,
  TablerIcons.IconTransfer,
  TablerIcons.IconTransferIn,
  TablerIcons.IconTransferOut,
  TablerIcons.IconTrash,
  TablerIcons.IconTruckDelivery,
  TablerIcons.IconUpload,
  TablerIcons.IconUserCheck,
  TablerIcons.IconUserCircle,
  TablerIcons.IconUserOff,
  TablerIcons.IconUsers,
  TablerIcons.IconWalletOff,
  TablerIcons.IconX,
  TablerIcons.IconLogout
];
var tablerIconRegistry = Object.fromEntries(
  tablerIcons.map((icon) => [
    `Icon${icon.name.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("")}`,
    icon
  ])
);
var MaterialIconProviders = TablerIcons.provideTablerIcons(tablerIconRegistry);
var APP_DATE_FORMATS = {
  parse: {
    dateInput: { day: "2-digit", month: "2-digit", year: "numeric" },
    timeInput: { hour: "2-digit", minute: "2-digit" }
  },
  display: {
    dateInput: { day: "2-digit", month: "2-digit", year: "numeric" },
    monthYearLabel: { month: "long", year: "numeric" },
    dateA11yLabel: { weekday: "long", day: "numeric", month: "long", year: "numeric" },
    monthYearA11yLabel: { month: "long", year: "numeric" },
    timeInput: { hour: "2-digit", minute: "2-digit" },
    timeOptionLabel: { hour: "2-digit", minute: "2-digit" }
  }
};
var MaterialImports = [
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
  MatTimepickerModule,
  MatAutocompleteModule,
  MatSort,
  MatPaginator,
  FileInputDirective,
  MatDropzone,
  TablerIcons.TablerIconComponent,
  RegionalCurrencySymbolPipe,
  RegionalCurrencyPipe,
  RegionalDatePipe,
  RegionalNumberPipe,
  RegionalTimePipe
];
var MaterialProviders = [
  ...provideNativeDateAdapter(APP_DATE_FORMATS),
  { provide: MAT_DATE_LOCALE, useValue: "en-GB" }
];

// src/app/data/payroll/payroll-settings.data.ts
var payrollSettings = {
  payrollFrequency: "MONTHLY",
  payrollCutoffDay: "LAST_DAY",
  scheduledPayDate: 1,
  currency: "MYR",
  salaryProrationMethod: "CALENDAR_DAYS",
  calculationPrecision: 2,
  includeBasicSalary: true,
  includeOvertime: true,
  includeClaimsAndAllowance: true,
  includeBonus: true,
  includeCommissionAndIncentives: true,
  standardWorkingHoursPerDay: 8,
  normalWorkingDayMultiplier: 1.5,
  normalWorkingDayEarningCode: "OT",
  configureRestDayRates: true,
  restDayOvertimeMultiplier: 2,
  restDayEarningCode: "OT-REST",
  configurePublicHolidayRates: true,
  publicHolidayOvertimeMultiplier: 3,
  publicHolidayEarningCode: "OT-PH",
  deductionProrationMethod: "FOLLOW_SALARY_PRORATION",
  includeEpf: true,
  includeSocso: true,
  includeEis: true,
  includePcb: true,
  includeHrdCorpLevy: true,
  paymentMethod: "BANK_TRANSFER",
  automaticallyCalculatePayroll: true,
  blockApprovalOnValidationErrors: true,
  lockAfterFinalApproval: true,
  notifyApprovers: true,
  approvalWorkflow: "ONE_APPROVER"
};

// src/app/data/notifications/notification-preferences.data.ts
var NOTIFICATION_PREFERENCE_VALUES = {
  emailNotifications: true,
  whatsappNotifications: false,
  leaveApplications: true,
  claims: true,
  attendanceOvertime: true,
  payrollPayslips: true,
  statutoryCompliance: true,
  probationConfirmation: true
};
var NOTIFICATION_PREFERENCE_MONTH_VALUES = {
  probationConfirmation: 2
};

// src/app/services/api/notification-setting.service.ts
import { Injectable as Injectable2 } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

// src/environments/environment.ts
var environment = {
  production: false,
  apiURL: "http://localhost:3000/api/v1",
  // apiURL: 'https://mortgagebe.uhuidesignstudio.my',
  firebaseConfig: {
    apiKey: "AIzaSyAAIxXIKgxQmxo58TFlrHU_HkgAN_vlejs",
    authDomain: "payroll-system-6ae9b.firebaseapp.com",
    projectId: "payroll-system-6ae9b",
    storageBucket: "payroll-system-6ae9b.firebasestorage.app",
    messagingSenderId: "452876600395",
    appId: "1:452876600395:web:5bc68515bfb30d213639ce"
  }
};

// src/app/services/api/notification-setting.service.ts
var NotificationSettingApiService = class {
  constructor(http, authService) {
    this.http = http;
    this.authService = authService;
  }
  http;
  authService;
  getHeaders() {
    const token = this.authService.getAuthToken();
    let headers = new HttpHeaders({ "Content-Type": "application/json" });
    if (token) {
      headers = headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }
  getNotificationSetting() {
    return this.http.get(environment.apiURL + "/settings/notifications/", {
      headers: this.getHeaders()
    });
  }
  updateNotificationSetting(data) {
    return this.http.patch(environment.apiURL + "/settings/notifications/", data, {
      headers: this.getHeaders()
    });
  }
};
NotificationSettingApiService = __decorateClass([
  Injectable2()
], NotificationSettingApiService);

// src/app/pages/settings/preferences/notifications/notifications.component.ts
var NotificationsComponent = class {
  constructor(toastService, apiService) {
    this.toastService = toastService;
    this.apiService = apiService;
  }
  toastService;
  apiService;
  destroyRef = inject2(DestroyRef);
  form = new FormGroup({
    emailNotifications: new FormControl(NOTIFICATION_PREFERENCE_VALUES["emailNotifications"], { nonNullable: true }),
    whatsappNotifications: new FormControl(NOTIFICATION_PREFERENCE_VALUES["whatsappNotifications"], { nonNullable: true }),
    leaveApplications: new FormControl(NOTIFICATION_PREFERENCE_VALUES["leaveApplications"], { nonNullable: true }),
    claims: new FormControl(NOTIFICATION_PREFERENCE_VALUES["claims"], { nonNullable: true }),
    attendanceOvertime: new FormControl(NOTIFICATION_PREFERENCE_VALUES["attendanceOvertime"], { nonNullable: true }),
    payrollPayslips: new FormControl(NOTIFICATION_PREFERENCE_VALUES["payrollPayslips"], { nonNullable: true }),
    statutoryCompliance: new FormControl(NOTIFICATION_PREFERENCE_VALUES["statutoryCompliance"], { nonNullable: true }),
    probationConfirmation: new FormControl(NOTIFICATION_PREFERENCE_VALUES["probationConfirmation"], { nonNullable: true }),
    probationConfirmationLeadMonths: new FormControl(NOTIFICATION_PREFERENCE_MONTH_VALUES.probationConfirmation, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(12), Validators.pattern(/^\d+$/)]
    })
  });
  submitting = false;
  loading = true;
  loadError = false;
  showClaims = payrollSettings.includeClaimsAndAllowance;
  showAttendanceOvertime = payrollSettings.includeOvertime;
  showStatutoryCompliance = payrollSettings.includeEpf || payrollSettings.includeSocso || payrollSettings.includeEis || payrollSettings.includePcb || payrollSettings.includeHrdCorpLevy;
  ngOnInit() {
    this.form.controls.probationConfirmation.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateReminderValidation());
    this.getNotificationSetting();
  }
  getNotificationSetting() {
    this.loading = true;
    this.loadError = false;
    this.apiService.getNotificationSetting().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        if (response.data) this.form.patchValue(response.data);
        this.updateReminderValidation();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.loadError = true;
        this.showApiError(error);
      }
    });
  }
  updateReminderValidation() {
    const months = this.form.controls.probationConfirmationLeadMonths;
    if (this.form.controls.probationConfirmation.value) months.enable({ emitEvent: false });
    else months.disable({ emitEvent: false });
  }
  onSubmit(form) {
    if (this.submitting || this.loading || this.loadError) return;
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const data = form.value;
    this.apiService.updateNotificationSetting(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        if (response.data) this.form.patchValue(response.data);
        this.updateReminderValidation();
        this.form.markAsPristine();
        this.submitting = false;
        this.toastService.show({ title: "Success", message: "Notification preferences have been updated.", icon: "success" });
      },
      error: (error) => {
        this.submitting = false;
        this.showApiError(error);
      }
    });
  }
  showApiError(error) {
    const response = error?.error;
    const messages = response?.errors?.length ? response.errors.map((item) => item.message) : [response?.message || "Unable to load or save notification preferences. Please try again."];
    for (const message of messages) {
      this.toastService.show({ title: response?.code || "Error", message, icon: "danger" });
    }
  }
};
NotificationsComponent = __decorateClass([
  Component({
    selector: "app-notifications",
    standalone: true,
    imports: [...MaterialImports, ReactiveFormsModule],
    providers: [...MaterialProviders, NotificationSettingApiService],
    templateUrl: "./notifications.component.html",
    styleUrl: "./notifications.component.scss"
  })
], NotificationsComponent);
export {
  NotificationsComponent
};
