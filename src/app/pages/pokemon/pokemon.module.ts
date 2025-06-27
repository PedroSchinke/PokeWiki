import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PokemonPageRoutingModule } from './pokemon-routing.module';
import { PokemonPage } from './pokemon.page';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {MatChip} from "@angular/material/chips";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatFabButton} from "@angular/material/button";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PokemonPageRoutingModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatChip,
    MatCardImage,
    MatCardTitle,
    MatCardSubtitle,
    NgOptimizedImage,
    MatIcon,
    MatFabButton,
    MatIconModule
  ],
  declarations: [PokemonPage]
})
export class PokemonPageModule {}
