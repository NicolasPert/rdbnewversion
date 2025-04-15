import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="weather-container border-t-4 border-[#005AA7]">
      <div *ngIf="error" class="text-red-500 text-center p-2">
        {{ error }}
      </div>

      <div *ngIf="weatherData && !error; else loading" class="weather-card">
        <h2 class="text-2xl font-semibold text-center">
          {{ weatherData.city_info.name }}
        </h2>
        <div class="weather-info text-center">
          <img
            [src]="weatherData.current_condition.icon"
            alt="{{ weatherData.current_condition.condition }}"
            class="weather-icon mx-auto"
          />
          <p>{{ weatherData.current_condition.condition }}</p>
          <p class="temp">{{ weatherData.current_condition.tmp }} °C</p>
          <p>Vent: {{ weatherData.current_condition.wnd_spd }} km/h</p>
          <p>Humidité: {{ weatherData.current_condition.humidity }}%</p>
        </div>
      </div>

      <ng-template #loading>
        <p class="text-center">Chargement des données météo...</p>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .weather-container {
        @apply fixed top-1/4 left-0 bg-white p-4 rounded-xl shadow-lg w-64;
      }

      .weather-card {
        @apply flex flex-col items-center space-y-4 p-6;
      }

      .weather-info {
        @apply space-y-2;
      }

      .weather-icon {
        @apply w-24 h-24;
      }

      .temp {
        @apply text-xl font-bold text-blue-500;
      }
    `,
  ],
})
export class WeatherComponent implements OnInit {
  weatherData: any = null;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
          this.http.get<any>(geoUrl).subscribe({
            next: (geoData) => {
              const cityName =
                geoData.address?.city ||
                geoData.address?.town ||
                geoData.address?.village;

              if (cityName) {
                this.fetchWeather(cityName);
              } else {
                this.error = 'Ville non trouvée via géolocalisation.';
              }
            },
            error: () => {
              this.error = 'Erreur lors de la géolocalisation.';
            },
          });
        },
        () => {
          this.error = 'Accès à la localisation refusé.';
        }
      );
    } else {
      this.error =
        'La géolocalisation n’est pas supportée par votre navigateur.';
    }
  }

  private normalizeCityName(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // supprime les accents
      .replace(/[\s']/g, '-') // remplace espaces et apostrophes
      .replace(/[^a-z\-]/g, '') // supprime caractères spéciaux
      .replace(/-+/g, '-') // évite les tirets en double
      .replace(/^-|-$/g, ''); // supprime tirets au début/fin
  }

  fetchWeather(originalCity: string) {
    const normalized = this.normalizeCityName(originalCity);
    const url = `https://www.prevision-meteo.ch/services/json/${normalized}`;
    console.log('📡 Appel météo pour :', normalized);

    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (!data || data.errors || !data.city_info) {
          console.warn(
            `Ville non reconnue : ${normalized}, fallback sur Paris`
          );
          this.fetchFallbackWeather();
        } else {
          data.city_info.name = originalCity; // garder le nom original lisible
          this.weatherData = data;
        }
      },
      error: () => {
        this.error = 'Erreur lors de la récupération des données météo.';
      },
    });
  }

  fetchFallbackWeather() {
    const fallbackUrl = `https://www.prevision-meteo.ch/services/json/Paris`;
    this.http.get<any>(fallbackUrl).subscribe({
      next: (data) => {
        if (!data || data.errors || !data.city_info) {
          this.error = 'Impossible de récupérer les données météo.';
        } else {
          this.weatherData = data;
        }
      },
      error: () => {
        this.error = 'Erreur réseau lors du fallback météo.';
      },
    });
  }
}
