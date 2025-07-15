import { useState, useRef, useCallback } from 'react';

export function useTimer(initialTime: number) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef<number | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback((newTime: number = initialTime) => {
    stopTimer();
    setTimeLeft(newTime);

    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [initialTime, stopTimer]);

  return {
    timeLeft,
    startTimer,
    stopTimer,
  };
}
