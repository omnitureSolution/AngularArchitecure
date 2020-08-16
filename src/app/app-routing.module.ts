/** Angular core dependencies */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgetPasswordComponent } from './features-modules/auth/forget-password/forget-password.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        loadChildren: './features-modules/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: '',
        loadChildren: './features-modules/auth/auth.module#AuthModule'
      },
    ]
  },
  {
    path: 'forget',
    component: ForgetPasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: false})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
