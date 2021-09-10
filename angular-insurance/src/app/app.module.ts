import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { PolicyListComponent } from './components/policy-list/policy-list.component';
import { PolicyDetailsComponent } from './components/policy-details/policy-details.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { RequestPolicyComponent } from './components/request-policy/request-policy.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PolicyListComponent,
    PolicyDetailsComponent,
    RequestPolicyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    PdfViewerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
