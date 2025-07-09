
import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- TYPE DEFINITIONS ---
type Language = 'es' | 'en';
type Level = 1 | 2 | 3;
type GameState = 'menu' | 'playing' | 'finished';

// --- CONSTANTS ---
const PHRASES: Record<Language, Record<Level, string[]>> = {
  es: {
    1: [
      "el sol sale", "la luna brilla", "mi casa es azul", "el perro ladra", "la flor es roja",
      "veo un ave", "juego futbol", "me gusta leer", "el pasto es verde", "papa y mama"
    ],
    2: [
      "El gato duerme en el sofa", "La mariposa vuela alto", "Me gusta comer manzanas", "El lapiz escribe bien", "Mi amigo se llama Luis",
      "La escuela es divertida", "El cielo tiene nubes", "El coche rojo es rapido", "La pelota rebota mucho", "Hoy es un dia soleado"
    ],
    3: [
      "El explorador descubrio una cueva secreta", "El astronauta viajo a la galaxia lejana", "El leon es el rey de la selva africana", "La tecnologia moderna cambia el mundo", "El chocolate es mi postre favorito siempre",
      "La biblioteca tiene muchos libros interesantes", "El invierno trae nieve y mucho frio", "La musica clasica me relaja por la tarde", "Los pajaros cantan al amanecer cada dia", "El tren electrico cruza la ciudad rapidamente"
    ],
  },
  en: {
    1: [
      "the sun is up", "the moon is big", "my house is blue", "the dog barks", "the red flower",
      "i see a bird", "i play soccer", "i like to read", "the grass is green", "mom and dad"
    ],
    2: [
      "The cat sleeps on the sofa", "The butterfly flies high", "I like to eat apples", "The pencil writes well", "My friend is named Luis",
      "School is very fun", "The sky has many clouds", "The red car is fast", "The ball bounces a lot", "Today is a sunny day"
    ],
    3: [
      "The explorer discovered a secret cave", "The astronaut traveled to a distant galaxy", "The lion is the king of the african jungle", "Modern technology changes the world", "Chocolate is always my favorite dessert",
      "The library has many interesting books", "Winter brings snow and a lot of cold", "Classical music relaxes me in the afternoon", "The birds sing at dawn every day", "The electric train crosses the city quickly"
    ],
  }
};

const LEVEL_TIMES: Record<Level, number> = { 1: 30, 2: 15, 3: 5 };

const KEY_TO_FINGER_MAP: Record<string, string> = {
  '`': 'Left Pinky', '1': 'Left Pinky', 'q': 'Left Pinky', 'a': 'Left Pinky', 'z': 'Left Pinky',
  '~': 'Left Pinky', '!': 'Left Pinky', 'Q': 'Left Pinky', 'A': 'Left Pinky', 'Z': 'Left Pinky',
  '2': 'Left Ring', 'w': 'Left Ring', 's': 'Left Ring', 'x': 'Left Ring',
  '@': 'Left Ring', 'W': 'Left Ring', 'S': 'Left Ring', 'X': 'Left Ring',
  '3': 'Left Middle', 'e': 'Left Middle', 'd': 'Left Middle', 'c': 'Left Middle',
  '#': 'Left Middle', 'E': 'Left Middle', 'D': 'Left Middle', 'C': 'Left Middle',
  '4': 'Left Index', 'r': 'Left Index', 'f': 'Left Index', 'v': 'Left Index',
  '$': 'Left Index', 'R': 'Left Index', 'F': 'Left Index', 'V': 'Left Index',
  '5': 'Left Index', 't': 'Left Index', 'g': 'Left Index', 'b': 'Left Index',
  '%': 'Left Index', 'T': 'Left Index', 'G': 'Left Index', 'B': 'Left Index',
  ' ': 'Both Thumbs',
  '6': 'Right Index', 'y': 'Right Index', 'h': 'Right Index', 'n': 'Right Index',
  '^': 'Right Index', 'Y': 'Right Index', 'H': 'Right Index', 'N': 'Right Index',
  '7': 'Right Index', 'u': 'Right Index', 'j': 'Right Index', 'm': 'Right Index',
  '&': 'Right Index', 'U': 'Right Index', 'J': 'Right Index', 'M': 'Right Index',
  '8': 'Right Ring', 'i': 'Right Ring', 'k': 'Right Ring', ',': 'Right Ring',
  '*': 'Right Ring', 'I': 'Right Ring', 'K': 'Right Ring', '<': 'Right Ring',
  '9': 'Right Ring', 'o': 'Right Ring', 'l': 'Right Ring', '.': 'Right Ring',
  '(': 'Right Ring', 'O': 'Right Ring', 'L': 'Right Ring', '>': 'Right Ring',
  '0': 'Right Pinky', 'p': 'Right Pinky', ';': 'Right Pinky', '/': 'Right Pinky',
  ')': 'Right Pinky', 'P': 'Right Pinky', ':': 'Right Pinky', '?': 'Right Pinky',
  '-': 'Right Pinky', '[': 'Right Pinky', "'": 'Right Pinky',
  '_': 'Right Pinky', '{': 'Right Pinky', '"': 'Right Pinky',
  '=': 'Right Pinky', ']': 'Right Pinky',
  '+': 'Right Pinky', '}': 'Right Pinky', '\\': 'Right Pinky', '|': 'Right Pinky',
};

const FINGER_TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    'Left Pinky': 'Left Pinky', 'Left Ring': 'Left Ring', 'Left Middle': 'Left Middle', 'Left Index': 'Left Index',
    'Right Pinky': 'Right Pinky', 'Right Ring': 'Right Ring', 'Right Middle': 'Right Middle', 'Right Index': 'Right Index',
    'Both Thumbs': 'Both Thumbs'
  },
  es: {
    'Left Pinky': 'Meñique Izquierdo', 'Left Ring': 'Anular Izquierdo', 'Left Middle': 'Medio Izquierdo', 'Left Index': 'Índice Izquierdo',
    'Right Pinky': 'Meñique Derecho', 'Right Ring': 'Anular Derecho', 'Right Middle': 'Medio Derecho', 'Right Index': 'Índice Derecho',
    'Both Thumbs': 'Ambos Pulgares'
  }
};

// --- HELPER FUNCTIONS ---
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
  const [attempts, setAttempts] = useState<number>(0);

  const [currentPhrases, setCurrentPhrases] = useState<string[]>([]);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  
  const [timeLeft, setTimeLeft] = useState(LEVEL_TIMES[level]);
  const [fingerHint, setFingerHint] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerIntervalRef = useRef<number | null>(null);

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

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    const maxTime = LEVEL_TIMES[level as Level];
    setTimeLeft(maxTime);
    timerIntervalRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [level, stopTimer]);

  useEffect(() => {
    if (gameState === 'playing') {
      inputRef.current?.focus();
    }
    return stopTimer;
  }, [gameState, stopTimer]);

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
    startTimer();
  };

  const handleNextPhrase = () => {
    if (currentPhraseIndex < currentPhrases.length - 1) {
      setCurrentPhraseIndex(prev => prev + 1);
      setTypedText('');
      startTimer();
    } else {
      setGameState('finished');
      stopTimer();
    }
  };

  useEffect(() => {
    if (timeLeft === 0 && gameState === 'playing') {
      handleNextPhrase();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  };

  const handleRestart = () => {
    setGameState('menu');
    setCurrentPhraseIndex(0);
    setCurrentPhrases([]);
    setTypedText('');
    stopTimer();
  };

  const renderPhrase = () => {
    const targetPhrase = currentPhrases[currentPhraseIndex];
    if (!targetPhrase) return null;

    return (
      <div className="text-3xl md:text-4xl tracking-widest font-mono bg-white p-4 rounded-lg shadow-inner select-none">
        {targetPhrase.split('').map((char, index) => {
          let color = 'text-gray-400';
          if (index < typedText.length) {
            color = char === typedText[index] ? 'text-green-500' : 'text-red-500';
          }
          if (index === typedText.length) {
            color = 'text-blue-500 animate-pulse';
          }
          return (
            <span key={index} className={color}>
              {char === ' ' && index >= typedText.length ? '\u00A0' : char}
            </span>
          );
        })}
      </div>
    );
  };
  
  const renderContent = () => {
    switch (gameState) {
      case 'menu':
        return (
          <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200 text-center">
            <h1 className="text-4xl md:text-5xl text-blue-600 mb-2 font-display">Typing Tutor</h1>
            <p className="text-slate-500 mb-6">{language === 'es' ? '¡Aprende a teclear!' : 'Learn to type!'}</p>

            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder={language === 'es' ? 'Tu nombre aquí' : 'Your name here'}
              className="w-full px-4 py-3 mb-4 text-lg border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            <div className="mb-6">
              <h3 className="font-bold text-slate-600 mb-2">{language === 'es' ? 'Idioma' : 'Language'}</h3>
              <div className="flex justify-center gap-2">
                <button onClick={() => setLanguage('es')} className={`px-6 py-2 rounded-lg font-bold transition ${language === 'es' ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-200 text-slate-700'}`}>Español</button>
                <button onClick={() => setLanguage('en')} className={`px-6 py-2 rounded-lg font-bold transition ${language === 'en' ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-200 text-slate-700'}`}>English</button>
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
            
            <button onClick={handleStartGame} className="w-full py-4 text-2xl bg-orange-500 text-white rounded-lg font-display hover:bg-orange-600 transition-transform transform hover:scale-105 shadow-lg">
              {language === 'es' ? '¡Empezar!' : 'Start!'}
            </button>
            <p className="text-sm text-slate-400 mt-4">{language === 'es' ? 'Intentos totales:' : 'Total attempts:'} {attempts}</p>
          </div>
        );
      case 'playing': {
        const targetPhrase = currentPhrases[currentPhraseIndex];
        const isCompleted = typedText === targetPhrase;
        const maxTime = LEVEL_TIMES[level];

        return (
          <div className="w-full max-w-3xl mx-auto p-4 md:p-8">
            <h2 className="text-2xl font-display text-center mb-4">{language === 'es' ? `Frase ${currentPhraseIndex + 1} de 3` : `Phrase ${currentPhraseIndex + 1} of 3`}</h2>
            
            <div className="mb-4">
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                <div 
                  className="h-full bg-yellow-400 transition-all duration-1000 ease-linear" 
                  style={{ width: `${(timeLeft / maxTime) * 100}%` }}
                ></div>
              </div>
            </div>

            {renderPhrase()}
            
            <input
              ref={inputRef}
              type="text"
              value={typedText}
              onChange={handleInputChange}
              onBlur={() => inputRef.current?.focus()}
              autoFocus
              className="absolute -left-[9999px] opacity-0" // Hide input visually but keep it focusable
              disabled={isCompleted}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />

            <div className="h-24 mt-6 flex items-center justify-center">
              {isCompleted ? (
                <button onClick={handleNextPhrase} className="py-3 px-10 text-xl bg-green-500 text-white rounded-lg font-display hover:bg-green-600 transition-transform transform hover:scale-105 shadow-lg animate-bounce">
                  {language === 'es' ? 'Siguiente' : 'Next'}
                </button>
              ) : (level === 1 || level === 2) && fingerHint ? (
                 <div className="text-center">
                    <p className="text-slate-500 text-lg">{language === 'es' ? 'Usa tu...' : 'Use your...'}</p>
                    <p className="text-2xl font-bold text-blue-600 font-display">{fingerHint}</p>
                 </div>
              ) : level === 3 ? (
                <div className="text-center">
                    <p className="text-2xl font-bold text-red-500 font-display">{language === 'es' ? '¡Rápido!' : 'Quick!'}</p>
                </div>
              ) : <div className="h-full"></div>}
            </div>
          </div>
        );
      }
      case 'finished':
        return (
          <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200 text-center animate-pulse-once">
            <h1 className="text-5xl text-yellow-500 mb-4 font-display">
              {language === 'es' ? `¡Bien hecho, ${studentName}!` : `Well done, ${studentName}!`}
            </h1>
            <div className="my-6">
              <span className="inline-block bg-yellow-400 text-white text-lg font-bold px-6 py-3 rounded-full shadow-lg transform rotate-[-5deg]">
                ✨ {language === 'es' ? 'INSIGNIA DE TECLADISTA' : 'KEYBOARD MASTER BADGE'} ✨
              </span>
            </div>
            <p className="text-slate-600 mb-8">{language === 'es' ? '¡Completaste todas las frases!' : 'You completed all the phrases!'}</p>
            <button onClick={handleRestart} className="w-full py-4 text-2xl bg-blue-500 text-white rounded-lg font-display hover:bg-blue-600 transition-transform transform hover:scale-105 shadow-lg">
              {language === 'es' ? 'Volver al menú' : 'Back to Menu'}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-100 bg-cover bg-center" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')"}}>
      <div className="w-full max-w-4xl">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
