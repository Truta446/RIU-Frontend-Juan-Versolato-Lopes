import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Hero } from '../../../shared/models/hero.model';
import { HeroService } from '../../../shared/services/hero.service';

@Component({
  selector: 'app-hero-detail',
  imports: [
    CommonModule,
    TranslateModule,
    ButtonComponent,
    NzGridModule,
    NzIconModule,
    RouterLink,
    NzPopconfirmModule,
    NzDescriptionsModule,
    NzCardModule,
  ],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.scss',
})
export class HeroDetailComponent implements OnInit {
  private router: Router = inject(Router);
  private $hero: HeroService = inject(HeroService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private $message: NzMessageService = inject(NzMessageService);
  private $translate: TranslateService = inject(TranslateService);

  public hero?: Hero;

  public ngOnInit(): void {
    const heroId = this.route.snapshot.paramMap.get('id')!;
    this.hero = this.$hero.getById(heroId);
  }

  public deleteHero(id?: string): void {
    if (!id) return;

    this.$hero.delete(id);

    this.$message.success(this.$translate.instant('detail.deleteMessage'));

    this.router.navigate(['/heroes']);
  }
}
