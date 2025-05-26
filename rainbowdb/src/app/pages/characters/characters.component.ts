import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../models/character';
import { CharacterService } from '../../shared/services/character.service';
import { Color } from '../../models/color';
import { ColorService } from '../../shared/services/color.service';
import { PicturesService } from '../../shared/services/pictures.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Picture } from '../../models/picture';
import { UniversService } from '../../shared/services/univers.service';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <div class="containerComponent">
      <div>
        <div class="d-flex flex-wrap justify-content-start padding">
          @for (character of characterToDisplay; track character.id) {
          <app-card [character]="character"></app-card>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Vos styles existants */
    `,
  ],
})
export class CharactersComponent implements OnInit {
  characterToDisplay: Character[] = [];
  pictureToDisplay: Picture[] = [];
  universToDisplay: string[] = [];
  colorsToDisplay: string[] = [];
  allCharacters!: Character[];
  character!: Character;

  constructor(
    private characterService: CharacterService,
    private universService: UniversService,
    private colorService: ColorService,
    private pictureService: PicturesService
  ) {}

  ngOnInit(): void {
    this.characterService.getCharacters().subscribe((characters) => {
      console.log('Personnages récupérés :', characters);
      this.characterToDisplay = characters;
      this.allCharacters = characters;
      this.character = characters[0];
    });

    this.universService.getUnivers().subscribe((univers) => {
      this.universToDisplay = univers.map((u) => u.name);
    });

    this.colorService.getColors().subscribe((colors) => {
      this.colorsToDisplay = colors.map((c) => c.name);
    });
  }
}
