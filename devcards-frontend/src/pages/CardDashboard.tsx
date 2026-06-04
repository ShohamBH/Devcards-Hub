import type { DeveloperCardData } from '../types/card';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CardPreview from '../components/CardPreview';
import CardForm from '../components/CardForm';
import { SocialProofCounter } from '../components/SocialProofCounter';
import { AuthModal } from '../components/AuthModal';
import Footer from '../components/Footer';
import { createCard, updateCardUserLink, signInWithProvider, getCard, getCardByUserId } from '../lib/api';
import { supabase } from '../lib/supabase';
import { validateCardForm } from '../utils/validation';

const defaultCardData: DeveloperCardData = {
  fullName: '',
  title: '',
  bio: '',
  avatarUrl: '',
  skills: [],
  socialLinks: {},
  projects: [],
  themeName: 'default',
};

export function CardDashboard() {
  const { id: urlCardId } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  // Core form & card data
  const [formData, setFormData] = useState<DeveloperCardData>(defaultCardData);
  const [savedCardId, setSavedCardId] = useState<string | null>(urlCardId || null);
  const [loadedCard, setLoadedCard] = useState<any>(null);

  // Auth & UI states
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!urlCardId);
  const [session, setSession] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Ownership & edit mode
  const [canEdit, setCanEdit] = useState(false);
  const [isViewingOthersCard, setIsViewingOthersCard] = useState(false);

  const previewUrl = useMemo(() => {
    if (!savedCardId) return '';
    return `${window.location.origin}/card/${savedCardId}`;
  }, [savedCardId]);

  // Load card from database if ID exists in URL
  useEffect(() => {
    if (!urlCardId) {
      setIsLoading(false);
      return;
    }

    const loadCard = async () => {
      try {
        const card = await getCard(urlCardId);
        setLoadedCard(card);
        setFormData(card);
        setSavedCardId(card.id);
      } catch (error) {
        console.error('Failed to load card:', error);
        setErrorMessage('Could not load this card. It may not exist.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCard();
  }, [urlCardId]);

  // Check for existing session and auto-load user's card
  useEffect(() => {
    const initializeSession = async () => {
      console.log('🔵 [INIT] Initializing session...');
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession?.user) {
        console.log('✅ [AUTH] User is authenticated');
        console.log('🔵 [AUTH] Current Supabase User ID:', currentSession.user.id);
        console.log('🔵 [AUTH] User email:', currentSession.user.email);
      } else {
        console.log('⚠️ [AUTH] No authenticated user');
      }
      
      setSession(currentSession);

      // If user is authenticated and no card ID in URL, try to load their existing card
      if (currentSession?.user && !urlCardId) {
        console.log('🔵 [LOAD] No URL card ID detected, attempting to fetch user\'s existing card...');
        try {
          const userCard = await getCardByUserId(currentSession.user.id);
          console.log('🔵 [LOAD] Backend API Response for User Card:', userCard);
          
          if (userCard) {
            console.log('✅ [LOAD] User card found! Populating form with data...');
            console.log('🔵 [LOAD] Card ID:', userCard.id);
            console.log('🔵 [LOAD] Card belongs to user:', userCard.userId);
            
            setLoadedCard(userCard);
            setFormData(userCard);
            setSavedCardId(userCard.id);
            
            console.log('✅ [LOAD] Form populated successfully - switching to EDIT MODE');
          } else {
            console.log('⚠️ [LOAD] No existing card found for this user - showing blank form (CREATE MODE)');
          }
        } catch (error) {
          console.error('❌ [LOAD] Failed to load user card:', error);
        }
      } else if (urlCardId) {
        console.log('🔵 [LOAD] Card ID in URL detected, card will be loaded by URL-based useEffect');
      } else {
        console.log('🔵 [LOAD] No user session and no URL card ID - showing blank form');
      }
    };

    initializeSession();
  }, [urlCardId]);

  // Determine edit permissions based on session + card ownership
  useEffect(() => {
    if (!loadedCard) {
      // Creating new card - user can edit
      setCanEdit(true);
      setIsViewingOthersCard(false);
      return;
    }

    // Viewing/editing existing card
    if (session?.user?.id === loadedCard.userId) {
      // User is the owner
      setCanEdit(true);
      setIsViewingOthersCard(false);
    } else if (loadedCard.userId) {
      // Someone else owns this card
      setCanEdit(false);
      setIsViewingOthersCard(true);
    } else {
      // Card has no owner yet, current user can claim it
      setCanEdit(true);
      setIsViewingOthersCard(false);
    }
  }, [session, loadedCard]);

  // Listen for auth state changes (including OAuth redirects)
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      setSession(nextSession);

      // When user signs in and there's an active card
      if (event === 'SIGNED_IN' && nextSession?.user && savedCardId) {
        try {
          console.log('User signed in, linking card to user:', nextSession.user.id);
          await updateCardUserLink(savedCardId, nextSession.user.id);
          
          // Update loaded card with new userId
          if (loadedCard) {
            setLoadedCard({ ...loadedCard, userId: nextSession.user.id });
          }
          setShowAuthModal(false);
        } catch (error) {
          console.error('Failed to link card after auth:', error);
        }
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [savedCardId, loadedCard]);

  const validateForm = (): boolean => {
    const errors = validateCardForm(formData);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (data: DeveloperCardData) => {
    setFormData(data);
    // Clear validation errors when user updates form
    setValidationErrors({});
  };

  const handleSave = async () => {
    setErrorMessage('');

    // Validate form before saving
    if (!validateForm()) {
      setErrorMessage('Please fill in all required fields correctly before saving.');
      return;
    }

    setIsSaving(true);

    try {
      if (savedCardId && canEdit && loadedCard?.userId) {
        // Update existing card that has an owner
        console.log('🔵 [SAVE] Updating existing card:', savedCardId);
        // TODO: Implement UPDATE endpoint in backend
        setErrorMessage('Card updates coming soon!');
      } else {
        // Create new card
        const userIdToSave = session?.user?.id || null;
        console.log('🔵 [SAVE] Creating new card...');
        console.log('🔵 [SAVE] User ID to save:', userIdToSave);
        console.log('🔵 [SAVE] Session exists:', !!session);
        console.log('🔵 [SAVE] User exists:', !!session?.user);
        
        const createdCard = await createCard({
          ...formData,
          userId: userIdToSave,
        });
        
        console.log('✅ [SAVE] Card saved successfully!');
        console.log('🔵 [SAVE] Created card ID:', createdCard.id);
        console.log('🔵 [SAVE] Created card userId:', createdCard.userId);
        
        setSavedCardId(createdCard.id);
        setLoadedCard(createdCard);
        setValidationErrors({});
      }
    } catch (error) {
      console.error('❌ [SAVE] Save failed:', error);
      setErrorMessage('שמירה נכשלה. נסה שוב.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateOwnCard = () => {
    navigate('/');
  };

  const handleClaimCard = () => {
    setShowAuthModal(true);
  };

  const handleSignInGithub = async () => {
    try {
      await signInWithProvider('github');
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const handleSignInGoogle = async () => {
    try {
      await signInWithProvider('google');
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const onModalClose = () => {
    setShowAuthModal(false);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,_rgba(110,166,255,0.2),_transparent_58%)] opacity-90" />
        <div className="relative mx-auto flex min-h-screen max-w-[1600px] items-center justify-center px-6 py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
            <p className="mt-4 text-lg text-slate-300">Loading card...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      {/* Premium Ambient Lighting Background */}
      <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,_rgba(110,166,255,0.2),_transparent_58%)] opacity-90" />
      <div className="absolute inset-y-0 right-0 w-80 bg-[radial-gradient(circle_at_top_left,_rgba(45,255,240,0.14),_transparent_36%)]" />
      <div className="absolute inset-y-0 left-0 w-64 bg-[radial-gradient(circle_at_bottom_right,_rgba(252,121,168,0.12),_transparent_30%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col gap-10 px-6 py-12 lg:px-12">
        {/* Hero Header */}
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 shadow-[0_0_40px_rgba(0,0,0,0.18)] backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/30" />
              Create cards instantly and free — save anonymously or update later.
            </p>
            <div className="space-y-4">
              <h1 className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
                DevCards Hub
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                בנו כרטיס פיתוח מדהים עם עיצוב פרימיום, תצוגה חיה, והזמכנות לעדכונים.
              </p>
            </div>
          </div>

          <SocialProofCounter variant="badge" />
        </div>

        {/* Main Workspace Grid - 2 Column Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.2fr] lg:items-start">
          {/* Left Column: Form */}
          <section className="h-fit rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-8 shadow-xl backdrop-blur-xl">
            {/* Header with Auth/Claim Button */}
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-cyan-300/70">
                  {canEdit && !isViewingOthersCard ? 'Developer Card' : 'View Only'}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  {canEdit && !isViewingOthersCard ? 'Your Profile' : `${formData.fullName || 'Developer'}'s Card`}
                </h2>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <div className="flex gap-2">
                  {session?.user ? (
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:brightness-110 hover:shadow-indigo-500/50"
                    >
                      🚪 Sign Out
                    </button>
                  ) : !canEdit && isViewingOthersCard ? (
                    <button
                      type="button"
                      onClick={handleCreateOwnCard}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-fuchsia-500/30 transition-all hover:brightness-110 hover:shadow-fuchsia-500/50"
                    >
                      + Create Your Own
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleClaimCard}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-fuchsia-500/30 transition-all hover:brightness-110 hover:shadow-fuchsia-500/50"
                    >
                      + Claim
                    </button>
                  )}
                </div>
                {!session?.user && (
                  <p className="text-xs text-slate-400 max-w-xs text-right">
                    Connect your account to claim ownership and edit your card anytime in the future.
                  </p>
                )}
              </div>
            </div>

            <CardForm 
              formData={formData} 
              onChange={handleFormChange} 
              validationErrors={validationErrors}
              disabled={!canEdit}
            />
          </section>

          {/* Right Column: Live Preview (LARGER & FLOATING) */}
          <aside className="sticky top-8 h-fit rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-xl">
            <div className="pointer-events-none absolute -left-16 top-1/3 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 bottom-1/4 h-56 w-56 rounded-full bg-fuchsia-400/10 blur-3xl" />

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-400/70">Live Preview</p>
                <h3 className="mt-2 text-2xl font-bold text-white">Real-Time View</h3>
              </div>
              <span className="relative z-10 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300/80">
                {canEdit && !isViewingOthersCard ? 'Live Edit' : 'View Only'}
              </span>
            </div>

            {savedCardId && (
              <div className="relative z-10 mb-6 rounded-2xl border border-zinc-800/50 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Public Link</p>
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block break-all text-cyan-300 hover:text-cyan-200">
                  {previewUrl}
                </a>
              </div>
            )}

            <div className="relative z-10 min-h-[680px] overflow-hidden rounded-2xl border border-zinc-800/50 bg-[#020408]/90 p-8 shadow-[inset_0_0_60px_rgba(0,0,0,0.4)]">
              <CardPreview data={formData} cardId={savedCardId} />
            </div>

            {/* Premium Action Bar - Positioned Below Preview */}
            <div className="relative z-10 mt-8 space-y-4 rounded-2xl border border-zinc-800/50 bg-gradient-to-r from-slate-900/40 to-slate-800/40 p-6 backdrop-blur-xl">
              {errorMessage && (
                <div className="rounded-lg border border-rose-600/40 bg-rose-500/10 p-3 text-sm text-rose-300">
                  <p className="font-semibold">⚠️ {errorMessage}</p>
                </div>
              )}

              {canEdit && !isViewingOthersCard ? (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || Object.keys(validationErrors).length > 0}
                  className="relative w-full overflow-hidden rounded-full bg-gradient-to-r from-slate-900 via-cyan-500 to-cyan-400 px-8 py-4 text-base font-bold text-white shadow-[0_20px_50px_rgba(17,138,178,0.35)] transition-all hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(17,138,178,0.4)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      💾 Saving...
                    </span>
                  ) : Object.keys(validationErrors).length > 0 ? (
                    '✓ Complete Required Fields'
                  ) : savedCardId && loadedCard?.userId ? (
                    '💾 Update Card'
                  ) : (
                    '🚀 Save Card'
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateOwnCard}
                  className="relative w-full overflow-hidden rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-600 to-cyan-500 px-8 py-4 text-base font-bold text-slate-950 shadow-[0_20px_50px_rgba(168,85,247,0.35)] transition-all hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(168,85,247,0.4)]"
                >
                  ✨ Create Your Own Card
                </button>
              )}

              <p className="text-center text-xs text-slate-400">
                {canEdit && !isViewingOthersCard 
                  ? savedCardId 
                    ? session?.user 
                      ? 'Card saved! You can edit and update anytime.' 
                      : 'Card saved! Connect to claim ownership and edit later.'
                    : 'Your card will be public once saved'
                  : 'This card belongs to someone else. Create your own!'}
              </p>
            </div>
          </aside>
        </div>

        <Footer />
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={true}
          onClose={onModalClose}
          onSignInWithGithub={handleSignInGithub}
          onSignInWithGoogle={handleSignInGoogle}
        />
      )}
    </main>
  );
}