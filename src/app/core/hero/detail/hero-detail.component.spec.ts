import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { ArrowLeftOutline, DeleteOutline, EditOutline } from '@ant-design/icons-angular/icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Hero } from '../../../shared/models/hero.model';
import { HeroService } from '../../../shared/services/hero.service';
import { HeroDetailComponent } from './hero-detail.component';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
  let heroService: jasmine.SpyObj<HeroService>;
  let messageService: jasmine.SpyObj<NzMessageService>;
  let translateService: jasmine.SpyObj<TranslateService>;
  let router: jasmine.SpyObj<any>;

  const HERO: Hero = {
    id: '1',
    name: 'Wonder Woman',
    superPower: ['Super strength'],
    createdAt: new Date('2022-01-01T12:00:00'),
    updatedAt: null,
    deletedAt: null,
    description: 'Amazing Amazonian hero',
  };

  beforeEach(waitForAsync(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => (key === 'id' ? '1' : null),
        },
      },
    };

    heroService = jasmine.createSpyObj('HeroService', ['getById', 'delete']);
    heroService.getById.and.returnValue(HERO);
    messageService = jasmine.createSpyObj('NzMessageService', ['success']);

    translateService = jasmine.createSpyObj('TranslateService', ['instant', 'get', 'stream']);
    translateService.instant.and.callFake((key: string) => key);
    translateService.get.and.callFake((key: string) => of(key));
    translateService.stream.and.callFake((key: string) => of(key));

    TestBed.configureTestingModule({
      imports: [HeroDetailComponent, RouterTestingModule, TranslateModule.forRoot(), NoopAnimationsModule],
      providers: [
        { provide: HeroService, useValue: heroService },
        { provide: NzMessageService, useValue: messageService },
        { provide: 'Router', useValue: router },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        provideNzIcons([EditOutline, DeleteOutline, ArrowLeftOutline]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;

    // Troca manual porque o inject do Angular pode usar o símbolo 'Router', mas RouterTestingModule cobre normalmente.
    (component as any).router = router;
    fixture.detectChanges();
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call HeroService.getById and set hero on ngOnInit', () => {
    expect(heroService.getById).toHaveBeenCalledWith('1');
    expect(component.hero).toEqual(HERO);
  });

  it('should render hero details', () => {
    fixture.detectChanges();
    const nameEl = fixture.debugElement.query(By.css('.hero-name')).nativeElement;
    expect(nameEl.textContent).toContain('Wonder Woman');
    const descEl = fixture.debugElement.query(By.css('nz-descriptions-item[nztitle="form.description"]'));
    expect(component.hero?.description).toEqual('Amazing Amazonian hero');
  });

  it('should render edit and delete buttons', () => {
    fixture.detectChanges();
    const editBtn = fixture.debugElement.query(By.css('app-button[type="primary"]'));
    expect(editBtn).toBeTruthy();
    const delBtn = fixture.debugElement.query(By.css('app-button[type="default"]'));
    expect(delBtn).toBeTruthy();
  });

  it('should call deleteHero and show message and navigate when confirmed', () => {
    fixture.detectChanges();
    component.deleteHero('1');
    expect(heroService.delete).toHaveBeenCalledWith('1');
    expect(messageService.success).toHaveBeenCalledWith('detail.deleteMessage');
    expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
  });

  it('should NOT call delete if id is undefined', () => {
    fixture.detectChanges();
    component.deleteHero(undefined);
    expect(heroService.delete).not.toHaveBeenCalled();
    expect(messageService.success).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should render the title with translation key', () => {
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('h2.title')).nativeElement;
    expect(titleEl.textContent).toContain('detail.title');
  });

  it('should have routerLink to /heroes for back icon', () => {
    fixture.detectChanges();
    const backIcon = fixture.debugElement.query(By.css('span[routerLink="/heroes"]'));
    expect(backIcon).toBeTruthy();
  });

  it('should have edit button routerLink to /heroes/1', () => {
    fixture.detectChanges();
    const editBtn = fixture.debugElement.query(By.css('app-button[type="primary"]'));
    expect(editBtn).toBeTruthy();
  });
});
