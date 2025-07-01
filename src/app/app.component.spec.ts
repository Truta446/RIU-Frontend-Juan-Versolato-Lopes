import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';
import { StateManagementService } from './shared/services/state-management.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let translateService: jasmine.SpyObj<TranslateService>;
  let stateManagementService: any;

  beforeEach(waitForAsync(() => {
    translateService = jasmine.createSpyObj('TranslateService', ['use']);
    stateManagementService = {
      language: { set: jasmine.createSpy('set') },
    };

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => (key === 'id' ? '1' : null),
        },
      },
    };

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'lang') return 'pt';
      return null;
    });

    TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HeaderComponent,
        SidenavComponent,
        RouterOutlet,
        NzLayoutModule,
        CommonModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: TranslateService, useValue: translateService },
        { provide: StateManagementService, useValue: stateManagementService },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set language from localStorage and call services on ngOnInit', () => {
    component.ngOnInit();
    expect(translateService.use).toHaveBeenCalledWith('pt');
    expect(stateManagementService.language.set).toHaveBeenCalledWith('pt');
  });

  it('should default to "es" if lang not set in localStorage', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);
    component.ngOnInit();
    expect(translateService.use).toHaveBeenCalledWith('es');
    expect(stateManagementService.language.set).toHaveBeenCalledWith('es');
  });
});
