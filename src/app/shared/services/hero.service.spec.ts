import { TestBed } from '@angular/core/testing';
import { HEROES } from '../mocks/heroes.mock';
import { Hero } from '../models/hero.model';
import { HeroService } from './hero.service';

describe('HeroService', () => {
  let service: HeroService;
  let store: Record<string, string>;
  let mockUUID = 1;

  beforeEach(() => {
    store = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      store[key] = value;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete store[key];
    });

    spyOn(window.crypto, 'randomUUID').and.callFake(() => `123e4567-e89b-12d3-a456-42661417400${mockUUID++}`);

    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroService);

    mockUUID = 1;
  });

  afterEach(() => {
    store = {};
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load default HEROES if no storage present', () => {
    store = {};
    const s = TestBed.inject(HeroService);
    expect(s.getAll().length).toBe(HEROES.length);
  });

  it('should save and load from localStorage', () => {
    service.add({ name: 'Test', description: 'desc', superPower: ['Power'] });
    const stored = JSON.parse(store['heroes']);
    expect(stored.length).toBeGreaterThan(0);

    const s2 = TestBed.inject(HeroService);
    expect(s2.getAll().length).toBeGreaterThan(0);
  });

  it('should add a new hero with generated id', () => {
    const before = service.getAll().length;
    service.add({ name: 'Novo', description: '', superPower: ['Tech'] });
    const after = service.getAll();
    expect(after.length).toBe(before + 1);

    expect(after[0].id).toContain('123e4567');
    expect(after[0].name).toBe('Novo');
  });

  it('should get hero by id', () => {
    service.add({ name: 'Buscado', description: '', superPower: ['Fly'] });
    const all = service.getAll();
    const hero = service.getById(all[0].id);
    expect(hero).toBeTruthy();
    expect(hero?.name).toBe('Buscado');
  });

  it('should return undefined for deleted hero on getById', () => {
    service.add({ name: 'DeleteMe', description: '', superPower: ['Magic'] });
    const hero = service.getAll()[0];
    service.delete(hero.id);
    expect(service.getById(hero.id)).toBeUndefined();
  });

  it('should filter heroes by name', () => {
    service.add({ name: 'TechMan', description: '', superPower: ['Tech'] });
    service.add({ name: 'StrongWoman', description: '', superPower: ['Force'] });
    let filtered = service.filterByName('tech');
    expect(filtered.some((h) => h.name === 'TechMan')).toBeTrue();
    filtered = service.filterByName('woman');
    expect(filtered.some((h) => h.name === 'StrongWoman')).toBeTrue();

    filtered = service.filterByName('TechMan');
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('TechMan');
  });

  it('should update an existing hero', () => {
    service.add({ name: 'OldName', description: '', superPower: ['A'] });
    const hero = service.getAll()[0];
    service.update({ id: hero.id, name: 'NewName', description: 'Desc', superPower: ['B'] });
    const updated = service.getAll()[0];
    expect(updated.name).toBe('NewName');
    expect(updated.description).toBe('Desc');
    expect(updated.superPower[0]).toBe('B');
    expect(updated.updatedAt).toBeTruthy();
  });

  it('should soft delete a hero', () => {
    service.add({ name: 'DeleteHero', description: '', superPower: ['C'] });
    const hero = service.getAll()[0];
    service.delete(hero.id);
    const all = service.getAll();
    expect(all.some((h) => h.id === hero.id)).toBeFalse();

    const stored = JSON.parse(store['heroes']);
    expect(stored.find((h: Hero) => h.id === hero.id)?.deletedAt).toBeTruthy();
  });

  it('should parse hero dates as Date objects from storage', () => {
    const now = new Date();
    const hero = {
      id: 'hero-date-test',
      name: 'Data Hero',
      superPower: ['Time travel'],
      description: '',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      deletedAt: null,
    };

    store['heroes'] = JSON.stringify([hero]);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const s = TestBed.inject(HeroService);

    const loaded = s.getAll();

    expect(loaded[0].createdAt instanceof Date).toBeTrue();
    expect(loaded[0].updatedAt instanceof Date).toBeTrue();
    expect(loaded[0].deletedAt).toBeNull();
  });
});
