import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiURL;

  constructor(private http: HttpClient) {}

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
    return this.http.post(`${this.api}/api/logout`, {});
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken() {
    localStorage.removeItem('token');
  }
}
