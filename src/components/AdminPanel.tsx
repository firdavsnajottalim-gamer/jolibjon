import React, { useState } from 'react';
import { Lock, Unlock, Users, Plus, Trash2, Edit2, ShieldAlert, Check, X, FileText, Sparkles } from 'lucide-react';
import { WordPair, Visitor, Theme, AppLanguage } from '../types';

interface AdminPanelProps {
  theme: Theme;
  language: AppLanguage;
  words: WordPair[];
  visitors: Visitor[];
  onAddWord: (word: Omit<WordPair, 'id'>) => void;
  onDeleteWord: (id: string) => void;
  onClearAllWords: () => void;
  onClearVisitors: () => void;
  playerName: string;
}

export default function AdminPanel({
  theme,
  language,
  words,
  visitors,
  onAddWord,
  onDeleteWord,
  onClearAllWords,
  onClearVisitors,
  playerName
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Form states to add word
  const [newEn, setNewEn] = useState('');
  const [newUz, setNewUz] = useState('');
  const [newCategory, setNewCategory] = useState('Greetings');
  const [newDifficulty, setNewDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [newExEn, setNewExEn] = useState('');
  const [newExUz, setNewExUz] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle password submission
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'iroda') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError(language === 'uz' ? 'Noto\‘g‘ri parol! Qayta urinib ko\‘ring.' : 'Incorrect password! Please try again.');
    }
  };

  // Handle adding new word pair
  const handleAddWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEn.trim() || !newUz.trim()) {
      alert(language === 'uz' ? 'Iltimos, so‘z va uning tarjimasini to‘liq kiriting!' : 'Please enter both the English word and its Uzbek translation!');
      return;
    }

    onAddWord({
      english: newEn.trim(),
      uzbek: newUz.trim(),
      category: newCategory,
      difficulty: newDifficulty,
      exampleEn: newExEn.trim() || undefined,
      exampleUz: newExUz.trim() || undefined
    });

    setNewEn('');
    setNewUz('');
    setNewExEn('');
    setNewExUz('');
    setSuccessMsg(language === 'uz' ? 'Yangi so‘z bazaga kiritildi!' : 'New vocabulary term added successfully!');
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  // Locked check screen
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center py-6">
        <div className={`w-full max-w-md p-8 rounded-2xl ${theme.cardClass} shadow-xl relative border border-red-500/10`}>
          <div className="absolute top-4 right-4 flex items-center space-x-1">
            <Lock className="w-4 h-4 text-rose-400" />
            <span className="text-xs uppercase font-mono tracking-wider text-rose-400 font-bold">
              {language === 'uz' ? 'Qulflangan' : 'Locked'}
            </span>
          </div>

          <div className="text-center space-y-4 mb-8">
            <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{language === 'uz' ? 'Pedagoglar Tizimi' : 'Teacher Dashboard'}</h3>
              <p className="text-xs opacity-75 mt-1.5 max-w-sm mx-auto">
                {language === 'uz'
                  ? 'Ushbu bo‘lim dars mashqlarini, so‘zlarni va tizim statistikalarini boshqarish uchun faqat o‘qituvchilarga mo‘ljallangan.'
                  : 'This section is strictly for educators to view statistics and manage word database.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4" id="admin-auth-form">
            <div>
              <label htmlFor="admin-password-input" className="block text-[11px] font-bold uppercase opacity-80 mb-2">
                {language === 'uz' ? 'Pedagog Parolini Kiriting' : 'Enter Educator Password'}
              </label>
              <input
                id="admin-password-input"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••"
                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition ${
                  theme.id === 'classic-light'
                    ? 'bg-white border-slate-300 text-slate-800 focus:ring-indigo-500 hover:border-slate-400'
                    : 'bg-white/5 border-white/10 text-white focus:ring-rose-400 focus:bg-white/10'
                }`}
                autoFocus
              />
              {error && (
                <p className="mt-2 text-xs text-red-400 font-medium">
                  ⚠️ {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl font-semibold flex items-center justify-center space-x-1.5 transition transform hover:scale-[1.01] active:scale-100 ${
                theme.id === 'classic-light'
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                  : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30'
              }`}
              id="admin-unlock-btn"
            >
              <Unlock className="w-4 h-4" />
              <span>{language === 'uz' ? 'Yopiq Joyni Ochish' : 'Unlock Educator Space'}</span>
            </button>
          </form>

          {/* Secret password helper instructions hidden as requested */}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className={`p-6 rounded-2xl ${theme.cardClass} relative overflow-hidden shadow-lg border border-indigo-500/10`}>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 mb-1">
              <Unlock className="w-4 h-4" />
              <span className="text-xs uppercase font-mono tracking-wider font-bold">
                {language === 'uz' ? 'Mualliflashtirildi (Ustoz)' : 'Authenticated (Educator)'}
              </span>
            </div>
            <h2 className="text-2xl font-bold">
              {language === 'uz' ? `Salom Ustoz, ${playerName}!` : `Welcome Teacher, ${playerName}!`}
            </h2>
            <p className="text-xs opacity-75 mt-1">
              {language === 'uz'
                ? 'Siz o‘yin so‘zlarini qo‘shishingiz hamda o‘quvchilar ro‘yxatini nazorat qilishingiz mumkin.'
                : 'Manage interactive questions database, add definitions and check visitors logs.'}
            </p>
          </div>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 border border-red-500/20 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            {language === 'uz' ? 'Tizimni Qulflash' : 'Lock Admin View'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Add word pair */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-6 rounded-2xl ${theme.cardClass} shadow-lg space-y-4`}>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Plus className={`w-5 h-5 ${theme.accentColor}`} />
              {language === 'uz' ? 'Yangi so‘z qo‘shish' : 'Add New Word Pair'}
            </h3>

            <form onSubmit={handleAddWordSubmit} className="space-y-4" id="add-word-form">
              <div>
                <label className="block text-[11px] font-bold opacity-75 mb-1">English</label>
                <input
                  type="text"
                  value={newEn}
                  onChange={(e) => setNewEn(e.target.value)}
                  placeholder="e.g., Development"
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none ${
                    theme.id === 'classic-light' ? 'bg-white border-slate-300' : 'bg-white/5 border-white/10'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold opacity-75 mb-1">O‘zbekcha</label>
                <input
                  type="text"
                  value={newUz}
                  onChange={(e) => setNewUz(e.target.value)}
                  placeholder="Masalan: Rivojlanish"
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none ${
                    theme.id === 'classic-light' ? 'bg-white border-slate-300' : 'bg-white/5 border-white/10'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold opacity-75 mb-1">Rukn (Category)</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className={`w-full px-2 py-2 rounded-lg border text-xs focus:outline-none ${
                      theme.id === 'classic-light' ? 'bg-white border-slate-300' : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <option value="Greetings">Greetings</option>
                    <option value="People">People</option>
                    <option value="Education">Education</option>
                    <option value="Technology">Technology</option>
                    <option value="Adjectives">Adjectives</option>
                    <option value="Concepts">Concepts</option>
                    <option value="Food">Food</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold opacity-75 mb-1">Qiyinchilik</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className={`w-full px-2 py-2 rounded-lg border text-xs focus:outline-none ${
                      theme.id === 'classic-light' ? 'bg-white border-slate-300' : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <option value="easy">{language === 'uz' ? 'Oson' : 'Easy'}</option>
                    <option value="medium">{language === 'uz' ? 'O‘rta' : 'Medium'}</option>
                    <option value="hard">{language === 'uz' ? 'Qiyin' : 'Hard'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold opacity-75 mb-1">{language === 'uz' ? 'Misol gap (Inglizcha)' : 'Example English Sentence'}</label>
                <input
                  type="text"
                  value={newExEn}
                  onChange={(e) => setNewExEn(e.target.value)}
                  placeholder="e.g., Software development requires focus."
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none ${
                    theme.id === 'classic-light' ? 'bg-white border-slate-300' : 'bg-white/5 border-white/10'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold opacity-75 mb-1">{language === 'uz' ? 'Misol tarjimasi' : 'Example Uzbek Sentence'}</label>
                <input
                  type="text"
                  value={newExUz}
                  onChange={(e) => setNewExUz(e.target.value)}
                  placeholder="Masalan: Dasturiy ta'minot yaratish diqqat talab qiladi."
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none ${
                    theme.id === 'classic-light' ? 'bg-white border-slate-300' : 'bg-white/5 border-white/10'
                  }`}
                />
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl font-semibold transition cursor-pointer ${theme.primaryBtn}`}
                id="sumbit-new-word-btn"
              >
                {language === 'uz' ? 'Muhrlash & Qo‘shish' : 'Confirm & Insert'}
              </button>

              {successMsg && (
                <div className="p-3 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-center text-xs font-bold animate-pulse">
                  ✅ {successMsg}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right column stack: Active Words List, Visitors Logs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Visitors Logs */}
          <div className={`p-6 rounded-2xl ${theme.cardClass} shadow-lg space-y-4`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span>
                  {language === 'uz' ? 'Kirgan O‘quvchilar Jurnali' : 'Active Visitor Registry Logs'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 font-bold">
                  {visitors.length}
                </span>
              </h3>
              {visitors.length > 0 && (
                <button
                  onClick={onClearVisitors}
                  className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/15 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  id="clear-visitors-btn"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'uz' ? 'Tozalash' : 'Clear Logs'}</span>
                </button>
              )}
            </div>

            <p className="text-xs opacity-70">
              {language === 'uz'
                ? 'Dasturga qatnagan va kirgan barcha talabalar ismlari hamda ularning to‘plagan ballari ro‘yxati.'
                : 'See the names and accumulated game score points of everyone who registered name and entered.'}
            </p>

            <div className="overflow-x-auto border border-white/5 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`${theme.id === 'classic-light' ? 'bg-slate-100/50' : 'bg-white/5'} border-b border-white/5`}>
                    <th className="p-3 font-semibold">{language === 'uz' ? 'Taleb ismi' : 'Student Name'}</th>
                    <th className="p-3 font-semibold">{language === 'uz' ? 'Rol' : 'System Role'}</th>
                    <th className="p-3 font-semibold">{language === 'uz' ? 'Kirgan vaqti' : 'Visit Timestamp'}</th>
                    <th className="p-3 font-semibold text-right">{language === 'uz' ? 'Erishilgan Ball' : 'Points Scored'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {visitors.length > 0 ? (
                    visitors.map((vis) => (
                      <tr key={vis.id} className="hover:bg-white/5 transition-all">
                        <td className="p-3 font-bold flex items-center gap-1.5">
                          {vis.name === playerName ? (
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                          ) : null}
                          <span>{vis.name}</span>
                          {vis.name === playerName && (
                            <span className="text-[10px] bg-green-500/20 text-green-300 px-1 rounded">Siz</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                            vis.role === 'teacher'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {vis.role}
                          </span>
                        </td>
                        <td className="p-3 opacity-70">
                          {new Date(vis.loggedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-yellow-400">
                          {vis.score} pts
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-6 text-center opacity-50">
                        {language === 'uz' ? 'Hozircha hech kim kirmadi.' : 'No recorded visits yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Word editing database */}
          <div className={`p-6 rounded-2xl ${theme.cardClass} shadow-lg space-y-4`}>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>{language === 'uz' ? 'Bazadagi Barcha So‘zlar' : 'Active Word Database'}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-500/20 text-slate-300 border border-white/10 font-bold">
                  {words.length}
                </span>
              </h3>
              {words.length > 0 && (
                <button
                  onClick={onClearAllWords}
                  className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-white border border-red-500/20 hover:border-red-500 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  id="clear-all-words-btn"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'uz' ? 'Hamma so‘zlarni o‘chirish' : 'Clear All Words'}</span>
                </button>
              )}
            </div>

            {words.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-white/5 rounded-xl">
                <p className="text-sm opacity-50 mb-1">
                  {language === 'uz' ? 'Hozircha so‘zlar qo‘shilmagan yoki lug‘at tozalandi.' : 'No vocabulary words in database currently.'}
                </p>
                <p className="text-xs opacity-40">
                  {language === 'uz' ? 'Yangi so‘zlar kiritish uchun chap paneldan foydalaning.' : 'Use the form on the left to add your custom words.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {words.map((w) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 flex justify-between items-center gap-3 transition"
                  >
                    <div>
                      <h4 className="font-bold text-sm tracking-wide">{w.english}</h4>
                      <p className={`text-xs opacity-80 ${theme.accentColor}`}>{w.uzbek}</p>
                      <span className="text-[10px] opacity-40 font-mono italic">{w.category} • {w.difficulty}</span>
                    </div>

                    <button
                      onClick={() => onDeleteWord(w.id)}
                      className="p-2 text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-lg transition cursor-pointer"
                      title={language === 'uz' ? 'So‘zni o‘chirish' : 'Remove Word Pair'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
