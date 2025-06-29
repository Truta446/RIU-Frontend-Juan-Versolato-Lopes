import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Subject, takeUntil } from 'rxjs';
import { StateManagementService } from '../../services/state-management.service';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    TranslateModule,
    NzFormModule,
    NzEmptyModule,
    NzSelectModule,
    NzIconModule,
    NzMenuModule,
    NzAvatarModule,
    NzLayoutModule,
    NzPopoverModule,
    NzInputModule,
    NzDropDownModule,
    ReactiveFormsModule,
    NzBadgeModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private fb: FormBuilder = inject(FormBuilder);
  private $translate: TranslateService = inject(TranslateService);
  private $stateManagement: StateManagementService = inject(StateManagementService);

  public headerForm = this.fb.group({
    language: this.fb.control<string>('pt'),
  });
  private destroy$ = new Subject<void>();
  public isCollapsed = false;
  public notifications: any[] = [];
  public isPopoverNotificationVisible: boolean = false;
  public isPopoverBookVisible: boolean = false;

  public ngOnInit(): void {
    const language = this.$stateManagement.language();
    this.headerForm.get('language')?.setValue(language);

    this.$translate.setDefaultLang(language || 'es');

    this.headerForm.controls.language.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        this.changeLanguage(value);
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public changeLanguage(lang: string): void {
    this.$translate.use(lang);
    localStorage.setItem('lang', lang);
    this.$stateManagement.language.set(lang);
  }

  public toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;

    this.$stateManagement.isCollapsed.set(this.isCollapsed);
  }
}
