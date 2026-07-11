import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Mission } from '../../models/mission.model';
import { Developer } from '../../models/developer.model';
import { split, label } from '../../services/utils';

@Component({standalone:true, imports:[CommonModule, FormsModule], template:`
<div class="admin-shell">
  <aside class="admin-sidebar">
    <div class="admin-brand"><span class="logo">GM</span><div><b>Gestion Missions</b><small>BackOffice Admin</small></div></div>
    <button class="side-link" (click)="scrollToSection('overview')">Vue générale</button>
    <button class="side-link" (click)="scrollToSection('analytics')">Analytics</button>
    <button class="side-link" (click)="scrollToSection('missions')">CRUD missions</button>
    <button class="side-link" (click)="scrollToSection('developers')">Développeurs</button>
    <button class="side-link" (click)="scrollToSection('workflow')">Workflow & emails</button>
    <button class="side-link" (click)="scrollToSection('datascience')">Data science</button>
    <button class="side-danger" (click)="goPublic()">Retour FrontOffice</button>
  </aside>

  <main class="admin-main">
    <section id="overview" class="admin-hero">
      <div>
        <p class="eyebrow">BackOffice sécurisé</p>
        <h1>Tableau de bord administrateur</h1>
        <p>Supervision complète : missions, développeurs, budget, risques, emails, workflow et algorithmes de matching.</p>
      </div>
      <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900" alt="dashboard analytique">
    </section>

    <section class="admin-kpis">
      <div><span>Missions</span><b>{{s?.missions || 0}}</b><small>Total publié</small></div>
      <div><span>Développeurs</span><b>{{s?.developers || 0}}</b><small>Talents inscrits</small></div>
      <div><span>Clients</span><b>{{s?.clients || 0}}</b><small>Comptes actifs</small></div>
      <div><span>Budget</span><b>{{s?.budget || 0}} DT</b><small>Volume global</small></div>
      <div><span>Note moyenne</span><b>{{s?.avgRating || 0}}/5</b><small>Réputation</small></div>
      <div><span>Risque moyen</span><b>{{s?.avgRisk || 0}}%</b><small>Prédiction</small></div>
    </section>

    <section id="analytics" class="admin-grid">
      <div class="admin-card wide">
        <h2>Courbe d'activité missions</h2>
        <p class="muted">Visualisation synthétique du pipeline métier.</p>
        <div class="line-chart">
          <svg viewBox="0 0 700 220" preserveAspectRatio="none">
            <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2563eb" stop-opacity=".35"/><stop offset="1" stop-color="#2563eb" stop-opacity="0"/></linearGradient></defs>
            <polyline points="20,170 110,135 200,150 290,85 380,105 470,55 560,82 680,35" fill="none" stroke="#2563eb" stroke-width="5" stroke-linecap="round"/>
            <polygon points="20,170 110,135 200,150 290,85 380,105 470,55 560,82 680,35 680,210 20,210" fill="url(#g)"/>
          </svg>
        </div>
      </div>
      <div class="admin-card">
        <h2>Répartition des statuts</h2>
        <div class="donut" [style.background]="donutStyle()"><span>{{s?.successRate || 0}}%</span></div>
        <p class="muted">Taux réussite calculé depuis les missions validées/payées.</p>
      </div>
      <div class="admin-card">
        <h2>Top technologies</h2>
        <div *ngFor="let t of topTech(); let i=index" class="barline">
          <span>{{t.technology}}</span><div><i [style.width.%]="barWidth(t.count)"></i></div><b>{{t.count}}</b>
        </div>
      </div>
    </section>

    <section id="datascience" class="admin-grid">
      <div class="admin-card wide">
        <h2>Pipeline algorithmique & Data Science</h2>
        <div class="pipeline">
          <div>Nettoyage<br><small>trim, normalisation</small></div>
          <div>NLP<br><small>mots-clés</small></div>
          <div>Features<br><small>compétences, budget</small></div>
          <div>Similarité<br><small>cosinus</small></div>
          <div>Scoring<br><small>ranking</small></div>
          <div>Prédiction<br><small>risque/réussite</small></div>
        </div>
      </div>
      <div class="admin-card">
        <h2>Missions risquées</h2>
        <p *ngFor="let r of s?.riskyMissions" class="risk">⚠️ {{r.title}}<br><b>Risque {{r.riskScore}}%</b> — {{r.complexityLabel}}</p>
        <p *ngIf="!s?.riskyMissions?.length" class="muted">Aucune anomalie critique.</p>
      </div>
    </section>

    <section id="missions" class="admin-grid">
      <div class="admin-card">
        <h2>Créer mission</h2>
        <input [(ngModel)]="missionForm.title" placeholder="Titre mission">
        <textarea [(ngModel)]="missionForm.description" placeholder="Description"></textarea>
        <input [(ngModel)]="missionSkills" placeholder="Compétences">
        <input type="number" [(ngModel)]="missionForm.budget" placeholder="Budget">
        <input [(ngModel)]="missionForm.ownerEmail" placeholder="Email client">
        <button class="btn" (click)="addMission()">Générer mission</button>
      </div>
      <div class="admin-card wide">
        <h2>CRUD Missions</h2>
        <div class="table admin-table">
          <div class="row headrow"><b>Mission</b><b>Client</b><b>Budget</b><b>Statut</b><b>Actions</b></div>
          <div class="row" *ngFor="let m of missions">
            <input [(ngModel)]="m.title"><input [(ngModel)]="m.ownerEmail"><input type="number" [(ngModel)]="m.budget">
            <select [(ngModel)]="m.status"><option *ngFor="let st of statuses" [value]="st">{{l(st)}}</option></select>
            <div><button class="btn mini" (click)="saveMission(m)">Modifier</button><button class="danger mini" (click)="deleteMission(m)">Supprimer</button></div>
          </div>
        </div>
      </div>
    </section>

    <section id="developers" class="admin-grid">
      <div class="admin-card">
        <h2>Ajouter développeur</h2>
        <input [(ngModel)]="devForm.name" placeholder="Nom"><input [(ngModel)]="devForm.email" placeholder="Email"><input [(ngModel)]="devForm.password" placeholder="Mot de passe"><input [(ngModel)]="devForm.title" placeholder="Titre"><input [(ngModel)]="devForm.domain" placeholder="Domaine"><input [(ngModel)]="devSkills" placeholder="Compétences"><input type="number" [(ngModel)]="devForm.rate" placeholder="Tarif"><input [(ngModel)]="devForm.image" placeholder="URL image"><textarea [(ngModel)]="devForm.bio" placeholder="Bio"></textarea>
        <button class="btn" (click)="addDeveloper()">Ajouter développeur</button>
      </div>
      <div class="admin-card wide">
        <h2>Gestion développeurs</h2>
        <div class="admin-dev-grid"><article class="dev-mini" *ngFor="let d of devs"><img [src]="d.image"><div><h3>{{d.name}}</h3><p>{{d.title}} — {{d.domain}}</p><b>Réputation {{d.reputation}}/100 · {{d.rating}}/5</b><br><span class="tag" *ngFor="let sk of d.skills">{{sk}}</span></div><button class="danger mini" (click)="deleteDeveloper(d)">Supprimer</button></article></div>
      </div>
    </section>

    <section id="workflow" class="admin-grid">
      <div class="admin-card">
        <h2>Emails / notifications</h2>
        <p *ngFor="let e of emails" class="mailitem"><b>{{e.subject}}</b><br>{{e.to}}<br><small>{{e.body}}</small></p>
      </div>
      <div class="admin-card">
        <h2>Workflow métier</h2>
        <p *ngFor="let w of workflow" class="workflowitem">⚙️ {{w.message}}</p>
      </div>
    </section>
  </main>
</div>`})
export class AdminDashboardComponent {
  s:any; emails:any[]=[]; workflow:any[]=[]; missions:Mission[]=[]; devs:Developer[]=[]; statuses=['open','accepted_by_developer','refused_by_developer','delivered','revision_requested','validated','paid']; l=label;
  devSkills='Angular, Node.js'; missionSkills='Angular, Node.js, MySQL';
  devForm:any={name:'',email:'',password:'1234',title:'Développeur Full Stack',domain:'Web',rate:70,image:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',bio:'Développeur ajouté par l’administration.'};
  missionForm:any={title:'',description:'',budget:500,ownerEmail:'client@demo.com'};
  constructor(private api: ApiService){ this.load(); }
  load(){ this.api.stats().subscribe(x=>this.s=x); this.api.emails().subscribe(x=>this.emails=x); this.api.workflow().subscribe(x=>this.workflow=x); this.api.missions().subscribe(x=>this.missions=x); this.api.devs().subscribe(x=>this.devs=x); }
  scrollToSection(id:string){
    const el = document.getElementById(id);
    if(el){ el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }
  goPublic(){ location.href='/'; }
  topTech(){ return this.s?.topTechnologies?.length ? this.s.topTechnologies : [{technology:'Angular',count:4},{technology:'Spring',count:3},{technology:'MySQL',count:3},{technology:'IA',count:2}]; }
  barWidth(c:number){ const max=Math.max(...this.topTech().map((x:any)=>x.count||1)); return Math.max(18, Math.round((c/max)*100)); }
  donutStyle(){ const v=Math.min(100, Math.max(0, Number(this.s?.successRate || 0))); return `conic-gradient(#2563eb 0 ${v}%, #e2e8f0 ${v}% 100%)`; }
  addDeveloper(){ this.api.addDev({...this.devForm, skills:split(this.devSkills), projects:[]}).subscribe(()=>{this.devForm={name:'',email:'',password:'1234',title:'Développeur Full Stack',domain:'Web',rate:70,image:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',bio:'Développeur ajouté par l’administration.'}; this.load();}); }
  deleteDeveloper(d:Developer){ if(confirm('Supprimer ce développeur ?')) this.api.deleteDev(d.id).subscribe(()=>this.load()); }
  addMission(){ this.api.addMission({...this.missionForm, skills:split(this.missionSkills)}).subscribe(()=>{this.missionForm={title:'',description:'',budget:500,ownerEmail:'client@demo.com'}; this.load();}); }
  saveMission(m:Mission){ this.api.updateMission(m.id,m).subscribe(()=>this.load()); }
  deleteMission(m:Mission){ if(confirm('Supprimer cette mission ?')) this.api.deleteMission(m.id).subscribe(()=>this.load()); }
}
