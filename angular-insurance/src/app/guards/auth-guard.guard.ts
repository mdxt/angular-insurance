import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../common/user';
import { AuthService } from '../services/authservice.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log('canActivateChild next - '+next.toString());
      console.log('canActivateChild state - '+state.toString());
      //return false;
      const role: string = next.data.role;
      return this.authService.user
                              .pipe(map(user => (user != null && user.authorities.includes('ROLE_'+role.toUpperCase()))))
                              .pipe(validInMemory => (validInMemory && this.authService.checkAccess(role)))
                              .pipe(catchError(err => of(false)))
                              .pipe(map(fullyValid => {
                                if(!fullyValid) {
                                  this.router.navigate(['/login'], {
                                    queryParams: {
                                      returnTo: state.url
                                    }
                                  });
                                }
                                return fullyValid;
                              }));                  
  }
  
}
