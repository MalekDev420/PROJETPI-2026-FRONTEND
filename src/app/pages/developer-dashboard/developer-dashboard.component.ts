import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { Mission } from '../../models/mission.model';
import { label } from '../../services/utils';

@Component({standalone:true, imports:[CommonModule, FormsModule], template:`
<section class="page"><h1>Espace développeur</h1>
  <div class="cols"><div class="card"><h2>Messages & emails</h2><p *ngFor="let n of notifs">📩 {{n.message}}</p></div>
  <div class="card"><h2>Missions acceptées à livrer</h2><select [(ngModel)]="selectedMissionId"><option value="">-- Sélectionner --</option><option *ngFor="let m of accepted" [value]="m.id">{{m.title}} — {{l(m.status)}}</option></select><textarea [(ngModel)]="work.description" placeholder="Description du travail livré"></textarea><input [(ngModel)]="work.link" placeholder="Lien GitHub / Drive / Démo"><button class="btn" (click)="deliver()">Mettre en ligne le travail</button></div></div>
  <h2>Recommandations IA à accepter ou refuser</h2><div class="grid"><article class="card" *ngFor="let r of recs"><span class="status">Score IA {{r.score}}%</span><h3>{{r.mission.title}}</h3><p>{{r.mission.description}}</p><p *ngFor="let reason of r.reasons">✓ {{reason}}</p><button class="btn" (click)="decide(r.mission,'accept')">Accepter</button><button class="danger" (click)="decide(r.mission,'refuse')">Refuser</button></article></div>
</section>`})
export class DeveloperDashboardComponent {
  devId = localStorage.getItem('devId') || 'd1'; recs:any[]=[]; accepted: Mission[]=[]; notifs:any[]=[]; selectedMissionId=''; work:any={description:'',link:''}; l=label;
  constructor(private api: ApiService, private toast: ToastService){ this.load(); }
  load(){ this.api.recs(this.devId).subscribe(x=>this.recs=x); this.api.missions().subscribe(x=>this.accepted=x.filter(m=>m.assignedDeveloperId===this.devId && ['accepted_by_developer','revision_requested'].includes(m.status))); this.api.dev(this.devId).subscribe(d=>this.api.notifs(d.email).subscribe(n=>this.notifs=n)); }
  decide(m: Mission, decision: string){ this.api.decision(m.id,this.devId,decision).subscribe(()=>{this.toast.success(decision==='accept' ? 'Mission acceptée. Email envoyé au client et au développeur.' : 'Mission refusée. Email envoyé au client et au développeur.'); this.load();}); }
  deliver(){ if(!this.selectedMissionId) { this.toast.error('Choisissez une mission acceptée.'); return; } this.api.deliver(this.selectedMissionId,this.devId,this.work).subscribe(()=>{this.toast.success('Travail livré. Email envoyé au client avec le lien Git/Démo.'); this.work={description:'',link:''};this.selectedMissionId='';this.load();}); }
}
