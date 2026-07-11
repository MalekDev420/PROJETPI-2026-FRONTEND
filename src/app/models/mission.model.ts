export interface Mission {
  id: string;
  title: string;
  description: string;
  budget: number;
  skills: string[];
  status: string;
  ownerEmail: string;
  assignedDeveloperId?: string;
  work?: { description?: string; link?: string; status?: string };
  payment?: any;
}
