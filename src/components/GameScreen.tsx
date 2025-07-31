import React, { useEffect, useRef } from 'react';
import TypingPhrase from './TypingPhrase';
import FingerHint from './FingerHint';
import type { Language, Level } from '../types';

interface GameScreenProps {
  language: Language;
  level: Level;
  currentPhraseIndex: number;
  currentPhrases: string[];
  typedText: string;
  setTypedText: (text: string) => void;
  fingerHint: string;
  timeLeft: number;
  handleNextPhrase: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>; // ✅ ESTA ES LA LÍNEA QUE DEBES CAMBIAR
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


const LEVEL_TIMES: Record<Level, number> = { 1: 30, 2: 15, 3: 5 };

const GameScreen: React.FC<GameScreenProps> = ({
  language,
  level,
  currentPhraseIndex,
  currentPhrases,
  typedText,
  setTypedText,
  fingerHint,
  timeLeft,
  handleNextPhrase,
  inputRef,
  handleInputChange,
}) => {
  const targetPhrase = currentPhrases[currentPhraseIndex];
  const isCompleted = typedText === targetPhrase;
  const maxTime = LEVEL_TIMES[level];

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8">
      <h2 className="text-2xl font-display text-center mb-4">
        {language === 'es'
          ? `Frase ${currentPhraseIndex + 1} de 3`
          : `Phrase ${currentPhraseIndex + 1} of 3`}
      </h2>

      {/* Barra de tiempo */}
      <div className="mb-4">
        <div className="h-4 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
          <div
            className="h-full bg-yellow-400 transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / maxTime) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Frase actual */}
      <TypingPhrase targetPhrase={targetPhrase} typedText={typedText} />

      {/* Input oculto */}
      <p>DEBUG: typedText = {typedText}</p>

      <input
      ref={inputRef}
      type="text"
      value={typedText}
      onChange={handleInputChange} // ✅ viene desde App
      onBlur={() => inputRef.current?.focus()}
      autoFocus
      className="absolute -left-[9999px] opacity-0"
      disabled={isCompleted}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      />



      {/* Indicador de dedo o botón siguiente */}
      <div className="h-24 mt-6 flex items-center justify-center">
        {isCompleted ? (
          <button
            onClick={handleNextPhrase}
            className="py-3 px-10 text-xl bg-green-500 text-white rounded-lg font-display hover:bg-green-600 transition-transform transform hover:scale-105 shadow-lg animate-bounce"
          >
            {language === 'es' ? 'Siguiente' : 'Next'}
          </button>
        ) : (level === 1 || level === 2) && fingerHint ? (
          <FingerHint language={language} fingerHint={fingerHint} />
        ) : level === 3 ? (
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500 font-display">
              {language === 'es' ? '¡Rápido!' : 'Quick!'}
            </p>
          </div>
        ) : (
          <div className="h-full" />
        )}
      </div>
    </div>
  );
};

export default GameScreen;
