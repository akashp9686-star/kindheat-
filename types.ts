
export enum UserRole {
  GUEST = 'GUEST',
  ADOPTER = 'ADOPTER',
  ORPHANAGE = 'ORPHANAGE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photoUrl?: string;
}

export interface Orphanage {
  id: string;
  name: string;
  location: string;
  email?: string;
  distance?: string;
  image: string;
  description: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  gender: 'Boy' | 'Girl';
  bio: string;
  image: string;
  location: string;
  interests: string[];
}

export interface DonationRecord {
  id: string;
  amount: number;
  date: string;
  type: 'one-time' | 'monthly';
  status: 'completed' | 'pending';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}
