import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

type RegisterFormControls = {
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup<RegisterFormControls>;
  errorMessage = '';
  isLoading = false;

  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor() {
    this.registerForm = this.fb.nonNullable.group(
      {
        username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, email, password } = this.registerForm.getRawValue();
    const payload = {
      username,
      email,
      password,
      role: 'User',
    };

    this.http.post('https://localhost:7048/api/Users', payload).subscribe({
      next: () => {
        this.isLoading = false;

        // نجاح التسجيل
        this.registerForm.reset({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        this.registerForm.markAsPristine();
        this.registerForm.markAsUntouched();

        this.router.navigate(['/login']);
      },

      error: (err: HttpErrorResponse) => {
        this.isLoading = false; // مهم عشان الزر ما يعلق

        const serverMessage = this.extractErrorMessage(err);
        const isEmailDup = this.isDuplicateEmailMessage(serverMessage);
        const isUsernameDup = this.isDuplicateUsernameMessage(serverMessage);

        if (err.status === 0 || err.status === 404) {
          this.errorMessage = 'Server unavailable. Please try again later.';
        }
        else if (err.status === 400 || err.status === 409) {
          // حالات البيانات الغلط / الدوبلكيت
          if (isEmailDup) {
            this.errorMessage = serverMessage || 'Email already exists.';
            this.clearPasswordFields();
          } else if (isUsernameDup) {
            this.errorMessage = serverMessage || 'Username already exists.';
            this.clearPasswordFields();
          } else {
            this.errorMessage = serverMessage || 'Invalid request.';
          }
        }
        else if (err.status === 401) {
          this.errorMessage = serverMessage || 'Invalid request.';
          this.clearPasswordFields();
        }
        else {
          this.errorMessage = 'Unexpected error occurred.';
        }
      },
    });
  }

  // ✅ تطابق الباسورد والكونفرم
  private passwordsMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  };

  // ✅ تنظيف حقول الباسورد فقط في حالة الخطأ
  private clearPasswordFields(): void {
    const passwordCtrl = this.registerForm.get('password');
    const confirmPasswordCtrl = this.registerForm.get('confirmPassword');

    passwordCtrl?.reset('');
    confirmPasswordCtrl?.reset('');

    passwordCtrl?.markAsPristine();
    passwordCtrl?.markAsUntouched();
    confirmPasswordCtrl?.markAsPristine();
    confirmPasswordCtrl?.markAsUntouched();

    this.registerForm.updateValueAndValidity();
  }

  // ✅ محاولة استخراج رسالة واضحة من السيرفر
  private extractErrorMessage(error: HttpErrorResponse): string | undefined {
    if (!error.error) return undefined;

    // نص خام
    if (typeof error.error === 'string') {
      return error.error;
    }

    // شكل { message: "..."}
    if (error.error.message) {
      return error.error.message;
    }

    // لو عندك ModelState مثل { errors: { Email: ["..."], Username: ["..."] } }
    const errors = error.error.errors as Record<string, string[]> | undefined;
    if (errors) {
      if (errors['Email']?.length) return errors['Email'][0];
      if (errors['Username']?.length) return errors['Username'][0];
    }

    return undefined;
  }

  // ✅ التحقق من إن الرسالة تتكلم عن إيميل مكرر
  private isDuplicateEmailMessage(message?: string): boolean {
    if (typeof message !== 'string') return false;
    const m = message.toLowerCase();
    return m.includes('email') && (m.includes('exist') || m.includes('already'));
  }

  // ✅ التحقق من إن الرسالة تتكلم عن يوزر نيم مكرر
  private isDuplicateUsernameMessage(message?: string): boolean {
    if (typeof message !== 'string') return false;
    const m = message.toLowerCase();
    return (
      m.includes('username') &&
      (m.includes('exist') || m.includes('already') || m.includes('taken'))
    );
  }
}
