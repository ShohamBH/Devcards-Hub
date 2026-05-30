import React, { useState } from 'react';
import CardForm from '../components/CardForm';
import { CardPreview } from '../components/CardPreview';
import Footer from '../components/Footer';
import type { DeveloperCardData } from '../types/card';
import { createCard } from '../lib/api';
import { CheckCircle, Sparkles, Star } from 'lucide-react'; // הוספת אייקון כוכב ל-Beta

const initialFormData: DeveloperCardData = {
  fullName: '',
  title: '',
  bio: '',
  avatarUrl: '',
  skills: [],
  socialLinks: {},
  projects: [],
  themeName: 'default'
};

export const CardDashboard: React.FC = () => {
  const [formData, setFormData] = useState<DeveloperCardData>(initialFormData);
  const [savedCardId, setSavedCardId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setShowSuccess(false);

    try {
      const card = await createCard(formData);
      setSavedCardId(card.id);
      setFormData({ ...formData, id: card.id });
      setShowSuccess(true);
    } catch (error) {
      console.error('Error saving card:', error);
      alert('שגיאה בשמירת הכרטיס. נסה שוב.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 dir-rtl flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1">

        {/* 🔝 ה-Header עם תווית BETA בולטת ומקצועית */}
        <header className="max-w-7xl mx-auto mb-12 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-b-slate-800/60 pb-6">
          <div className="text-center sm:text-right flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                DevCards Hub
              </h1>
              {/* תווית Beta קריאה וברורה לצד השם הראשי */}
              <span className="flex items-center gap-1 px-2.5 py-0.5 bg-blue-600/20 border border-blue-500/50 text-blue-400 text-xs font-mono font-bold rounded-md tracking-wider uppercase select-none">
                <Star size={10} className="fill-blue-400/20" />
                BETA
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">צור את כרטיס הביקור הדיגיטלי שלך כמפתח</p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || !formData.fullName || !formData.title}
            className={`px-8 py-3.5 rounded-xl font-bold shadow-lg transition-all transform active:scale-95 flex items-center gap-2 ${!formData.fullName || !formData.title
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-l from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-[1.02]'
              }`}
          >
            {isSaving ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>מייצר את הכרטיס שלך...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>✨ סיימתי! צור את הכרטיס שלי</span>
              </>
            )}
          </button>
        </header>

        {showSuccess && savedCardId && (
          <div className="max-w-7xl mx-auto mb-8 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-4 animate-fade-in shadow-md">
            <CheckCircle className="text-emerald-500 shrink-0" size={24} />
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-emerald-400 font-bold text-base">הכרטיס שלך באוויר! הנה הקישור הציבורי:</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`${window.location.origin}/card/${savedCardId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono text-sm rounded-lg border border-emerald-500/30 transition-colors"
                >
                  {window.location.origin}/card/{savedCardId}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 💻 אזור העבודה המרכזי */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto items-start">

          {/* צד ימין (או שמאל ב-RTL): טופס הפרטים */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
              <span className="text-xl">📝</span>
              <h2 className="text-xl font-bold text-slate-200">פרטי הכרטיס</h2>
            </div>
            <CardForm formData={formData} onChange={setFormData} />
          </div>

          {/* צד שמאל: תצוגה מקדימה חיה קבועה */}
          <div className="lg:sticky lg:top-8 h-fit bg-slate-900/30 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3 justify-center">
              <span className="text-xl">👀</span>
              <h2 className="text-xl font-bold text-slate-200">תצוגה מקדימה דינמית</h2>
            </div>
            <div className="flex justify-center">
              <CardPreview data={formData} cardId={savedCardId} />
            </div>
          </div>

        </div>

      </div>
      <Footer />
    </div>
  );
};