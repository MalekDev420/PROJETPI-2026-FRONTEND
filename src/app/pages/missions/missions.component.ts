import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Mission } from '../../models/mission.model';
import { label } from '../../services/utils';

@Component({standalone:true, imports:[CommonModule, RouterLink], template:`
<section class="page">
  <div class="head"><h1>Missions publiques</h1><a routerLink="/client-login" class="btn">Ajouter une mission</a></div>
  <div class="grid"><article *ngFor="let m of missions" class="card">
    <span class="status">{{ l(m.status) }}</span><h3>{{m.title}}</h3><p>{{m.description}}</p>
    <b>{{m.budget}} DT</b><div><span class="tag" *ngFor="let s of m.skills">{{s}}</span></div><small>Client: {{m.ownerEmail}}</small>
  </article></div>
</section>`})
export class MissionsComponent { missions: Mission[] = []; l = label; constructor(api: ApiService){ api.missions().subscribe(x => this.missions = x); } }
