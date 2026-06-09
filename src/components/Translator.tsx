import React, { useState, useMemo } from 'react';
import { Search, Volume2, Plus, Sparkles, Filter, BookOpen } from 'lucide-react';
import { WordPair, Theme, AppLanguage } from '../types';

interface TranslatorProps {
  theme: Theme;
  language: AppLanguage;
  words: WordPair[];
  onAddWordClick?: () => void; // Trigger callback or open modal/admin
}

export default function Translator({ theme, language, words, onAddWordClick }: TranslatorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Speak function for English words
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Get unique categories
  const categories = useMemo(() => {
    const list = new Set(words.map((w) => w.category));
    return ['All', ...Array.from(list)];
  }, [words]);

  // Filter words
  const filteredWords = useMemo(() => {
    return words.filter((w) => {
      const matchesSearch =
        w.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.uzbek.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || w.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || w.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [words, searchQuery, selectedCategory, selectedDifficulty]);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className={`p-6 rounded-2xl ${theme.cardClass} shadow-lg transition-all`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className={`w-6 h-6 ${theme.accentColor}`} />
              {language === 'uz' ? 'Lug\‘at & Qidiruv' : 'Dictionary & Translation Search'}
            </h2>
            <p className="text-xs opacity-70 mt-1">
              {language === 'uz'
                ? `Ingliz va O\‘zbek so\‘zlarini tezkor toping. Jamg\‘arilgan so\‘zlar: ${words.length} ta.`
                : `Instantly find English and Uzbek terms. Word library size: ${words.length} terms.`}
            </p>
          </div>

          {onAddWordClick && (
            <button
              onClick={onAddWordClick}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer transform hover:scale-102 ${theme.primaryBtn}`}
              id="goto-admin-add-word"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'uz' ? 'Siz ham qo\‘shing' : 'Add custom word'}</span>
            </button>
          )}
        </div>

        {/* Filters and Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'uz' ? 'Qidirish... (Masalan: Welcome yoki Olma)' : 'Type to search... (e.g., Welcome or Book)'}
              className={`w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                theme.id === 'classic-light'
                  ? 'bg-white border-slate-300 text-slate-800 focus:ring-indigo-500'
                  : 'bg-white/5 border-white/10 text-white focus:ring-cyan-500 focus:bg-white/10'
              }`}
              id="word-search-input"
            />
          </div>

          <div className="md:col-span-3 flex items-center space-x-2">
            <span className="text-xs font-semibold opacity-60 shrink-0">
              {language === 'uz' ? 'Rukn:' : 'Category:'}
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl border focus:outline-none text-sm cursor-pointer ${
                theme.id === 'classic-light'
                  ? 'bg-white border-slate-300 text-slate-800'
                  : 'bg-white/10 border-white/10 text-white [&>option]:bg-slate-900 [&>option]:text-white'
              }`}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? (language === 'uz' ? 'Barchasi' : 'All Categories') : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 flex items-center space-x-2">
            <span className="text-xs font-semibold opacity-60 shrink-0">
              {language === 'uz' ? 'Daraja:' : 'Difficulty:'}
            </span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl border focus:outline-none text-sm cursor-pointer ${
                theme.id === 'classic-light'
                  ? 'bg-white border-slate-300 text-slate-800'
                  : 'bg-white/10 border-white/10 text-white [&>option]:bg-slate-900 [&>option]:text-white'
              }`}
            >
              <option value="All">{language === 'uz' ? 'Barchasi' : 'All Levels'}</option>
              <option value="easy">{language === 'uz' ? 'Oson' : 'Easy'}</option>
              <option value="medium">{language === 'uz' ? 'O‘rta' : 'Medium'}</option>
              <option value="hard">{language === 'uz' ? 'Qiyin' : 'Hard'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results grid */}
      {filteredWords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="dictionary-list">
          {filteredWords.map((word) => (
            <div
              key={word.id}
              className={`p-5 rounded-2xl ${theme.cardClass} hover:translate-y-[-2px] transition-all flex flex-col justify-between shadow-sm relative group`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    word.difficulty === 'easy'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : word.difficulty === 'medium'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {language === 'uz'
                      ? word.difficulty === 'easy' ? 'Oson' : word.difficulty === 'medium' ? 'O‘rta' : 'Qiyin'
                      : word.difficulty.toUpperCase()}
                  </span>
                  <span className="text-xs opacity-50 font-mono tracking-wide">{word.category}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold tracking-tight">{word.english}</span>
                    <button
                      onClick={() => handleSpeak(word.english)}
                      title={language === 'uz' ? 'Talaffuzni eshitish' : 'Listen to pronunciation'}
                      className="p-1 rounded bg-white/5 hover:bg-white/15 text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="border-t border-white/5 pt-2">
                    <span className={`text-sm tracking-wide block font-semibold ${theme.accentColor}`}>
                      {word.uzbek}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sample Sentences */}
              {(word.exampleEn || word.exampleUz) && (
                <div className={`mt-4 pt-3 border-t border-dashed ${
                  theme.id === 'classic-light' ? 'border-slate-200' : 'border-white/10'
                }`}>
                  <p className="text-xs italic opacity-85 font-sans">
                    💡 "{word.exampleEn}"
                  </p>
                  <p className="text-[11px] opacity-60 mt-1">
                    ➡️ {word.exampleUz}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={`p-12 text-center rounded-2xl ${theme.cardClass}`}>
          <p className="opacity-60 text-lg">
            {language === 'uz' ? 'Qidiruv bo‘yicha hech qanday so‘z topilmadi.' : 'No vocabulary matches for your search.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
            }}
            className={`mt-4 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-xl text-xs font-semibold border border-indigo-500/20 transition cursor-pointer`}
          >
            {language === 'uz' ? 'Saralashni tozalash' : 'Clear Filters'}
          </button>
        </div>
      )}
    </div>
  );
}
