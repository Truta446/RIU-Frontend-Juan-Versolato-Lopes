import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PieChart } from 'echarts/charts';
import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';

import { CommonModule } from '@angular/common';
import { Hero } from '../../shared/models/hero.model';
import { HeroService } from '../../shared/services/hero.service';

echarts.use([GridComponent, TooltipComponent, CanvasRenderer, TitleComponent, PieChart]);

@Component({
  selector: 'app-dashboard',
  imports: [
    ReactiveFormsModule,
    NzIconModule,
    TranslateModule,
    NzCardModule,
    NzGridModule,
    NgxEchartsDirective,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [provideEchartsCore({ echarts })],
})
export class DashboardComponent implements OnInit {
  private $hero: HeroService = inject(HeroService);

  public heroes: Hero[] = [];
  public options: echarts.EChartsCoreOption = {};
  public isLoading: boolean = true;

  public ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.heroes = this.$hero.getAll();

    this.prepareSuperpowerChart();
  }

  public prepareSuperpowerChart(): void {
    const allPowers = this.heroes.flatMap((hero) => hero.superPower);
    const powerCounts: Record<string, number> = {};

    allPowers.forEach((power) => {
      powerCounts[power] = (powerCounts[power] || 0) + 1;
    });

    const data = Object.entries(powerCounts).map(([name, value]) => ({ name, value }));

    this.options = {
      tooltip: { trigger: 'item' },
      series: [
        {
          name: 'Superpowers',
          type: 'pie',
          radius: '60%',
          data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            formatter: '{b}: {c} ({d}%)',
          },
        },
      ],
    };

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  public get totalHeroes(): number {
    return this.heroes.length;
  }

  public get mostCommonPower(): { power: string; count: number } | null {
    const allPowers = this.heroes.flatMap((hero) => hero.superPower);
    const powerCount = allPowers.reduce(
      (acc, power) => {
        acc[power] = (acc[power] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    const sorted = Object.entries(powerCount).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? { power: sorted[0][0], count: sorted[0][1] } : null;
  }

  public get mostRecentHero(): Hero {
    return this.heroes.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
  }
}
