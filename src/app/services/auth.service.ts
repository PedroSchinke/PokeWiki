import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  async login(email: string, password: string) {
    const response = await this.http
      .post(`${this.apiUrl}/login`, { email, password })
      .toPromise();

    if (response) {
      localStorage.setItem('token', response.token);
    }

    return response;
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
