import { Injectable } from '@angular/core';
import {
  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree
  {
    if (this.authService.isAuthenticated() && next.routeConfig?.path === 'login') {
      return this.router.createUrlTree(['/home']);
    }

    if (this.authService.isAuthenticated() && next.routeConfig?.path === 'cadastrar') {
      return this.router.createUrlTree(['/home']);
    }

    if (this.authService.isAuthenticated()) {
      return true;
    }

    return this.router.createUrlTree(['/login']);
  }
}
