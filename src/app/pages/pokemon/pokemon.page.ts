import { Component, OnInit } from '@angular/core';
import { PokemonService } from "../../services/pokemon.service";
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from "rxjs";
import { AuthService } from "../../services/auth.service";
import { FavoritosService } from "../../services/favoritos.service";
import getIdFromUrl from "../../helpers/getIdFromUrl";
import primeiraLetraMaiuscula from "../../helpers/primeiraLetraMaiuscula";

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
  protected loading = false;
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
    private pokemonService: PokemonService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private favoritosService: FavoritosService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.id = id;

        this.limparDados();
        this.getPokemon();

        this.isFavorito = this.authService.getFavoritePokemonIds().includes(parseInt(this.id));
      }
    });
  }

  async getPokemon() {
    this.loading = true;

    this.pokemonService.getPokemon(this.id)
      .subscribe((data: any) => {
        this.pokemon = data;

        this.getAbilities();

        this.getEvolutionChain();

        this.getImages();
      });
  }

  getAbilities() {
    const abilityRequests = this.pokemon.abilities.map((ability:any) => {
      const id = getIdFromUrl(ability.ability.url);

      if (id) {
        return this.pokemonService.getAbility(id);
      }

      return null;
    });

    forkJoin(abilityRequests).subscribe((data:any) => {
      this.abilities = data;
    });
  }

  getEvolutionChain() {
    const id = getIdFromUrl(this.pokemon.species.url);

    if (id) {
      this.pokemonService.getSpecies(id).subscribe((data:any) => {
        this.species = data;

        const evolutionChainId = getIdFromUrl(this.species.evolution_chain.url);

        if (evolutionChainId) {
          this.pokemonService.getEvolutionChain(evolutionChainId).subscribe((data:any) => {
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

            this.loading = false;
          });
        }
      });
    }
  }

  getImages() {
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
  }

  toggleFavorito() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);

      return;
    }

    const originalState = this.isFavorito;

    this.isFavorito = !this.isFavorito;

    this.pokemonService.toggleFavorito(this.id).subscribe({
      next: () => {
        this.favoritosService.toggle(parseInt(this.id));
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
    const id = getIdFromUrl(url);

    this.router.navigate(['/pokemon', id]);
  }

  getAbilityEmIngles(habilidades:[]):any {
    return habilidades.find((hab:any) => {
      return hab.language.name === 'en';
    });
  }

  limparDados() {
    this.pokemon = {
      name: '',
      species: {
        name: ''
      },
      types: [],
      sprites: {}
    };
    this.species = [];
    this.evolutionChain = [];
    this.abilities = [];
    this.pokemonImages = [];
    this.pokemonImage = null;
    this.totalImages = 0;
    this.imageIndex = 0;
  }

  protected readonly primeiraLetraMaiuscula = primeiraLetraMaiuscula;
}

