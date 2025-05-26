import { Component, Input, OnInit } from '@angular/core';
import { PicturesService } from '../../shared/services/pictures.service';
import { ColorService } from '../../shared/services/color.service';
import { Character } from '../../models/character';
import { Picture } from '../../models/picture';
import { UniversService } from '../../shared/services/univers.service';
import { MoviesService } from '../../shared/services/movies.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="w-52 h-[40rem] shadow-lg rounded-xl bg-white overflow-hidden flex flex-col"
    >
      <img
        src="{{ characterImage }}"
        class="imgCard"
        alt="image du personnage"
        id="element2"
      />
      <div class="p-4 flex-1 flex flex-col justify-between">
        <h5 class="text-lg font-semibold break-words mb-2">
          {{ character.name }}
        </h5>
        <hr class="border-gray-300 my-2" />
        <h6 class="text-sm font-bold">Film :</h6>
        @for (movie of character.to_in; track movie) {
        <p class="text-sm">{{ movie.name }}</p>
        }
        <hr class="border-gray-300 my-2" />
        <h6 class="text-sm font-bold">Univers :</h6>
        @for (univer of character.belong; track univer) {
        <p class="text-sm">{{ univer.name }}</p>
        }
        <hr class="border-gray-300 my-2" />
        <h6 class="text-sm font-bold">Couleurs :</h6>
        <div class="container">
          <div class="grid grid-cols-2 gap-1">
            @for (color of character.to_own; track color) {
            <div class="text-sm">
              {{ color.name }}
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``],
})
export class CardComponent implements OnInit {
  @Input() character!: Character;
  characterImage!: any;

  constructor(private pictureService: PicturesService) {}

  ngOnInit() {
    console.log('character complet:', this.character);

    const CharacterIdPicture = Number(this.character.picture);

    this.pictureService.getPictureById(CharacterIdPicture).subscribe({
      next: (data: Picture) => {
        // console.log('Image JSON reçue :', data);
        this.characterImage = data.file_url;
      },
      error: (err) => {
        console.error('Erreur chargement image :', err);
      },
    });
  }
}