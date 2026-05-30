import type { DeveloperCardData } from '../types/card';

const API_BASE_URL = 'http://localhost:5233/api';

export interface Card extends DeveloperCardData {
  id: string;
  createdAt?: string;
}

// פונקציה ליצירה של כרטיס חדש
export async function createCard(data: DeveloperCardData): Promise<Card> {
  const response = await fetch(`${API_BASE_URL}/cards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fullName: data.fullName,
      title: data.title,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      skills: data.skills,
      socialLinks: data.socialLinks,
      projects: data.projects,
      themeName: data.themeName,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create card: ${response.statusText}`);
  }

  return response.json();
}

// פונקציה לקבלת כרטיס לפי ID
export async function getCard(id: string): Promise<Card> {
  const response = await fetch(`${API_BASE_URL}/cards/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch card: ${response.statusText}`);
  }

  return response.json();
}
