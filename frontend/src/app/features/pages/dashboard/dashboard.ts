import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  effect,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [CommonModule],
})
export class Dashboard {
  private readonly _route: ActivatedRoute = inject(ActivatedRoute);
  private readonly _router: Router = inject(Router);

  dashboard = this._route.snapshot.data['data'];
  rangeFilter =
    (this._route.snapshot.queryParamMap.get('range') as
      | 'all'
      | 'year'
      | 'month') ?? 'all';

  private chartRefs: Chart[] = [];

  @ViewChildren('chart') charts!: QueryList<ElementRef<HTMLCanvasElement>>;

  selectRange(range: 'all' | 'year' | 'month') {
    if (this.rangeFilter === range) return;

    this.rangeFilter = range;

    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: { range },
      queryParamsHandling: 'merge',
    });
  }

  constructor() {
    console.log('dashboard from route:', this.dashboard);

    effect(() => {
      const data = this.dashboard?.value();
      const canvases = this.charts?.toArray() ?? [];

      // 🟡 Données pas prêtes ou DOM pas encore rendu
      if (!data || canvases.length < 8) {
        console.log('⏳ Dashboard pas encore prêt', { data, canvases });

        // on attend la fin du rendu DOM avant de relancer
        queueMicrotask(() => {
          const canvasesLater = this.charts?.toArray() ?? [];
          if (data && canvasesLater.length >= 8) {
            this.renderCharts(data, canvasesLater);
          }
        });
        return;
      }

      // ✅ Données + canvases prêts
      this.renderCharts(data, canvases);
    });
  }

  private renderCharts(
    data: any,
    canvases: ElementRef<HTMLCanvasElement>[]
  ): void {
    console.log('✅ Dashboard ready:', data);

    // Reset des anciens graphiques
    this.chartRefs.forEach((c) => c.destroy());
    this.chartRefs = [];

    // === 1) Achats & dépenses ===
    this.chartRefs.push(
      new Chart(canvases[0].nativeElement, {
        type: 'bar',
        data: data.purchases,
        options: { responsive: true, scales: { y: { beginAtZero: true } } },
      })
    );

    // === 2) Répartition par thème ===
    this.chartRefs.push(
      new Chart(canvases[1].nativeElement, {
        type: 'doughnut',
        data: data.themes,
        options: { plugins: { legend: { position: 'bottom' } } },
      })
    );

    // === 3) Sets avec minifigs ===
    this.chartRefs.push(
      new Chart(canvases[2].nativeElement, {
        type: 'pie',
        data: data.minifigs,
      })
    );

    // === 4) Histogramme valeur estimée ===
    this.chartRefs.push(
      new Chart(canvases[3].nativeElement, {
        type: 'bar',
        data: data.priceHistogram,
      })
    );

    // === 5) Histogramme par tranches de pièces ===
    this.chartRefs.push(
      new Chart(canvases[4].nativeElement, {
        type: 'bar',
        data: data.piecesHistogram,
      })
    );

    // === 6) Progression des sets construits ===
    this.chartRefs.push(
      new Chart(canvases[5].nativeElement, {
        type: 'line',
        data: {
          labels: data.progression?.labels,
          datasets: data.progression.datasets.map((d: any) => ({
            ...d,
            borderColor: '#facc15',
            tension: 0.3,
            fill: false,
            pointRadius: 4,
          })),
        },
        options: {
          scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
        },
      })
    );

    // === 7) Top 5 thèmes construits ===
    this.chartRefs.push(
      new Chart(canvases[6].nativeElement, {
        type: 'bar',
        data: {
          labels: data.tops.themesBuilt.map((t: any) => t.label),
          datasets: [
            {
              label: 'Sets construits',
              data: data.tops.themesBuilt.map((t: any) => t.value),
            },
          ],
        },
      })
    );

    // === 8) Top 5 sets les plus chers ===
    this.chartRefs.push(
      new Chart(canvases[7].nativeElement, {
        type: 'bar',
        data: {
          labels: data.tops.expensiveSets.map((s: any) => s.name),
          datasets: [
            {
              label: 'Prix (€)',
              data: data.tops.expensiveSets.map((s: any) => s.price),
            },
          ],
        },
      })
    );
  }
}
