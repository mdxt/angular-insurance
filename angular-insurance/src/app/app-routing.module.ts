import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatePolicyComponent } from './components/create-policy/create-policy.component';
import { CreatePurchaseComponent } from './components/create-purchase/create-purchase.component';
import { LoginComponent } from './components/login/login.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { PolicyDetailsComponent } from './components/policy-details/policy-details.component';
import { PolicyListComponent } from './components/policy-list/policy-list.component';
import { UsersComponent } from './components/users/users.component';
import { UserGuard } from './guards/auth-guard.guard';


const routes: Routes = [
  // {path: 'members', component: MembersPageComponent, canActivate: [OktaAuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'policies', component: PolicyListComponent},
  {path: 'policy/:type/:id', component: PolicyDetailsComponent},
  {path: 'purchase', component: CreatePurchaseComponent, canActivate: [UserGuard], data: {role: 'user'}},
  {path: 'history', component: OrderHistoryComponent, canActivate: [UserGuard], data: {role: 'user'}},
  {path: 'underwrite', component: OrderHistoryComponent, canActivate: [UserGuard], data: {role: 'underwriter'}},
  {path: 'users', component: UsersComponent, canActivate: [UserGuard], data: {role: 'admin'}},
  {path: 'create', component: CreatePolicyComponent, canActivate: [UserGuard], data: {role: 'admin'}},
  {path: 'all', component: OrderHistoryComponent, canActivate: [UserGuard], data: {role: 'admin'}},
  {path: '**', redirectTo: '/policies'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
