// hooks/useMonthlySessions.ts
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface MonthlySessions {
  currentMonthTotal: number;
  percentageChange: number;
}

export function useMonthlySessions() {
  const { user, isLoaded } = useUser();
  const [sessionStats, setSessionStats] = useState<MonthlySessions | null>(null);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessionStats() {
      if (!isLoaded || !user) {
        setLoadingSessions(false);
        return;
      }

      try {
        setLoadingSessions(true);
        setError(null);
        const response = await fetch('/api/tracking/monthly-sessions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: MonthlySessions = await response.json();
        setSessionStats(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoadingSessions(false);
      }
    }

    fetchSessionStats();
  }, [isLoaded, user]);

  return { sessionStats, loadingSessions, error };
}
