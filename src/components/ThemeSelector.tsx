import { Palette, Check } from 'lucide-react';
import { Theme, AppLanguage } from '../types';
import { THEMES } from '../data/themes';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onSelectTheme: (theme: Theme) => void;
  language: AppLanguage;
}

export default function ThemeSelector({ currentTheme, onSelectTheme, language }: ThemeSelectorProps) {
  return (
    <div className={`p-6 rounded-2xl ${currentTheme.cardClass} shadow-lg transition-all`}>
      <div className="flex items-center gap-2 mb-4">
        <Palette className={`w-5 h-5 ${currentTheme.accentColor}`} />
        <h3 className="font-bold text-lg">
          {language === 'uz' ? 'Orqa Fon Rangini Tanlash' : 'Customize Background Paint'}
        </h3>
      </div>
      <p className="text-xs opacity-75 mb-6">
        {language === 'uz'
          ? 'Saytning butun dizayni va orqa fonini bir marta bosish bilan o‘zgartiring. Har xil ajoyib gradient ranglar mavjud.'
          : 'Change the look, background paint and components theme instantly with presets designed for you.'}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3" id="theme-selector-grid">
        {THEMES.map((theme) => {
          const isActive = theme.id === currentTheme.id;
          return (
            <button
              key={theme.id}
              onClick={() => onSelectTheme(theme)}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-24 relative overflow-hidden transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                theme.bgClass
              } ${
                isActive
                  ? 'ring-2 ring-indigo-500 scale-[1.01] border-indigo-500'
                  : 'border-white/1 blue-900 hover:border-white/20'
              }`}
            >
              {/* Little circle indicators inside card */}
              <div className="flex justify-between items-center w-full z-10">
                <div className="flex space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                </div>
                {isActive && (
                  <span className="p-0.5 rounded-full bg-indigo-500 text-white block">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div className="z-10 mt-auto">
                <span className={`text-[11px] font-bold tracking-tight block ${
                  theme.id === 'classic-light' ? 'text-slate-800' : 'text-white'
                }`}>
                  {language === 'uz' ? theme.nameUz : theme.nameEn}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
