import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import {
  MatCard,
  MatCardContent,
  MatCardHeader, MatCardImage,
  MatCardTitle
} from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import { AuthService } from "../../services/auth.service";
import primeiraLetraMaiuscula from "../../helpers/primeiraLetraMaiuscula";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {RouterLink} from "@angular/router";

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
export class UserPage implements OnInit {
  private pokeApiUrl = environment.pokeApiURL;
  protected nome = '';
  protected email = '';
  protected favoritosIds = [];
  protected pokemonsFavoritos: any = [];

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    const user = this.authService.getUser();

    this.nome = user.name;
    this.email = user.email;

    this.favoritosIds = this.authService.getFavoritePokemonIds();

    this.getPokemonsFavoritos();
  }

  getPokemonsFavoritos() {
    this.favoritosIds.forEach((id) => {
      this.http.get(`${this.pokeApiUrl}/pokemon/${id}`)
        .subscribe((response) => {
          this.pokemonsFavoritos.push(response);
        });
    });
  }

  protected readonly primeiraLetraMaiuscula = primeiraLetraMaiuscula;
}
