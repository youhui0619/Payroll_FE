import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { departments } from '../../../../data/workforce/departments.data';
import { employees } from '../../../../data/workforce/employees.data';
import { leaveApplications } from '../../../../data/leave/leave-applications.data';
import type { Employee, EmployeeOverview } from '../../../../models/workforce/employee.model';
import type { LeavePolicy } from '../../../../models/leave/leave-policy.model';
import type { LeaveApplication } from '../../../../models/leave/leave.model';
import { DropzoneComponent } from '../../../../shared/dropzone/dropzone.component';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { LeaveApplicationApiService } from '../../../../services/api/leave-applications.service';
import { EmployeesApiService } from '../../../../services/api/employees.service';
import { LeavePolicyApiService } from '../../../../services/api/leave-policy.service';
import { getEmployeeLeaveBalances } from '../../../../data/leave/leave-balances.data';

@Component({
  selector: 'app-leave-create',
  standalone: true,
  imports: [...MaterialImports, CommonModule, ReactiveFormsModule, DropzoneComponent],
  providers: [...MaterialProviders, LeaveApplicationApiService, EmployeesApiService, LeavePolicyApiService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: LeaveApplicationApiService,
    private employeeApiService: EmployeesApiService,
    private leavePolicyApiService: LeavePolicyApiService,
    private toastService: ToastService
  ) {
    // this.route.queryParamMap.subscribe(params => {
    //   const employee = this.employees.find(item => item.employeeNo === params.get('employeeId'));
    //   const selectedDate = this.dateFromKey(params.get('date'));
    //   if (employee) {
    //     const department = this.departments.find(item => item.name === employee.department);
    //     if (department) this.form.controls.departmentId.setValue(department.id);
    //     this.onEmployeeSelected(employee);
    //   }
    //   if (selectedDate) {
    //     this.form.controls.startDate.setValue(selectedDate);
    //     this.form.controls.endDate.setValue(selectedDate);
    //   }
    // });
  }
  employeeList: EmployeeOverview[] = [];
  employeeSearch = new FormControl<EmployeeOverview | string>('');
  submitting: boolean = false;
  year = new Date().getFullYear();
  leavePolicyList: LeavePolicy[] = [];




  readonly departments = departments.filter(department => department.active);
  employees = employees;
  createdLeave: LeaveApplication | null = null;

  form = new FormGroup({
    requestDate: new FormControl<Date | null>(new Date(), Validators.required),
    employeeId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    policyId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    startDate: new FormControl<Date | null>(null, Validators.required),
    endDate: new FormControl<Date | null>(null, Validators.required),
    reason: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    supportingDocuments: new FormControl<Array<File | string>>([], { nonNullable: true })
  });

  
  ngOnInit() {
    this.getEmployeeList();
  }
  

  getEmployeeList(){
    this.employeeApiService.getAllEmployees(null).subscribe({
      next: (response) => {
        this.employeeList = response.data || [];
      },
      error: (error) => {
        this.toastService.show({
          title: error.error.code,
          message: error.error.message,
          icon: 'danger'
        });
      },
    });
  }
  
  getLeavePolicyList(id: string){
    this.leavePolicyList = [];
    this.form.controls.policyId.setValue('');
    this.employeeApiService.getEmployeeLeaveBalances(id, this.year).subscribe({
      next: (response) => {
        // Ignore a late response if the employee has changed since this request started.
        if (this.selectedEmployee?.id !== id) return;
        const policies: LeavePolicy[] = Array.isArray(response?.data) ? response.data : [];
        this.leavePolicyList = policies.filter(policy => policy.active && policy?.balance && policy?.balance > 0);
        console.log("this.leavePolicyList",this.leavePolicyList )
      },
      error: (error) => {
        this.toastService.show({
          title: error?.error?.code || 'Error',
          message: error?.error?.message || 'Unable to load leave policies.',
          icon: 'danger'
        });
      },
    });
  }

  goBack() {
    return this.router.navigate(['/time-leave/leave/applications'])
  }


  get filteredEmployees() {
    const searchValue = this.employeeSearch.value;
    const query = typeof searchValue === 'string' ? searchValue.trim().toLowerCase() : '';
    return this.employeeList.filter(employee =>
      !query || [employee.employeeNo, employee.name].some(value => value.toLowerCase().includes(query))
    );
  }

  employeeDisplayName = (value: Employee | string | null): string => {
    if (value && typeof value === 'object') return `${value.employeeNo} - ${value.name}`;
    if (!value) return '';
    const employee = this.employeeList.find(item => item.employeeNo === value);
    return employee ? `${employee.employeeNo} - ${employee.name}` : value;
  };

  get selectedEmployee(): EmployeeOverview | undefined {
    return this.employeeList.find(employee => employee.employeeNo === this.form.controls.employeeId.value);
  }

  get selectedLeavePolicy() {
    return this.leavePolicyList.find(policy => policy.policyId === this.form.controls.policyId.value);
  }

  get requestedDays(): number {
    const { startDate, endDate } = this.form.getRawValue();
    if (!startDate || !endDate || endDate < startDate) return 0;
    return Math.round((this.startOfDay(endDate).getTime() - this.startOfDay(startDate).getTime()) / 86_400_000) + 1;
  }

  get requestedDaysLabel(): string {
    return `${this.requestedDays} day${this.requestedDays === 1 ? '' : 's'}`;
  }

  onEmployeeSelected(employee: EmployeeOverview): void {
    this.form.controls.employeeId.setValue(employee.employeeNo);
    this.employeeSearch.setValue(employee);
    this.getLeavePolicyList(employee.id);
  }

  onEmployeeSearchInput(): void {
    if (typeof this.employeeSearch.value === 'string') {
      this.form.controls.employeeId.setValue('');
      this.form.controls.policyId.setValue('');
      this.leavePolicyList = [];
    }
  }

  onLeaveTypeChange(): void {
    const documents = this.form.controls.supportingDocuments;
    if (this.selectedLeavePolicy?.requireSupportingDocuments) {
      documents.setValidators([Validators.minLength(1)]);
    } else {
      documents.clearValidators();
    }
    documents.updateValueAndValidity({ emitEvent: false });
  }

  formatDate(date: Date | string | null): string | null {
    if (!date) return null;

    const parsedDate = date instanceof Date ? date : new Date(date);
    if (isNaN(parsedDate.getTime())) return null;
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  onSubmit(form: FormGroup) {
    this.submitting = true;
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    const value = form.value;
    const data = {
      ...value,
      requestDate: this.formatDate(value.requestDate),
      startDate: this.formatDate(value.startDate),
      endDate: this.formatDate(value.endDate),
    }

    this.apiService.createLeaveApplication(data).subscribe({
      next: (response) => {
        console.log("response", response);

        this.toastService.show({
          title: "Success",
          message: "Leave application has been created.",
          icon: 'success'
        });

        this.formDirective.resetForm();
        this.submitting = false;
        setTimeout(() => {
          this.router.navigate(['/settings/commission-incentives/overview']);
        }, 1000);
      },
      error: (error) => {
        console.log("Error:", error);
        const errorResponse = error?.error;

        if (errorResponse?.errors?.length) {
          errorResponse.errors.forEach((err: any) => {
            this.toastService.show({
              title: errorResponse.code,
              message: err.message,
              icon: 'danger'
            });
          });
        } else {
          this.toastService.show({
            title: errorResponse?.code || 'Error',
            message: errorResponse?.message || 'Something went wrong.',
            icon: 'danger'
          });
        }
        this.submitting = false;
      }
    });
    console.log("data", data)
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
