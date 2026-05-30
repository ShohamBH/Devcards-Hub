export interface Project {
  title: string;
  description: string;
  link?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  email?: string;
}

export type ThemeType = 'default' | 'dark' | 'vscode' | 'retro' | 'gradient' | 'minimal' | 'cyberpunk' | 'nature';

export interface DeveloperCardData {
  id?: string;
  fullName: string;
  title: string;
  bio: string;
  avatarUrl: string;
  skills: string[];
  socialLinks: SocialLinks;
  projects: Project[];
  themeName: ThemeType;
}
