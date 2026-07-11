import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { Mission } from '../../models/mission.model';
import { split, label } from '../../services/utils';

@Component({standalone:true, imports:[CommonModule, FormsModule], template:`
<section class="page"><h1>Dashboard client</h1><p>Connecté: <b>{{email}}</b></p>
  <div class="cols"><div class="card"><h2>Préparer une mission parfaite</h2>
    <input [(ngModel)]="form.title" placeholder="Titre">
    <textarea [(ngModel)]="form.description" placeholder="Description"></textarea>
    <input [(ngModel)]="skills" placeholder="Compétences">
    <input type="number" [(ngModel)]="form.budget" placeholder="Budget">
    <div class="btnbar">
      <button class="btn soft" (click)="analyze()">Analyser</button>
      <button class="btn soft" (click)="optimizeBudget()">Optimiser budget</button>
      <button class="btn soft" (click)="improve()">Améliorer description</button>
      <button class="btn soft" (click)="generateSpec()">Cahier des charges</button>
      <button class="btn soft" [disabled]="!spec" (click)="exportSpecPdf()">Exporter PDF</button>
      <button class="btn soft" (click)="recommendBest()">Recommander au meilleur développeur</button>
      <button class="btn" (click)="publishOptimized()">Publier mission optimisée</button>
    </div>
    <p class="success" *ngIf="info">{{info}}</p>
    <div *ngIf="analysis" class="comparebox"><b>{{analysis.category}}</b> — Complexité {{analysis.complexityScore}}% — Risque {{analysis.riskScore}}% — Budget conseillé {{analysis.estimatedBudgetMin}}-{{analysis.estimatedBudgetMax}} DT</div>
    <div *ngIf="bestDeveloper" class="comparebox">🏆 Meilleur développeur recommandé : <b>{{bestDeveloper.name}}</b></div>
  </div>
  <div class="card"><h2>Messages</h2><p *ngFor="let n of notifs">📩 {{n.message}}</p></div></div>

  <div class="card" *ngIf="spec"><h2>Cahier des charges</h2><pre>{{spec}}</pre></div>
  <h2>Mes missions</h2><div class="grid"><article class="card" *ngFor="let m of mine"><span class="status">{{l(m.status)}}</span><h3>{{m.title}}</h3><p>{{m.description}}</p><p *ngIf="m.work?.link"><b>Lien livré:</b> <a [href]="m.work?.link" target="_blank">{{m.work?.link}}</a></p><button *ngIf="m.status==='delivered'" class="btn" (click)="validate(m,'validate')">Valider</button><button *ngIf="m.status==='delivered'" class="danger" (click)="validate(m,'refuse')">Refuser</button><button *ngIf="m.status==='validated'" class="btn" (click)="pay(m)">Paiement simulé</button><button class="danger" *ngIf="m.ownerEmail===email" (click)="remove(m)">Supprimer</button></article></div>
</section>`})
export class ClientDashboardComponent {
  email = localStorage.getItem('clientEmail') || 'client@demo.com'; missions: Mission[]=[]; mine: Mission[]=[]; notifs:any[]=[]; skills='Angular, Spring Boot, MySQL'; form:any={title:'', description:'', budget:800}; l=label; analysis:any; spec=''; improved=''; bestDeveloper:any; info=''; budgetResult:any;
  constructor(private api: ApiService, private toast: ToastService){ this.load(); }
  payload(){ return {...this.form, ownerEmail:this.email, skills:this.skills}; }
  load(){ this.api.missions().subscribe(x=>{this.missions=x; this.mine=x.filter(m=>m.ownerEmail===this.email)}); this.api.notifs(this.email).subscribe(x=>this.notifs=x); }
  analyze(){ this.api.advancedAnalyzeMission(this.payload()).subscribe(r=>{this.analysis=r; this.info='Analyse terminée : mission nettoyée et évaluée.'; this.toast.success(this.info);}); }
  optimizeBudget(){ this.api.advancedOptimizeBudget(this.payload()).subscribe(r=>{this.budgetResult=r; this.form.budget=r.recommended; this.info='Budget optimisé appliqué : '+r.recommended+' DT'; this.toast.success(this.info);}); }
  improve(){ this.api.advancedImproveDescription(this.payload()).subscribe(r=>{this.improved=r.improved; this.form.description=r.improved; this.info='Description améliorée appliquée.'; this.toast.success(this.info);}); }
  generateSpec(){ this.api.advancedGenerateSpec(this.payload()).subscribe(r=>{this.spec=r.specification; this.info='Cahier des charges généré.'; this.toast.success(this.info);}); }
  recommendBest(){ this.api.advancedRecommendBestDeveloper(this.payload()).subscribe(r=>{this.bestDeveloper=r.bestDeveloper; this.info='Mission recommandée au développeur le plus optimisé : '+(this.bestDeveloper?.name || 'N/A'); this.toast.success(this.info);}); }
  publishOptimized(){ this.api.advancedPublishOptimizedMission(this.payload()).subscribe(r=>{this.bestDeveloper=r.bestDeveloper; this.info='Mission optimisée publiée et recommandée à '+(this.bestDeveloper?.name || 'N/A'); this.toast.success(this.info); this.form={title:'',description:'',budget:800}; this.skills='Angular, Spring Boot, MySQL'; this.spec=''; this.analysis=null; this.load();}); }
  remove(m: Mission){ if(confirm('Supprimer cette mission ?')) this.api.deleteMission(m.id, this.email).subscribe(()=>{this.toast.success('Mission supprimée avec succès.'); this.load();}); }
  validate(m: Mission, decision: string){ this.api.validate(m.id, this.email, decision).subscribe(()=>{this.toast.success(decision==='validate' ? 'Travail validé. Email envoyé au développeur.' : 'Travail refusé. Email envoyé au développeur.'); this.load();}); }
  pay(m: Mission){ this.api.pay(m.id).subscribe(()=>{this.toast.success('Paiement simulé confirmé. Emails envoyés au client et au développeur.'); this.load();}); }
  exportSpecPdf(){
    const content = this.spec || 'Veuillez générer le cahier des charges avant export.';
    const html = `<!doctype html><html><head><title>Cahier des charges</title><style>body{font-family:Arial;padding:35px;line-height:1.6;color:#111827}.logo{background:#111827;color:white;padding:16px 20px;border-radius:16px;margin-bottom:25px}h1{margin:0}.section{border:1px solid #e5e7eb;border-radius:14px;padding:16px;margin:14px 0}pre{white-space:pre-wrap;font-family:Arial}</style></head><body><div class="logo"><h1>GM · Gestion Missions</h1><p>Cahier des charges généré automatiquement</p></div><div class="section"><pre>${content.replace(/</g,'&lt;')}</pre></div><script>window.print()</script></body></html>`;
    const w = window.open('', '_blank'); if(w){ w.document.write(html); w.document.close(); this.toast.success('Export PDF ouvert. Choisissez Enregistrer en PDF.'); }
  }
}
