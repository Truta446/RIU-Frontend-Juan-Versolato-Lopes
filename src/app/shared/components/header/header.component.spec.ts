import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalOutline, MenuFoldOutline, MenuUnfoldOutline } from '@ant-design/icons-angular/icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule, provideNzIcons } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { StateManagementService } from '../../services/state-management.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let translateService: jasmine.SpyObj<TranslateService>;
  let stateManagementService: any;

  beforeEach(waitForAsync(() => {
    const languageSignal = Object.assign(
      jasmine.createSpy('language', () => 'es'),
      { set: jasmine.createSpy('set') }
    ) as any;
    const isCollapsedSignal = Object.assign(
      jasmine.createSpy('isCollapsed', () => false),
      { set: jasmine.createSpy('set') }
    ) as any;

    stateManagementService = {
      language: languageSignal,
      isCollapsed: isCollapsedSignal,
    };

    translateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use']);

    TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        TranslateModule.forRoot(),
        NzIconModule,
        NzSelectModule,
        NzFormModule,
        NzInputModule,
        NzLayoutModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: TranslateService, useValue: translateService },
        { provide: StateManagementService, useValue: stateManagementService },
        provideNzIcons([GlobalOutline, MenuUnfoldOutline, MenuFoldOutline]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render nz-header and logo icon', () => {
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css('nz-header.header-container'));
    expect(header).toBeTruthy();

    const icon = fixture.debugElement.query(By.css('nz-icon.pointer-cursor'));
    expect(icon).toBeTruthy();
  });

  it('should call toggleSidebar when menu icon is clicked', () => {
    spyOn(component, 'toggleSidebar');
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('nz-icon.pointer-cursor'));
    icon.triggerEventHandler('click', null);
    expect(component.toggleSidebar).toHaveBeenCalled();
  });

  it('should toggle isCollapsed and update stateManagementService', () => {
    component.isCollapsed = false;
    component.toggleSidebar();
    expect(component.isCollapsed).toBeTrue();
    expect(stateManagementService.isCollapsed.set).toHaveBeenCalledWith(true);

    component.toggleSidebar();
    expect(component.isCollapsed).toBeFalse();
    expect(stateManagementService.isCollapsed.set).toHaveBeenCalledWith(false);
  });

  it('should set default language on ngOnInit', () => {
    component.ngOnInit();
    expect(translateService.setDefaultLang).toHaveBeenCalledWith('es');
  });

  it('should call changeLanguage on language value change', () => {
    spyOn(component, 'changeLanguage');
    component.ngOnInit();
    const control = component.headerForm.get('language');
    control?.setValue('en');
    expect(component.changeLanguage).toHaveBeenCalledWith('en');
  });

  it('should call TranslateService.use and update localStorage on changeLanguage', () => {
    spyOn(localStorage, 'setItem');
    component.changeLanguage('es');
    expect(translateService.use).toHaveBeenCalledWith('es');
    expect(localStorage.setItem).toHaveBeenCalledWith('lang', 'es');
    expect(stateManagementService.language.set).toHaveBeenCalledWith('es');
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const spy = spyOn(component['destroy$'], 'next').and.callThrough();
    const spyComplete = spyOn(component['destroy$'], 'complete').and.callThrough();
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('should prevent default form submit', () => {
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.css('form'));
    const event = new Event('submit');
    spyOn(event, 'preventDefault');
    form.triggerEventHandler('ngSubmit', event);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
