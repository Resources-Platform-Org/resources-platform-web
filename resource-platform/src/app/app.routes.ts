import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ContentComponent } from './pages/content/content.component';
import { ContentDetailComponent } from './pages/content-detail/content-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { FilesComponent } from './admin/files/files.component';
import { UniversitiesComponent } from './admin/universities/universities.component';
import { MajorsComponent } from './admin/majors/majors.component';
import { LevelsComponent } from './admin/levels/levels.component';
import { UsersComponent } from './admin/users/users.component';
import { SettingsComponent } from './admin/settings/settings.component';
import { ActivityLogsComponent } from './admin/activity-logs/activity-logs.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'content', component: ContentComponent },
  { path: 'content/:id', component: ContentDetailComponent },
  {
    path: 'admin',
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'files', component: FilesComponent },
      { path: 'universities', component: UniversitiesComponent },
      { path: 'majors', component: MajorsComponent },
      { path: 'levels', component: LevelsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'activity-logs', component: ActivityLogsComponent },
    ]
  },
  { path: '**', component: NotFoundComponent }
];
