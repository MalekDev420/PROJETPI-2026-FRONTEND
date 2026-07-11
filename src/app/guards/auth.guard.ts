import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const developerGuard: CanActivateFn = () => localStorage.getItem('devId') ? true : inject(Router).parseUrl('/developer-login');
export const clientGuard: CanActivateFn = () => localStorage.getItem('clientEmail') ? true : inject(Router).parseUrl('/client-login');
