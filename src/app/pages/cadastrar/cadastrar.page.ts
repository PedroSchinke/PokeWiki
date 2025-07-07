import { Component } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatFabButton } from "@angular/material/button";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { NgIf } from "@angular/common";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.page.html',
  styleUrls: ['./cadastrar.page.scss'],
  imports: [
    IonicModule,
    FormsModule,
    MatCard,
    MatCardContent,
    MatFabButton,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf
  ]
})
export class CadastrarPage {
  protected nome = '';
  protected email = '';
  protected senha = '';
  protected senhaConfirmada = '';

  protected alertaVisivel:boolean = false;
  protected alertaMensagem = '';

  constructor(private router: Router, private authService: AuthService) {}

  async cadastrarUsuario() {
    if (!this.nome || !this.email || !this.senha || !this.senhaConfirmada) {
      this.alertaVisivel = true;
      this.alertaMensagem = '*É preciso preencher todos os campos';

      return;
    }

    if (this.senha !== this.senhaConfirmada) {
      this.alertaVisivel = true;
      this.alertaMensagem = '*As senhas precisam ser iguais';

      return;
    }

    const params = {
      name: this.nome,
      email: this.email,
      password: this.senha
    };

    this.authService.register(params).subscribe({
      next: (res: any) => {
        this.authService.saveToken(res.access_token);
        this.router.navigate(['/home']);
      },
      error: err => {
        console.log('Login inválido', err);
      }
    });
  }
}
