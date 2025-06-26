import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CadastrarComponent } from "./cadastrar.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastrarComponent,
    MatFormFieldModule,
    MatInputModule
  ],
})
export class CadastrarPageModule {}
