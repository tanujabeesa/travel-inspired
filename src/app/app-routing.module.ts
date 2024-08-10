import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddpostComponent } from './pages/addpost/addpost.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { HomeComponent } from './pages/home/home.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';

import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from "@angular/fire/auth-guard"

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['signin']);
const redirectLoggedInToHome = ()=> redirectLoggedInTo(['']);



const routes: Routes = [
  {
    path: 'signin',
    component: SigninComponent,
    canActivate: [canActivate],
    data: { authGuardPipe: redirectLoggedInToHome },
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [canActivate],
    data: { authGuardPipe: redirectLoggedInToHome },
  },
  {
    path: 'addpost',
    component: AddpostComponent,
    canActivate: [canActivate],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [canActivate],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: '**',
    component: PagenotfoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
