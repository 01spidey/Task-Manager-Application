import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskViewComponent } from './task-view/task-view.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthGuard } from './guard/auth.guard';
import { AuthRevGuard } from './guard/auth-rev.guard';

const routes: Routes = [
  {path : 'home',component : TaskViewComponent, canActivate:[AuthGuard]},
  {path : '',component : AuthenticationComponent,canActivate:[AuthRevGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
