import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

import { MoviesService } from 'src/app/services/movies.service';
import { UniversService } from 'src/app/services/univers.service';
import { Character } from './models/character';
import { Color } from 'src/models/color';
import { Picture } from 'src/models/picture';
import { Univer } from 'src/models/univer';
import { CharacterService } from '../../shared/services/character.service';
import { PicturesService } from '../../shared/services/pictures.service';
import { ColorService } from '../../shared/services/color.service';

@Component({
  selector: 'app-add-character',
  template: `
    <div class="add-character-container">
      <form [formGroup]="addCharacterForm" (ngSubmit)="onSubmit()">
        <label for="name">Nom du personnage:</label>
        <input type="text" id="name" formControlName="name" />

        <label for="movie">Film:</label>
        <select id="movie" formControlName="movie">
          <option *ngFor="let movie of moviesAvailable" [value]="movie.id">
            {{ movie.name }}
          </option>
        </select>

        <label for="univers">Univers:</label>
        <select id="univers" formControlName="univers" multiple>
          <option *ngFor="let univers of universAvailable" [value]="univers.id">
            {{ univers.name }}
          </option>
        </select>

        <label for="colors">Couleurs:</label>
        <select id="colors" formControlName="colors" multiple>
          <option *ngFor="let color of colorsAvailable" [value]="color.id">
            {{ color.name }}
          </option>
        </select>

        <label for="picture">Image:</label>
        <input type="file" (change)="onFileChange($event)" />

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
  moviesAvailable: any[] = [];
  colorsAvailable: Color[] = [];
  universAvailable: Univer[] = [];

  addCharacterForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    movie: new FormControl('', Validators.required),
    univers: new FormArray([], Validators.required),
    colors: new FormArray([], Validators.required),
    picture: new FormControl(''),
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
    this.moviesService.getMovies().subscribe({
      next: (movies) => {
        this.moviesAvailable = movies;
      },
      error: (err) => {
        console.error('Erreur de chargement des films', err);
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

    this.moviesService.createMovies(movie).subscribe({
      next: (response) => {
        this.id_Movie = response.id!;
        this.createCharacter();
      },
      error: (err) => {
        console.error('Erreur création du film', err);
      },
    });
  }

  createCharacter() {
    const universIds = this.addCharacterForm.get('univers')?.value;
    const universTransformed = universIds.map((id: number) => ({ id }));

    const colorIds = this.addCharacterForm.get('colors')?.value;
    const colorsTransformed = colorIds
      .filter((id: number) => typeof id === 'number')
      .map((id: number) => ({ id }));

    const newCharacter = {
      name: this.addCharacterForm.get('name')?.value,
      movie: { id: this.id_Movie },
      universes: universTransformed,
      colors: colorsTransformed,
      picture: { id: this.id_file },
    };

    this.characterService.createCharacter(newCharacter).subscribe({
      next: (response: Character) => {
        this.router.navigate(['/arc-en-ciel']);
      },
      error: (err) => {
        console.error('Erreur création du personnage', err);
      },
    });
  }

  onFileChange(e: any) {
    this.myFile = e.target.files[0];

    if (this.myFile) {
      const formData = new FormData();
      formData.append('image', this.myFile);

      this.pictureService.uploadPicture(formData).subscribe({
        next: (photo: Partial<Picture>) => {
          this.id_file = photo.id!;
        },
        error: (err) => {
          console.error("Erreur de téléchargement de l'image", err);
        },
      });
    }
  }

  get universControls() {
    return (this.addCharacterForm.get('univers') as FormArray).controls;
  }

  get colorControls() {
    return (this.addCharacterForm.get('colors') as FormArray).controls;
  }

  addUnivers(universeId: number) {
    const univers = this.addCharacterForm.get('univers') as FormArray;
    univers.push(new FormControl(universeId));
  }

  addColor(colorId: number) {
    const colors = this.addCharacterForm.get('colors') as FormArray;
    colors.push(new FormControl(colorId));
  }
}
