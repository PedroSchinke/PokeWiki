import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatFabButton } from "@angular/material/button";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { NgIf } from "@angular/common";
import * as bcrypt from 'bcryptjs';

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
  private apiUrl = environment.apiURL;
  protected nome = '';
  protected email = '';
  protected senha = '';
  protected senhaConfirmada = '';
  protected alertaVisivel:boolean = false;
  protected alertaMensagem = '';

  constructor(private http: HttpClient, private router: Router) {}

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

    console.log(this.nome);
    console.log(this.email);
    console.log(this.senha);

    try {
      const salt = await bcrypt.genSalt(10);
      const senhaCriptografada = await bcrypt.hash(this.senha, salt);

      const payload = {
        nome: this.nome,
        email: this.email,
        senha: senhaCriptografada
      };

      console.log(payload)

      this.http.post(`${this.apiUrl}/api/user`, payload)
        .subscribe((data) => {
          console.log(data);

          alert('Usuário cadastrado com sucesso!');

          this.router.navigate(['/login']);
        });
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar. Tente novamente.');
    }
  }
}
