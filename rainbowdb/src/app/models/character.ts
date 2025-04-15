import { Color } from './color';
import { Movie } from './movie';
import { Picture } from './picture';
import { Univer } from './univer';

export interface Character {
  id: number;
  name: string;
  to_in: Movie[];
  belong: Univer[];
  to_own: Color[];
  picture: Picture;
}
