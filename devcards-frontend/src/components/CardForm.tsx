import React, { useState } from 'react';
import type { DeveloperCardData, ThemeType } from '../types/card';
import { validateEmail, validateUrl } from '../utils/validation';

interface CardFormProps {
  formData: DeveloperCardData;
  onChange: (data: DeveloperCardData) => void;
  validationErrors?: Record<string, string>;
  disabled?: boolean;
}

const CardForm: React.FC<CardFormProps> = ({ formData, onChange, validationErrors = {}, disabled = false }) => {
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const inputStyles = `w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 hover:border-zinc-600/80 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <div className="space-y-8">

      {/* Theme Selection */}
      <section className="bg-zinc-800/40 border border-zinc-700/50 p-6 rounded-2xl backdrop-blur-xl hover:border-zinc-600/70 transition-all duration-300 shadow-inner shadow-zinc-900/20">
        <label className="block text-sm font-semibold text-zinc-300 mb-4">✨ Card Theme</label>
        <select
          value={formData.themeName}
          onChange={(e) => updateField('themeName', e.target.value as ThemeType)}
          disabled={disabled}
          className={`w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 font-medium transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <option value="default">✨ Modern & Clean (Default)</option>
          <option value="dark">🌙 Dark Neon (Dark Mode)</option>
          <option value="vscode">💻 Developer IDE (VS Code)</option>
          <option value="retro">📟 Retro Terminal (Green Screen)</option>
          <option value="gradient">🌈 Colorful Gradient (Gradient)</option>
          <option value="minimal">⚪ Minimalist (Minimal)</option>
          <option value="cyberpunk">🔮 Cyberpunk (Cyberpunk)</option>
          <option value="nature">🌿 Nature (Nature)</option>
        </select>
      </section>

      {/* Personal Information */}
      <section className="space-y-5">
        <h3 className="text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 uppercase tracking-wider border-b border-zinc-700/60 pb-3">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              disabled={disabled}
              className={`${inputStyles} ${validationErrors.fullName ? 'border-red-500/70 bg-red-900/20 focus:border-red-500 focus:ring-red-500/10' : ''}`}
            />
            {validationErrors.fullName && (
              <p className="text-red-400 text-sm mt-2 font-medium">⚠️ {validationErrors.fullName}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Professional Title (e.g., Senior React Developer)"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              disabled={disabled}
              className={`${inputStyles} ${validationErrors.title ? 'border-red-500/70 bg-red-900/20 focus:border-red-500 focus:ring-red-500/10' : ''}`}
            />
            {validationErrors.title && (
              <p className="text-red-400 text-sm mt-2 font-medium">⚠️ {validationErrors.title}</p>
            )}
          </div>
          <textarea
            placeholder="A concise bio about yourself (e.g., passionate about web development, AI, open-source...)"
            value={formData.bio}
            onChange={(e) => updateField('bio', e.target.value)}
            disabled={disabled}
            rows={4}
            className={`${inputStyles} resize-y`}
          />
          <input
            type="text"
            placeholder="Avatar Image URL (e.g., from GitHub, Gravatar)"
            value={formData.avatarUrl}
            onChange={(e) => {
              const value = e.target.value;
              const newErrors = { ...errors };
              if (value && !validateUrl(value)) {
                newErrors.avatarUrl = 'Invalid URL provided';
              } else {
                delete newErrors.avatarUrl;
              }
              setErrors(newErrors);
              updateField('avatarUrl', value);
            }}
            disabled={disabled}
            className={inputStyles}
          />
          {errors.avatarUrl && <p className="text-red-400 text-sm mt-2">{errors.avatarUrl}</p>}
        </div>
      </section>

      {/* Social Media Links */}
      <section className="space-y-5">
        <h3 className="text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 uppercase tracking-wider border-b border-zinc-700/60 pb-3">Social Media Links</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="LinkedIn Profile URL"
            value={formData.socialLinks.linkedin || ''}
            onChange={(e) => updateSocialLink('linkedin', e.target.value)}
            disabled={disabled}
            className={`${inputStyles} text-left dir-ltr`}
          />
          {errors.linkedin && <p className="text-red-400 text-sm mt-2">{errors.linkedin}</p>}
          <input
            type="text"
            placeholder="GitHub Profile URL"
            value={formData.socialLinks.github || ''}
            onChange={(e) => updateSocialLink('github', e.target.value)}
            disabled={disabled}
            className={`${inputStyles} text-left dir-ltr`}
          />
          {errors.github && <p className="text-red-400 text-sm mt-2">{errors.github}</p>}
          <input
            type="text"
            placeholder="Personal Portfolio URL"
            value={formData.socialLinks.portfolio || ''}
            onChange={(e) => updateSocialLink('portfolio', e.target.value)}
            disabled={disabled}
            className={`${inputStyles} text-left dir-ltr`}
          />
          {errors.portfolio && <p className="text-red-400 text-sm mt-2">{errors.portfolio}</p>}
          <input
            type="email"
            placeholder="Email Address"
            value={formData.socialLinks.email || ''}
            onChange={(e) => updateSocialLink('email', e.target.value)}
            disabled={disabled}
            className={`${inputStyles} text-left dir-ltr ${validationErrors.email ? 'border-red-500/70 bg-red-900/20 focus:border-red-500 focus:ring-red-500/10' : ''}`}
          />
          {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email}</p>}
          {validationErrors.email && (
            <p className="text-red-400 text-sm mt-2 font-medium">⚠️ {validationErrors.email}</p>
          )}
        </div>
      </section>

      {/* Technical Skills */}
      <section className="space-y-5">
        <h3 className="text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 uppercase tracking-wider border-b border-zinc-700/60 pb-3">Technical Skills</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Add a skill (e.g., React, TypeScript, Node.js)"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            disabled={disabled}
            className={inputStyles}
          />
          <button
            onClick={addSkill}
            disabled={disabled}
            className={`flex-shrink-0 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transform hover:scale-[1.02] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {formData.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-200 rounded-full text-sm border border-cyan-500/40 shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] transition-all duration-200"
            >
              {skill}
              <button
                onClick={() => removeSkill(index)}
                disabled={disabled}
                className={`text-cyan-300 hover:text-cyan-100 font-bold text-base focus:outline-none transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="space-y-5">
        <h3 className="text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 uppercase tracking-wider border-b border-zinc-700/60 pb-3">
          Featured Projects (Max 5)
        </h3>
        <div className="space-y-4">
          {formData.projects.map((project, index) => (
            <div key={index} className="p-6 bg-zinc-800/40 border border-zinc-700/50 rounded-2xl space-y-4 hover:border-zinc-600/70 transition-all duration-300 shadow-inner shadow-zinc-900/20">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Project {index + 1}</span>
                <button
                  onClick={() => removeProject(index)}
                  disabled={disabled}
                  className={`text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                placeholder="Project Title (e.g., DevCards Hub Frontend)"
                value={project.title}
                onChange={(e) => updateProject(index, 'title', e.target.value)}
                disabled={disabled}
                className={inputStyles}
              />
              <textarea
                placeholder="Brief description of the project and your role."
                value={project.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
                disabled={disabled}
                rows={3}
                className={`${inputStyles} resize-y`}
              />
              <input
                type="text"
                placeholder="Project Live Link or GitHub Repository URL (optional)"
                value={project.link || ''}
                onChange={(e) => updateProject(index, 'link', e.target.value)}
                disabled={disabled}
                className={`${inputStyles} text-left dir-ltr`}
              />
              {errors[`project_${index}_link`] && (
                <p className="text-red-400 text-sm mt-2">{errors[`project_${index}_link`]}</p>
              )}
            </div>
          ))}

          {/* Add Project Button - Dynamic up to 5 */}
          {formData.projects.length < 5 && (
            <button
              onClick={addProject}
              disabled={disabled}
              className={`w-full px-6 py-3 border-2 border-dashed border-zinc-700/60 hover:border-indigo-500/50 text-zinc-400 hover:text-indigo-400 rounded-lg transition-all duration-300 font-medium text-base transform hover:scale-[1.01] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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