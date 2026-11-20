import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { NotificationSettingApiService } from '../../../../services/api/notification-setting.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { NotificationsComponent } from './notifications.component';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let api: jasmine.SpyObj<NotificationSettingApiService>;
  let toast: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    api = jasmine.createSpyObj('NotificationSettingApiService', ['getNotificationSetting', 'updateNotificationSetting']);
    toast = jasmine.createSpyObj('ToastService', ['show']);
    api.getNotificationSetting.and.returnValue(of({ data: { emailNotifications: false, probationConfirmationLeadMonths: 4 } }));
    api.updateNotificationSetting.and.returnValue(of({ data: null }));
    await TestBed.configureTestingModule({
      imports: [NotificationsComponent],
      providers: [{ provide: ToastService, useValue: toast }]
    }).overrideComponent(NotificationsComponent, {
      set: { providers: [{ provide: NotificationSettingApiService, useValue: api }] }
    }).compileComponents();
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads saved preferences into explicit form controls', () => {
    expect(component.form.controls.emailNotifications.value).toBeFalse();
    expect(component.form.controls.probationConfirmationLeadMonths.value).toBe(4);
    expect(component.loading).toBeFalse();
  });

  it('rejects an invalid enabled probation interval', () => {
    component.form.controls.probationConfirmationLeadMonths.setValue(1.5);
    component.onSubmit(component.form);
    expect(api.updateNotificationSetting).not.toHaveBeenCalled();
    expect(component.form.controls.probationConfirmationLeadMonths.touched).toBeTrue();
  });

  it('omits an invalid interval when probation reminders are disabled', () => {
    component.form.controls.probationConfirmationLeadMonths.setValue(0);
    component.form.controls.probationConfirmation.setValue(false);
    component.onSubmit(component.form);
    const payload = api.updateNotificationSetting.calls.mostRecent().args[0];
    expect(payload.probationConfirmation).toBeFalse();
    expect(payload.probationConfirmationLeadMonths).toBeUndefined();
    expect(component.submitting).toBeFalse();
  });

  it('keeps unsaved values and allows retry after an API error', () => {
    api.updateNotificationSetting.and.returnValue(throwError(() => ({ error: { message: 'Save failed' } })));
    component.form.controls.whatsappNotifications.setValue(true);
    component.onSubmit(component.form);
    expect(component.form.controls.whatsappNotifications.value).toBeTrue();
    expect(component.submitting).toBeFalse();
    expect(toast.show).toHaveBeenCalledWith(jasmine.objectContaining({ message: 'Save failed', icon: 'danger' }));
  });
});
