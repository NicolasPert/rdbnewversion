import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

import { CharacterService } from '../../shared/services/character.service';
import { PicturesService } from '../../shared/services/pictures.service';
import { ColorService } from '../../shared/services/color.service';
import { Color } from '../../models/color';
import { Univer } from '../../models/univer';
import { UniversService } from '../../shared/services/univers.service';
import { MoviesService } from '../../shared/services/movies.service';
import { Movie } from '../../models/movie';
import { Character } from '../../models/character';
import { Picture } from '../../models/picture';
import { CreateCharacter } from '../../models/createCharacter';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-character',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="add-character-container">
      <form [formGroup]="addCharacterForm" (ngSubmit)="onSubmit()">
        <label for="name">Nom du personnage:</label>
        <input type="text" id="name" formControlName="name" />

        <label for="movie">Film :</label>
        <input
          formControlName="movie"
          type="text"
          id="movie"
          placeholder="film"
          class="form-control"
          required
        />

        <label for="univers">Univers:</label>
        <select id="univers" formControlName="univers" multiple>
          @for (univers of universAvailable; track univers.id) {
          <option [value]="univers.id">
            {{ univers.name }}
          </option>
          }
        </select>

        <label for="colors">Couleurs:</label>
        <select id="colors" formControlName="colors" multiple>
          @for (color of colorsAvailable; track color.id) {
          <option [value]="color.id">
            {{ color.name }}
          </option>
          }
        </select>

        <label for="picture">Image:</label>
        <input type="file" (change)="onChange($event)" />

        <button type="submit" [disabled]="addCharacterForm.invalid">
          Ajouter le personnage
        </button>
      </form>
    </div>
  `,
  styles: [
    `
      .add-character-container {
        padding: 20px;
        max-width: 500px;
        margin: 0 auto;
        background-color: #f4f4f4;
        border-radius: 8px;
      }

      label {
        display: block;
        margin: 10px 0 5px;
      }

      input,
      select {
        width: 100%;
        padding: 8px;
        margin-bottom: 15px;
        border-radius: 4px;
        border: 1px solid #ccc;
      }

      button {
        padding: 10px 20px;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      button:disabled {
        background-color: #ddd;
        cursor: not-allowed;
      }
    `,
  ],
})
export class AjouterCharacterComponent {
  myFile!: File;
  id_file!: number;
  id_Movie!: number;
  character!: Character[];
  moviesAvailable: Movie[] = [];
  colorsAvailable: Color[] = [];
  universAvailable: Univer[] = [];

  addCharacterForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    movie: new FormControl('', Validators.required),
    univers: new FormControl([]),
    colors: new FormControl([]),
    id_pictures: new FormControl(''),
  });

  constructor(
    private characterService: CharacterService,
    private pictureService: PicturesService,
    private router: Router,
    private colorsService: ColorService,
    private moviesService: MoviesService,
    private universService: UniversService
  ) {}

  ngOnInit(): void {
    this.characterService.getCharacters().subscribe({
      next: (response: Character[]) => {
        this.character = [...response];
      },
    });

    this.colorsService.getColors().subscribe((colors: Color[]) => {
      this.colorsAvailable = colors;
    });

    this.universService.getUnivers().subscribe((univers: Univer[]) => {
      this.universAvailable = univers;
    });
  }

  onSubmit() {
    let movie = {
      name: this.addCharacterForm.get('movie')?.value,
    };

    console.log("Payload envoyé à l'API :", movie);

    this.moviesService.createMovies(movie).subscribe({
      next: (response) => {
        this.id_Movie = response.id!;
        this.createCharacter();
      },
      error: (err) => {
        console.error('Erreur Backend:', err.error);
      },
    });
  }

  onChange(e: any) {
    this.myFile = e.target.files[0];

    if (this.myFile) {
      const formData = new FormData();
      formData.append('file', this.myFile);

      this.pictureService.postPicture(formData).subscribe({
        next: (photo: Partial<Picture>) => {
          const pictureId = photo.id!;
          this.addCharacterForm.get('id_pictures')?.setValue(pictureId);
          console.log('Image uploadée, ID :', pictureId);
        },
        error: (err) => {
          console.error('Erreur upload image :', err);
        },
      });
    }
  }

  createCharacter() {
    const universIds = this.addCharacterForm.get('univers')?.value;
    const colorIds = this.addCharacterForm.get('colors')?.value;
    const pictureId = this.addCharacterForm.get('id_pictures')?.value;

    const newCharacter: CreateCharacter = {
      name: this.addCharacterForm.get('name')?.value,
      movies: [ this.id_Movie ],
      univers: universIds,
      colors: colorIds,
      picture: pictureId,
    };

    console.log("Payload envoyé à l'API :", newCharacter);

    this.characterService
      .createCharacter(newCharacter)
      .subscribe((response: Character) => {
        this.router.navigate(['/arc-en-ciel']);
      });
  }

  get universControls() {
    return (this.addCharacterForm.get('univers') as FormArray).controls;
  }

  get colorControls() {
    return (this.addCharacterForm.get('colors') as FormArray).controls;
  }

  addUnivers(universId: number) {
    const univers = this.addCharacterForm.get('univers') as FormArray;
    univers.push(new FormControl(universId));
  }

  addColor(colorId: number) {
    const colors = this.addCharacterForm.get('colors') as FormArray;
    colors.push(new FormControl(colorId));
  }
}
