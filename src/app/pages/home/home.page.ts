import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "../../../environments/environment";

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
  private perPage = 10;
  private offset = 0;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.getPokemons();
  }

  async getPokemons() {
    this.http
      .get(`${this.pokeApiUrl}/pokemon?limit=${this.perPage}&offset=${this.offset}`)
      .subscribe((data: any) => {
        console.log(data);
        this.pokemons = data.results;
      });
  }

  showPokemon(url:string) {
    const id = url.split('/').filter(Boolean).pop(); // "1"
    console.log(id);

    this.router.navigate(['/pokemon', id]);
  }
}
