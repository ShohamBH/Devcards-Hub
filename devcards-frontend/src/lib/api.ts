import type { DeveloperCardData } from '../types/card';
import { supabase } from './supabase';
import { API_BASE_URL, APP_URL } from '../config/constants';

export interface Card extends DeveloperCardData {
  id: string;
  createdAt?: string;
  userId?: string;
}

/**
 * Sign in with OAuth provider (GitHub or Google)
 */
export async function signInWithProvider(provider: 'github' | 'google'): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: APP_URL,
    },
  });

  if (error) {
    console.error(`Error signing in with ${provider}:`, error);
    throw error;
  }
}

/**
 * Create a new card
 * Includes userId if user is authenticated
 */
export async function createCard(data: DeveloperCardData & { userId?: string }): Promise<Card> {
  console.log('🔵 Creating card with userId:', data.userId);
  
  const payload = {
    fullName: data.fullName,
    title: data.title,
    bio: data.bio,
    avatarUrl: data.avatarUrl,
    skills: data.skills,
    socialLinks: data.socialLinks,
    projects: data.projects,
    themeName: data.themeName,
    userId: data.userId || null,
  };

  console.log('🔵 Request payload:', JSON.stringify(payload, null, 2));

  const response = await fetch(`${API_BASE_URL}/cards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Failed to create card:', response.status, errorText);
    throw new Error(`Failed to create card: ${response.statusText}`);
  }

  const createdCard = await response.json();
  console.log('✅ Card created successfully:', createdCard);
  return createdCard;
}

/**
 * Get a card by ID
 */
export async function getCard(id: string): Promise<Card> {
  const response = await fetch(`${API_BASE_URL}/cards/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch card: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get a card by user ID
 * Returns null if no card exists for this user
 */
export async function getCardByUserId(userId: string): Promise<Card | null> {
  console.log('🔵 Fetching card for user ID:', userId);
  
  const response = await fetch(`${API_BASE_URL}/cards/user/${userId}`);

  if (response.status === 404) {
    console.log('⚠️ No card found for user (404)');
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Failed to fetch card by user:', response.status, errorText);
    throw new Error(`Failed to fetch card by user: ${response.statusText}`);
  }

  const userCard = await response.json();
  console.log('✅ User card loaded:', userCard);
  return userCard;
}

/**
 * Link a card to a user (claim ownership)
 */
export async function updateCardUserLink(cardId: string, userId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/cards/${cardId}/link`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to link card to user: ${response.statusText}`);
  }
}

/**
 * Get total count of cards
 */
export async function getCardsCount(): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/cards/count`);

    if (!response.ok) {
      return 0;
    }

    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error fetching card count:', error);
    return 50;
  }
}
