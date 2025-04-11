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
    <div
      class="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 to-white"
    >
      <div
        class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border-t-[10px] border-[#005AA7]"
      >
        <h2 class="text-2xl font-bold text-center text-[#005AA7] mb-6">
          Inscription
        </h2>

        <form
          [formGroup]="registerForm"
          (ngSubmit)="onSubmit()"
          class="flex flex-col gap-4"
        >
          <div>
            <label class="block text-gray-700 font-medium mb-1"
              >Nom d'utilisateur</label
            >
            <input
              type="text"
              formControlName="username"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#005AA7]"
              required
            />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              formControlName="email"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#005AA7]"
              required
            />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1"
              >Mot de passe</label
            >
            <input
              type="password"
              formControlName="password"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#005AA7]"
              required
            />
          </div>

          <button
            type="submit"
            [disabled]="registerForm.invalid"
            class="mt-4 bg-[#005AA7] text-white py-2 rounded-lg hover:bg-[#0071c1] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            S'inscrire
          </button>

          <p class="text-sm text-center mt-4">
            Déjà un compte ?
            <a routerLink="/login" class="text-[#0ceaea] hover:underline"
              >Connexion</a
            >
          </p>
        </form>
      </div>
    </div>
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
    console.log(this.registerForm.value); 
    this.authService.register(this.registerForm.value).subscribe(
      () => this.router.navigate(['/login']), // Redirige vers login après inscription
      (err) => console.log(err)
    );
  }
}
