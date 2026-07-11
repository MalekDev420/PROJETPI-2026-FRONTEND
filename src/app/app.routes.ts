import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { MissionsComponent } from './pages/missions/missions.component';
import { DevelopersComponent, DeveloperProfileComponent } from './pages/developers/developers.component';
import { ClientLoginComponent } from './pages/client-login/client-login.component';
import { DeveloperLoginComponent } from './pages/developer-login/developer-login.component';
import { ClientDashboardComponent } from './pages/client-dashboard/client-dashboard.component';
import { DeveloperDashboardComponent } from './pages/developer-dashboard/developer-dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AssistantComponent } from './pages/assistant/assistant.component';
import { AdvancedLabComponent } from './pages/advanced-lab/advanced-lab.component';
import { clientGuard, developerGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LayoutComponent, children: [
    { path: '', component: HomeComponent },
    { path: 'missions', component: MissionsComponent },
    { path: 'developers', component: DevelopersComponent },
    { path: 'developers/:id', component: DeveloperProfileComponent },
    { path: 'client-login', component: ClientLoginComponent },
    { path: 'developer-login', component: DeveloperLoginComponent },
    { path: 'client', component: ClientDashboardComponent, canActivate: [clientGuard] },
    { path: 'developer', component: DeveloperDashboardComponent, canActivate: [developerGuard] },
    { path: 'assistant', component: AssistantComponent },
    { path: 'advanced-lab', component: AdvancedLabComponent, canActivate: [clientGuard] },
    { path: 'admin', component: AdminDashboardComponent }
  ]},
  { path: '**', redirectTo: '' }
];
