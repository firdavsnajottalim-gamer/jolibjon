import React, { useState, useEffect } from 'react';
import { BookOpen, Gamepad2, Palette, Shield, Sparkles, LogOut, CheckCircle2, Languages, RefreshCw, Trophy, Users } from 'lucide-react';
import { WordPair, Visitor, Theme, AppLanguage } from './types';
import { DEFAULT_WORDS } from './data/defaultWords';
import { THEMES } from './data/themes';

import WelcomeScreen from './components/WelcomeScreen';
import Translator from './components/Translator';
import Games from './components/Games';
import ThemeSelector from './components/ThemeSelector';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // Current user / visitor
  const [playerName, setPlayerName] = useState<string | null>(() => {
    return localStorage.getItem('uz_en_player_name');
  });

  // UI Language
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('uz_en_lang');
    return (saved as AppLanguage) || 'uz';
  });

  // Current background theme
  const [theme, setTheme] = useState<Theme>(() => {
    const savedId = localStorage.getItem('uz_en_theme_id');
    const matched = THEMES.find((t) => t.id === savedId);
    return matched || THEMES[0]; // defaults to blue
  });

  // Words bank
  const [words, setWords] = useState<WordPair[]>(() => {
    const saved = localStorage.getItem('uz_en_words');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_WORDS;
      }
    }
    return DEFAULT_WORDS;
  });

  // Visitors database
  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    const saved = localStorage.getItem('uz_en_visitors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'dictionary' | 'games' | 'themes' | 'admin'>('dictionary');

  // Sync state mutations back to LocalStorage
  useEffect(() => {
    localStorage.setItem('uz_en_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('uz_en_theme_id', theme.id);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('uz_en_words', JSON.stringify(words));
  }, [words]);

  useEffect(() => {
    localStorage.setItem('uz_en_visitors', JSON.stringify(visitors));
  }, [visitors]);

  // Handle first login / name input
  const handleLogin = (name: string) => {
    localStorage.setItem('uz_en_player_name', name);
    setPlayerName(name);

    // Register into visitor list
    const isTeacher = name.toLowerCase() === 'teacher';
    const newVisitor: Visitor = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
      name: name,
      role: isTeacher ? 'teacher' : 'student',
      loggedInAt: new Date().toISOString(),
      score: 0
    };

    setVisitors((prev) => {
      // Check if user already exists in history to update or log brand new
      const filtered = prev.filter((v) => v.name.toLowerCase() !== name.toLowerCase());
      return [newVisitor, ...filtered];
    });
  };

  // Sign out / change player
  const handleSignOut = () => {
    localStorage.removeItem('uz_en_player_name');
    setPlayerName(null);
  };

  // Score points logic
  const handleAddScore = (points: number) => {
    if (!playerName) return;
    setVisitors((prev) => {
      return prev.map((v) => {
        if (v.name === playerName) {
          return { ...v, score: v.score + points };
        }
        return v;
      });
    });
  };

  // Retrieve current active player's score
  const currentPlayerScore = React.useMemo(() => {
    const matched = visitors.find((v) => v.name === playerName);
    return matched ? matched.score : 0;
  }, [visitors, playerName]);

  // Words CRUD from AdminPanel
  const handleAddWord = (newWordData: Omit<WordPair, 'id'>) => {
    const newId = (words.length > 0 ? Math.max(...words.map(w => parseInt(w.id) || 0)) + 1 : 1).toString();
    const newWord: WordPair = {
      id: newId,
      ...newWordData
    };
    setWords((prev) => [newWord, ...prev]);
  };

  const handleDeleteWord = (id: string) => {
    setWords((prev) => prev.filter((w) => w.id !== id));
  };

  const handleClearAllWords = () => {
    if (confirm(language === 'uz' ? 'Haqiqatdan ham lug‘at bazasidagi barcha so‘zlarni butunlay o‘chirib tashlamoqchimisiz?' : 'Are you absolutely sure you want to permanently delete all words in the database?')) {
      setWords([]);
    }
  };

  const handleClearVisitors = () => {
    if (confirm(language === 'uz' ? 'Haqiqatdan ham hamma kirish tarixlarini o‘chirmoqchimisiz?' : 'Are you sure you want to purge all visitor logs?')) {
      // Keep only current session
      const currentVisitor = visitors.find((v) => v.name === playerName);
      setVisitors(currentVisitor ? [currentVisitor] : []);
    }
  };

  // If not logged-in (no name input), enforce entry barrier
  if (!playerName) {
    return (
      <div className={`min-h-screen ${theme.bgClass} flex flex-col justify-center font-sans transition-all duration-500 relative overflow-hidden`}>
        {theme.bgImage && (
          <div 
            className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-500"
            style={{ backgroundImage: `url(${theme.bgImage})` }}
          />
        )}
        {theme.bgImage && (
          <div className="fixed inset-0 z-0 bg-black/60 backdrop-blur-[3px] transition-all duration-500" />
        )}
        <div className="relative z-10 w-full">
          <WelcomeScreen
            theme={theme}
            language={language}
            setLanguage={setLanguage}
            onLogin={handleLogin}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bgClass} ${theme.id === 'classic-light' ? 'text-slate-800' : 'text-white'} font-sans transition-all duration-500 pb-16 relative overflow-hidden`}>
      {theme.bgImage && (
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${theme.bgImage})` }}
        />
      )}
      {theme.bgImage && (
        <div className="fixed inset-0 z-0 bg-black/65 backdrop-blur-[3px] transition-all duration-500" />
      )}
      <div className="relative z-10">
        {/* Top Navigation Frame */}
      <header className="sticky top-0 z-50 bg-black/25 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className={`p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400`}>
              <Languages className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold font-display tracking-tight flex items-center gap-1.5">
                <span>Eng-Uz</span>
                <span className={`text-xs px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300 font-mono border border-indigo-500/20`}>
                  PRO
                </span>
              </h1>
              <p className="text-[10px] opacity-60">Interactive Language Lab</p>
            </div>
          </div>

          {/* Center Tabs bar for responsive screens */}
          <nav className="hidden md:flex items-center space-x-1" id="desktop-navbar">
            <button
              onClick={() => setActiveTab('dictionary')}
              className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
                activeTab === 'dictionary'
                  ? 'bg-white/15 text-white border-b border-indigo-500/50'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>{language === 'uz' ? 'Lug‘at' : 'Dictionary'}</span>
            </button>

            <button
              onClick={() => setActiveTab('games')}
              className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
                activeTab === 'games'
                  ? 'bg-white/15 text-white border-b border-indigo-500/50'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-pink-400" />
              <span>{language === 'uz' ? 'O‘yinlar' : 'Games Panel'}</span>
            </button>

            <button
              onClick={() => setActiveTab('themes')}
              className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
                activeTab === 'themes'
                  ? 'bg-white/15 text-white border-b border-indigo-500/50'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'uz' ? 'Orqa fon' : 'Themes'}</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
                activeTab === 'admin'
                  ? 'bg-white/15 text-white border-b border-indigo-500/50'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span>{language === 'uz' ? 'O‘qituvchi 🔒' : 'Educator 🔒'}</span>
            </button>
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center space-x-3">
            {/* Quick Lang selection */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'uz' : 'en')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer flex items-center space-x-1 text-xs"
              title={language === 'uz' ? 'Inglizchaga o‘zgartirish' : 'Switch to Uzbek'}
            >
              <Languages className="w-4 h-4 text-indigo-400" />
              <span className="font-bold font-mono text-[10px] uppercase">
                {language === 'uz' ? 'EN' : 'UZ'}
              </span>
            </button>

            {/* active user badge */}
            <div className="hidden sm:flex flex-col items-end pr-2 border-r border-white/10">
              <span className="text-[10px] opacity-50">{language === 'uz' ? 'O‘yinchi' : 'Logged in'}</span>
              <span className="text-xs font-bold text-slate-100">{playerName}</span>
            </div>

            {/* Logout trigger */}
            <button
              onClick={handleSignOut}
              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition cursor-pointer"
              title={language === 'uz' ? 'Tizimdan chiqish' : 'Log out / Switch player'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around border-t border-white/5 py-1.5 bg-black/10">
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`flex flex-col items-center justify-center p-2 text-[10px] font-semibold transition ${
              activeTab === 'dictionary' ? 'text-indigo-400' : 'text-gray-400'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span>{language === 'uz' ? 'Lug‘at' : 'Vocab'}</span>
          </button>

          <button
            onClick={() => setActiveTab('games')}
            className={`flex flex-col items-center justify-center p-2 text-[10px] font-semibold transition ${
              activeTab === 'games' ? 'text-pink-400' : 'text-gray-400'
            }`}
          >
            <Gamepad2 className="w-4 h-4 mb-0.5" />
            <span>{language === 'uz' ? 'O‘yinlar' : 'Games'}</span>
          </button>

          <button
            onClick={() => setActiveTab('themes')}
            className={`flex flex-col items-center justify-center p-2 text-[10px] font-semibold transition ${
              activeTab === 'themes' ? 'text-amber-400' : 'text-gray-400'
            }`}
          >
            <Palette className="w-4 h-4 mb-0.5" />
            <span>{language === 'uz' ? 'Bo‘yoqlar' : 'Themes'}</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center p-2 text-[10px] font-semibold transition ${
              activeTab === 'admin' ? 'text-rose-400' : 'text-gray-400'
            }`}
          >
            <Shield className="w-4 h-4 mb-0.5" />
            <span>{language === 'uz' ? 'Ustoz 🔒' : 'Teacher 🔒'}</span>
          </button>
        </div>
      </header>

      {/* Main container frame */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-12">
        <div className="animate-fadeIn">
          {activeTab === 'dictionary' && (
            <Translator
              theme={theme}
              language={language}
              words={words}
              onAddWordClick={() => setActiveTab('admin')}
            />
          )}

          {activeTab === 'games' && (
            <Games
              theme={theme}
              language={language}
              words={words}
              playerName={playerName}
              onAddScore={handleAddScore}
              currentScore={currentPlayerScore}
            />
          )}

          {activeTab === 'themes' && (
            <ThemeSelector
              currentTheme={theme}
              onSelectTheme={setTheme}
              language={language}
            />
          )}

          {activeTab === 'admin' && (
            <AdminPanel
              theme={theme}
              language={language}
              words={words}
              visitors={visitors}
              onAddWord={handleAddWord}
              onDeleteWord={handleDeleteWord}
              onClearAllWords={handleClearAllWords}
              onClearVisitors={handleClearVisitors}
              playerName={playerName}
            />
          )}
        </div>
      </main>

      {/* Persistent mini-score footer or scoreboard bar for context */}
      <div className="fixed bottom-4 right-4 z-40 max-w-sm hidden sm:block">
        <div className={`p-3.5 rounded-xl ${theme.cardClass} shadow-xl border border-white/10 flex items-center gap-3 backdrop-blur-lg`}>
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] opacity-60 uppercase font-bold tracking-wider">{language === 'uz' ? 'Sizning natijangiz' : 'Continuous Score'}</div>
            <div className="text-sm font-extrabold text-slate-100">{currentPlayerScore} XP</div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
