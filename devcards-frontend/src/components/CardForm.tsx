import React, { useState } from 'react';
import type { DeveloperCardData, ThemeType } from '../types/card';

interface CardFormProps {
  formData: DeveloperCardData;
  onChange: (data: DeveloperCardData) => void;
}

const CardForm: React.FC<CardFormProps> = ({ formData, onChange }) => {
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string): boolean => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const updateField = <K extends keyof DeveloperCardData>(
    field: K,
    value: DeveloperCardData[K]
  ) => {
    onChange({ ...formData, [field]: value });
  };

  const updateSocialLink = (platform: keyof DeveloperCardData['socialLinks'], value: string) => {
    const newErrors = { ...errors };
    
    if (platform === 'email' && value && !validateEmail(value)) {
      newErrors[platform] = 'כתובת אימייל לא תקינה';
    } else if (platform !== 'email' && value && !validateUrl(value)) {
      newErrors[platform] = 'כתובת URL לא תקינה (חייבת להתחיל ב-http:// או https://)';
    } else {
      delete newErrors[platform];
    }
    
    setErrors(newErrors);
    onChange({
      ...formData,
      socialLinks: { ...formData.socialLinks, [platform]: value }
    });
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      updateField('skills', [...formData.skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    updateField('skills', formData.skills.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: keyof DeveloperCardData['projects'][0], value: string) => {
    const updated = [...formData.projects];
    updated[index] = { ...updated[index], [field]: value };
    
    const newErrors = { ...errors };
    if (field === 'link' && value && !validateUrl(value)) {
      newErrors[`project_${index}_link`] = 'כתובת URL לא תקינה';
    } else if (field === 'link') {
      delete newErrors[`project_${index}_link`];
    }
    
    setErrors(newErrors);
    onChange({ ...formData, projects: updated });
  };

  const addProject = () => {
    // עדכון המגבלה ל-5 פרויקטים
    if (formData.projects.length < 5) {
      onChange({
        ...formData,
        projects: [...formData.projects, { title: '', description: '', link: '' }]
      });
    }
  };

  const removeProject = (index: number) => {
    onChange({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index)
    });
  };

  const inputStyles = "w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors";

  return (
    <div className="space-y-6 text-right">
      
      {/* 🎨 בחירת Theme */}
      <section className="bg-slate-750 p-4 rounded-xl border border-slate-700 mb-2">
        <label className="block text-sm font-medium text-slate-300 mb-2">🎨 בחר עיצוב לכרטיס (Theme)</label>
        <select
          value={formData.themeName}
          onChange={(e) => updateField('themeName', e.target.value as ThemeType)}
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 font-medium"
        >
          <option value="default">✨ מודרני ונקי (Default)</option>
          <option value="dark">🌙 ניאון אפל (Dark Mode)</option>
          <option value="vscode">💻 סביבת פיתוח (VS Code IDE)</option>
          <option value="retro">📟 רטרו מסך ירוק (Retro Terminal)</option>
          <option value="gradient">🌈 גרדיאנט צבעוני (Gradient)</option>
          <option value="minimal">⚪ מינימליסטי (Minimal)</option>
          <option value="cyberpunk">🔮 סייברפאנק (Cyberpunk)</option>
          <option value="nature">🌿 טבע (Nature)</option>
        </select>
      </section>

      {/* Personal Info */}
      <section className="space-y-4">
        <h3 className="text-md font-semibold text-teal-400 border-b border-slate-700 pb-1">Personal Info</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            className={inputStyles}
          />
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            className={inputStyles}
          />
          <textarea
            placeholder="Bio"
            value={formData.bio}
            onChange={(e) => updateField('bio', e.target.value)}
            rows={3}
            className={`${inputStyles} resize-none`}
          />
          <input
            type="text"
            placeholder="Avatar URL"
            value={formData.avatarUrl}
            onChange={(e) => {
              const value = e.target.value;
              const newErrors = { ...errors };
              if (value && !validateUrl(value)) {
                newErrors.avatarUrl = 'כתובת URL לא תקינה';
              } else {
                delete newErrors.avatarUrl;
              }
              setErrors(newErrors);
              updateField('avatarUrl', value);
            }}
            className={inputStyles}
          />
          {errors.avatarUrl && <p className="text-red-400 text-xs mt-1">{errors.avatarUrl}</p>}
        </div>
      </section>

      {/* Social Links */}
      <section className="space-y-4">
        <h3 className="text-md font-semibold text-teal-400 border-b border-slate-700 pb-1">Social Links</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="LinkedIn URL"
            value={formData.socialLinks.linkedin || ''}
            onChange={(e) => updateSocialLink('linkedin', e.target.value)}
            className={`${inputStyles} text-left dir-ltr`}
          />
          {errors.linkedin && <p className="text-red-400 text-xs mt-1">{errors.linkedin}</p>}
          <input
            type="text"
            placeholder="GitHub URL"
            value={formData.socialLinks.github || ''}
            onChange={(e) => updateSocialLink('github', e.target.value)}
            className={`${inputStyles} text-left dir-ltr`}
          />
          {errors.github && <p className="text-red-400 text-xs mt-1">{errors.github}</p>}
          <input
            type="text"
            placeholder="Portfolio URL"
            value={formData.socialLinks.portfolio || ''}
            onChange={(e) => updateSocialLink('portfolio', e.target.value)}
            className={`${inputStyles} text-left dir-ltr`}
          />
          {errors.portfolio && <p className="text-red-400 text-xs mt-1">{errors.portfolio}</p>}
          <input
            type="email"
            placeholder="Email"
            value={formData.socialLinks.email || ''}
            onChange={(e) => updateSocialLink('email', e.target.value)}
            className={`${inputStyles} text-left dir-ltr`}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-4">
        <h3 className="text-md font-semibold text-teal-400 border-b border-slate-700 pb-1">Skills</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a skill"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            className={inputStyles}
          />
          <button
            onClick={addSkill}
            className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-slate-900 font-bold rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-xs border border-slate-600 shadow-sm"
            >
              {skill}
              <button
                onClick={() => removeSkill(index)}
                className="text-red-400 hover:text-red-500 font-bold text-sm focus:outline-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* Projects - מעודכן למקסימום 5 פרויקטים */}
      <section className="space-y-4">
        <h3 className="text-md font-semibold text-teal-400 border-b border-slate-700 pb-1">
          Projects (Max 5)
        </h3>
        <div className="space-y-4">
          {formData.projects.map((project, index) => (
            <div key={index} className="p-4 bg-slate-900/40 border border-slate-700 rounded-xl space-y-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-500">Project {index + 1}</span>
                <button
                  onClick={() => removeProject(index)}
                  className="text-red-400 hover:text-red-500 text-xs font-medium"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                placeholder="Project Title"
                value={project.title}
                onChange={(e) => updateProject(index, 'title', e.target.value)}
                className={inputStyles}
              />
              <textarea
                placeholder="Project Description"
                value={project.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
                rows={2}
                className={`${inputStyles} resize-none`}
              />
              <input
                type="text"
                placeholder="Project Link (optional)"
                value={project.link || ''}
                onChange={(e) => updateProject(index, 'link', e.target.value)}
                className={`${inputStyles} text-left dir-ltr`}
              />
              {errors[`project_${index}_link`] && (
                <p className="text-red-400 text-xs mt-1">{errors[`project_${index}_link`]}</p>
              )}
            </div>
          ))}
          
          {/* כפתור הוספה דינמי עד 5 */}
          {formData.projects.length < 5 && (
            <button
              onClick={addProject}
              className="w-full px-4 py-2 border-2 border-dashed border-slate-700 hover:border-teal-500 text-slate-400 hover:text-teal-400 rounded-lg transition-colors font-medium text-sm"
            >
              + Add Project ({formData.projects.length}/5)
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default CardForm;