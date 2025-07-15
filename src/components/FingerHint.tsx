import React from 'react';

interface FingerHintProps {
  language: 'es' | 'en';
  fingerHint: string;
}

const FingerHint: React.FC<FingerHintProps> = ({ language, fingerHint }) => {
  if (!fingerHint) return null;

  return (
    <div className="text-center">
      <p className="text-slate-500 text-lg">
        {language === 'es' ? 'Usa tu...' : 'Use your...'}
      </p>
      <p className="text-2xl font-bold text-blue-600 font-display">
        {fingerHint}
      </p>
    </div>
  );
};

export default FingerHint;
