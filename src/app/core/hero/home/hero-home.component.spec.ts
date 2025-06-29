import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MoreOutline, PlusOutline, SearchOutline } from '@ant-design/icons-angular/icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule, provideNzIcons } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { of } from 'rxjs';

import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Hero } from '../../../shared/models/hero.model';
import { HeroService } from '../../../shared/services/hero.service';
import { HeroHomeComponent } from './hero-home.component';

describe('HeroHomeComponent', () => {
  let component: HeroHomeComponent;
  let fixture: ComponentFixture<HeroHomeComponent>;
  let heroService: jasmine.SpyObj<HeroService>;
  let messageService: jasmine.SpyObj<NzMessageService>;
  let translateService: jasmine.SpyObj<TranslateService>;

  const HEROES: Hero[] = [
    {
      id: '1',
      name: 'Superman',
      superPower: ['Flight'],
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      description: '',
    },
    {
      id: '2',
      name: 'Batman',
      superPower: ['Martial arts'],
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      description: '',
    },
    {
      id: '3',
      name: 'Wonder Woman',
      superPower: ['Super strength'],
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      description: '',
    },
  ];

  beforeEach(waitForAsync(() => {
    heroService = jasmine.createSpyObj('HeroService', ['getAll', 'delete']);
    heroService.getAll.and.returnValue([...HEROES]);
    messageService = jasmine.createSpyObj('NzMessageService', ['success']);

    translateService = jasmine.createSpyObj('TranslateService', ['instant', 'get', 'stream']);
    translateService.instant.and.returnValue('Herói deletado com sucesso.');
    translateService.get.and.callFake((key: string) => of(key));
    translateService.stream.and.callFake((key: string) => of(key));

    TestBed.configureTestingModule({
      imports: [
        HeroHomeComponent,
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzIconModule,
        NzTableModule,
        NzDropDownModule,
        NzPopconfirmModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        ButtonComponent,
        RouterTestingModule,
      ],
      providers: [
        { provide: HeroService, useValue: heroService },
        { provide: NzMessageService, useValue: messageService },
        provideNzIcons([MoreOutline, SearchOutline, PlusOutline]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroHomeComponent);
    component = fixture.componentInstance;
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the list of heroes', () => {
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(HEROES.length);
  });

  it('should filter heroes by name', fakeAsync(() => {
    fixture.detectChanges();
    const input = component.form.get('search');
    input?.setValue('bat');
    tick(300); // Aguarda debounce
    fixture.detectChanges();

    expect(component.heroes.length).toBe(1);
    expect(component.heroes[0].name).toBe('Batman');
  }));

  it('should call deleteHero and show message', () => {
    fixture.detectChanges();
    component.deleteHero('1');
    expect(heroService.delete).toHaveBeenCalledWith('1');
    expect(messageService.success).toHaveBeenCalledWith('detail.deleteMessage');
  });

  it('should update heroes after delete', () => {
    fixture.detectChanges();
    // Simula o herói sumindo após o delete
    heroService.getAll.and.returnValue(HEROES.filter((h) => h.id !== '1'));
    component.deleteHero('1');
    expect(component.heroes.find((h) => h.id === '1')).toBeUndefined();
  });

  it('should render the add button and call routerLink', () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('app-button[type="primary"]'));
    expect(button).toBeTruthy();
    expect(button.attributes['routerLink']).toBe('/heroes/0');
  });

  it('should render table headers', () => {
    fixture.detectChanges();
    const headers = fixture.debugElement.queryAll(By.css('th.header'));
    expect(headers.length).toBe(4);
  });

  it('should call filterHeroes on search input change', fakeAsync(() => {
    fixture.detectChanges();
    const spy = spyOn<any>(component, 'filterHeroes').and.callThrough();
    const input = component.form.get('search');
    input?.setValue('Wonder');
    tick(300); // Espera o debounce
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  }));
});
