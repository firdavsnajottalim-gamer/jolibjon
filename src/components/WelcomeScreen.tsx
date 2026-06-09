import React, { useState } from 'react';
import { LogIn, Sparkles, Languages } from 'lucide-react';
import { Theme, AppLanguage } from '../types';

interface WelcomeScreenProps {
  theme: Theme;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  onLogin: (name: string) => void;
}

export default function WelcomeScreen({ theme, language, setLanguage, onLogin }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(language === 'uz' ? 'Iltimos, ismingizni kiriting!' : 'Please enter your name!');
      return;
    }
    if (name.trim().length < 2) {
      setError(language === 'uz' ? 'Ism kamida 2 ta harfdan iborat bo\'lishi kerak' : 'Name must be at least 2 characters long');
      return;
    }
    onLogin(name.trim());
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 transition-all duration-300">
      <div className={`w-full max-w-md p-8 rounded-2xl ${theme.cardClass} shadow-2xl relative overflow-hidden transition-all duration-300`}>
        {/* Glow Effects */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-pink-500/20 rounded-full blur-xl"></div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2 text-indigo-500">
            <Sparkles className="w-6 h-6 animate-pulse text-yellow-400" />
            <span className={`font-mono text-sm uppercase tracking-wider ${theme.textColor} opacity-80`}>
              Uz-En Learn
            </span>
          </div>

          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'uz' : 'en')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border transition ${
              theme.id === 'classic-light'
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-white/5 hover:bg-white/15 border-white/10 text-white'
            }`}
            id="lang-toggle-btn"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'O\'zbekcha' : 'English'}</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            {language === 'uz' ? (
              <>
                Xush <span className={theme.accentColor}>Kelibsiz!</span>
              </>
            ) : (
              <>
                Welcome <span className={theme.accentColor}>Aboard!</span>
              </>
            )}
          </h1>
          <p className="text-sm opacity-70">
            {language === 'uz'
              ? 'Tizimga kirish uchun ismingizni kiriting va ajoyib o\'yinlarni boshlang.'
              : 'Enter your name to start learning, playing games and improving vocabulary.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" id="welcome-form">
          <div>
            <label htmlFor="user-name-input" className={`block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80`}>
              {language === 'uz' ? 'Sizning Ismingiz' : 'Your Name'}
            </label>
            <input
              id="user-name-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder={language === 'uz' ? 'Masalan: Firdavs' : 'e.g. John Doe'}
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                theme.id === 'classic-light'
                  ? 'bg-white border-slate-300 text-slate-800 focus:ring-indigo-500 focus:border-indigo-500'
                  : 'bg-white/10 border-white/10 text-white focus:ring-cyan-400 focus:border-cyan-400 focus:bg-white/15'
              }`}
              maxLength={25}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-xs text-red-400 font-medium flex items-center gap-1">
                ⚠️ {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5 active:translate-y-0 ${theme.primaryBtn}`}
            id="enter-app-btn"
          >
            <LogIn className="w-5 h-5" />
            <span>{language === 'uz' ? 'Tizimga Kirish' : 'Enter Learning'}</span>
          </button>
        </form>

        {/* Password hint removed as requested */}
      </div>
    </div>
  );
}
