
import { ChildProfile, Orphanage } from './types';

export const MOCK_ORPHANAGES: Orphanage[] = [
  {
    id: 'o1',
    name: 'Sunnyvale Sanctuary',
    location: 'Bangalore, KA',
    email: 'contact@sunnyvale.org',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400',
    description: 'Specializing in early childhood care and primary education.'
  },
  {
    id: 'o2',
    name: 'Grace Haven Home',
    location: 'Mumbai, MH',
    email: 'hello@gracehaven.org',
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=400',
    description: 'Providing a safe environment and vocational training for teenagers.'
  },
  {
    id: 'o3',
    name: 'Hope Springs Center',
    location: 'Delhi, NCR',
    email: 'info@hopesprings.center',
    image: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&q=80&w=400',
    description: 'A holistic care center with on-site medical facilities.'
  }
];

export const MOCK_CHILDREN: ChildProfile[] = [
  {
    id: '1',
    name: 'Leo',
    age: 5,
    gender: 'Boy',
    bio: 'Leo is a bright and energetic child who loves building complex structures with blocks and playing soccer with his friends.',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=600&auto=format&fit=crop',
    location: 'Sunnyvale Sanctuary',
    interests: ['Lego', 'Soccer', 'Drawing']
  },
  {
    id: '2',
    name: 'Maya',
    age: 7,
    gender: 'Girl',
    bio: 'Maya is a quiet observer with a heart of gold. She enjoys reading fairy tales and has a natural talent for painting.',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=600&auto=format&fit=crop',
    location: 'Grace Haven',
    interests: ['Reading', 'Painting', 'Nature']
  },
  {
    id: '3',
    name: 'Ethan',
    age: 4,
    gender: 'Boy',
    bio: 'Ethan is full of curiosity and always asking "why?". He loves animals and hopes to be a veterinarian one day.',
    image: 'https://images.unsplash.com/photo-1513159446162-54eb8bdaa79b?q=80&w=600&auto=format&fit=crop',
    location: 'Hope Springs',
    interests: ['Animals', 'Singing', 'Parks']
  },
  {
    id: '4',
    name: 'Sarah',
    age: 6,
    gender: 'Girl',
    bio: 'Sarah is an adventurous spirit who loves exploring the outdoors and has a contagious laugh.',
    image: 'https://images.unsplash.com/photo-1496433835238-4f099b127db4?q=80&w=600&auto=format&fit=crop',
    location: 'Sunnyvale Sanctuary',
    interests: ['Hiking', 'Biking', 'Cooking']
  }
];

export const APP_THEME = {
  primary: '#4F46E5', // Indigo-600
  secondary: '#10B981', // Emerald-500
  accent: '#F59E0B', // Amber-500
};
