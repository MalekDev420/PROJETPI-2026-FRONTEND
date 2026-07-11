import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private subject = new BehaviorSubject<ToastMessage | null>(null);
  message$ = this.subject.asObservable();
  private timer: any;

  show(text: string, type: 'success' | 'error' | 'info' = 'success') {
    this.subject.next({ text, type });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.subject.next(null), 3500);
  }

  success(text: string) { this.show(text, 'success'); }
  error(text: string) { this.show(text, 'error'); }
  info(text: string) { this.show(text, 'info'); }
}
