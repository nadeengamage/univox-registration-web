import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';
import { AuthGuard } from './service/auth-gaurd.service';
import { UnivoxComponent } from './univox/univox.component';
import { RegisterComponent } from './univox/register/register.component';
import { NotFoundComponent } from './404/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: FullLayoutComponent},
  { path: 'univox', component: UnivoxComponent, canActivate: [AuthGuard],
  children: [
    { path: 'register', component: RegisterComponent },
  ] },
  { path: '404', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
