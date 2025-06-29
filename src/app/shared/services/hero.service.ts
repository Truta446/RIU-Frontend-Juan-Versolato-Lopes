import { computed, Injectable, Signal, signal } from '@angular/core';
import { HEROES } from '../mocks/heroes.mock';
import { Hero } from '../models/hero.model';

const HEROES_STORAGE_KEY = 'heroes';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private _heroes = signal<Hero[]>(this.loadHeroes());

  public heroes: Signal<Hero[]> = computed(() => this._heroes());

  public getAll(): Hero[] {
    return this.heroes()
      .filter((hero) => hero.deletedAt === null)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public getById(id: string): Hero | undefined {
    return this._heroes().find((hero) => hero.id === id && hero.deletedAt === null);
  }

  public filterByName(name: string): Hero[] {
    return this._heroes()
      .filter((hero) => hero.deletedAt === null && hero.name.toLowerCase().includes(name.toLowerCase()))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public add(hero: Omit<Hero, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): void {
    const newHero: Hero = {
      id: this.generateId(),
      ...hero,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    };

    this._heroes.set([...this._heroes(), newHero]);

    this.saveHeroes();
  }

  public update(updatedHero: Omit<Hero, 'createdAt' | 'updatedAt' | 'deletedAt'>): void {
    this._heroes.set(
      this._heroes().map((hero) =>
        hero.id === updatedHero.id
          ? {
              ...hero,
              ...updatedHero,
              updatedAt: new Date(),
            }
          : hero
      )
    );

    this.saveHeroes();
  }

  public delete(id: string): void {
    const now = new Date();

    this._heroes.set(
      this._heroes().map((hero) =>
        hero.id === id
          ? {
              ...hero,
              deletedAt: now,
              updatedAt: now,
            }
          : hero
      )
    );

    this.saveHeroes();
  }

  private saveHeroes(): void {
    localStorage.setItem(HEROES_STORAGE_KEY, JSON.stringify(this._heroes()));
  }

  private loadHeroes(): Hero[] {
    try {
      const data = localStorage.getItem(HEROES_STORAGE_KEY);
      if (data) {
        return JSON.parse(data, (key, value) => {
          if (['createdAt', 'updatedAt', 'deletedAt'].includes(key) && value != null) {
            return new Date(value);
          }
          return value;
        });
      }
    } catch (e) {
      localStorage.removeItem(HEROES_STORAGE_KEY);
    }

    localStorage.setItem(HEROES_STORAGE_KEY, JSON.stringify(HEROES));
    return HEROES;
  }

  private generateId(): string {
    return crypto.randomUUID();
  }
}
