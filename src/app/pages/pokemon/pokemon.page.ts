import { Component, OnInit } from '@angular/core';
import { environment } from "../../../environments/environment";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from "rxjs";
import primeiraLetraMaiuscula from "../../helpers/primeiraLetraMaiuscula";
import { AuthService } from "../../services/auth.service";

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
  private id = '0';
  private pokeApiUrl = environment.pokeApiURL;
  private apiUrl = environment.apiURL;
  protected isFavorito = false;
  protected pokemon:any = {
    name: '',
    species: {
      name: ''
    },
    types: [],
    sprites: {}
  };
  protected species:any = [];
  protected evolutionChain:any = [];
  protected abilities:any = [];
  protected pokemonImages:any = [];
  protected pokemonImage = null;
  protected totalImages = 0;
  protected imageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') ?? '0';
    this.isFavorito = this.authService.getFavoritePokemonIds().includes(parseInt(this.id));

    this.getPokemon();
  }

  async getPokemon() {
    this.http.get(`${this.pokeApiUrl}/pokemon/${this.id}`)
      .subscribe((data: any) => {
        console.log(data);
        this.pokemon = data;

        const abilityRequests = this.pokemon.abilities.map((ability:any) =>
          this.http.get(ability.ability.url)
        );

        forkJoin(abilityRequests).subscribe((data:any) => {
          this.abilities = data;
        });

        this.http.get(this.pokemon.species.url).subscribe((data:any) => {
          this.species = data;

          this.http.get(this.species.evolution_chain.url).subscribe((data:any) => {
            const primeiraEvolucao = data.chain.species;

            this.evolutionChain.push({ url: primeiraEvolucao.url, name: primeiraEvolucao.name });

            if (data.chain.evolves_to.length > 0) {
              const segundaEvolucao = data.chain.evolves_to[0].species;

              this.evolutionChain.push({ url: segundaEvolucao.url, name: segundaEvolucao.name });

              if (data.chain.evolves_to[0].evolves_to.length > 0) {
                const terceiraEvolucao = data.chain.evolves_to[0].evolves_to[0].species;

                this.evolutionChain.push({ url: terceiraEvolucao.url, name: terceiraEvolucao.name });
              }
            }
          });
        });

        console.log(this.evolutionChain);

        Object.values(this.pokemon.sprites.other['official-artwork']).forEach((img) => {
          if (img && typeof img === 'string') this.pokemonImages.push(img);
        });

        Object.values(this.pokemon.sprites.other['dream_world']).forEach((img) => {
          if (img && typeof img === 'string') this.pokemonImages.push(img);
        });

        Object.values(this.pokemon.sprites.other['home']).forEach((img) => {
          if (img && typeof img === 'string') this.pokemonImages.push(img);
        });

        Object.values(this.pokemon.sprites).forEach((img) => {
          if (img && typeof img === 'string') this.pokemonImages.push(img);
        });

        this.totalImages = this.pokemonImages.length;

        if (this.pokemonImages.length > 0) {
          this.pokemonImage = this.pokemonImages[0];
        }
      });
  }

  getAbilities(url:string) {
    this.http.get(url.slice(0, -1))
      .subscribe((data:any) => {
        this.abilities.push(data);
      });
  }

  toggleFavorito() {
    const originalState = this.isFavorito;

    this.isFavorito = !this.isFavorito;

    this.http.post(`${this.apiUrl}/api/favoritos`, { pokemon_id: this.id })
      .subscribe({
        next: () => {
          console.log('Favorito atualizado');
          this.authService.toggleFavoritePokemon(parseInt(this.id));
        },
        error: (err) => {
          this.isFavorito = originalState;

          alert('Ocorreu um erro ao tentar favoritar. Tente novamente.');
        }
      });
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

  showPokemon(url:string) {
    const id = url.split('/').filter(Boolean).pop(); // "1"

    this.router.navigate(['/pokemon', id]);
  }

  getAbilityEmIngles(habilidades:[]):any {
    return habilidades.find((hab:any) => {
      return hab.language.name === 'en';
    });
  }

  protected readonly primeiraLetraMaiuscula = primeiraLetraMaiuscula;
}

