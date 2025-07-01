import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule, provideNzIcons } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { of } from 'rxjs';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ArrowLeftOutline, DingtalkOutline } from '@ant-design/icons-angular/icons';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Hero } from '../../../shared/models/hero.model';
import { HeroService } from '../../../shared/services/hero.service';
import { HeroFormComponent } from './hero-form.component';

describe('HeroFormComponent', () => {
  let component: HeroFormComponent;
  let fixture: ComponentFixture<HeroFormComponent>;
  let heroService: jasmine.SpyObj<HeroService>;
  let messageService: jasmine.SpyObj<NzMessageService>;
  let translateService: jasmine.SpyObj<TranslateService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;

  const HERO: Hero = {
    id: '1',
    name: 'Superman',
    superPower: ['Flight', 'Super strength'],
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
    description: 'Man of Steel',
  };

  beforeEach(waitForAsync(() => {
    heroService = jasmine.createSpyObj('HeroService', ['getById', 'update', 'add']);
    messageService = jasmine.createSpyObj('NzMessageService', ['success']);
    translateService = jasmine.createSpyObj('TranslateService', ['instant', 'get', 'stream']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    translateService.instant.and.callFake((key: string) => {
      if (key === 'form.editSuccessMessage') return 'Herói atualizado!';
      if (key === 'form.createSuccessMessage') return 'Herói criado!';
      if (key === 'form.required') return 'Campo obrigatório';
      return key;
    });
    translateService.get.and.callFake((key: string) => of(key));
    translateService.stream.and.callFake((key: string) => of(key));

    activatedRoute = {
      snapshot: {
        paramMap: {
          get: (k: string) => (k === 'id' ? HERO.id : null),
        },
      },
    } as any;

    heroService.getById.and.returnValue(HERO);

    TestBed.configureTestingModule({
      imports: [
        HeroFormComponent,
        ReactiveFormsModule,
        NzCheckboxModule,
        NzFormModule,
        NzSelectModule,
        NzInputModule,
        NzCardModule,
        NzIconModule,
        NzButtonModule,
        NoopAnimationsModule,
        ButtonComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: HeroService, useValue: heroService },
        { provide: NzMessageService, useValue: messageService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
        provideNzIcons([DingtalkOutline, ArrowLeftOutline]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load hero data into form when editing', () => {
    expect(component.form.get('name')?.value).toBe(HERO.name);
    expect(component.form.get('description')?.value).toBe(HERO.description || '');
    expect(component.form.get('superPower')?.value).toEqual(HERO.superPower);
  });

  it('should call update on submit when editing', () => {
    component.hero = HERO;
    component.form.setValue({
      name: 'Batman',
      description: 'The Dark Knight',
      superPower: ['Martial arts'],
    });
    component.submitForm();
    expect(heroService.update).toHaveBeenCalledWith(
      jasmine.objectContaining({
        id: HERO.id,
        name: 'Batman',
        description: 'The Dark Knight',
        superPower: ['Martial arts'],
      })
    );
    expect(messageService.success).toHaveBeenCalledWith('form.editSuccessMessage');
    expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
  });

  it('should call add on submit when creating', () => {
    component.hero = undefined;
    component.form.setValue({
      name: 'Flash',
      description: 'Fastest Man Alive',
      superPower: ['Speed'],
    });
    component.submitForm();
    expect(heroService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        name: 'Flash',
        description: 'Fastest Man Alive',
        superPower: ['Speed'],
      })
    );
    expect(messageService.success).toHaveBeenCalledWith('form.createSuccessMessage');
    expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
  });

  it('should not submit if form is invalid and mark controls as dirty', () => {
    component.form.get('name')?.setValue('');
    component.form.get('superPower')?.setValue([]);
    spyOn(component.form.get('name')!, 'markAsDirty').and.callThrough();
    spyOn(component.form.get('superPower')!, 'markAsDirty').and.callThrough();

    component.submitForm();

    expect(heroService.update).not.toHaveBeenCalled();
    expect(heroService.add).not.toHaveBeenCalled();
    expect(component.form.get('name')?.markAsDirty).toHaveBeenCalled();
    expect(component.form.get('superPower')?.markAsDirty).toHaveBeenCalled();
  });

  it('should render the correct title for edit mode', () => {
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('h2.title')).nativeElement.textContent.trim();
    expect(title).toBe('form.editTitle');
  });

  it('should render the correct title for create mode', () => {
    heroService.getById.and.returnValue(undefined as any);
    (activatedRoute.snapshot.paramMap.get as any) = (k: string) => (k === 'id' ? null : null);
    fixture = TestBed.createComponent(HeroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('h2.title')).nativeElement.textContent.trim();
    expect(title).toBe('form.createTitle');
  });

  it('should show required error if name is empty and form is submitted', () => {
    component.form.get('name')?.setValue('');
    component.form.get('superPower')?.setValue(['Speed']);
    component.form.get('description')?.setValue('');
    component.submitForm();
    fixture.detectChanges();

    const errorText = fixture.debugElement.query(By.css('.ant-form-item-explain')).nativeElement.textContent;
    expect(errorText).toContain('form.required');
  });
});
