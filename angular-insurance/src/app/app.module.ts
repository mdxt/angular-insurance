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
import { CreatePurchaseComponent } from './components/create-purchase/create-purchase.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UsersComponent } from './components/users/users.component';
import { CreatePolicyComponent } from './components/create-policy/create-policy.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PolicyListComponent,
    PolicyDetailsComponent,
    RequestPolicyComponent,
    CreatePurchaseComponent,
    OrderHistoryComponent,
    NavbarComponent,
    UsersComponent,
    CreatePolicyComponent
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
