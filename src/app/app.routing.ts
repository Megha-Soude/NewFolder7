import { Routes } from '@angular/router';
import { HeaderTopComponent } from './shared/components/header-top/header-top.component';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/services/auth/auth.guard';

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'sessions/signin4', pathMatch: 'full'},


  {
    path: '', component: AuthLayoutComponent, children: [
      {
        path: 'sessions', loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule),
        data: { title: '' }
      }
    ]
  },
  {
    path: '', component: AdminLayoutComponent, canActivate: [AuthGuard], children: [
      {
        path: 'others', loadChildren: () => import('./views/others/others.module').then(m => m.OthersModule),
        data: { title: 'Others', breadcrumb: 'OTHERS' }
      },
      {
        path: 'pages', loadChildren: () => import('./views/pages/pages.module').then(m => m.PagesModule),
        data: { title: 'Pages', breadcrumb: 'PAGES' }
      }
    ]
  },
  { path: '**', redirectTo: 'sessions/signin4' }
];

