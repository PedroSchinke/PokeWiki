import { Injectable } from '@angular/core';
import {
  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): any
  {
    if (this.authService.isAuthenticated() && next.routeConfig?.path === 'login') {
      return this.router.createUrlTree(['/home']);
    }

    if (this.authService.isAuthenticated() && next.routeConfig?.path === 'cadastrar') {
      return this.router.createUrlTree(['/home']);
    }
  }
}
