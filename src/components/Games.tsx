import React, { useState, useEffect, useMemo } from 'react';
import { Gamepad2, CheckCircle2, XCircle, RefreshCw, Trophy, ArrowRight, Star, HelpCircle } from 'lucide-react';
import { WordPair, Theme, AppLanguage } from '../types';

interface GamesProps {
  theme: Theme;
  language: AppLanguage;
  words: WordPair[];
  playerName: string;
  onAddScore: (points: number) => void;
  currentScore: number;
}

type ActiveGameType = 'match' | 'scramble' | 'quiz';

export default function Games({ theme, language, words, playerName, onAddScore, currentScore }: GamesProps) {
  const [activeGame, setActiveGame] = useState<ActiveGameType>('match');

  // Game 1: Match State
  const [matchEnglishCards, setMatchEnglishCards] = useState<{ id: string; text: string; matched: boolean }[]>([]);
  const [matchUzbekCards, setMatchUzbekCards] = useState<{ id: string; text: string; matched: boolean }[]>([]);
  const [selectedEn, setSelectedEn] = useState<string | null>(null);
  const [selectedUz, setSelectedUz] = useState<string | null>(null);
  const [matchScore, setMatchScore] = useState(0);

  // Game 2: Scramble State
  const [scrambleTarget, setScrambleTarget] = useState<WordPair | null>(null);
  const [scrambleLetters, setScrambleLetters] = useState<{char: string; id: number}[]>([]);
  const [scrambleAnswer, setScrambleAnswer] = useState<string[]>([]);
  const [scrambleStatus, setScrambleStatus] = useState<'playing' | 'success' | 'failed'>('playing');

  // Game 3: Quiz State
  const [quizWord, setQuizWord] = useState<WordPair | null>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [quizIsCorrect, setQuizIsCorrect] = useState(false);

  // Initialize/Reset Game 1 (Match)
  const initMatchGame = React.useCallback(() => {
    if (words.length < 4) return;
    // Shuffle and pick 4 random words
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    const English = selected.map((w) => ({ id: w.id, text: w.english, matched: false })).sort(() => 0.5 - Math.random());
    const Uzbek = selected.map((w) => ({ id: w.id, text: w.uzbek, matched: false })).sort(() => 0.5 - Math.random());

    setMatchEnglishCards(English);
    setMatchUzbekCards(Uzbek);
    setSelectedEn(null);
    setSelectedUz(null);
  }, [words]);

  // Handle Match card selections
  useEffect(() => {
    if (selectedEn && selectedUz) {
      if (selectedEn === selectedUz) {
        // Correct Match!
        setMatchEnglishCards((prev) => prev.map((c) => (c.id === selectedEn ? { ...c, matched: true } : c)));
        setMatchUzbekCards((prev) => prev.map((c) => (c.id === selectedUz ? { ...c, matched: true } : c)));
        onAddScore(10);
        setMatchScore((s) => s + 10);
        setSelectedEn(null);
        setSelectedUz(null);
      } else {
        // Reset selections after a short delay
        const timer = setTimeout(() => {
          setSelectedEn(null);
          setSelectedUz(null);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedEn, selectedUz, onAddScore]);

  // Check if Game 1 is finished
  const matchCompleted = useMemo(() => {
    return matchEnglishCards.length > 0 && matchEnglishCards.every((c) => c.matched);
  }, [matchEnglishCards]);

  // Initializing Game 2 (Scramble)
  const initScrambleGame = React.useCallback(() => {
    if (words.length === 0) return;
    const item = words[Math.floor(Math.random() * words.length)];
    setScrambleTarget(item);
    
    // Scramble letters
    const wordStr = item.english.toUpperCase();
    const scrambled = wordStr.split('')
      .map((char, index) => ({ char, id: index }))
      .sort(() => 0.5 - Math.random());
    
    setScrambleLetters(scrambled);
    setScrambleAnswer([]);
    setScrambleStatus('playing');
  }, [words]);

  // Add letter in scramble
  const handleScrambleSubmit = () => {
    if (!scrambleTarget) return;
    const constructed = scrambleAnswer.join('');
    if (constructed.toLowerCase() === scrambleTarget.english.toLowerCase()) {
      setScrambleStatus('success');
      onAddScore(15);
    } else {
      setScrambleStatus('failed');
    }
  };

  // Initializing Game 3 (Quiz)
  const initQuizGame = React.useCallback(() => {
    if (words.length < 3) return;
    const target = words[Math.floor(Math.random() * words.length)];
    setQuizWord(target);

    // Pick 3 decoys
    const decoys = words
      .filter((w) => w.id !== target.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((w) => w.uzbek);

    const merged = [target.uzbek, ...decoys].sort(() => 0.5 - Math.random());
    setQuizOptions(merged);
    setQuizAnswered(false);
    setQuizSelected(null);
    setQuizIsCorrect(false);
  }, [words]);

  const handleQuizAnswer = (option: string) => {
    if (quizAnswered || !quizWord) return;
    setQuizSelected(option);
    setQuizAnswered(true);
    if (option === quizWord.uzbek) {
      setQuizIsCorrect(true);
      onAddScore(10);
    } else {
      setQuizIsCorrect(false);
    }
  };

  // Trigger init on game switch
  useEffect(() => {
    if (activeGame === 'match') initMatchGame();
    if (activeGame === 'scramble') initScrambleGame();
    if (activeGame === 'quiz') initQuizGame();
  }, [activeGame, initMatchGame, initScrambleGame, initQuizGame]);

  if (words.length < 4) {
    return (
      <div className={`p-8 rounded-2xl ${theme.cardClass} text-center space-y-4`}>
        <h3 className="text-xl font-bold">⚠️ {language === 'uz' ? "O'yinlar Faol Emas" : 'Games unavailable'}</h3>
        <p className="max-w-md mx-auto opacity-70">
          {language === 'uz' 
            ? "O'yin o'ynash uchun lug'atda kamida 4 ta so'z mavjud bo'lishi kerak. Iltimos tepadagi va yoki Admin Panel orqali unga so'zlar qo'shing."
            : "To play vocabulary games, you need at least 4 word pairings in research list. Open or add words first."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Header tab switcher */}
      <div className={`p-4 rounded-xl ${theme.cardClass} flex flex-wrap justify-center items-center gap-2`}>
        <button
          onClick={() => setActiveGame('match')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
            activeGame === 'match'
              ? 'bg-indigo-600 text-white shadow'
              : 'hover:bg-white/10 opacity-70'
          }`}
          id="btn-match-game"
        >
          <Gamepad2 className="w-4 h-4" />
          <span>{language === 'uz' ? 'So\'zlarni Moslashtirish' : 'Word Matcher'}</span>
        </button>

        <button
          onClick={() => setActiveGame('scramble')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
            activeGame === 'scramble'
              ? 'bg-indigo-600 text-white shadow'
              : 'hover:bg-white/10 opacity-70'
          }`}
          id="btn-scramble-game"
        >
          <Star className="w-4 h-4 text-amber-300" />
          <span>{language === 'uz' ? 'Harp Terish' : 'Letter Scramble'}</span>
        </button>

        <button
          onClick={() => setActiveGame('quiz')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
            activeGame === 'quiz'
              ? 'bg-indigo-600 text-white shadow'
              : 'hover:bg-white/10 opacity-70'
          }`}
          id="btn-quiz-game"
        >
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span>{language === 'uz' ? 'Ko’p Tanlovli Test' : 'Trivia Quiz'}</span>
        </button>
      </div>

      {/* Actual games wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Game view area */}
        <div className="lg:col-span-8">
          {activeGame === 'match' && (
            <div className={`p-6 rounded-2xl ${theme.cardClass} shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[420px]`}>
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      ⚔️ {language === 'uz' ? 'Moslashtirish O\‘yini' : 'Matching Matcher'}
                    </h3>
                    <p className="text-xs opacity-75 mt-1">
                      {language === 'uz'
                        ? 'Chap tildagi so\'z bilan o\'ng tildagi to\'g\'ri moslamani tanlang.'
                        : 'Select matching English in left and corresponding Uzbek translation in right.'}
                    </p>
                  </div>
                  <button
                    onClick={initMatchGame}
                    className="p-1 px-2 text-xs rounded hover:bg-white/10 flex items-center gap-1 opacity-70 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{language === 'uz' ? 'Qayta boshlash' : 'Reset'}</span>
                  </button>
                </div>

                {matchCompleted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-green-400">
                        {language === 'uz' ? 'Ajoyib! Barchasi topildi!' : 'Awesome job! All cleared!'}
                      </h4>
                      <p className="text-xs opacity-75">
                        {language === 'uz' ? '+40 ball bevosita balingizga qo\'shildi.' : '+40 cumulative points have been scored.'}
                      </p>
                    </div>
                    <button
                      onClick={initMatchGame}
                      className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition ${theme.primaryBtn}`}
                      id="match-next-round-btn"
                    >
                      {language === 'uz' ? 'Keyingi bosqich' : 'Next Round'}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {/* Left Column (English) */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold opacity-60 uppercase tracking-widest text-center">English</h4>
                      {matchEnglishCards.map((card) => (
                        <button
                          key={card.id}
                          disabled={card.matched}
                          onClick={() => !card.matched && setSelectedEn(card.id)}
                          className={`w-full p-4 rounded-xl text-left font-medium text-sm transition-all border cursor-pointer ${
                            card.matched
                              ? 'bg-green-500/10 border-green-500/30 text-green-400/60 line-through'
                              : selectedEn === card.id
                              ? 'bg-indigo-600 border-indigo-500 text-white scale-[1.02] shadow-indigo-950/20 shadow-md'
                              : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
                          }`}
                        >
                          {card.text}
                        </button>
                      ))}
                    </div>

                    {/* Right Column (Uzbek) */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold opacity-60 uppercase tracking-widest text-center">O‘zbekcha</h4>
                      {matchUzbekCards.map((card) => (
                        <button
                          key={card.id}
                          disabled={card.matched}
                          onClick={() => !card.matched && setSelectedUz(card.id)}
                          className={`w-full p-4 rounded-xl text-left font-medium text-sm transition-all border cursor-pointer ${
                            card.matched
                              ? 'bg-green-500/10 border-green-500/30 text-green-400/60 line-through'
                              : selectedUz === card.id
                              ? 'bg-indigo-600 border-indigo-500 text-white scale-[1.02] shadow-indigo-950/20 shadow-md'
                              : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
                          }`}
                        >
                          {card.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-white/10 pt-4 flex justify-between items-center text-xs opacity-60">
                <span>{language === 'uz' ? 'To‘g‘ri moslamalar ball olib keladi!' : 'Pair all items to test recall!'}</span>
                <span>🔥 {language === 'uz' ? `Joriy ball: ${matchScore}` : `Game Score: ${matchScore}`}</span>
              </div>
            </div>
          )}

          {activeGame === 'scramble' && scrambleTarget && (
            <div className={`p-6 rounded-2xl ${theme.cardClass} shadow-xl flex flex-col justify-between min-h-[420px]`}>
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      🧩 {language === 'uz' ? 'Harflar Scramble' : 'Spelling Constructor'}
                    </h3>
                    <p className="text-xs opacity-75 mt-1">
                      {language === 'uz' ? 'Ko’rsatilgan tarjimalar asosida inglizcha so‘zni toping.' : 'Reconstruct English word spelling based on the card translations.'}
                    </p>
                  </div>
                  <button
                    onClick={initScrambleGame}
                    className="p-1 px-2 text-xs rounded hover:bg-white/10 flex items-center gap-1 opacity-70 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{language === 'uz' ? 'Yangisi' : 'Skip / New'}</span>
                  </button>
                </div>

                <div className="text-center py-6 space-y-4">
                  {/* Uzbek definition */}
                  <span className="text-xs opacity-50 uppercase tracking-widest block">{language === 'uz' ? 'Mukammal Tarjimasi' : 'Uzbek translation'}</span>
                  <div className={`inline-block px-6 py-2 rounded-xl text-lg font-bold border border-white/10 bg-white/5 ${theme.accentColor}`}>
                    {scrambleTarget.uzbek}
                  </div>

                  {/* Scramble Answer boxes */}
                  <div className="flex flex-wrap justify-center gap-2 mt-8 min-h-[46px] items-center">
                    {scrambleTarget.english.split('').map((_, idx) => {
                      const letter = scrambleAnswer[idx];
                      return (
                        <div
                          key={idx}
                          className={`w-10 h-10 rounded-lg border flex items-center justify-center font-bold text-lg select-none transition ${
                            letter
                              ? 'bg-zinc-800 text-white border-indigo-500 shadow'
                              : 'bg-white/5 border-dashed border-white/20'
                          }`}
                        >
                          {letter || ''}
                        </div>
                      );
                    })}
                  </div>

                  {/* Available letter options */}
                  {scrambleStatus === 'playing' ? (
                    <div className="flex flex-wrap justify-center gap-2 mt-8">
                      {scrambleLetters.map((node) => {
                        const isUsed = scrambleAnswer.some((_, idx) => scrambleAnswer[idx] === node.char && idx === scrambleAnswer.indexOf(node.char)); // Simple model
                        const countInAnswer = scrambleAnswer.filter((c) => c === node.char).length;
                        const countInTargetWithSameId = scrambleLetters.filter(l => l.char === node.char && l.id === node.id).length; // we have node ids.
                        const idxInAnswerOfThisNode = scrambleAnswer.indexOf(node.char);
                        
                        return (
                          <button
                            key={node.id}
                            onClick={() => {
                              setScrambleAnswer((prev) => [...prev, node.char]);
                            }}
                            className={`w-10 h-10 rounded-full font-bold transition flex items-center justify-center text-sm cursor-pointer border ${
                              theme.id === 'classic-light'
                                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                                : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                            }`}
                          >
                            {node.char}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  {/* Keyboard actions */}
                  {scrambleStatus === 'playing' && (
                    <div className="flex justify-center gap-3 mt-6">
                      <button
                        onClick={() => setScrambleAnswer((prev) => prev.slice(0, prev.length - 1))}
                        className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition cursor-pointer"
                      >
                        {language === 'uz' ? 'O‘chirish (Backspace)' : 'Undo Letter'}
                      </button>
                      <button
                        onClick={() => setScrambleAnswer([])}
                        className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-700 hover:bg-zinc-600 text-white transition cursor-pointer"
                      >
                        {language === 'uz' ? 'Hammasini tozalash' : 'Clear All'}
                      </button>
                    </div>
                  )}

                  {/* feedback status */}
                  {scrambleStatus === 'success' && (
                    <div className="p-4 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 space-y-2 mt-4">
                      <div className="flex items-center justify-center gap-1 font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{language === 'uz' ? 'To‘ppa-to‘g‘ri! Offarin!' : 'Congratulations! Perfect Match!'}</span>
                      </div>
                      <p className="text-xs opacity-75">{language === 'uz' ? '+15 ball qo‘shildi.' : '+15 educational points earned.'}</p>
                      <button
                        onClick={initScrambleGame}
                        className={`mt-2 px-5 py-2 rounded-xl text-xs font-bold ${theme.primaryBtn}`}
                      >
                        {language === 'uz' ? 'Keyingisi' : 'Next Word'}
                      </button>
                    </div>
                  )}

                  {scrambleStatus === 'failed' && (
                    <div className="p-4 rounded-xl bg-red-500/10 text-red-300 border border-red-500/20 space-y-2 mt-4">
                      <div className="flex items-center justify-center gap-1 font-bold">
                        <XCircle className="w-5 h-5" />
                        <span>{language === 'uz' ? 'Noto‘g‘ri, xatolik bor.' : 'Oops! Incorrect spelling.'}</span>
                      </div>
                      <p className="text-xs opacity-75">{language === 'uz' ? `To‘g‘ri javob: ${scrambleTarget.english}` : `The correct answer was: ${scrambleTarget.english}`}</p>
                      <button
                        onClick={() => {
                          setScrambleAnswer([]);
                          setScrambleStatus('playing');
                        }}
                        className="mt-2 px-4 py-1.5 bg-zinc-800 text-white rounded-lg text-xs font-medium hover:bg-zinc-700 transition"
                      >
                        {language === 'uz' ? 'Qayta urinish' : 'Retry'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {scrambleStatus === 'playing' && scrambleAnswer.length === scrambleTarget.english.length && (
                <button
                  onClick={handleScrambleSubmit}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition ${theme.primaryBtn} mt-4`}
                  id="submit-scramble-btn"
                >
                  {language === 'uz' ? 'Javobni Tekshirish' : 'Check Constructed word'}
                </button>
              )}
            </div>
          )}

          {activeGame === 'quiz' && quizWord && (
            <div className={`p-6 rounded-2xl ${theme.cardClass} shadow-xl flex flex-col justify-between min-h-[420px]`}>
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      💡 {language === 'uz' ? 'Ko’p Tanlovli Savol-Javob' : 'Vocabulary Trivia Quiz'}
                    </h3>
                    <p className="text-xs opacity-75 mt-1">
                      {language === 'uz' ? 'Berilgan ingliz so‘zining o‘zbekcha mos tarjimasini tezda tanlang.' : 'Select correct Uzbek translational equivalent for given English word.'}
                    </p>
                  </div>
                  <button
                    onClick={initQuizGame}
                    className="p-1 px-2 text-xs rounded hover:bg-white/10 flex items-center gap-1 opacity-70 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{language === 'uz' ? 'Yangisi' : 'Skip'}</span>
                  </button>
                </div>

                <div className="space-y-6 mt-6">
                  <div className="text-center py-4">
                    <span className="text-xs opacity-55 uppercase tracking-wider block mb-1">{language === 'uz' ? 'Berilgan So‘z' : 'English Item'}</span>
                    <h2 className={`text-4xl font-extrabold tracking-tight ${theme.accentColor}`}>{quizWord.english}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="quiz-options-list">
                    {quizOptions.map((v, idx) => {
                      const isOptionSelected = quizSelected === v;
                      const isThisCorrect = quizWord.uzbek === v;

                      let btnStyle = 'bg-white/5 hover:bg-white/10 border-white/10';
                      if (quizAnswered) {
                        if (isThisCorrect) {
                          btnStyle = 'bg-green-500/25 border-green-500/50 text-green-300';
                        } else if (isOptionSelected) {
                          btnStyle = 'bg-red-500/25 border-red-500/50 text-red-300';
                        } else {
                          btnStyle = 'bg-white/2 border-white/5 opacity-55';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={quizAnswered}
                          onClick={() => handleQuizAnswer(v)}
                          className={`w-full p-4 rounded-xl text-left font-medium text-sm border flex items-center justify-between transition cursor-pointer ${btnStyle}`}
                        >
                          <span>{v}</span>
                          {quizAnswered && isThisCorrect && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                          {quizAnswered && isOptionSelected && !isThisCorrect && <XCircle className="w-4 h-4 text-red-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {quizAnswered && (
                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        {quizIsCorrect ? (
                          <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 rounded-full">
                            +10 {language === 'uz' ? 'ball qo\'shildi' : 'points correct!'}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 rounded-full">
                            ❌ {language === 'uz' ? 'Xato tanlov' : 'Incorrect choice'}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={initQuizGame}
                        className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold ${theme.primaryBtn}`}
                        id="quiz-next-btn"
                      >
                        <span>{language === 'uz' ? 'Keyingi Savol' : 'Next Word'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global score leaderboard right alongside games */}
        <div className="lg:col-span-4">
          <div className={`p-6 rounded-2xl ${theme.cardClass} shadow-xl space-y-4`}>
            <div className="flex items-center space-x-2 text-yellow-400">
              <Trophy className="w-5 h-5 animate-bounce" />
              <h3 className="font-bold text-lg">{language === 'uz' ? 'Sizning Balangiz' : 'Your Progress'}</h3>
            </div>

            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <span className="text-xs opacity-60 block tracking-wide uppercase font-semibold">
                {language === 'uz' ? 'Faol O’yinchi' : 'Active Learner'}
              </span>
              <h4 className="text-lg font-bold mt-1 text-slate-100">{playerName}</h4>
              <div className="text-4xl font-extrabold mt-3 text-yellow-300 tracking-tight">
                {currentScore} <span className="text-sm font-normal opacity-60">{language === 'uz' ? 'ball' : 'pts'}</span>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold opacity-60 uppercase mb-3">{language === 'uz' ? 'Qanday ball olinadi?' : 'How points work?'}</h4>
              <ul className="space-y-2 text-xs opacity-80 pl-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-cyan-300"></span>
                  <span>{language === 'uz' ? 'So‘zlarni muvaffaqiyatli moslash' : 'Matcher connection'}: <b>+10 pts</b></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-300 shadow-pink-300"></span>
                  <span>{language === 'uz' ? 'Harf Scramble to‘g‘ri tuzish' : 'Correct letter spelling'}: <b>+15 pts</b></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-amber-300"></span>
                  <span>{language === 'uz' ? 'Testda to‘g‘ri javob topish' : 'Correct trivia response'}: <b>+10 pts</b></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
