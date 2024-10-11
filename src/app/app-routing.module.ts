import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component'; // Adjust the path as necessary
import { UserDetailsComponent } from './user-details/user-details.component'; // Adjust the path as necessary

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UserListComponent },
  { path: 'user/:id', component: UserDetailsComponent },
  { path: '**', redirectTo: 'users' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
