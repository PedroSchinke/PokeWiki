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
  sprites: {};
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
  protected pokemon:any = {
    name: '',
    species: {
      name: ''
    },
    types: [],
    sprites: {}
  };
  protected pokemonImages:any = [];
  protected pokemonImage = null;
  protected totalImages = 0;
  protected imageIndex = 0;

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

        this.pokemon.abilities.forEach((ability:any) => {
          this.getAbilities(ability.ability.url);
        });

        Object.values(this.pokemon.sprites.other['official-artwork']).forEach((img) => {
          if (img && typeof img === 'string') this.pokemonImages.push(img);
        });

        Object.values(this.pokemon.sprites).forEach((img) => {
          if (img && typeof img === 'string') this.pokemonImages.push(img);
        });

        this.totalImages = this.pokemonImages.length;

        if (this.pokemonImages.length > 0) {
          this.pokemonImage = this.pokemonImages[0];
        }

        console.log(this.pokemonImages)
      });
  }

  primeiraLetraMaiuscula(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getAbilities(url:string) {
    // this.http.get(url.slice(0, -1))
    //   .subscribe((data:any) => {
    //     console.log(data);
    //   });
  }

  previousImage() {
    const previousImage = this.pokemonImages[this.imageIndex - 1];

    if (!previousImage) {
      const lastIndex = this.pokemonImages.length - 1;
      this.pokemonImage = this.pokemonImages[lastIndex];
      this.imageIndex = lastIndex;

      return;
    }

    const previousIndex = this.imageIndex - 1;
    this.pokemonImage = this.pokemonImages[previousIndex];
    this.imageIndex = previousIndex
  }

  nextImage() {
    const nextImage = this.pokemonImages[this.imageIndex + 1];

    if (!nextImage) {
      this.pokemonImage = this.pokemonImages[0];
      this.imageIndex = 0;

      return;
    }

    const nextIndex = this.imageIndex + 1;
    this.pokemonImage = this.pokemonImages[this.imageIndex + 1];
    this.imageIndex = nextIndex;
  }
}

