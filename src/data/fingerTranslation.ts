import type { Language } from '../types';

const FINGER_TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    'Left Pinky': 'Left Pinky',
    'Left Ring': 'Left Ring',
    'Left Middle': 'Left Middle',
    'Left Index': 'Left Index',
    'Right Pinky': 'Right Pinky',
    'Right Ring': 'Right Ring',
    'Right Middle': 'Right Middle',
    'Right Index': 'Right Index',
    'Both Thumbs': 'Both Thumbs',
  },
  es: {
    'Left Pinky': 'Meñique Izquierdo',
    'Left Ring': 'Anular Izquierdo',
    'Left Middle': 'Medio Izquierdo',
    'Left Index': 'Índice Izquierdo',
    'Right Pinky': 'Meñique Derecho',
    'Right Ring': 'Anular Derecho',
    'Right Middle': 'Medio Derecho',
    'Right Index': 'Índice Derecho',
    'Both Thumbs': 'Ambos Pulgares',
  }
};

export default FINGER_TRANSLATIONS;
