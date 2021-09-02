import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PolicyService } from 'src/app/services/policy.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  private static baseUrl: string = 'http://localhost:8080';

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private httpClient: HttpClient,
              private policyService: PolicyService) { 
    this.form = this.formBuilder.group({
      email: ['',Validators.required],
      password: ['',Validators.required]
    });
  }
  
  ngOnInit() {
  }

  login() {
    const val = this.form.value;
    if (val.email && val.password) {
      this.authService.login(val.email, val.password)
          .subscribe(
              data => {
              console.log('login succeeded? = '+data);
              }
          );
    }
  }

  tryAdmin() {
    console.log('in tryAdmin');
    this.httpClient.get(LoginComponent.baseUrl+'/api/v1/tests/admin/test2'
                  , {responseType: 'text'})
                  .subscribe(
                    next => console.log('result of tryAdmin- '+next),
                    error => console.log('tryAdmin returned error- '+error));
  }
}