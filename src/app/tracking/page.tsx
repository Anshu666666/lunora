'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChartListeningHistory } from '@/components/ui/chart-listening-history'
import { Star } from "lucide-react"; 

interface ListeningData {
  date: string;
  minutesListened: number;
}

interface UserProgress {
  songId: string;
  songTitle: string;
  songDuration: number;
  totalDurationListened: number;
  completionPercentage: number;
  lastUpdated: string;
}

export default function TrackingPage() {
  const { user, isLoaded } = useUser();
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [favoriteSong, setFavoriteSong] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [listeningData, setListeningData] = useState<ListeningData[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalSongs: 0,
    totalDuration: 0,
    totalListened: 0,
    overallCompletion: 0
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch data in parallel for better performance
        const [activityResponse, favoriteResponse] = await Promise.all([
          fetch('/api/tracking/daily-activity'),
          fetch('/api/tracking/favorite-song')
        ]);

        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          setListeningData(activityData);
        }

        // ✨ 2. Handle the response for the favorite song
        if (favoriteResponse.ok) {
          const favoriteData = await favoriteResponse.json();
          setFavoriteSong(favoriteData.favoriteSong);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserProgress();
    }
  }, [isLoaded, user]);

const fetchUserProgress = useCallback(async () => {
    if (!user) return; // Guard clause in case user is not available

    try {
      // Set loading to true at the start of the fetch
      setLoading(true); 
      const response = await fetch(`/api/tracking/user-progress?userId=${user.id}`);
      const data = await response.json();
      setUserProgress(data.progress);
      setTotalStats(data.stats);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setLoading(false);
    }
  }, [user]); // The function depends on `user`.

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserProgress();
    }
  // ✨ FIX 3: Add the memoized `fetchUserProgress` to the dependency array.
  }, [isLoaded, user, fetchUserProgress]);

  if (!isLoaded || loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to view your progress</div>;
  }

  return (
    <div className="container mx-auto p-6 ">
      <h1 className="text-3xl font-bold mb-6 ">Your Listening Progress</h1>
      
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 text-black">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="font-semibold">Total Songs</h3>
          <p className="text-2xl">{totalStats.totalSongs}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-semibold">Total Duration</h3>
          <p className="text-2xl">{formatTime(totalStats.totalDuration)}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="font-semibold">Time Listened</h3>
          <p className="text-2xl">{formatTime(totalStats.totalListened)}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="font-semibold">Overall Completion</h3>
          <p className="text-2xl">{(totalStats.overallCompletion || 0).toFixed(1)}%</p>

        </div>
      </div>

      {/* Individual Song Progress */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Song
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Listened
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {userProgress.map((song) => (
              <tr key={song.songId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {song.songTitle}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatTime(song.songDuration)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatTime(song.totalDurationListened)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${song.completionPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{song.completionPercentage.toFixed(1)}%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(song.lastUpdated).toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true, // Use AM/PM format
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button>Click Me</Button>
      <div className="mb-8">
        <div className="bg-amber-100 text-black p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Star className="w-6 h-6 mr-3 text-amber-500" />
            <div>
              <h3 className="font-semibold text-lg">Your All-Time Favorite</h3>
              <p className="text-2xl font-bold">
                {loading ? "Loading..." : favoriteSong || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
          <p>Loading chart...</p>
        ) : (
          <ChartListeningHistory data={listeningData} />
        )}
    </div>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}


