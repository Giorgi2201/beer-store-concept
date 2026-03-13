import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css'
})
export class LoginModalComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  
  // Login form
  email = '';
  password = '';
  rememberMe = false;
  
  // Signup form
  firstName = '';
  lastName = '';
  dateOfBirth = '';
  signupEmail = '';
  signupPassword = '';
  confirmPassword = '';
  over18 = false;
  
  // UI state
  isSignupMode = false;
  isLoading = false;
  errorMessage = '';
  
  // Validation errors
  validationErrors: { [key: string]: string } = {};

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    // Restore body scrolling when modal is closed
    document.body.style.overflow = '';
  }

  onClose() {
    this.close.emit();
  }

  switchToSignup() {
    this.isSignupMode = true;
    this.validationErrors = {};
  }

  switchToLogin() {
    this.isSignupMode = false;
    this.validationErrors = {};
  }

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.close.emit();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Login failed. Please check your credentials.';
      }
    });
  }

  onForgotPassword() {
    // TODO: Add forgot password logic here
    alert('Password reset functionality will be added soon!');
  }

  validateSignupForm(): boolean {
    this.validationErrors = {};
    let isValid = true;

    // First name validation
    if (!this.firstName.trim()) {
      this.validationErrors['firstName'] = 'First name is required';
      isValid = false;
    } else if (!/^[a-zA-Z\s'-]+$/.test(this.firstName)) {
      this.validationErrors['firstName'] = 'First name can only contain letters';
      isValid = false;
    }

    // Last name validation
    if (!this.lastName.trim()) {
      this.validationErrors['lastName'] = 'Last name is required';
      isValid = false;
    } else if (!/^[a-zA-Z\s'-]+$/.test(this.lastName)) {
      this.validationErrors['lastName'] = 'Last name can only contain letters';
      isValid = false;
    }

    // Date of birth validation
    if (!this.dateOfBirth) {
      this.validationErrors['dateOfBirth'] = 'Date of birth is required';
      isValid = false;
    } else {
      const birthDate = new Date(this.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      
      const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      
      if (actualAge < 18) {
        this.validationErrors['dateOfBirth'] = 'You must be at least 18 years old to register';
        isValid = false;
      }
    }

    // Email validation
    if (!this.signupEmail.trim()) {
      this.validationErrors['email'] = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.signupEmail)) {
      this.validationErrors['email'] = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!this.signupPassword) {
      this.validationErrors['password'] = 'Password is required';
      isValid = false;
    } else if (this.signupPassword.length < 8) {
      this.validationErrors['password'] = 'Password must be at least 8 characters';
      isValid = false;
    } else if (this.signupPassword.length > 100) {
      this.validationErrors['password'] = 'Password must not exceed 100 characters';
      isValid = false;
    } else if (!/[A-Z]/.test(this.signupPassword)) {
      this.validationErrors['password'] = 'Password must include at least 1 uppercase letter';
      isValid = false;
    } else if (!/[a-z]/.test(this.signupPassword)) {
      this.validationErrors['password'] = 'Password must include at least 1 lowercase letter';
      isValid = false;
    } else if (!/[0-9]/.test(this.signupPassword)) {
      this.validationErrors['password'] = 'Password must include at least 1 number';
      isValid = false;
    } else if (!/[@$!%*?&]/.test(this.signupPassword)) {
      this.validationErrors['password'] = 'Password must include at least 1 special character (@$!%*?&)';
      isValid = false;
    }

    // Confirm password validation
    if (!this.confirmPassword) {
      this.validationErrors['confirmPassword'] = 'Please confirm your password';
      isValid = false;
    } else if (this.signupPassword !== this.confirmPassword) {
      this.validationErrors['confirmPassword'] = 'Passwords do not match';
      isValid = false;
    }

    // Age verification
    if (!this.over18) {
      this.validationErrors['over18'] = 'You must be over 18 to register';
      isValid = false;
    }

    return isValid;
  }

  onSignUp() {
    if (this.validateSignupForm()) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.register({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.signupEmail,
        password: this.signupPassword,
        confirmPassword: this.confirmPassword,
        dateOfBirth: this.dateOfBirth,
        isOver18: this.over18
      }).subscribe({
        next: () => {
          this.isLoading = false;
          this.close.emit();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.error || 'Registration failed. Please try again.';
        }
      });
    }
  }
}
