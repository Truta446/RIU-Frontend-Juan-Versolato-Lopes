import { Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { debounceTime } from 'rxjs';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Hero } from '../../../shared/models/hero.model';
import { HeroService } from '../../../shared/services/hero.service';

@Component({
  selector: 'app-hero-home',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    TranslateModule,
    ButtonComponent,
    NzTableModule,
    NzIconModule,
    NzDropDownModule,
    RouterLink,
    NzPopconfirmModule,
  ],
  templateUrl: './hero-home.component.html',
  styleUrl: './hero-home.component.scss',
})
export class HeroHomeComponent implements OnInit {
  private $hero: HeroService = inject(HeroService);
  private $message: NzMessageService = inject(NzMessageService);
  private $translate: TranslateService = inject(TranslateService);
  private fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  public heroes: Hero[] = [];
  public form = this.fb.group({
    search: this.fb.control<string>(''),
  });

  public ngOnInit(): void {
    this.form
      .get('search')!
      .valueChanges.pipe(debounceTime(300))
      .subscribe((searchTerm: string) => {
        this.filterHeroes(searchTerm);
      });

    this.filterHeroes();
  }

  private filterHeroes(searchTerm?: string): void {
    const heroes = this.$hero.getAll();

    if (!searchTerm) {
      this.heroes = heroes;
    } else {
      const lowerTerm = searchTerm.trim().toLowerCase();
      this.heroes = heroes.filter((hero) => hero.name.toLowerCase().includes(lowerTerm));
    }
  }

  public deleteHero(id: string): void {
    this.$hero.delete(id);

    this.$message.success(this.$translate.instant('detail.deleteMessage'));

    this.filterHeroes(this.form.get('search')!.value);
  }
}
