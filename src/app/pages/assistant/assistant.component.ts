import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({standalone:true, imports:[CommonModule, FormsModule], template:`
<section class="page"><h1>Assistant IA local</h1><div class="chat"><div *ngFor="let m of msgs" [class.bot]="m.bot"><b>{{m.bot?'Assistant IA':'Vous'}}</b><p>{{m.text}}</p></div></div><textarea [(ngModel)]="q" placeholder="Explique le matching IA"></textarea><button class="btn" (click)="send()">Envoyer</button><h2>Questions rapides</h2><button class="btn soft" (click)="q='Rédiger une mission';send()">Rédiger mission</button><button class="btn soft" (click)="q='Explique le matching IA';send()">Matching IA</button></section>`})
export class AssistantComponent { q=''; msgs:any[]=[]; constructor(private api: ApiService){} send(){ const text=this.q.trim(); if(!text) return; this.msgs.push({text}); this.q=''; this.api.assistant(text).subscribe({next:r=>this.msgs.push({bot:true,text:r.reply}), error:()=>this.msgs.push({bot:true,text:'Erreur de connexion avec le backend.'})}); } }
