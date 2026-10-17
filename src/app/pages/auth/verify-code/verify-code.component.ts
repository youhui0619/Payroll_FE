import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TablerIconComponent, provideTablerIcons } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

@Component({
  selector: 'app-verify-code',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, TablerIconComponent],
  providers: [provideTablerIcons(TablerIcons)],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.scss'
})
export class VerifyCodeComponent implements OnInit, OnDestroy {
  @ViewChildren('codeInput') private codeInputs!: QueryList<ElementRef<HTMLInputElement>>;

  code = Array(6).fill('');
  resendSeconds = 30;
  private resendTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.startResendCountdown();
  }

  ngOnDestroy(): void {
    this.clearResendTimer();
  }

  resendCode(): void {
    // TODO: Trigger the resend-code API here.
    this.code = Array(6).fill('');
    this.focusInput(0);
    this.startResendCountdown();
  }

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '');

    if (digits.length > 1) {
      this.setDigits(digits, index);
      return;
    }

    this.code[index] = digits;
    input.value = digits;
    if (digits && index < this.code.length - 1) {
      this.focusInput(index + 1);
    }
  }

  onDigitKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.code[index] && index > 0) {
      this.focusInput(index - 1);
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusInput(index - 1);
    } else if (event.key === 'ArrowRight' && index < this.code.length - 1) {
      event.preventDefault();
      this.focusInput(index + 1);
    }
  }

  onCodePaste(event: ClipboardEvent): void {
    event.preventDefault();
    this.setDigits(event.clipboardData?.getData('text') ?? '', 0);
  }

  private setDigits(value: string, startIndex: number): void {
    const digits = value.replace(/\D/g, '').slice(0, this.code.length - startIndex);
    for (let offset = 0; offset < this.code.length - startIndex; offset++) {
      this.code[startIndex + offset] = digits[offset] ?? '';
    }
    this.code = [...this.code];
    this.focusInput(Math.min(startIndex + digits.length, this.code.length - 1));
  }

  private focusInput(index: number): void {
    this.codeInputs?.get(index)?.nativeElement.focus();
  }

  private startResendCountdown(): void {
    this.clearResendTimer();
    this.resendSeconds = 30;
    this.resendTimer = setInterval(() => {
      if (this.resendSeconds > 0) {
        this.resendSeconds--;
      } else {
        this.clearResendTimer();
      }
    }, 1000);
  }

  private clearResendTimer(): void {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
      this.resendTimer = undefined;
    }
  }

}
