import { Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Hero } from '../../../shared/models/hero.model';
import { HeroService } from '../../../shared/services/hero.service';

@Component({
  selector: 'app-hero-form',
  imports: [
    ReactiveFormsModule,
    NzCheckboxModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    TranslateModule,
    NzCardModule,
    ButtonComponent,
    NzIconModule,
    NzButtonModule,
    RouterLink,
  ],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.scss',
})
export class HeroFormComponent implements OnInit {
  private router: Router = inject(Router);
  private $hero: HeroService = inject(HeroService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private $message: NzMessageService = inject(NzMessageService);
  private $translate: TranslateService = inject(TranslateService);
  private fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  public hero?: Hero;
  public loading: boolean = false;
  public form = this.fb.group({
    name: this.fb.control<string>('', [Validators.required]),
    description: this.fb.control<string>('', [Validators.maxLength(512)]),
    superPower: this.fb.control<string[]>([], [Validators.required]),
  });
  public SUPER_POWERS: string[] = [
    'Super strength',
    'Flight',
    'Martial arts',
    'Technology',
    'Speed',
    'Energy blasts',
    'Telepathy',
    'Agility',
    'Magic',
    'Regeneration',
  ];

  public ngOnInit(): void {
    const heroId = this.route.snapshot.paramMap.get('id')!;
    this.hero = this.$hero.getById(heroId);

    if (!!this.hero?.id) {
      this.form.patchValue({
        name: this.hero.name,
        description: String(this.hero.description),
        superPower: this.hero.superPower || [],
      });
    }
  }

  public submitForm(): void {
    if (this.form.valid) {
      const { name, description, superPower } = this.form.value;

      if (!!this.hero?.id) {
        this.$hero.update({ id: this.hero.id, name: name!, description, superPower: superPower! });
        this.$message.success(this.$translate.instant('form.editSuccessMessage'));
      } else {
        this.$hero.add({ name: name!, description, superPower: superPower! });
        this.$message.success(this.$translate.instant('form.createSuccessMessage'));
      }

      this.router.navigate(['/heroes']);
    } else {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
