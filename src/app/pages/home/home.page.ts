import { Component, OnInit } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from "rxjs";
import primeiraLetraMaiuscula from '../../helpers/primeiraLetraMaiuscula';

interface Pokemon {
  name: string;
  url: string;
  image: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  private pokeApiUrl = environment.pokeApiURL;
  protected loading = false;
  protected pokemons:Pokemon[] = [];
  protected pokemonsExibidos:Pokemon[] = [];
  protected filtro = '';
  protected page = 0;
  protected perPage = 10;
  protected total = 0;
  protected offset = 0;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.getPokemons();
  }

  async filter(event:any = null) {
    this.filtro = event.target.value;

    const resultado = this.pokemons.filter(p =>
      p.name.toLowerCase().includes(this.filtro)
    );

    this.total = resultado.length;

    this.pokemonsExibidos = resultado.slice(this.offset, this.perPage);

    this.handlePokemonImages();
  }

  async getPokemons() {
    this.loading = true;

    this.http
      .get(`${this.pokeApiUrl}/pokemon?limit=2000&offset=0`)
      .subscribe((data: any) => {
        this.pokemons = data.results;
        this.pokemonsExibidos = this.pokemons.slice(this.offset, this.offset + this.perPage);
        this.total = data.count;

        this.handlePokemonImages();

        this.loading = false;
      });
  }

  handlePokemonImages() {
    this.loading = true;

    const pokemonRequests = this.pokemonsExibidos.map((pokemon: any) =>
      this.http.get(pokemon.url)
    );

    forkJoin(pokemonRequests).subscribe((responses: any[]) => {
      this.pokemonsExibidos = this.pokemonsExibidos.map((pokemon, index) => {
        const response = responses[index];

        return {
          ...pokemon,
          image: response.sprites?.other?.['official-artwork']?.front_default ?? null
        };
      });

      this.loading = false;
    });
  }

  handlePageEvent(event:any) {
    this.perPage = event.pageSize;
    this.offset = event.pageIndex * this.perPage;

    const resultado = this.pokemons.filter(p =>
      p.name.toLowerCase().includes(this.filtro)
    );

    this.pokemonsExibidos = resultado.slice(this.offset, this.offset + this.perPage);

    this.handlePokemonImages();
  }

  showPokemon(url:string) {
    const id = url.split('/').filter(Boolean).pop();

    this.router.navigate(['/pokemon', id]);
  }

  protected readonly primeiraLetraMaiuscula = primeiraLetraMaiuscula;
}
