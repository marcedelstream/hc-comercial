import { getSevenDaysFromToday } from '@/utils/dateUtils';
import { useEffect, useState } from 'react';
import TimeDisplay from './TimeDisplay';

export interface TimeState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = ({ targetDate }: { targetDate?: string }) => {
  const [date, setDate] = useState<TimeState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const getTime = () => {
    const target = targetDate ? new Date(targetDate).getTime() : Date.parse(getSevenDaysFromToday())
    const time = Math.max(0, target - Date.now());

    setDate({
      days: Math.floor(time / (1000 * 60 * 60 * 24)),
      hours: Math.floor((time / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((time / 1000 / 60) % 60),
      seconds: Math.floor((time / 1000) % 60),
    });
  };

  useEffect(() => {
    const interval = setInterval(getTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap gap-6 mt-6">
      <TimeDisplay value={date.days} label="Días" />
      <TimeDisplay value={date.hours} label="Horas" />
      <TimeDisplay value={date.minutes} label="Minutos" />
      <TimeDisplay value={date.seconds} label="Segundos" />
    </div>
  );
}; 