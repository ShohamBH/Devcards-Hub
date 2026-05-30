import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { ExternalLink, GitBranch, Globe, Mail } from 'lucide-react';
import type { DeveloperCardData, ThemeType } from '../types/card';

interface CardPreviewProps {
  data: DeveloperCardData;
  cardId?: string | null; // תוספת לקבלת ה-ID מ-Supabase
}

const themeStyles = {
  default: {
    container: 'bg-white shadow-2xl border border-gray-200',
    header: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    title: 'text-slate-900 font-bold',
    subtitle: 'text-blue-600 font-medium',
    bio: 'text-slate-600',
    section: 'text-slate-800 font-semibold',
    badge: 'bg-blue-100 text-blue-700 border border-blue-200',
    link: 'text-blue-600 hover:text-blue-800',
    qr: 'bg-white p-3 rounded-lg shadow-md'
  },
  dark: {
    container: 'bg-black shadow-[0_0_50px_rgba(0,255,255,0.3)] border-2 border-cyan-500',
    header: 'bg-gradient-to-br from-purple-900 to-black',
    title: 'text-white font-bold [text-shadow:0_0_20px_rgba(147,51,234,0.8)]',
    subtitle: 'text-cyan-400 font-medium [text-shadow:0_0_15px_rgba(34,211,238,0.6)]',
    bio: 'text-gray-300',
    section: 'text-purple-400 font-semibold [text-shadow:0_0_10px_rgba(168,85,247,0.5)]',
    badge: 'bg-purple-900/50 text-cyan-300 border border-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.3)]',
    link: 'text-cyan-400 hover:text-cyan-300 [text-shadow:0_0_8px_rgba(34,211,238,0.4)]',
    qr: 'bg-white p-3 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.5)]'
  },
  vscode: {
    container: 'bg-[#1e1e1e] shadow-2xl border border-[#3c3c3c]',
    header: 'bg-[#252526] border-b border-[#3c3c3c]',
    title: 'text-[#4ec9b0] font-bold font-mono',
    subtitle: 'text-[#569cd6] font-medium font-mono',
    bio: 'text-[#d4d4d4] font-mono text-sm',
    section: 'text-[#dcdcaa] font-semibold font-mono',
    badge: 'bg-[#264f78] text-[#9cdcfe] border border-[#569cd6] font-mono text-xs',
    link: 'text-[#569cd6] hover:text-[#9cdcfe] font-mono',
    qr: 'bg-[#252526] p-3 rounded border border-[#3c3c3c]'
  },
  retro: {
    container: 'bg-black shadow-[0_0_40px_rgba(0,255,0,0.4)] border-4 border-[#00ff00]',
    header: 'bg-gradient-to-b from-[#001a00] to-black border-b-2 border-[#00ff00]',
    title: 'text-[#00ff00] font-bold font-mono uppercase [text-shadow:0_0_10px_rgba(0,255,0,0.8)]',
    subtitle: 'text-[#00ff00] font-medium font-mono [text-shadow:0_0_8px_rgba(0,255,0,0.6)]',
    bio: 'text-[#00cc00] font-mono text-sm',
    section: 'text-[#00ff00] font-semibold font-mono uppercase [text-shadow:0_0_8px_rgba(0,255,0,0.5)]',
    badge: 'bg-transparent text-[#00ff00] border-2 border-[#00ff00] font-mono text-xs shadow-[0_0_8px_rgba(0,255,0,0.3)]',
    link: 'text-[#00ff00] hover:text-[#00cc00] font-mono [text-shadow:0_0_6px_rgba(0,255,0,0.4)]',
    qr: 'bg-black p-3 rounded border-2 border-[#00ff00] shadow-[0_0_15px_rgba(0,255,0,0.4)]'
  },
  gradient: {
    container: 'bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 shadow-2xl',
    header: 'bg-white/10 backdrop-blur-md border-b border-white/20',
    title: 'text-white font-bold [text-shadow:0_2px_10px_rgba(0,0,0,0.3)]',
    subtitle: 'text-pink-100 font-medium [text-shadow:0_2px_8px_rgba(0,0,0,0.2)]',
    bio: 'text-white/90',
    section: 'text-white font-semibold',
    badge: 'bg-white/20 text-white border border-white/30 backdrop-blur-sm',
    link: 'text-white hover:text-pink-200',
    qr: 'bg-white p-3 rounded-lg shadow-lg'
  },
  minimal: {
    container: 'bg-gray-50 shadow-lg border-l-4 border-black',
    header: 'bg-white border-b-2 border-gray-200',
    title: 'text-black font-bold',
    subtitle: 'text-gray-700 font-normal',
    bio: 'text-gray-600 leading-relaxed',
    section: 'text-black font-bold uppercase text-xs tracking-wider',
    badge: 'bg-black text-white px-2 py-1',
    link: 'text-black hover:text-gray-600 underline',
    qr: 'bg-white p-2 border border-gray-300'
  },
  cyberpunk: {
    container: 'bg-[#0a0e27] shadow-[0_0_60px_rgba(255,0,255,0.4)] border-2 border-[#ff00ff]',
    header: 'bg-gradient-to-r from-[#ff00ff] via-[#00ffff] to-[#ffff00] p-[2px]',
    title: 'text-[#ffff00] font-bold uppercase [text-shadow:0_0_20px_rgba(255,255,0,0.8)]',
    subtitle: 'text-[#ff00ff] font-bold [text-shadow:0_0_15px_rgba(255,0,255,0.8)]',
    bio: 'text-[#00ffff]',
    section: 'text-[#ff00ff] font-bold uppercase [text-shadow:0_0_10px_rgba(255,0,255,0.6)]',
    badge: 'bg-[#ff00ff]/20 text-[#ffff00] border-2 border-[#00ffff] shadow-[0_0_10px_rgba(0,255,255,0.5)]',
    link: 'text-[#00ffff] hover:text-[#ff00ff] [text-shadow:0_0_8px_rgba(0,255,255,0.6)]',
    qr: 'bg-white p-3 rounded shadow-[0_0_20px_rgba(255,0,255,0.6)]'
  },
  nature: {
    container: 'bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl border-2 border-green-200',
    header: 'bg-gradient-to-br from-green-100 to-emerald-100 border-b-2 border-green-300',
    title: 'text-green-900 font-bold',
    subtitle: 'text-emerald-700 font-medium',
    bio: 'text-green-800',
    section: 'text-green-900 font-semibold',
    badge: 'bg-green-200 text-green-900 border border-green-400',
    link: 'text-emerald-600 hover:text-emerald-800',
    qr: 'bg-white p-3 rounded-lg shadow-md border-2 border-green-200'
  },
  sunset: {
    container: 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 shadow-2xl',
    header: 'bg-white/15 backdrop-blur-md border-b border-white/30',
    title: 'text-white font-bold [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]',
    subtitle: 'text-orange-100 font-medium [text-shadow:0_2px_6px_rgba(0,0,0,0.3)]',
    bio: 'text-white/95 leading-relaxed',
    section: 'text-white font-semibold uppercase',
    badge: 'bg-white/25 text-white border border-white/50 backdrop-blur-sm',
    link: 'text-white hover:text-orange-100 [text-shadow:0_1px_4px_rgba(0,0,0,0.3)]',
    qr: 'bg-white/90 p-3 rounded-lg shadow-lg'
  },
  ocean: {
    container: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 shadow-[0_0_40px_rgba(6,182,212,0.4)]',
    header: 'bg-white/10 backdrop-blur-md border-b-2 border-cyan-300/50',
    title: 'text-white font-bold [text-shadow:0_2px_10px_rgba(0,0,0,0.3)]',
    subtitle: 'text-cyan-100 font-medium [text-shadow:0_2px_8px_rgba(0,0,0,0.2)]',
    bio: 'text-white/90 leading-relaxed',
    section: 'text-white font-semibold uppercase tracking-wide',
    badge: 'bg-white/20 text-white border border-white/40 backdrop-blur-sm',
    link: 'text-white hover:text-cyan-100',
    qr: 'bg-white p-3 rounded-lg shadow-lg'
  },
  royal: {
    container: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 shadow-[0_0_50px_rgba(139,92,246,0.3)] border border-purple-700',
    header: 'bg-gradient-to-r from-purple-800 to-indigo-800 border-b-2 border-purple-600',
    title: 'text-yellow-300 font-bold [text-shadow:0_0_15px_rgba(253,224,71,0.5)]',
    subtitle: 'text-purple-200 font-medium [text-shadow:0_0_10px_rgba(196,181,253,0.4)]',
    bio: 'text-gray-200 leading-relaxed',
    section: 'text-yellow-300 font-semibold uppercase tracking-wider [text-shadow:0_0_8px_rgba(253,224,71,0.3)]',
    badge: 'bg-purple-700/50 text-yellow-300 border border-purple-600 [text-shadow:0_0_6px_rgba(253,224,71,0.3)]',
    link: 'text-purple-300 hover:text-yellow-300 [text-shadow:0_0_8px_rgba(196,181,253,0.3)]',
    qr: 'bg-white p-3 rounded-lg shadow-lg'
  },
  fire: {
    container: 'bg-gradient-to-br from-gray-950 via-red-900 to-gray-950 shadow-[0_0_60px_rgba(239,68,68,0.4)] border-2 border-red-700',
    header: 'bg-gradient-to-r from-red-900 via-orange-800 to-red-900 border-b-2 border-red-700',
    title: 'text-yellow-50 font-bold uppercase [text-shadow:0_0_20px_rgba(239,68,68,0.8)]',
    subtitle: 'text-orange-300 font-bold [text-shadow:0_0_15px_rgba(251,146,60,0.6)]',
    bio: 'text-gray-200 leading-relaxed',
    section: 'text-yellow-50 font-bold uppercase tracking-wide [text-shadow:0_0_10px_rgba(239,68,68,0.6)]',
    badge: 'bg-red-900/60 text-yellow-100 border-2 border-orange-600 shadow-[0_0_10px_rgba(239,68,68,0.4)]',
    link: 'text-orange-400 hover:text-yellow-50 [text-shadow:0_0_8px_rgba(239,68,68,0.5)]',
    qr: 'bg-white p-3 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.5)]'
  }
};

export const CardPreview: React.FC<CardPreviewProps> = ({ data, cardId }) => {
  const theme = themeStyles[data.themeName];
  
  // יצירת הלינק ל-QR: אם יש מזהה אמיתי מהדאטה-בייס - נשתמש בו, אחרת נשמור על לינק זמני
  const qrUrl = cardId 
    ? `${window.location.origin}/card/${cardId}` 
    : 'https://devcards.com/cards/preview';

  const socialIcons = [
    { key: 'github', icon: GitBranch, url: data.socialLinks.github },
    { key: 'linkedin', icon: ExternalLink, url: data.socialLinks.linkedin },
    { key: 'portfolio', icon: Globe, url: data.socialLinks.portfolio },
    { key: 'email', icon: Mail, url: data.socialLinks.email ? `mailto:${data.socialLinks.email}` : undefined }
  ];

  return (
    <div className={`rounded-xl overflow-hidden w-full h-full flex flex-col ${theme.container}`}>
      {data.themeName === 'vscode' && (
        <div className="bg-[#323233] px-4 py-2 flex items-center gap-2 border-b border-[#3c3c3c]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-[#cccccc] text-xs font-mono ml-2">card.tsx</span>
        </div>
      )}

      {data.themeName === 'cyberpunk' && (
        <div className="bg-gradient-to-r from-[#ff00ff] via-[#00ffff] to-[#ffff00] h-1"></div>
      )}

      <div className={`p-12 ${data.themeName === 'cyberpunk' ? 'bg-[#0a0e27]' : theme.header}`}>
        <div className="flex items-start gap-10">
          <img
            src={data.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName || 'User')}&size=180&background=3b82f6&color=fff`}
            alt={data.fullName}
            className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
          />
          <div className="flex-1">
            <h1 className={`text-5xl mb-3 ${theme.title}`}>{data.fullName || 'Your Name'}</h1>
            <p className={`text-2xl mb-5 ${theme.subtitle}`}>{data.title || 'Your Title'}</p>
            <div className="flex gap-5 mt-6">
              {socialIcons.map(({ key, icon: Icon, url }) => url && (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-colors ${theme.link}`}
                >
                  <Icon size={32} />
                </a>
              ))}
            </div>
          </div>
          <div className={`${theme.qr} flex-shrink-0`}>
            <QRCodeCanvas value={qrUrl} size={120} />
          </div>
        </div>
      </div>

      <div className="p-12 space-y-10 flex-1 overflow-y-auto">
        <div>
          <h2 className={`text-xl uppercase tracking-wide mb-4 ${theme.section}`}>About</h2>
          <p className={`text-lg leading-relaxed ${theme.bio}`}>{data.bio || 'Tell us about yourself...'}</p>
        </div>

        {data.skills.length > 0 && (
          <div>
            <h2 className={`text-xl uppercase tracking-wide mb-4 ${theme.section}`}>Skills</h2>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className={`px-4 py-2 rounded-full text-base ${theme.badge}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.projects.length > 0 && (
          <div>
            <h2 className={`text-xl uppercase tracking-wide mb-4 ${theme.section}`}>Projects</h2>
            <div className="space-y-6">
              {data.projects.map((project, index) => (
                <div key={index} className={`${data.themeName === 'vscode' ? 'font-mono' : ''}`}>
                  <h3 className={`font-semibold mb-2 ${theme.title} text-2xl`}>
                    {project.link ? (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className={theme.link}>
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}
                  </h3>
                  <p className={`text-lg ${theme.bio}`}>{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {data.themeName === 'cyberpunk' && (
        <div className="px-12 pb-6 bg-[#0a0e27]">
          <div className="border-t-2 border-[#ff00ff] pt-4 text-center">
            <p className="text-[#00ffff] font-bold text-lg [text-shadow:0_0_10px_rgba(0,255,255,0.8)]">
              ⚡ NEURAL LINK ACTIVE ⚡
            </p>
          </div>
        </div>
      )}

      {data.themeName === 'retro' && (
        <div className="px-12 pb-6">
          <div className="border-t-2 border-[#00ff00] pt-4 text-center">
            <p className="text-[#00ff00] font-mono text-lg [text-shadow:0_0_5px_rgba(0,255,0,0.5)]">
              &gt; SYSTEM READY_
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPreview;