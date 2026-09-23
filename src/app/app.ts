import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  page = signal('login');
  menuOpen = signal(false);
  carouselIndex = signal(0);
  loginError = signal('');
  loginForm: FormGroup;
  signupForm: FormGroup;
  registrationForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.registrationForm = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9 ]{10,15}$/)]],
      city: ['', Validators.required],
      updates: [true]
    });
  }

  showPage(pageName: string): void {
    this.page.set(pageName);
    this.menuOpen.set(false);
    window.history.pushState({}, '', `#${pageName}`);
  }

  toggleMenu(): void {
    this.menuOpen.update((isOpen) => !isOpen);
  }

  previousSlide(): void {
    this.carouselIndex.update((index) => index === 0 ? 2 : index - 1);
  }

  nextSlide(): void {
    this.carouselIndex.update((index) => (index + 1) % 3);
  }

  showSlide(index: number): void {
    this.carouselIndex.set(index);
  }

  isInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginError.set('Enter a username and a password to continue.');
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    if (username !== 'demo@zomato.com' || password !== 'password123') {
      this.loginError.set('Incorrect username or password. You can sign up for a new account.');
      return;
    }

    this.loginError.set('');
    this.showPage('home');
  }

  submitSignup(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.showPage('registration');
  }

  submitRegistration(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }
    this.showPage('home');
  }

}