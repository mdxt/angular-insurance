import { Component } from '@angular/core';
import { User } from './common/user';
import { AuthService } from './services/authservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-insurance';
  user: User;

  constructor(private authService: AuthService){
    authService.user.subscribe(user => this.user = user);
  }
}
