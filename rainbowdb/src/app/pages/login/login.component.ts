import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div
      class="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 to-white"
    >
      <div
        class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border-t-4 border-[#005AA7] animate-fade-in"
      >
        <h2 class="text-2xl font-bold text-center text-[#005AA7] mb-6">
          Connexion
        </h2>

        <form
          [formGroup]="loginForm"
          (ngSubmit)="onSubmit()"
          class="flex flex-col gap-4"
        >
          <div>
            <label class="block text-gray-700 font-medium mb-1">Nom</label>
            <input
              type="text"
              formControlName="username"
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
            [disabled]="loginForm.invalid"
            class="mt-4 bg-[#005AA7] text-white py-2 rounded-lg hover:bg-[#0071c1] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Se connecter
          </button>

          <p class="text-sm text-center mt-4">
            Vous n'avez pas de compte ?
            <a routerLink="/register" class="text-[#0ceaea] hover:underline"
              >Inscription</a
            >
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      h2, button {
        font-family: 'Waltograph', sans-serif;
        font-size: 2rem;
      }


    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    // console.log("données envoyés", this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe(
      (data: any) => {
        this.router.navigate(['/characters']); // Redirection après connexion réussie
      },
      (err) => console.log(err)
    );
  }

  logout() {
    this.authService.logout();
  }
}
