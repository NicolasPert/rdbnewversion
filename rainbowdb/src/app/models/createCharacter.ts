import { Color } from './color';
import { Movie } from './movie';
import { Univer } from './univer';

export interface CreateCharacter {
  id?: number;
  name: string;
  to_in: [{ id: number }];
  belong: [{ id: number }];
  to_own: [{ id: number }];
  picture:  number ;
}
