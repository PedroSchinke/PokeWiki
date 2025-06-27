import { Component, OnInit } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import primeiraLetraMaiuscula from '../../helpers/primeiraLetraMaiuscula';

interface Pokemon {
  name: string;
  url: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  private pokeApiUrl = environment.pokeApiURL;
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
  }

  async getPokemons() {
    this.http
      .get(`${this.pokeApiUrl}/pokemon?limit=2000&offset=0`)
      .subscribe((data: any) => {
        this.pokemons = data.results;
        this.pokemonsExibidos = this.pokemons.slice(this.offset, this.perPage);
        this.total = data.count;
      });
  }

  handlePageEvent(event:any) {
    this.perPage = event.pageSize;
    this.offset = event.pageIndex * this.perPage;

    const resultado = this.pokemons.filter(p =>
      p.name.toLowerCase().includes(this.filtro)
    );

    this.pokemonsExibidos = resultado.slice(this.offset, this.offset + this.perPage);
  }

  showPokemon(url:string) {
    const id = url.split('/').filter(Boolean).pop(); // "1"

    this.router.navigate(['/pokemon', id]);
  }

  protected readonly primeiraLetraMaiuscula = primeiraLetraMaiuscula;
}
