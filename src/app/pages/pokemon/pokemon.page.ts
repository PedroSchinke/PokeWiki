import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment";

interface Pokemon {
  name: string;
  species: {
    name: string;
  };
  types: Type[];
}

interface Type {
  type: {
    name: string;
  }
}

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.page.html',
  styleUrls: ['./pokemon.page.scss'],
  standalone: false
})
export class PokemonPage implements OnInit {
  private id: string | null = null;
  private pokeApiUrl = environment.pokeApiURL;
  protected pokemon:Pokemon = {
    name: '',
    species: {
      name: ''
    },
    types: []
  };

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.getPokemon();
  }

  async getPokemon() {
    this.http.get(`${this.pokeApiUrl}/pokemon/${this.id}`)
      .subscribe((data: any) => {
        console.log(data);
        this.pokemon = data;
      });
  }
}

