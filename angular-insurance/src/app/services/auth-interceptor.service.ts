import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { AuthService } from './authservice.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const securedEndpoints = ['/user/','/admin/','/underwriter/'];//['http://localhost:8080/api/orders'];

    if(securedEndpoints.some(url => request.urlWithParams.includes(url))) {
      //const accessToken = await this.oktaAuth.getAccessToken();
      console.log('intercepting HTML request');

      let promise: Promise<HttpEvent<any>> = new Promise((resolve, reject) => {
        this.authService.user.subscribe(user => {
          console.log('adding user to request');

          if(user === null){
            console.log('unauthenticated user attempting to access protected endpoint');
            return resolve(next.handle(request).toPromise());
          }
          
          const accessToken = user.authToken;
          console.log('obtained access token '+accessToken);
          request = request.clone({
            setHeaders: {
              Authorization: 'Bearer '+accessToken
            }
          });

          resolve(next.handle(request).toPromise());
        });
      });
      return promise;
    }
    
    return next.handle(request).toPromise();
  }

  
}