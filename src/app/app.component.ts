import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

import { HeaderComponent } from './shared/components/header/header.component';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';
import { StateManagementService } from './shared/services/state-management.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidenavComponent, HeaderComponent, NzLayoutModule, CommonModule],
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
})
export class AppComponent implements OnInit {
  private $translate: TranslateService = inject(TranslateService);
  private $stateManagement: StateManagementService = inject(StateManagementService);

  public ngOnInit(): void {
    const lang = localStorage.getItem('lang') || 'es';
    this.$translate.use(lang);
    this.$stateManagement.language.set(lang);
  }
}
