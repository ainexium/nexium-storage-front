import { useState, useEffect, useCallback } from "react";

const COOLDOWN = 60;

export function useResendTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const startTimer = useCallback(() => setSeconds(COOLDOWN), []);
  const canResend = seconds <= 0;

  return { seconds, startTimer, canResend };
}
