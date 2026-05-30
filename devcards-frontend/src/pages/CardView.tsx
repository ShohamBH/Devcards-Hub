import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // הוספת Link לניווט פנימי
import { CardPreview } from '../components/CardPreview';
import Footer from '../components/Footer';
import type { DeveloperCardData } from '../types/card';
import { getCard } from '../lib/api';
import { supabase } from '../lib/supabase';
import { Loader2, AlertCircle, Copy, Check, Star } from 'lucide-react';

export const CardView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cardData, setCardData] = useState<DeveloperCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) {
        setError('מזהה כרטיס חסר');
        setLoading(false);
        return;
      }

      try {
        const data = await getCard(id);

        const mappedData: DeveloperCardData = {
          id: data.id,
          fullName: data.fullName,
          title: data.title,
          bio: data.bio,
          avatarUrl: data.avatarUrl,
          skills: data.skills || [],
          socialLinks: data.socialLinks || {},
          projects: data.projects || [],
          themeName: data.themeName || 'default'
        };

        setCardData(mappedData);

        supabase.from('page_views')
          .insert({ card_id: id })
          .then(({ error: analyticsError }) => {
            if (analyticsError) console.error('Analytics Error:', analyticsError);
          });

      } catch (err) {
        console.error('Error fetching card:', err);
        setError('שגיאה בטעינת הכרטיס');
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center p-8 bg-slate-900/50 rounded-xl border border-slate-800">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-white">{error || 'הכרטיס לא נמצא'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 relative">
      
      {/* תווית בטא */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-1.5 bg-blue-600/20 border border-blue-500 text-blue-300 text-sm font-mono font-bold rounded-md shadow-lg backdrop-blur-sm select-none">
        <Star className="w-4 h-4 fill-blue-400" />
        <span>BETA VERSION</span>
      </div>

      <div className="w-full h-full flex flex-col items-center justify-center flex-1">
        <CardPreview data={cardData} />
        
        {/* כפתור העתקה */}
        <button 
          onClick={copyLink}
          className="mt-6 flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-all text-sm border border-slate-700 shadow-md"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          {copied ? 'הקישור הועתק!' : 'העתק קישור לכרטיס'}
        </button>

        {/* הכפתור החדש - "גם אני רוצה כרטיס כזה" */}
        <Link 
          to="/" 
          className="mt-4 px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-full shadow-lg transition-all transform active:scale-95"
        >
          🚀 גם אני רוצה כרטיס כזה!
        </Link>
      </div>
      
      <Footer />
    </div>
  );
};