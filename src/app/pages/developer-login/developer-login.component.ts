import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { split } from '../../services/utils';

@Component({standalone:true, imports:[CommonModule, FormsModule], template:`
<section class="auth"><div class="card">
  <h1>{{mode==='login'?'Connexion développeur':mode==='register'?'Créer compte développeur':'Mot de passe oublié développeur'}}</h1>
  <input [(ngModel)]="email" placeholder="Email développeur réel">
  <input *ngIf="mode!=='forgot'" [(ngModel)]="password" placeholder="Mot de passe" type="password">
  <input *ngIf="mode==='register'" [(ngModel)]="name" placeholder="Nom complet">
  <input *ngIf="mode==='register'" [(ngModel)]="title" placeholder="Titre professionnel">
  <input *ngIf="mode==='register'" [(ngModel)]="domain" placeholder="Domaine">
  <input *ngIf="mode==='register'" [(ngModel)]="skills" placeholder="Compétences séparées par virgule">
  <input *ngIf="mode==='register'" [(ngModel)]="image" placeholder="URL image profil">
  <textarea *ngIf="mode==='register'" [(ngModel)]="bio" placeholder="Bio"></textarea>
  <p class="success" *ngIf="success">{{success}}</p><p class="error" *ngIf="error">{{error}}</p>
  <button class="btn" (click)="go()">{{mode==='login'?'Entrer espace développeur':mode==='register'?'Créer compte développeur':'Envoyer nouveau mot de passe'}}</button>
  <button class="btn soft" *ngIf="mode==='login'" (click)="mode='register'">Créer un compte développeur</button>
  <button class="btn soft" *ngIf="mode==='login'" (click)="mode='forgot'">Mot de passe oublié ?</button>
  <button class="btn soft" *ngIf="mode!=='login'" (click)="mode='login'">Retour connexion</button>
</div></section>`})
export class DeveloperLoginComponent {
  mode='login'; email='ahmed@dev.com'; password='1234'; name=''; title='Développeur Full Stack'; domain='Web'; skills='Angular, Node.js, MySQL'; image='https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400'; bio='Développeur inscrit sur la plateforme.'; error=''; success='';
  constructor(private api: ApiService, private router: Router) {}
  go(){ this.error=''; this.success=''; const done=(d:any)=>{localStorage.setItem('devId',d.id);this.router.navigateByUrl('/developer')};
    if(this.mode==='forgot') this.api.forgotDev(this.email).subscribe({next:r=>this.success=r.message||'Email envoyé.', error:e=>this.error=e.error?.message||'Erreur récupération mot de passe'});
    else if(this.mode==='register') this.api.registerDev({email:this.email,password:this.password,name:this.name,title:this.title,domain:this.domain,skills:split(this.skills),image:this.image,bio:this.bio}).subscribe({next:done,error:e=>this.error=e.error?.message||'Erreur création compte'});
    else this.api.loginDev(this.email,this.password).subscribe({next:done,error:e=>this.error=e.error?.message||'Erreur connexion'});
  }
}
