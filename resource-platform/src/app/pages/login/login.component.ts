import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;

  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      password: ['', [Validators.required]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  // تستخدم في زر Dashboard في أي كومبوننت يعرض الـ navbar
  get isAdmin(): boolean {
    return localStorage.getItem('role') === 'Admin';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginData = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    this.http.post<any>('https://localhost:7048/Auth', loginData).subscribe({
      next: (response) => {
        this.isLoading = false;

        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('role', response.role);

        // نجاح → إلى الصفحة الرئيسية
        this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        if (err.status === 0 || err.status === 404) {
          this.errorMessage = 'Server unavailable. Please try again later.';
        } else if (err.status === 400) {
          this.errorMessage = err.error?.message || 'Invalid request.';
        } else if (err.status === 401) {
          // 🔴 هنا حالة username/password خطأ
          this.errorMessage = 'Invalid username or password.';

          // نظّف حقل الباسورد فقط
          const pwdCtrl = this.loginForm.get('password');
          pwdCtrl?.reset();
          pwdCtrl?.markAsPristine();
          pwdCtrl?.markAsUntouched();
        } else {
          this.errorMessage = 'Unexpected error occurred.';
        }
      },
    });
  }
}
