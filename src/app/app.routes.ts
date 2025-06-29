import { Routes } from '@angular/router';
import { DashboardComponent } from './core/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  { path: 'heroes', loadChildren: () => import('./core/hero/hero.routes').then((m) => m.HERO_ROUTES) },
];
