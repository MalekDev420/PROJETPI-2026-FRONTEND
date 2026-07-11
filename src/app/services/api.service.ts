import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mission } from '../models/mission.model';
import { Developer } from '../models/developer.model';

const API = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  missions() { return this.http.get<Mission[]>(API + '/missions'); }
  addMission(m: any) { return this.http.post<Mission>(API + '/missions', m); }
  updateMission(id: string, m: any) { return this.http.put<Mission>(API + '/missions/' + id, m); }
  deleteMission(id: string, email = 'admin@system.local') { return this.http.delete(API + `/missions/${id}?email=${encodeURIComponent(email)}`); }

  devs() { return this.http.get<Developer[]>(API + '/developers'); }
  dev(id: string) { return this.http.get<Developer>(API + '/developers/' + id); }
  addDev(d: any) { return this.http.post<Developer>(API + '/admin/developers', d); }
  deleteDev(id: string) { return this.http.delete(API + '/admin/developers/' + id); }
  updateDev(id: string, d: any) { return this.http.put<Developer>(API + '/developers/' + id + '/profile', d); }
  rateDev(id: string, r: any) { return this.http.post<Developer>(API + '/developers/' + id + '/reviews', r); }

  loginDev(email: string, password: string) { return this.http.post<Developer>(API + '/auth/developer', { email, password }); }
  loginClient(email: string, password = '1234', name = '') { return this.http.post<any>(API + '/auth/client', { email, password, name }); }
  registerClient(data: any) { return this.http.post<any>(API + '/register/client', data); }
  registerDev(data: any) { return this.http.post<Developer>(API + '/register/developer', data); }
  forgotClient(email: string) { return this.http.post<any>(API + '/auth/forgot/client', { email }); }
  forgotDev(email: string) { return this.http.post<any>(API + '/auth/forgot/developer', { email }); }

  recs(id: string) { return this.http.get<any[]>(API + '/developers/' + id + '/recommendations'); }
  decision(mid: string, did: string, decision: string) { return this.http.post(API + '/missions/' + mid + '/decision', { developerId: did, decision }); }
  deliver(mid: string, did: string, b: any) { return this.http.post(API + '/missions/' + mid + '/work', { developerId: did, ...b }); }
  validate(mid: string, email: string, decision: string, reason = '') { return this.http.post(API + '/missions/' + mid + '/validation', { clientEmail: email, decision, reason }); }
  pay(mid: string) { return this.http.post(API + '/missions/' + mid + '/payment', {}); }

  emails() { return this.http.get<any[]>(API + '/emails'); }
  notifs(to?: string) { return this.http.get<any[]>(API + '/notifications' + (to ? '?to=' + encodeURIComponent(to) : '')); }
  workflow() { return this.http.get<any[]>(API + '/workflow'); }
  stats() { return this.http.get<any>(API + '/stats'); }
  assistant(message: string) { return this.http.post<any>(API + '/assistant/chat', { message }); }

  advancedAnalyzeMission(data: any) { return this.http.post<any>(API + '/advanced/analyze-mission', data); }
  advancedTopDevelopers(data: any) { return this.http.post<any[]>(API + '/advanced/top-developers', data); }
  advancedPredictSuccess(data: any) { return this.http.post<any>(API + '/advanced/predict-success', data); }
  advancedCompareDevelopers(data: any) { return this.http.post<any[]>(API + '/advanced/compare-developers', data); }
  advancedScanAnomalies() { return this.http.get<any[]>(API + '/advanced/scan-anomalies'); }
  advancedOptimizeBudget(data: any) { return this.http.post<any>(API + '/advanced/optimize-budget', data); }
  advancedPredictiveDashboard() { return this.http.get<any>(API + '/advanced/predictive-dashboard'); }
  advancedExplainMatching(data: any) { return this.http.post<any>(API + '/advanced/explain-matching', data); }
  advancedGenerateSpec(data: any) { return this.http.post<any>(API + '/advanced/generate-spec', data); }
  advancedImproveDescription(data: any) { return this.http.post<any>(API + '/advanced/improve-description', data); }
  advancedPublishOptimizedMission(data: any) { return this.http.post<any>(API + '/advanced/publish-optimized-mission', data); }
  advancedRecommendBestDeveloper(data: any) { return this.http.post<any>(API + '/advanced/recommend-best-developer', data); }
  advancedDeadlinePlan(data: any) { return this.http.post<any>(API + '/advanced/deadline-plan', data); }
  advancedRoiEstimate(data: any) { return this.http.post<any>(API + '/advanced/roi-estimate', data); }
  advancedQualityChecklist(data: any) { return this.http.post<any>(API + '/advanced/quality-checklist', data); }
  advancedMarketBenchmark(data: any) { return this.http.post<any>(API + '/advanced/market-benchmark', data); }
  advancedMissionHealth(data: any) { return this.http.post<any>(API + '/advanced/mission-health', data); }
  advancedMilestonePlan(data: any) { return this.http.post<any>(API + '/advanced/milestone-plan', data); }
  advancedTechStackAdvice(data: any) { return this.http.post<any>(API + '/advanced/tech-stack-advice', data); }
  advancedNegotiationStrategy(data: any) { return this.http.post<any>(API + '/advanced/negotiation-strategy', data); }
}



