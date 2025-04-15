import { Component } from '@angular/core';
import { ArticleService } from '../../shared/services/article.service';
import { Article } from '../../models/article';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-articles',
  imports: [DatePipe],
  template: `
    <div
      class="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-100 to-white py-10 px-4"
    >
      <h2 class="text-3xl font-bold text-[#005AA7] mb-10 text-center">
        Liste des articles
      </h2>

      @for (article of articles; track article.id) {
      <div
        class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border-t-4 border-[#005AA7] mb-8 animate-fade-in"
      >
        <h3 class="text-2xl font-bold text-center text-[#005AA7] mb-4">
          {{ article.title }}
        </h3>

        <div class="w-full mb-4 rounded-xl overflow-hidden">
          <img
            [src]="article.image_url"
            alt="{{ article.title }} image"
            class="w-full h-52 object-cover rounded-lg"
          />
        </div>

        <p class="text-gray-700 mb-4 text-justify">
          {{ article.content }}
        </p>

        <p class="text-sm text-gray-500 text-right">
          Publié le {{ article.published_at | date : 'dd/MM/yyyy à HH:mm' }}
        </p>
      </div>
      } @empty {
      <p class="text-gray-600">Aucun article trouvé.</p>
      }
    </div>
  `,
  styles: [``],
})
export class ArticlesComponent {
  articles: Article[] = [];

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articleService.getArticles().subscribe(
      (data) => {
        this.articles = data;
      },
      (error) => {
        console.error('Error loading articles', error);
      }
    );
  }
}
