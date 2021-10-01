import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/common/user';
import { AuthService } from 'src/app/services/authservice.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.authService.user.subscribe(user => this.user = user);
  }

  logIn(){
    this.router.navigate(['/login'], {
      queryParams: {
        returnTo: this.router.routerState.snapshot.url
      }
    });
  }

  logOut(){
    this.authService.logout();
    if(this.router.routerState.snapshot.url.startsWith('/policies') ||
       this.router.routerState.snapshot.url.startsWith('/policy')) return;
    this.router.navigate(['/policies']);
  }

}
