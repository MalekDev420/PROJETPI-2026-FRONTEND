import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({standalone:true, imports:[RouterLink], template:`
<section class="hero">
  <div>
    <p class="eyebrow">Marketplace freelance IT</p>
    <h1>Gestion Missions : clients, développeurs, IA Matching et dashboards.</h1>
    <p>Une plateforme complète avec comptes séparés, notifications email, livraison GitHub/Drive, validation et paiement simulé.</p>
    <a routerLink="/client-login" class="btn">Publier une mission</a>
    <a routerLink="/developer-login" class="btn soft">Espace développeur</a>
  </div>
  <div class="heroimg">
    <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=900" alt="dashboard">
    <div class="float"><b>IA</b><span>Matching local avancé</span></div>
  </div>
</section>
<section class="cards">
  <div><h3>FrontOffice</h3><p>Missions publiques, profils, notes et commentaires.</p></div>
  <div><h3>BackOffice</h3><p>CRUD missions, CRUD développeurs, dashboards.</p></div>
  <div><h3>Workflow</h3><p>Acceptation, refus, livraison, validation, paiement.</p></div>
</section>`})
export class HomeComponent {}
