// hooks/useMonthlyStats.js
import { useState, useEffect } from 'react';

// You can keep this interface definition in a separate types file
interface MonthlyStats {
  currentMonthTotal: number;
  percentageChange: number;
}

export const useMonthlyStats = () => {
  const [stats, setStats] = useState<MonthlyStats | null>(null);
  const [loadingChart, setLoadingChart] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthlyStats = async () => {
      try {
        const response = await fetch('/api/tracking/monthly-stats');
        if (!response.ok) {
          throw new Error('Failed to fetch monthly stats');
        }
        const data: MonthlyStats = await response.json();
        setStats(data);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred');
        }
        console.error(err);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchMonthlyStats();
  }, []);

  // The hook returns the state and data
  return { stats, loadingChart, error };
};
