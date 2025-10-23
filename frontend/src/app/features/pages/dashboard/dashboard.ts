import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  inject,
  signal,
  effect,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { LegothequeService } from 'app/features/services/legotheque.service';
import { AuthService } from 'app/features/services/auth.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [CommonModule],
})
export class Dashboard implements OnInit, OnDestroy {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _legoService = inject(LegothequeService);
  private readonly _authService = inject(AuthService);

  @ViewChildren('chart') charts!: QueryList<ElementRef<HTMLCanvasElement>>;
  private chartRefs: Chart[] = [];

  dashboard = signal<any | null>(null);
  rangeFilter: 'all' | 'year' | 'month' = 'all';

  constructor() {
    const resource = this._legoService.getUserDashboard();

    if (resource?.value) this.dashboard.set(resource.value());

    effect(() => {
      const val = resource?.value ? resource.value() : null;
      if (val) this.dashboard.set(val);
    });

    effect(() => {
      const data = this.dashboard();
      if (!data) return;

      setTimeout(() => {
        const canvases = this.charts?.toArray() ?? [];
        if (canvases.length < 8) return;
        this.renderCharts(data, canvases);
      });
    });
  }

  ngOnInit(): void {
    this.dashboard.set(null);
    this.rangeFilter = 'all';
    this._legoService.setDashboardRange('all');

    const rangeParam = this._route.snapshot.queryParamMap.get('range');
    if (!rangeParam) {
      this.rangeFilter = 'all';
      this._router.navigate([], {
        relativeTo: this._route,
        queryParams: { range: 'all' },
        queryParamsHandling: 'merge',
      });
    } else {
      this.rangeFilter = rangeParam as 'all' | 'year' | 'month';
    }
  }

  ngOnDestroy(): void {
    this.chartRefs.forEach((c) => c.destroy());
    this.chartRefs = [];
  }

  selectRange(range: 'all' | 'year' | 'month') {
    if (this.rangeFilter === range) return;
    this.rangeFilter = range;

    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: { range },
      queryParamsHandling: 'merge',
    });

    this._legoService.setDashboardRange(range);
  }

  private renderCharts(
    data: any,
    canvases: ElementRef<HTMLCanvasElement>[]
  ): void {
    this.chartRefs.forEach((c) => c.destroy());
    this.chartRefs = [];

    this.chartRefs.push(
      new Chart(canvases[0].nativeElement, {
        type: 'bar',
        data: data.purchases,
        options: { responsive: true, scales: { y: { beginAtZero: true } } },
      })
    );

    this.chartRefs.push(
      new Chart(canvases[1].nativeElement, {
        type: 'doughnut',
        data: data.themes,
        options: { plugins: { legend: { position: 'bottom' } } },
      })
    );

    this.chartRefs.push(
      new Chart(canvases[2].nativeElement, {
        type: 'pie',
        data: data.minifigs,
      })
    );

    this.chartRefs.push(
      new Chart(canvases[3].nativeElement, {
        type: 'bar',
        data: data.priceHistogram,
      })
    );

    this.chartRefs.push(
      new Chart(canvases[4].nativeElement, {
        type: 'bar',
        data: data.piecesHistogram,
      })
    );

    this.chartRefs.push(
      new Chart(canvases[5].nativeElement, {
        type: 'line',
        data: {
          labels: data.progression.labels,
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
