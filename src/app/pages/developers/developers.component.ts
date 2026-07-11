import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Developer } from '../../models/developer.model';

@Component({standalone:true, imports:[CommonModule, RouterLink], template:`
<section class="page"><h1>Liste des développeurs</h1>
  <div class="grid devgrid"><article *ngFor="let d of devs" class="card dev">
    <img [src]="d.image"><h3>{{d.name}}</h3><p>{{d.title}} — {{d.domain}}</p>
    <div class="stars">★★★★★ <b>{{d.rating}}</b>/5</div><div class="rep">Réputation {{d.reputation}}/100</div>
    <span class="tag" *ngFor="let s of d.skills">{{s}}</span><a [routerLink]="['/developers', d.id]" class="btn soft">Voir profil</a>
  </article></div>
</section>`})
export class DevelopersComponent { devs: Developer[] = []; constructor(api: ApiService){ api.devs().subscribe(x => this.devs = x); } }

@Component({standalone:true, imports:[CommonModule, FormsModule], template:`
<section class="page" *ngIf="dev">
  <div class="profile"><img [src]="dev.image"><div><h1>{{dev.name}}</h1><p>{{dev.title}} — {{dev.domain}}</p><div class="stars">★★★★★ {{dev.rating}}/5 · Réputation {{dev.reputation}}/100</div><p>{{dev.bio}}</p><span class="tag" *ngFor="let s of dev.skills">{{s}}</span></div></div>
  <div class="cols"><div class="card"><h2>Projets réalisés</h2><p *ngFor="let p of dev.projects">✓ {{p}}</p></div><div class="card"><h2>Donner une note</h2><input [(ngModel)]="clientEmail" placeholder="Email client"><select [(ngModel)]="rating"><option *ngFor="let n of [1,2,3,4,5]" [value]="n">{{n}} étoile(s)</option></select><textarea [(ngModel)]="text" placeholder="Commentaire"></textarea><button class="btn" (click)="rate()">Envoyer avis</button></div></div>
  <h2>Avis clients</h2><div class="card" *ngFor="let r of dev.reviews"><b>{{r.rating}}/5 — {{r.clientEmail}}</b><p>{{r.text}}</p></div>
</section>`})
export class DeveloperProfileComponent {
  dev?: Developer; clientEmail = localStorage.getItem('clientEmail') || 'client@demo.com'; rating = 5; text = '';
  constructor(private api: ApiService, private route: ActivatedRoute){ this.load(); }
  load(){ const id = this.route.snapshot.paramMap.get('id')!; this.api.dev(id).subscribe(x => this.dev = x); }
  rate(){ if(!this.dev) return; this.api.rateDev(this.dev.id, { clientEmail: this.clientEmail, rating: this.rating, text: this.text }).subscribe(() => { this.text=''; this.load(); }); }
}
