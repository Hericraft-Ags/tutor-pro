import React from 'react';
import type { Language, Level } from '../types';

interface MenuScreenProps {
  studentName: string;
  setStudentName: (name: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  level: Level;
  setLevel: (lvl: Level) => void;
  attempts: number;
  handleStartGame: () => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({
  studentName,
  setStudentName,
  language,
  setLanguage,
  level,
  setLevel,
  attempts,
  handleStartGame
}) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200 text-center">
        <h1 className="text-4xl md:text-5xl text-blue-600 mb-2 font-display">Typing Tutor</h1>
        <p className="text-slate-500 mb-6">{language === 'es' ? '¡Aprende a teclear!' : 'Learn to type!'}</p>
        <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder={language === 'es' ? 'Tu nombre aquí' : 'Your name here'} className="w-full px-4 py-3 mb-4 text-lg border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>

      <div className="mb-6">
        <h3 className="font-bold text-slate-600 mb-2">{language === 'es' ? 'Idioma' : 'Language'}</h3>
        <div className="flex justify-center gap-2">
          <button onClick={() => setLanguage('es')} className={`px-6 py-2 rounded-lg font-bold transition ${language === 'es' ? 'bg-yellow-500 text-white shadow-md' : 'bg-slate-200 text-slate-700'}`}>Español</button>
          <button onClick={() => setLanguage('en')} className={`px-6 py-2 rounded-lg font-bold transition ${language === 'en' ? 'bg-yellow-500 text-white shadow-md' : 'bg-slate-200 text-slate-700'}`}>English</button>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-slate-600 mb-2">{language === 'es' ? 'Nivel' : 'Level'}</h3>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((l) => (
            <button key={l} onClick={() => setLevel(l as Level)} className={`py-3 rounded-lg font-bold text-xl transition ${level === l ? 'bg-green-500 text-white shadow-md' : 'bg-slate-200 text-slate-700'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
      
      <button onClick={handleStartGame} className="w-full py-4 text-2xl bg-blue-500 text-white rounded-lg font-display hover:bg-blue-600 transition-transform transform hover:scale-105 shadow-lg">
        {language === 'es' ? '¡Empezar!' : 'Start!'}
      </button>

      <p className="text-sm text-slate-400 mt-4">{language === 'es' ? 'Intentos totales:' : 'Total attempts:'} {attempts}</p>
    </div>
  );
};

export default MenuScreen;
