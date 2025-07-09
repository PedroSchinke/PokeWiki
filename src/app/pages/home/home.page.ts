import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from "../../services/pokemon.service";
import { Router } from '@angular/router';
import { forkJoin } from "rxjs";
import getIdFromUrl from "../../helpers/getIdFromUrl";
import primeiraLetraMaiuscula from '../../helpers/primeiraLetraMaiuscula';
import { MatPaginator } from "@angular/material/paginator";

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
  protected loading = false;
  protected pokemons:Pokemon[] = [];
  protected pokemonsExibidos:Pokemon[] = [];
  protected filtro = '';
  protected page = 0;
  protected perPage = 10;
  protected total = 0;
  protected offset = 0;

  constructor(private pokemonService: PokemonService, private router: Router) {}

  ngOnInit() {
    this.getPokemons();
  }

  @ViewChild('paginator') paginator!: MatPaginator;

  async filter(event:any = null) {
    this.page = 0;
    this.offset = 0;

    this.filtro = event?.target?.value?.toLowerCase() ?? '';

    const resultado = this.pokemons.filter(p =>
      p.name.toLowerCase().includes(this.filtro)
    );

    this.total = resultado.length;
    this.pokemonsExibidos = resultado.slice(this.offset, this.perPage);

    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }

    this.handlePokemonImages();
  }

  async getPokemons() {
    this.loading = true;

    this.pokemonService.getPokemonsList(2000, 0)
      .subscribe((data: any) => {
        this.pokemons = data.results;
        this.pokemonsExibidos = this.pokemons.slice(this.offset, this.offset + this.perPage);
        this.total = data.count;

        this.handlePokemonImages();
      });
  }

  handlePokemonImages() {
    this.loading = true;

    const pokemonRequests = this.pokemonsExibidos.map((pokemon: any) => {
      const id = getIdFromUrl(pokemon.url);

      if (id) {
        return this.pokemonService.getPokemon(id);
      }

      return null;
    });

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
    const id = getIdFromUrl(url);

    this.router.navigate(['/pokemon', id]);
  }

  protected readonly primeiraLetraMaiuscula = primeiraLetraMaiuscula;
}
