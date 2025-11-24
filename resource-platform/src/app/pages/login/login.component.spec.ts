import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    
    // Spy on the navigate method
    vi.spyOn(router, 'navigate');
    
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.loginForm.valid).toBe(false);
  });

  it('username field validity', () => {
    const username = component.loginForm.controls['username'];
    expect(username.valid).toBe(false);

    username.setValue('');
    expect(username.hasError('required')).toBe(true);

    username.setValue('invalid user name'); // spaces not allowed
    expect(username.hasError('pattern')).toBe(true);

    username.setValue('valid_user1');
    expect(username.valid).toBe(true);
  });

  it('password field validity', () => {
    const password = component.loginForm.controls['password'];
    expect(password.valid).toBe(false);

    password.setValue('');
    expect(password.hasError('required')).toBe(true);

    password.setValue('password123');
    expect(password.valid).toBe(true);
  });

  it('should submit data and handle success for Admin', () => {
    const mockResponse = {
      token: 'fake-token',
      username: 'ALI',
      role: 'Admin'
    };

    component.loginForm.controls['username'].setValue('ALI');
    component.loginForm.controls['password'].setValue('password123');
    component.onSubmit();

    const req = httpMock.expectOne('https://localhost:7048/Auth');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'ALI', password: 'password123' });
    req.flush(mockResponse);

    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(localStorage.getItem('username')).toBe('ALI');
    expect(localStorage.getItem('role')).toBe('Admin');
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should submit data and handle success for User', () => {
    const mockResponse = {
      token: 'fake-token-user',
      username: 'USER1',
      role: 'User'
    };

    component.loginForm.controls['username'].setValue('USER1');
    component.loginForm.controls['password'].setValue('password123');
    component.onSubmit();

    const req = httpMock.expectOne('https://localhost:7048/Auth');
    req.flush(mockResponse);

    expect(localStorage.getItem('role')).toBe('User');
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should handle 401 error', () => {
    component.loginForm.controls['username'].setValue('ALI');
    component.loginForm.controls['password'].setValue('wrongpass');
    component.onSubmit();

    const req = httpMock.expectOne('https://localhost:7048/Auth');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(component.errorMessage).toBe('Invalid username or password.');
    expect(component.isLoading).toBe(false);
  });

  it('should handle 404 error (Server unavailable)', () => {
    component.loginForm.controls['username'].setValue('ALI');
    component.loginForm.controls['password'].setValue('pass');
    component.onSubmit();

    const req = httpMock.expectOne('https://localhost:7048/Auth');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });

    expect(component.errorMessage).toBe('Server unavailable. Please try again later.');
  });

  it('should handle 400 error with message', () => {
    component.loginForm.controls['username'].setValue('ALI');
    component.loginForm.controls['password'].setValue('pass');
    component.onSubmit();

    const req = httpMock.expectOne('https://localhost:7048/Auth');
    req.flush({ message: 'Custom error message' }, { status: 400, statusText: 'Bad Request' });

    expect(component.errorMessage).toBe('Custom error message');
  });
});
