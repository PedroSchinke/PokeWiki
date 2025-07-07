import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private apiUrl = environment.apiURL;
  private pokeApiUrl = environment.pokeApiURL;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getPokemonsList(limit: number, offset: number) {
    return this.http.get(`${this.pokeApiUrl}/pokemon?limit=${limit}&offset=${offset}`);
  }

  getPokemon(id: number|string) {
    return this.http.get(`${this.pokeApiUrl}/pokemon/${id}`);
  }

  getAbility(id: number|string) {
    return this.http.get(`${this.pokeApiUrl}/ability/${id}`);
  }

  getSpecies(id: number|string) {
    return this.http.get(`${this.pokeApiUrl}/pokemon-species/${id}`);
  }

  getEvolutionChain(id: number|string) {
    return this.http.get(`${this.pokeApiUrl}/evolution-chain/${id}`);
  }

  toggleFavorito(id: number|string) {
    return this.http.post(
      `${this.apiUrl}/api/favoritos`,
      { pokemon_id: id },
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`
        }
      }
    );
  }
}
