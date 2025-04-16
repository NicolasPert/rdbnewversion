import { Component, OnDestroy, OnInit } from '@angular/core';
import { ArticleService } from '../../shared/services/article.service';
import { Article } from '../../models/article';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div
      class="min-h-screen bg-gradient-to-b from-blue-100 to-white py-10 px-4 relative"
    >
      <h2 class="text-3xl font-bold text-[#005AA7] mb-10 text-center">
        Les articles
      </h2>

      @if (articles.length > 0) {
      <div class="relative flex items-center justify-center">
        <!-- Flèche gauche -->
        <button
          (click)="prev()"
          class="absolute bottom-25 right-6 w-16 h-16 bg-blue-500 text-white rounded-full left-0 z-10 text-4xl text-[#005AA7] hover:text-[#0071c1]"
        >
          ‹
        </button>

        <!-- Carrousel -->
        <div
          class="flex overflow-x-hidden w-full max-w-4xl justify-center items-center"
        >
          <div
            class="snap-start min-w-[80%] sm:min-w-[400px] max-w-sm bg-white rounded-2xl shadow-xl border-t-4 border-[#005AA7] p-6 animate-fade-in"
          >
            <h3 class="text-xl font-bold text-[#005AA7] mb-3 text-center">
              {{ articles[currentIndex].title }}
            </h3>

            <div class="mb-4 rounded-xl overflow-hidden">
              <img
                [src]="articles[currentIndex].image_url"
                alt="{{ articles[currentIndex].title }} image"
                class="w-full h-52 object-cover rounded-lg"
              />
            </div>

            <p class="text-gray-700 mb-4 text-justify">
              {{ articles[currentIndex].content }}
            </p>

            <p class="text-sm text-gray-500 text-right">
              Publié le
              {{
                articles[currentIndex].published_at
                  | date : 'dd/MM/yyyy à HH:mm'
              }}
            </p>
          </div>
        </div>

        <!-- Flèche droite -->
        <button
          (click)="next()"
          class="absolute bottom-25 right-6 w-16 h-16 bg-blue-500 text-white rounded-full right-0 z-10 text-4xl text-[#005AA7] hover:text-[#0071c1]"
        >
          ›
        </button>
      </div>
      } @else {
      <p class="text-center text-gray-600">Aucun article trouvé.</p>
      }
    </div>
  `,
  styles: [
    `
      h2,
      h3 {
        font-family: 'Waltograph', sans-serif;
        font-size: 3rem;
      }
    `,
  ],
})
export class ArticlesComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  currentIndex = 0;
  intervalId!: ReturnType<typeof setInterval>;

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  loadArticles(): void {
    this.articleService.getArticles().subscribe(
      (data) => {
        this.articles = data;
        this.startAutoScroll();
      },
      (error) => {
        console.error('Error loading articles', error);
      }
    );
  }

  startAutoScroll(): void {
    this.intervalId = setInterval(() => {
      this.next();
    }, 5000);
  }

  prev(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.articles.length) % this.articles.length;
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.articles.length;
  }
}
