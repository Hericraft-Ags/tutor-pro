import React from 'react';

interface FinishedScreenProps {
  language: 'es' | 'en';
  studentName: string;
  handleRestart: () => void;
}

const FinishedScreen: React.FC<FinishedScreenProps> = ({
  language,
  studentName,
  handleRestart,
}) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200 text-center animate-pulse-once">
      <h1 className="text-5xl text-yellow-500 mb-4 font-display">
        {language === 'es'
          ? `¡Bien hecho, ${studentName}!`
          : `Well done, ${studentName}!`}
      </h1>

      <div className="my-6">
        <span className="inline-block bg-yellow-400 text-white text-lg font-bold px-6 py-3 rounded-full shadow-lg transform rotate-[-5deg]">
          ✨ {language === 'es' ? 'INSIGNIA DE TECLADISTA' : 'KEYBOARD MASTER BADGE'} ✨
        </span>
      </div>

      <p className="text-slate-600 mb-8">
        {language === 'es'
          ? '¡Completaste todas las frases!'
          : 'You completed all the phrases!'}
      </p>

      <button
        onClick={handleRestart}
        className="w-full py-4 text-2xl bg-blue-500 text-white rounded-lg font-display hover:bg-blue-600 transition-transform transform hover:scale-105 shadow-lg"
      >
        {language === 'es' ? 'Volver al menú' : 'Back to Menu'}
      </button>
    </div>
  );
};

export default FinishedScreen;
