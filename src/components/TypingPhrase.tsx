import React from 'react';

interface TypingPhraseProps {
  targetPhrase: string;
  typedText: string;
}

const TypingPhrase: React.FC<TypingPhraseProps> = ({ targetPhrase, typedText }) => {
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

export default TypingPhrase;
