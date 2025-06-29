import { Routes } from '@angular/router';
import { HeroDetailComponent } from './detail/hero-detail.component';
import { HeroFormComponent } from './form/hero-form.component';
import { HeroHomeComponent } from './home/hero-home.component';

export const HERO_ROUTES: Routes = [
  { path: '', component: HeroHomeComponent },
  { path: ':id', component: HeroFormComponent },
  { path: ':id/detail', component: HeroDetailComponent },
];
