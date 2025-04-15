export interface Article {
  id?: number; // L'ID peut être optionnel lors de la création d'un article
  title: string;
  content: string;
  author: string; // Ce sera probablement le nom de l'utilisateur ou l'ID de l'auteur
  published_at: string;
  updated_at: string;
  is_published: boolean;
  image?: string;
  image_url: string; // L'image est optionnelle
}
