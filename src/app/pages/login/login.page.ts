import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCard, MatCardContent } from "@angular/material/card";
import { Router, RouterLink } from "@angular/router";
import { MatFabButton } from "@angular/material/button";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    IonicModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCard,
    MatCardContent,
    MatFabButton,
    RouterLink,
    FormsModule
  ]
})
export class LoginPage {
  protected email = '';
  protected senha = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onLogin() {
    const params = {
      email: this.email,
      password: this.senha
    }

    this.authService.login(params).subscribe({
      next: (res: any) => {
        this.authService.saveToken(res.access_token);
        this.authService.saveUserData({ user: res.user, favorites: res.favorites });

        this.router.navigate(['/home']);
      },
      error: err => {
        console.log('Login inválido', err);
      }
    });
  }
}
