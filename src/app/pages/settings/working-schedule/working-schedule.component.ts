import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WORKING_SCHEDULE } from '../../../data/working-schedule/working-schedule.data';
import { employmentTypes } from '../../../data/workforce/options/employment-options.data';
import type { WorkingDayName, WorkingDaySchedule, WorkingSchedule, WorkingScheduleSettings } from '../../../models/working-schedule/working-schedule.model';
import type { EmploymentType } from '../../../models/workforce/employment-status.model';
import { MaterialImports, MaterialProviders } from '../../../shared/material-imports';

export type WorkingDayFormGroup = FormGroup<{
  day: FormControl<WorkingDayName>;
  isWorkingDay: FormControl<boolean>;
  startTime: FormControl<string>;
  endTime: FormControl<string>;
  breakStartTime: FormControl<string>;
  breakEndTime: FormControl<string>;
}>;

type WorkingScheduleFormGroup = FormGroup<{ days: FormArray<WorkingDayFormGroup> }>;

type EmploymentTypeScheduleFormGroup = FormGroup<{
  employmentType: FormControl<EmploymentType>;
  schedule: WorkingScheduleFormGroup;
}>;

export type WorkingScheduleSettingsFormGroup = FormGroup<{
  allEmploymentTypesSameSchedule: FormControl<boolean>;
  commonWorkingSchedule: WorkingScheduleFormGroup;
  workingSchedule: FormArray<EmploymentTypeScheduleFormGroup>;
}>;

const workingDays: WorkingDayName[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function createWorkingDayForm(day: WorkingDaySchedule): WorkingDayFormGroup {
  const form = new FormGroup({
    day: new FormControl<WorkingDayName>(day.day, { nonNullable: true }),
    isWorkingDay: new FormControl(day.isWorkingDay, { nonNullable: true }),
    startTime: new FormControl(day.startTime, { nonNullable: true, validators: [Validators.required] }),
    endTime: new FormControl(day.endTime, { nonNullable: true, validators: [Validators.required] }),
    breakStartTime: new FormControl(day.breakStartTime, { nonNullable: true }),
    breakEndTime: new FormControl(day.breakEndTime, { nonNullable: true })
  });
  if (!day.isWorkingDay) setWorkingDayControlsEnabled(form, false);
  return form;
}

function createScheduleForm(schedule: WorkingSchedule): WorkingScheduleFormGroup {
  const scheduleByDay = new Map(schedule.days.map(day => [day.day, day]));
  return new FormGroup({
    days: new FormArray<WorkingDayFormGroup>(workingDays.map(day => createWorkingDayForm(scheduleByDay.get(day) ?? {
      day,
      isWorkingDay: false,
      startTime: '09:00',
      endTime: '18:00',
      breakStartTime: '',
      breakEndTime: ''
    })))
  });
}

function setWorkingDayControlsEnabled(day: WorkingDayFormGroup, enabled: boolean): void {
  [day.controls.startTime, day.controls.endTime, day.controls.breakStartTime, day.controls.breakEndTime]
    .forEach(control => enabled ? control.enable() : control.disable());
}

function setScheduleControlsEnabled(schedule: WorkingScheduleFormGroup, enabled: boolean): void {
  if (!enabled) {
    schedule.disable();
    return;
  }
  schedule.enable();
  schedule.controls.days.controls.forEach(day => {
    setWorkingDayControlsEnabled(day, day.controls.isWorkingDay.value);
  });
}

function schedulesMatch(first: WorkingSchedule, second: WorkingSchedule): boolean {
  return workingDays.every(dayName => {
    const firstDay = first.days.find(day => day.day === dayName);
    const secondDay = second.days.find(day => day.day === dayName);
    return !!firstDay && !!secondDay
      && firstDay.isWorkingDay === secondDay.isWorkingDay
      && firstDay.startTime === secondDay.startTime
      && firstDay.endTime === secondDay.endTime
      && firstDay.breakStartTime === secondDay.breakStartTime
      && firstDay.breakEndTime === secondDay.breakEndTime;
  });
}

function cloneSchedule(schedule: WorkingSchedule): WorkingSchedule {
  return { days: schedule.days.map(day => ({ ...day })) };
}

export function createWorkingScheduleSettingsForm(settings: WorkingScheduleSettings): WorkingScheduleSettingsFormGroup {
  const firstEmploymentType = employmentTypes[0].value;
  const firstSchedule = settings[firstEmploymentType];
  const allEmploymentTypesSameSchedule = employmentTypes.every(({ value }) => schedulesMatch(firstSchedule, settings[value]));
  const form = new FormGroup({
    allEmploymentTypesSameSchedule: new FormControl(allEmploymentTypesSameSchedule, { nonNullable: true }),
    commonWorkingSchedule: createScheduleForm(firstSchedule),
    workingSchedule: new FormArray<EmploymentTypeScheduleFormGroup>(employmentTypes.map(({ value }) => new FormGroup({
      employmentType: new FormControl<EmploymentType>(value, { nonNullable: true }),
      schedule: createScheduleForm(settings[value])
    })))
  });

  if (allEmploymentTypesSameSchedule) {
    form.controls.workingSchedule.disable({ emitEvent: false });
    setScheduleControlsEnabled(form.controls.commonWorkingSchedule, true);
  } else {
    form.controls.commonWorkingSchedule.disable({ emitEvent: false });
    form.controls.workingSchedule.controls.forEach(item => setScheduleControlsEnabled(item.controls.schedule, true));
  }
  return form;
}

@Component({
  selector: 'app-working-schedule',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders],
  templateUrl: './working-schedule.component.html',
  styleUrl: './working-schedule.component.scss'
})
export class WorkingScheduleComponent {
  @Input() showHeader = true;
  @Input() showSubmitButton = true;
  readonly form = createWorkingScheduleSettingsForm(WORKING_SCHEDULE);
  readonly employmentTypes = employmentTypes;
  readonly workingDays = workingDays;

  get employmentTypeScheduleControls() {
    return this.form.controls.workingSchedule.controls;
  }

  get commonScheduleDayControls() {
    return this.form.controls.commonWorkingSchedule.controls.days.controls;
  }

  employmentScheduleDayControls(scheduleIndex: number) {
    return this.employmentTypeScheduleControls[scheduleIndex].controls.schedule.controls.days.controls;
  }

  setAllEmploymentTypesSameSchedule(sameSchedule: boolean): void {
    const commonSchedule = this.form.controls.commonWorkingSchedule;
    const schedules = this.form.controls.workingSchedule;

    if (sameSchedule) {
      const firstSchedule = this.employmentTypeScheduleControls[0].controls.schedule;
      firstSchedule.controls.days.controls.forEach((day, index) => {
        commonSchedule.controls.days.controls[index].patchValue(day.getRawValue());
      });
      setScheduleControlsEnabled(commonSchedule, true);
      schedules.disable();
    } else {
      setScheduleControlsEnabled(commonSchedule, false);
      schedules.enable();
      this.employmentTypeScheduleControls.forEach(item => setScheduleControlsEnabled(item.controls.schedule, true));
    }

    this.form.controls.allEmploymentTypesSameSchedule.setValue(sameSchedule);
  }

  setWorkingDayEnabled(day: WorkingDayFormGroup, enabled: boolean): void {
    day.controls.isWorkingDay.setValue(enabled);
    setWorkingDayControlsEnabled(day, enabled);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { allEmploymentTypesSameSchedule, commonWorkingSchedule, workingSchedule } = this.form.getRawValue();
    const schedules = Object.fromEntries(
      allEmploymentTypesSameSchedule
        ? employmentTypes.map(({ value }) => [value, cloneSchedule(commonWorkingSchedule)])
        : workingSchedule.map(({ employmentType, schedule }) => [employmentType, schedule])
    ) as Record<EmploymentType, WorkingSchedule>;
    console.log('working schedule', schedules);
  }
}
