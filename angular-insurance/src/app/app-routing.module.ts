import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PolicyDetailsComponent } from './components/policy-details/policy-details.component';
import { PolicyListComponent } from './components/policy-list/policy-list.component';


const routes: Routes = [
  // {path: 'members', component: MembersPageComponent, canActivate: [OktaAuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'policies', component: PolicyListComponent},
  {path: 'policy/:id', component: PolicyDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
