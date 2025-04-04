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
    <form (ngSubmit)="onSubmit()" [formGroup]="loginForm">
      <label>Nom</label>
      <input type="text" formControlName="username" required />

      <label>Mot de passe</label>
      <input type="password" formControlName="password" required />

      <button type="submit" [disabled]="loginForm.invalid">Se connecter</button>

      <p>vous n'avez pas de compte ? <a routerLink="/register">Inscription</a></p>
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
    // console.log(this.loginForm.value);
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
