import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiURL;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string, password: string }) {
    return this.http.post(`${this.api}/api/login`, credentials);
  }

  register(data: { name: string, email: string, password: string }) {
    return this.http.post(`${this.api}/api/register`, data).subscribe({
      next: (res: any) => {
        this.removeToken();
        this.removeUserData();
        this.saveToken(res.access_token);
        this.saveUserData({ user: res.user, favorites: res.favorites });

        this.router.navigate(['/home']);
      },
      error: err => {
        console.log('Login inválido', err);
      }
    });
  }

  me() {
    return this.http.get(`${this.api}/api/user`);
  }

  logout() {
    return this.http.post(`${this.api}/api/logout`, {}, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    }).subscribe({
      next: () => {
        this.removeToken();
        this.removeUserData();

        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        console.log(error)
      }
    });
  }

  isAuthenticated(): boolean {
    const token = this.getToken();

    return !!token;
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  saveUserData({ user, favorites }: any) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  removeUserData() {
    localStorage.removeItem('user');
    localStorage.removeItem('favorites');
  }

  getUser(): any {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  getFavoritePokemonIds(): any {
    const data = localStorage.getItem('favorites');
    return data ? JSON.parse(data) : [];
  }

  toggleFavoritePokemon(pokemonId: number) {
    console.log(localStorage.getItem('user.favorites'))
  }
}
