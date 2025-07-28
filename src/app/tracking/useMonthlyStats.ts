import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface MonthlyStats {
  currentMonthTotal: number;
  percentageChange: number;
}

export function useMonthlyStats() {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState<MonthlyStats | null>(null); 
  const [loadingChart, setLoadingChart] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      if (!isLoaded || !user) {
        setLoadingChart(false);
        return;
      }

      try {
        setLoadingChart(true);
        setError(null);
        
        console.log('Fetching monthly stats for user:', user.id);
        const response = await fetch('/api/tracking/monthly-stats');
        console.log('Monthly stats response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: MonthlyStats = await response.json(); // Add type
        console.log('Monthly stats data:', data);
        setStats(data);
      } catch (error) {
        console.error('Error fetching monthly stats:', error);
        setError(error instanceof Error ? error.message : 'Unknown error'); // Fix error type
      } finally {
        setLoadingChart(false);
      }
    }

    fetchStats();
  }, [isLoaded, user]);

  return { stats, loadingChart, error };
}