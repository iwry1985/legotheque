import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDashboard } from 'app/features/models/dashboard.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [CommonModule],
})
export class Dashboard implements AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  dashboard!: any;

  @ViewChildren('chart') charts!: QueryList<ElementRef<HTMLCanvasElement>>;

  ngAfterViewInit() {
    const tryInit = () => {
      this.dashboard = this.route.snapshot.data['data'].value();
      const canvases = this.charts.toArray();

      const data = this.dashboard;

      if (!data || canvases?.length < 8) {
        console.warn('Dashboard not ready', { data, canvases });
        setTimeout(tryInit, 50);
        return;
      }

      this.initCharts(data, canvases);
    };

    queueMicrotask(() => setTimeout(tryInit, 0));
  }

  private initCharts(data: any, canvases: ElementRef<HTMLCanvasElement>[]) {
    new Chart(canvases[0].nativeElement, {
      type: 'bar',
      data: data.purchases,
      options: { responsive: true, scales: { y: { beginAtZero: true } } },
    });

    new Chart(canvases[1].nativeElement, {
      type: 'doughnut',
      data: data.themes,
      options: { plugins: { legend: { position: 'bottom' } } },
    });

    new Chart(canvases[2].nativeElement, {
      type: 'pie',
      data: data.minifigs,
    });

    new Chart(canvases[3].nativeElement, {
      type: 'bar',
      data: data.priceHistogram,
    });

    new Chart(canvases[4].nativeElement, {
      type: 'bar',
      data: data.piecesHistogram,
    });

    new Chart(canvases[5].nativeElement, {
      type: 'line',
      data: data.progression,
    });

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
    });

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
    });
  }
}
