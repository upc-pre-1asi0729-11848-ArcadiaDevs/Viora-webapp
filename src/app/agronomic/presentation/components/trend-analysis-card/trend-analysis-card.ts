import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

import { AgronomicStore, TrendAnalysisTimeRange } from '../../../application/agronomic.store';

interface TrendTimeRangeOption {
  value: TrendAnalysisTimeRange;
  label: string;
  labelKey: string;
}

@Component({
  selector: 'app-trend-analysis-card',
  standalone: true,
  imports: [MatCardModule, MatSelectModule, TranslatePipe, BaseChartDirective],
  templateUrl: './trend-analysis-card.html',
  styleUrl: './trend-analysis-card.css',
})
export class TrendAnalysisCard {
  protected readonly store = inject(AgronomicStore);

  protected readonly chartType: 'bar' | 'line' = 'bar';

  protected readonly timeRangeOptions: TrendTimeRangeOption[] = [
    {
      value: '7days',
      label: '7 days',
      labelKey: 'time.7days',
    },
    {
      value: '30days',
      label: '30 days',
      labelKey: 'time.30days',
    },
    {
      value: 'campaign',
      label: 'Campaign',
      labelKey: 'time.campaign',
    },
  ];

  protected readonly chartData = computed<ChartData<'bar' | 'line', number[], string>>(() => {
    const statistics = this.store.trendAgronomicStatistics();

    const labels = statistics?.labels ?? [];
    const ndviSeries = statistics?.ndviSeries ?? [];
    const cpSeries = statistics?.cpSeries ?? [];
    const threshold = statistics?.threshold ?? 600;

    return {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'NDVI Index',
          data: ndviSeries,
          yAxisID: 'yNDVI',
          backgroundColor: '#2E4A3A',
          borderColor: '#2E4A3A',
          borderRadius: 5,
          barThickness: 28,
          order: 2,
        },
        {
          type: 'line',
          label: 'Chill Portions (CP)',
          data: cpSeries,
          yAxisID: 'yCP',
          borderColor: '#5B8DEF',
          backgroundColor: '#5B8DEF',
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.35,
          order: 1,
        },
        {
          type: 'line',
          label: 'Threshold',
          data: labels.map(() => threshold),
          yAxisID: 'yCP',
          borderColor: '#FF8B8B',
          backgroundColor: '#FF8B8B',
          borderWidth: 2,
          borderDash: [8, 6],
          pointRadius: 0,
          pointHoverRadius: 0,
          tension: 0,
          order: 0,
        },
      ],
    };
  });

  protected readonly chartOptions: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          color: '#1F2C26',
          font: {
            family: "'Poppins', sans-serif",
            size: 13,
            weight: 500,
          },
        },
      },
      tooltip: {
        backgroundColor: '#1F2C26',
        padding: 12,
        cornerRadius: 8,
        titleColor: '#FFFFFF',
        titleFont: {
          family: "'Poppins', sans-serif",
        },
        bodyColor: '#FFFFFF',
        bodyFont: {
          family: "'Poppins', sans-serif",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#8C877F',
          font: {
            family: "'Poppins', sans-serif",
          },
        },
      },
      yNDVI: {
        type: 'linear',
        position: 'left',
        min: 0,
        max: 1,
        grid: {
          color: '#EFEAE3',
        },
        ticks: {
          color: '#8C877F',
          font: {
            family: "'Poppins', sans-serif",
          },
        },
        title: {
          display: true,
          text: 'NDVI Index',
          color: '#1F2C26',
          font: {
            family: "'Poppins', sans-serif",
            size: 13,
            weight: 700,
          },
        },
      },
      yCP: {
        type: 'linear',
        position: 'right',
        min: 0,
        max: 700,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#8C877F',
          font: {
            family: "'Poppins', sans-serif",
          },
        },
        title: {
          display: true,
          text: 'Chill Portions (CP)',
          color: '#5B8DEF',
          font: {
            family: "'Poppins', sans-serif",
            size: 13,
            weight: 700,
          },
        },
      },
    },
  };

  protected onTrendPlotSelected(event: MatSelectChange): void {
    this.store.selectTrendPlot(event.value);
  }

  protected onTrendTimeRangeSelected(event: MatSelectChange): void {
    this.store.selectTrendTimeRange(event.value as TrendAnalysisTimeRange);
  }
}
