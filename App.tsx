import React, { useState, useEffect, useRef } from 'react';

import PHRASES from './src/data/phrases';
import KEY_TO_FINGER_MAP from './src/data/keyToFingerMap';
import FINGER_TRANSLATIONS from './src/data/fingerTranslation';

import { useTimer } from './src/hooks/userTime';

import MenuScreen from './src/components/MenuScreen';
import GameScreen from './src/components/GameScreen';
import FinishedScreen from './src/components/FinishedScreen';

import type { Language, Level, GameState } from './src/types';

const LEVEL_TIMES: Record<Level, number> = { 1: 30, 2: 15, 3: 5 };

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getFingerForChar = (char: string, lang: Language): string => {
  const finger = KEY_TO_FINGER_MAP[char] || '';
  return FINGER_TRANSLATIONS[lang][finger] || '';
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [studentName, setStudentName] = useState('');
  const [language, setLanguage] = useState<Language>('es');
  const [level, setLevel] = useState<Level>(1);
  const [attempts, setAttempts] = useState(0);

  const [currentPhrases, setCurrentPhrases] = useState<string[]>([]);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [fingerHint, setFingerHint] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const { timeLeft, startTimer, stopTimer } = useTimer(LEVEL_TIMES[level]);

  useEffect(() => {
    const savedName = localStorage.getItem('studentName') || '';
    const savedAttempts = parseInt(localStorage.getItem('attempts') || '0', 10);
    setStudentName(savedName);
    setAttempts(savedAttempts);
  }, []);

  useEffect(() => {
    localStorage.setItem('studentName', studentName);
  }, [studentName]);

  useEffect(() => {
    localStorage.setItem('attempts', attempts.toString());
  }, [attempts]);

  useEffect(() => {
    if (gameState === 'playing') {
      inputRef.current?.focus();
    }
    return stopTimer;
  }, [gameState, stopTimer]);

  useEffect(() => {
    if (timeLeft === 0 && gameState === 'playing') {
      handleNextPhrase();
    }
  }, [timeLeft, gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const targetPhrase = currentPhrases[currentPhraseIndex];
    if (!targetPhrase) return;

    if (level === 1) {
      const nextChar = targetPhrase[typedText.length];
      if (nextChar) {
        setFingerHint(getFingerForChar(nextChar, language));
      } else {
        setFingerHint('');
      }
    }
  }, [typedText, currentPhraseIndex, currentPhrases, level, language, gameState]);

  const handleStartGame = () => {
    if (!studentName.trim()) {
      alert(language === 'es' ? 'Por favor, escribe tu nombre.' : 'Please enter your name.');
      return;
    }

    setAttempts(prev => prev + 1);
    const phrasesForLevel = PHRASES[language][level];
    setCurrentPhrases(shuffleArray(phrasesForLevel).slice(0, 3));
    setCurrentPhraseIndex(0);
    setTypedText('');
    setGameState('playing');
    startTimer(LEVEL_TIMES[level]);
  };

  const handleNextPhrase = () => {
    if (currentPhraseIndex < currentPhrases.length - 1) {
      setCurrentPhraseIndex(prev => prev + 1);
      setTypedText('');
      startTimer(LEVEL_TIMES[level]);
  
      // 🔧 AÑADIR ESTA LÍNEA PARA REENFOCAR EL INPUT:
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else {
      setGameState('finished');
      stopTimer();
    }
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTypedText = e.target.value;
    const targetPhrase = currentPhrases[currentPhraseIndex];

    setTypedText(newTypedText);

    if (level === 2) {
      const lastTypedChar = newTypedText[newTypedText.length - 1];
      const correspondingTargetChar = targetPhrase[newTypedText.length - 1];
      if (lastTypedChar && lastTypedChar === correspondingTargetChar) {
        setFingerHint(getFingerForChar(lastTypedChar, language));
      } else {
        setFingerHint('');
      }
    }

    if (newTypedText === targetPhrase) {
      stopTimer();
    }

    console.log('Typed:', newTypedText);
console.log('Expected:', targetPhrase);

  };

  const handleRestart = () => {
    setGameState('menu');
    setCurrentPhraseIndex(0);
    setCurrentPhrases([]);
    setTypedText('');
    stopTimer();
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-100 bg-cover bg-center"
      style={{ backgroundImage: "url('https://cdn.pixabay.com/photo/2022/03/24/16/44/background-7089459_1280.png')" }}
    >
      <div className="w-full max-w-4xl">
        {gameState === 'menu' && (
          <MenuScreen
            studentName={studentName}
            setStudentName={setStudentName}
            language={language}
            setLanguage={setLanguage}
            level={level}
            setLevel={setLevel}
            attempts={attempts}
            handleStartGame={handleStartGame}
          />
        )}
        {gameState === 'playing' && (
          <GameScreen
            language={language}
            level={level}
            currentPhraseIndex={currentPhraseIndex}
            currentPhrases={currentPhrases}
            typedText={typedText}
            setTypedText={setTypedText}
            fingerHint={fingerHint}
            timeLeft={timeLeft}
            handleNextPhrase={handleNextPhrase}
            inputRef={inputRef}
            handleInputChange={handleInputChange}
          />
        )}
        {gameState === 'finished' && (
          <FinishedScreen
            studentName={studentName}
            language={language}
            handleRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
};

export default App;
