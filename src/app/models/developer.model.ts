export interface Developer {
  id: string;
  name: string;
  email: string;
  password?: string;
  title: string;
  domain: string;
  skills: string[];
  level?: string;
  rate?: number;
  availability?: string;
  image: string;
  bio: string;
  projects: string[];
  rating: number;
  ratingCount: number;
  reputation: number;
  reviews: any[];
}
