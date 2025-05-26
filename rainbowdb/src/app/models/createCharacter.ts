import { Color } from './color';
import { Movie } from './movie';
import { Univer } from './univer';

export interface CreateCharacter {
  id?: number;
  name: string;
  movies: number[];
  univers: number[];
  colors: number[];
  picture: number;
}
