import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <nav class="nav" *ngIf="!isAdminRoute()">
      <a routerLink="/" class="brand"><span class="logo">GM</span> Gestion Missions</a>
      <div class="links">
        <a routerLink="/missions">Missions</a>
        <a routerLink="/developers">Développeurs</a>
        <a [routerLink]="isClient() ? '/client' : '/client-login'">{{isClient() ? 'Dashboard client' : 'Espace client'}}</a>
        <a [routerLink]="isDeveloper() ? '/developer' : '/developer-login'">{{isDeveloper() ? 'Dashboard développeur' : 'Espace développeur'}}</a>
        <a routerLink="/assistant">Assistant IA</a>
        <a routerLink="/advanced-lab" *ngIf="isClient()">Lab mission</a>
        <button *ngIf="isLogged()" class="navlogout" (click)="logout()">Déconnexion</button>
      </div>
    </nav>

    <div class="toast" *ngIf="toast.message$ | async as t" [class.error]="t.type==='error'" [class.info]="t.type==='info'">
      <b>{{t.type === 'error' ? 'Erreur' : t.type === 'info' ? 'Info' : 'Succès'}}</b>
      <span>{{t.text}}</span>
    </div>

    <router-outlet />
    <footer *ngIf="!isAdminRoute()">Plateforme freelance moderne — accès admin uniquement via /admin.</footer>
  `
})
export class LayoutComponent {
  constructor(private router: Router, public toast: ToastService) {}
  isClient(){ return !!localStorage.getItem('clientEmail'); }
  isDeveloper(){ return !!localStorage.getItem('devId'); }
  isLogged(){ return this.isClient() || this.isDeveloper(); }
  isAdminRoute(){ return this.router.url.startsWith('/admin'); }
  logout(){
    localStorage.removeItem('clientEmail');
    localStorage.removeItem('devId');
    localStorage.removeItem('currentUserRole');
    this.toast.info('Déconnexion effectuée.');
    this.router.navigateByUrl('/client-login');
  }
}
