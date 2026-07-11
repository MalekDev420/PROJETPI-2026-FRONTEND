import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { label } from '../../services/utils';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<section class="page advanced-page lab-clean">
  <div class="head">
    <div>
      <p class="eyebrow">Laboratoire algorithmique client</p>
      <h1>Optimiser une mission ouverte</h1>
      <p>Le client peut appliquer des calculs avancés uniquement sur ses missions encore ouvertes. Les missions acceptées, livrées, validées ou payées ne sont pas affichées.</p>
    </div>
  </div>

  <div class="card">
    <h2>1. Choisir une mission ouverte du client</h2>
    <p class="mini-note">Connecté : <b>{{clientEmail}}</b></p>
    <select class="mission-select" [(ngModel)]="selectedMissionId" (change)="selectMission()">
      <option value="">-- Sélectionner une mission ouverte --</option>
      <option *ngFor="let m of mine" [value]="m.id">{{m.title}} — {{l(m.status)}} — {{m.budget}} DT</option>
    </select>
    <p *ngIf="!mine.length" class="error">Aucune mission ouverte trouvée pour ce client. Les missions acceptées/payées ne sont pas modifiables ici.</p>

    <div *ngIf="mission.id" class="ai-panel">
      <h3>{{mission.title}}</h3>
      <p>{{mission.description}}</p>
      <p><b>Budget actuel :</b> {{mission.budget}} DT</p>
      <p><b>Compétences :</b> {{mission.skills}}</p>
      <p><b>Statut :</b> {{l(mission.status)}}</p>
    </div>

    <div class="action-grid" *ngIf="mission.id">
      <button class="btn" [class.loading]="loading==='health'" (click)="health()">Score santé mission</button>
      <button class="btn" [class.loading]="loading==='analyze'" (click)="analyze()">Analyser qualité & risque</button>
      <button class="btn" [class.loading]="loading==='budget'" (click)="optimizeBudget()">Optimiser budget</button>
      <button class="btn" [class.loading]="loading==='market'" (click)="market()">Benchmark marché</button>
      <button class="btn" [class.loading]="loading==='roi'" (click)="roi()">Estimer ROI client</button>
      <button class="btn" [class.loading]="loading==='deadline'" (click)="deadline()">Plan délai intelligent</button>
      <button class="btn" [class.loading]="loading==='milestones'" (click)="milestones()">Plan jalons & paiement</button>
      <button class="btn" [class.loading]="loading==='quality'" (click)="quality()">Checklist qualité</button>
      <button class="btn" [class.loading]="loading==='tech'" (click)="tech()">Conseil stack technique</button>
      <button class="btn" [class.loading]="loading==='negotiation'" (click)="negotiation()">Stratégie négociation</button>
      <button class="btn" [class.loading]="loading==='description'" (click)="improve()">Améliorer description</button>
      <button class="btn" [class.loading]="loading==='top'" (click)="topDevelopers()">Trouver meilleurs développeurs</button>
      <button class="btn" [class.loading]="loading==='spec'" (click)="generateSpec()">Générer cahier des charges</button>
      <button class="btn soft" [disabled]="!spec" (click)="exportSpecPdf()">Exporter PDF détaillé</button>
      <button class="btn" [class.loading]="loading==='recommend'" (click)="recommendBest()">Recommander au développeur optimal</button>
      <button class="danger" [class.loading]="loading==='apply'" (click)="applyOptimizations()">Sauvegarder optimisations</button>
    </div>
  </div>

  <div class="metric-grid" *ngIf="healthResult || analysis">
    <div class="metric" *ngIf="healthResult"><b>{{healthResult.healthScore}}%</b><p>Santé mission</p><span>{{healthResult.status}}</span></div>
    <div class="metric" *ngIf="analysis"><b>{{analysis.complexityScore}}%</b><p>Complexité</p><span>{{analysis.complexityLabel}}</span></div>
    <div class="metric" *ngIf="analysis"><b>{{analysis.riskScore}}%</b><p>Risque</p><span>{{analysis.riskScore > 65 ? 'À surveiller' : 'Acceptable'}}</span></div>
    <div class="metric" *ngIf="analysis"><b>{{analysis.feasibilityScore}}%</b><p>Faisabilité</p><span>{{analysis.requiredLevel}}</span></div>
    <div class="metric" *ngIf="analysis"><b>{{analysis.clarityScore}}%</b><p>Clarté</p><span>{{analysis.descriptionQuality}}</span></div>
  </div>

  <div class="cols">
    <div class="card" *ngIf="healthResult">
      <h2>Score santé mission</h2>
      <p><b>Décision :</b> {{healthResult.status}}</p>
      <p *ngFor="let n of healthResult.nextActions">➡️ {{n}}</p>
    </div>

    <div class="card" *ngIf="analysis">
      <h2>Analyse décisionnelle</h2>
      <p><b>Catégorie détectée :</b> {{analysis.category}}</p>
      <p><b>Budget conseillé :</b> {{analysis.estimatedBudgetMin}} - {{analysis.estimatedBudgetMax}} DT</p>
      <p><b>Délai estimé :</b> {{analysis.estimatedDays}} jours</p>
      <p><b>Compétences extraites :</b></p>
      <span class="tag" *ngFor="let s of analysis.extractedSkills">{{s}}</span>
      <p *ngFor="let a of analysis.anomalies" class="error">⚠️ {{a}}</p>
      <p *ngFor="let r of analysis.recommendations">💡 {{r}}</p>
    </div>

    <div class="card" *ngIf="budgetResult">
      <h2>Optimisation budget</h2>
      <p><b>Budget recommandé :</b> {{budgetResult.recommended}} DT</p>
      <p><b>Fourchette :</b> {{budgetResult.min}} - {{budgetResult.max}} DT</p>
      <p>{{budgetResult.strategy}}</p><p>{{budgetResult.reason}}</p>
      <button class="btn soft" (click)="mission.budget = budgetResult.recommended; toast.success('Budget appliqué localement à la mission.')">Appliquer ce budget</button>
    </div>

    <div class="card" *ngIf="marketResult">
      <h2>Benchmark marché</h2>
      <p><b>Position :</b> {{marketResult.marketPosition}}</p>
      <p>Marché : {{marketResult.marketMin}} - {{marketResult.marketMax}} DT | Médiane {{marketResult.marketMedian}} DT</p>
      <p><b>Attractivité :</b> {{marketResult.attractivenessScore}}%</p><p>{{marketResult.advice}}</p>
    </div>

    <div class="card" *ngIf="roiResult">
      <h2>ROI estimé</h2>
      <p><b>Score valeur business :</b> {{roiResult.businessValueScore}}%</p>
      <p><b>Gain productivité estimé :</b> {{roiResult.productivityGainPercent}}%</p>
      <p><b>Retour sur investissement :</b> {{roiResult.paybackWeeks}} semaines</p><p>{{roiResult.decision}}</p>
    </div>

    <div class="card" *ngIf="deadlineResult">
      <h2>Plan délai intelligent</h2>
      <p><b>Délai total :</b> {{deadlineResult.estimatedDays}} jours</p><p>{{deadlineResult.planningRisk}}</p>
      <div class="comparebox" *ngFor="let p of deadlineResult.phases"><b>{{p.phase}}</b> — {{p.days}} jours<br><span>{{p.goal}}</span></div>
    </div>

    <div class="card" *ngIf="milestoneResult">
      <h2>Jalons & paiement</h2>
      <p>{{milestoneResult.benefit}}</p>
      <div class="comparebox" *ngFor="let m of milestoneResult.milestones"><b>{{m.name}}</b> — {{m.percent}}% — {{m.amount}} DT<br><span>{{m.deliverable}}</span></div>
    </div>

    <div class="card" *ngIf="qualityResult">
      <h2>Checklist qualité</h2>
      <p><b>Score qualité :</b> {{qualityResult.qualityScore}}% — {{qualityResult.decision}}</p>
      <div class="comparebox" *ngFor="let c of qualityResult.checklist"><b>{{c.item}}</b><br><span>Priorité {{c.priority}} — {{c.status}}</span></div>
    </div>

    <div class="card" *ngIf="techResult">
      <h2>Conseil stack technique</h2>
      <p><b>Catégorie :</b> {{techResult.category}}</p><p>{{techResult.architecture}}</p>
      <span class="tag" *ngFor="let t of techResult.recommendedStack">{{t}}</span><p>{{techResult.warning}}</p>
    </div>

    <div class="card" *ngIf="negotiationResult">
      <h2>Stratégie négociation</h2>
      <p><b>{{negotiationResult.strategy}}</b></p>
      <p>Budget recommandé : {{negotiationResult.recommendedBudget}} DT</p>
      <p *ngFor="let a of negotiationResult.arguments">📌 {{a}}</p>
    </div>
  </div>

  <div class="card" *ngIf="improved">
    <h2>Description améliorée</h2>
    <pre>{{improved}}</pre>
    <button class="btn soft" (click)="mission.description = improved; toast.success('Description améliorée appliquée localement.')">Appliquer description</button>
  </div>

  <div class="grid" *ngIf="top.length">
    <article class="card" *ngFor="let t of top; let i = index">
      <h3>#{{i+1}} {{t.developer.name}}</h3>
      <div class="bigscore">{{t.globalScore}}%</div>
      <p>Probabilité réussite : <b>{{t.successPrediction}}%</b></p>
      <p><b>Domaine :</b> {{t.developer.domain}}</p>
      <p *ngFor="let e of t.explanation">✅ {{e}}</p>
    </article>
  </div>

  <div class="card" *ngIf="recommendationResult">
    <h2>Recommandation au meilleur développeur</h2>
    <p>🏆 Mission recommandée à <b>{{recommendationResult.bestDeveloper?.name}}</b></p>
    <p>{{recommendationResult.recommendationMessage}}</p>
  </div>

  <div class="card wide-card" *ngIf="spec">
    <h2>Cahier des charges généré</h2>
    <pre>{{spec}}</pre>
    <button class="btn" (click)="exportSpecPdf()">Exporter PDF détaillé</button>
  </div>
</section>
  `
})
export class AdvancedLabComponent {
  clientEmail = localStorage.getItem('clientEmail') || 'client@demo.com';
  missions:any[]=[]; mine:any[]=[]; selectedMissionId=''; mission:any={};
  analysis:any; top:any[]=[]; budgetResult:any; spec=''; improved=''; recommendationResult:any; loading=''; l=label;
  healthResult:any; marketResult:any; roiResult:any; deadlineResult:any; milestoneResult:any; qualityResult:any; techResult:any; negotiationResult:any;
  constructor(private api: ApiService, public toast: ToastService) { this.load(); }
  load(){ this.api.missions().subscribe(x=>{ this.missions=x; this.mine=x.filter((m:any)=>m.ownerEmail===this.clientEmail && String(m.status).toLowerCase()==='open'); }); }
  selectMission(){
    const found = this.mine.find(m=>m.id===this.selectedMissionId);
    if(!found) return;
    this.mission = { ...found, skills: (found.skills || found.extractedSkills || []).join ? (found.skills || found.extractedSkills || []).join(', ') : (found.skills || '') };
    this.analysis=null; this.top=[]; this.budgetResult=null; this.spec=''; this.improved=''; this.recommendationResult=null;
    this.healthResult=null; this.marketResult=null; this.roiResult=null; this.deadlineResult=null; this.milestoneResult=null; this.qualityResult=null; this.techResult=null; this.negotiationResult=null;
    this.toast.info('Mission ouverte chargée. Vous pouvez appliquer les algorithmes avant recommandation.');
  }
  payload(){ return { ...this.mission, ownerEmail:this.clientEmail, skills:this.mission.skills }; }
  run(name:string, call:any, ok:string, cb:(r:any)=>void){ this.loading=name; call.subscribe({next:(r:any)=>{cb(r); this.toast.success(ok); this.loading='';}, error:()=>{this.toast.error('Action impossible. Vérifiez le backend Spring.'); this.loading='';}}); }
  analyze(){ this.run('analyze', this.api.advancedAnalyzeMission(this.payload()), 'Analyse terminée : score risque, complexité et qualité calculés.', r=>this.analysis=r); }
  optimizeBudget(){ this.run('budget', this.api.advancedOptimizeBudget(this.payload()), 'Budget optimisé calculé.', r=>this.budgetResult=r); }
  improve(){ this.run('description', this.api.advancedImproveDescription(this.payload()), 'Description améliorée générée.', r=>this.improved=r.improved); }
  topDevelopers(){ this.run('top', this.api.advancedTopDevelopers(this.payload()), 'Top développeurs calculé par scoring multicritère.', r=>this.top=r); }
  generateSpec(){ this.run('spec', this.api.advancedGenerateSpec(this.payload()), 'Cahier des charges complet généré.', r=>this.spec=r.specification); }
  recommendBest(){ this.run('recommend', this.api.advancedRecommendBestDeveloper(this.payload()), 'Mission recommandée au développeur optimal.', r=>{this.recommendationResult=r; this.top=r.ranking||this.top;}); }
  health(){ this.run('health', this.api.advancedMissionHealth(this.payload()), 'Score santé mission calculé.', r=>this.healthResult=r); }
  market(){ this.run('market', this.api.advancedMarketBenchmark(this.payload()), 'Benchmark marché calculé.', r=>this.marketResult=r); }
  roi(){ this.run('roi', this.api.advancedRoiEstimate(this.payload()), 'ROI client estimé.', r=>this.roiResult=r); }
  deadline(){ this.run('deadline', this.api.advancedDeadlinePlan(this.payload()), 'Plan délai intelligent généré.', r=>this.deadlineResult=r); }
  milestones(){ this.run('milestones', this.api.advancedMilestonePlan(this.payload()), 'Plan de jalons et paiement généré.', r=>this.milestoneResult=r); }
  quality(){ this.run('quality', this.api.advancedQualityChecklist(this.payload()), 'Checklist qualité générée.', r=>this.qualityResult=r); }
  tech(){ this.run('tech', this.api.advancedTechStackAdvice(this.payload()), 'Conseil stack technique généré.', r=>this.techResult=r); }
  negotiation(){ this.run('negotiation', this.api.advancedNegotiationStrategy(this.payload()), 'Stratégie négociation générée.', r=>this.negotiationResult=r); }
  applyOptimizations(){ this.run('apply', this.api.updateMission(this.mission.id, this.payload()), 'Optimisations sauvegardées dans MySQL.', r=>{this.load();}); }
  exportSpecPdf(){
    const content = this.spec || 'Veuillez générer le cahier des charges avant export.';
    const html = `<!doctype html><html><head><title>Cahier des charges</title><style>body{font-family:Arial;padding:35px;line-height:1.65;color:#111827}.logo{background:#111827;color:white;padding:18px 22px;border-radius:16px;margin-bottom:25px}h1{margin:0}.section{border:1px solid #e5e7eb;border-radius:14px;padding:18px;margin:14px 0}pre{white-space:pre-wrap;font-family:Arial;font-size:14px}</style></head><body><div class="logo"><h1>GM · Gestion Missions</h1><p>Cahier des charges détaillé généré automatiquement</p></div><div class="section"><pre>${content.replace(/</g,'&lt;')}</pre></div><script>window.print()</script></body></html>`;
    const w = window.open('', '_blank'); if(w){ w.document.write(html); w.document.close(); this.toast.success('Fenêtre PDF ouverte. Choisissez Enregistrer en PDF.'); }
  }
}
