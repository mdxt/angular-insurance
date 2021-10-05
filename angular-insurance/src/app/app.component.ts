import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './common/user';
import { AuthService } from './services/authservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-insurance';
  //user: User;
  params: any;
  showRequestForm: boolean;

  constructor(private authService: AuthService,
              private router: Router){
    //this.authService.user.subscribe(user => this.user = user);
    console.log('known API url is '+environment.apiUrl);
    this.router.events
    .subscribe(event => {
        if (event instanceof NavigationEnd) {
          console.log('router event '+event);
          if(event['urlAfterRedirects'].startsWith('/policies') ||
            event['urlAfterRedirects'].startsWith('/policy')){
            this.showRequestForm = true;
          }
          else{
            this.showRequestForm = false;
          }
        }
    });
  }
}
