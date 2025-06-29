import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClockCircleOutline, DingdingOutline, StarOutline } from '@ant-design/icons-angular/icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule, provideNzIcons } from 'ng-zorro-antd/icon';
import { NgxEchartsDirective } from 'ngx-echarts';
import { of } from 'rxjs';
import { Hero } from '../../shared/models/hero.model';
import { HeroService } from '../../shared/services/hero.service';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let heroService: jasmine.SpyObj<HeroService>;
  let translateService: jasmine.SpyObj<TranslateService>;

  const HEROES: Hero[] = [
    {
      id: '1',
      name: 'Superman',
      superPower: ['Flight', 'Super strength'],
      createdAt: new Date(2023, 6, 10),
      updatedAt: null,
      deletedAt: null,
      description: 'Man of Steel',
    },
    {
      id: '2',
      name: 'Batman',
      superPower: ['Martial arts', 'Technology'],
      createdAt: new Date(2024, 1, 1),
      updatedAt: null,
      deletedAt: null,
      description: 'Dark Knight',
    },
    {
      id: '3',
      name: 'Wonder Woman',
      superPower: ['Super strength', 'Magic'],
      createdAt: new Date(2024, 4, 7),
      updatedAt: null,
      deletedAt: null,
      description: 'Amazon Princess',
    },
  ];

  beforeEach(waitForAsync(() => {
    heroService = jasmine.createSpyObj('HeroService', ['getAll']);
    heroService.getAll.and.returnValue([...HEROES]);
    translateService = jasmine.createSpyObj('TranslateService', ['instant', 'get', 'stream']);
    translateService.instant.and.callFake((key: string) => key);
    translateService.get.and.callFake((key: string) => of(key));
    translateService.stream.and.callFake((key: string) => of(key));

    TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        NzCardModule,
        NzGridModule,
        NzIconModule,
        NgxEchartsDirective,
        TranslateModule.forRoot(),
        CommonModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: HeroService, useValue: heroService },
        provideNzIcons([DingdingOutline, StarOutline, ClockCircleOutline]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadDashboardData on ngOnInit and fill heroes', () => {
    spyOn<any>(component, 'loadDashboardData').and.callThrough();
    component.ngOnInit();
    expect((component as any).loadDashboardData).toHaveBeenCalled();
    expect(component.heroes.length).toBe(HEROES.length);
  });

  it('should set options and disable loading after chart prep', (done) => {
    component.heroes = HEROES;
    component.prepareSuperpowerChart();
    // loading desabilita após 1s
    setTimeout(() => {
      expect(component.isLoading).toBeFalse();
      done();
    }, 1100);
  });

  it('should calculate totalHeroes getter correctly', () => {
    component.heroes = HEROES;
    expect(component.totalHeroes).toBe(HEROES.length);
  });

  it('should calculate mostCommonPower getter correctly', () => {
    component.heroes = HEROES;
    // "Super strength" aparece em 2 heróis
    expect(component.mostCommonPower).toEqual({ power: 'Super strength', count: 2 });
  });

  it('should calculate mostRecentHero getter correctly', () => {
    component.heroes = HEROES;
    // Wonder Woman é mais recente
    expect(component.mostRecentHero.name).toBe('Wonder Woman');
  });

  it('should render dashboard title and cards', () => {
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('h2.title'));
    expect(title.nativeElement.textContent).toContain('sidenav.dashboard');

    const cards = fixture.debugElement.queryAll(By.css('.card-results'));
    expect(cards.length).toBe(3);

    // Testa gráfico (apenas a div, não a renderização real)
    const chartDiv = fixture.debugElement.query(By.css('.echart'));
    expect(chartDiv).toBeTruthy();
  });

  it('should display most recent hero name in card', () => {
    component.heroes = HEROES;
    fixture.detectChanges();
    const recentCard = fixture.debugElement.queryAll(By.css('.card-results'))[2];
    expect(recentCard.nativeElement.textContent).toContain('Wonder Woman');
  });
});
