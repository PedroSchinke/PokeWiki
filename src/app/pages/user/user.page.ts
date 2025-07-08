import { Component } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import {
  MatCard,
  MatCardContent,
  MatCardHeader, MatCardImage,
  MatCardTitle
} from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import { PokemonService } from "../../services/pokemon.service";
import { AuthService } from "../../services/auth.service";
import { RouterLink } from "@angular/router";
import primeiraLetraMaiuscula from "../../helpers/primeiraLetraMaiuscula";

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
    NgForOf,
    MatCardImage,
    NgOptimizedImage,
    RouterLink,
  ]
})
export class UserPage {
  protected nome = '';
  protected email = '';
  protected favoritosIds = [];
  protected pokemonsFavoritos: any = [];

  constructor(private pokemonService: PokemonService, private authService: AuthService) {}

  ionViewWillEnter() {
    const user = this.authService.getUser();

    this.nome = user.name;
    this.email = user.email;

    this.favoritosIds = this.authService.getFavoritePokemonIds();
    this.pokemonsFavoritos = [];

    this.getPokemonsFavoritos();
  }

  getPokemonsFavoritos() {
    this.favoritosIds.forEach((id) => {
      this.pokemonService.getPokemon(id)
        .subscribe((response) => {
          this.pokemonsFavoritos.push(response);
        });
    });
  }

  protected readonly primeiraLetraMaiuscula = primeiraLetraMaiuscula;
}
