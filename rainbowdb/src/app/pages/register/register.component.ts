import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <form (ngSubmit)="onSubmit()" [formGroup]="registerForm">
      <label>Nom d'utilisateur</label>
      <input type="text" formControlName="username" required />

      <label>Email</label>
      <input type="email" formControlName="email" required />

      <label>Mot de passe</label>
      <input type="password" formControlName="password" required />

      <button type="submit" [disabled]="registerForm.invalid">
        S'inscrire
      </button>

      <p>Déjà un compte ? <a routerLink="/login">Connexion</a></p>
    </form>
  `,
  styles: [
    `
      a {
        text-decoration: none;
        color: #0ceaea;
        padding: 10px;
        transition: color 0.3s;
      }
    `,
  ],
})
export class RegisterComponent {
  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.register(this.registerForm.value).subscribe(
      () => this.router.navigate(['/login']), // Redirige vers login après inscription
      (err) => console.log(err)
    );
  }
}
