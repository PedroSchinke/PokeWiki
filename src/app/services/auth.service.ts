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
    return this.http.post(`${this.api}/api/register`, data);
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

        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        console.log(error)
      }
    });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  getUser(): any {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  getFavoritePokemonIds(): number[] {
    return this.getUser()?.favorites || [];
  }

  toggleFavoritePokemon(pokemonId: number) {
    console.log(localStorage.getItem('user'))
  }
}
