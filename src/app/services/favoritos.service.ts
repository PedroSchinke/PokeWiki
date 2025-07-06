import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { BehaviorSubject } from 'rxjs';

const LS_KEY = 'favorites';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private favoritesSubject = new BehaviorSubject<number[]>(this.load());
  private api = environment.apiURL;

  favorites$ = this.favoritesSubject.asObservable();

  get value(): number[] {
    return this.favoritesSubject.value;
  }

  toggle(id: number): void {
    const current = this.value;

    const updated = current.includes(id)
      ? current.filter(p => p !== id)
      : [...current, id];

    this.favoritesSubject.next(updated);
    this.save(updated);
  }

  add(id: number): void {
    if (!this.value.includes(id)) this.toggle(id);
  }

  remove(id: number): void {
    if (this.value.includes(id)) this.toggle(id);
  }

  private load(): number[] {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private save(list: number[]): void {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  }
}
