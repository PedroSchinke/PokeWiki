import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle
} from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { NgIf } from "@angular/common";
import primeiraLetraMaiuscula from "../../helpers/primeiraLetraMaiuscula";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  imports: [
    IonicModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    NgIf,
  ]
})
export class UserPage implements OnInit {
  protected nome = '';
  protected email = '';
  protected favoritos = [];

  constructor(private authService: AuthService) { }

  ngOnInit() {
    const user = this.authService.getUser();

    this.nome = user.name;
    this.email = user.email;
    this.favoritos = user.favorites;
  }

  protected readonly primeiraLetraMaiuscula = primeiraLetraMaiuscula;
}
