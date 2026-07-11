export const split = (v: string) => String(v || '').split(',').map(x => x.trim()).filter(Boolean);
export const label = (s: string) => ({
  open: 'Ouverte', accepted_by_developer: 'Acceptée', refused_by_developer: 'Refusée',
  delivered: 'Livrée', revision_requested: 'Correction demandée', validated: 'Validée', paid: 'Payée'
} as any)[s] || s;
