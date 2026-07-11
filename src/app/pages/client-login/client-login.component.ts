import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({standalone:true, imports:[CommonModule, FormsModule], template:`
<section class="auth"><div class="card">
  <h1>{{mode==='login'?'Connexion client':mode==='register'?'Créer compte client':'Mot de passe oublié client'}}</h1>
  <input [(ngModel)]="email" placeholder="Email client réel">
  <input *ngIf="mode!=='forgot'" [(ngModel)]="password" placeholder="Mot de passe" type="password">
  <input *ngIf="mode!=='forgot'" [(ngModel)]="name" placeholder="Nom / Société">
  <input *ngIf="mode==='register'" [(ngModel)]="company" placeholder="Entreprise">
  <p class="success" *ngIf="success">{{success}}</p><p class="error" *ngIf="error">{{error}}</p>
  <button class="btn" (click)="go()">{{mode==='login'?'Entrer espace client':mode==='register'?'Créer compte client':'Envoyer nouveau mot de passe'}}</button>
  <button class="btn soft" *ngIf="mode==='login'" (click)="mode='register';error='';success=''">Créer un compte client</button>
  <button class="btn soft" *ngIf="mode==='login'" (click)="mode='forgot';error='';success=''">Mot de passe oublié ?</button>
  <button class="btn soft" *ngIf="mode!=='login'" (click)="mode='login';error='';success=''">Retour connexion</button>
  <p>Démo: client@demo.com / 1234.</p>
</div></section>`})
export class ClientLoginComponent {
  mode = 'login'; email = 'client@demo.com'; password = '1234'; name = 'Client Demo'; company = ''; error = ''; success = '';
  constructor(private api: ApiService, private router: Router) {}
  go(){ this.error=''; this.success=''; const done = () => { localStorage.setItem('clientEmail', this.email.trim().toLowerCase()); this.router.navigateByUrl('/client'); };
    if(this.mode==='forgot') this.api.forgotClient(this.email).subscribe({next:r=>this.success=r.message || 'Email envoyé.', error:e=>this.error=e.error?.message || 'Erreur récupération mot de passe'});
    else if(this.mode==='register') this.api.registerClient({email:this.email,password:this.password,name:this.name,company:this.company}).subscribe({next:done,error:e=>this.error=e.error?.message||'Erreur création compte'});
    else this.api.loginClient(this.email,this.password,this.name).subscribe({next:done,error:e=>this.error=e.error?.message||'Erreur connexion'});
  }
}
