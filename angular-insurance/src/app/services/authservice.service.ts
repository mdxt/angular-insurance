import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, observable, Observable, Subject } from 'rxjs';
import { User } from '../common/user';
import jwt_decode from 'jwt-decode'; 
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static baseUrl: string = environment.baseUrl;//'http://localhost:8080';

  user: Subject<User> = new BehaviorSubject<User>(null);

  constructor(private httpClient: HttpClient) { 
    let object: Object = JSON.stringify(null);
    if(localStorage.getItem('user') != null){
      const user: User = JSON.parse(localStorage.getItem('user'));

      //check if timestamp is expired
      console.log('stored expiry - '+user.expiry);
      console.log('current time - '+Date.now());

      if(Date.now() > user.expiry*1000){
        this.emitAndSave(null);
      }
      else {
        this.emitAndSave(user);
      }
    }
  }

  login(email: string, password: string): Observable<boolean>{
    console.log("in login method of AuthService");
    //return this.temp();
  
    return new Observable<boolean>(
      observable => {
        this.httpClient.post(AuthService.baseUrl + '/login',
        {
          username: email,
          password: password
        },
        {observe: 'response'}
        ).subscribe(
          response => {

            //todo - find why sendError in JwtUsernameAndPasswordAuthenticationFilter.unsuccessfulAuthentication is not working
          
            const authToken: string = response.headers.get("Authorization").replace('Bearer ','');
            console.log("Obtained auth token for user "+email+" is "+authToken);
            
            let decodedAuthToken = jwt_decode(authToken);
            console.log('decoded token');
            
            console.log(decodedAuthToken);

            // console.log('token components');
            
            // console.log('username-'+decodedAuthToken['sub']);
            // console.log('token expiry-'+decodedAuthToken['exp']);
            //console.log('authorities-'+decodedAuthToken['authorities'][0]['authority']);

            let tempAuthorities: string[] = [];
            for(let i=0; decodedAuthToken['authorities'][i] != undefined; i++){
              tempAuthorities.push(decodedAuthToken['authorities'][i]['authority']);
            }

            const tempUser = new User(
              decodedAuthToken['sub'],
              authToken,
              tempAuthorities,
              +decodedAuthToken['exp'] 
            );

            this.emitAndSave(tempUser);

            // const tempUser2: User =  JSON.parse(localStorage.getItem('user'));
            // console.log('saved - '+tempUser.username+" "+tempUser.authorities);

            observable.next(true);
          },
          error => {
            console.log("login error");
            this.emitAndSave(null);
            observable.next(false);
          }
        );
      }
    );
  }

  logout() {
    this.emitAndSave(null);
  }

  signUp(userDetails: any): Observable<boolean> {
    return this.httpClient.post<boolean>(environment.apiUrl+'/public/signup', userDetails);
  }

  emitAndSave(user: User) {
    if(user === null) {
      localStorage.removeItem('user');
    } else {
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.user.next(user);
  }

  checkAccess(accessLevel: string): Observable<boolean> {
    return this.httpClient.get<boolean>(environment.apiUrl + '/'+accessLevel+'/checkAccess');
  }

  temp(){
    return this.httpClient.get(
      AuthService.baseUrl+'/api/v1/tests/public/test1', 
      {responseType: 'text'}
    );
    //return this.httpClient.get<any>();
  }
}
