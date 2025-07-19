'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

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
  const [loading, setLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    totalSongs: 0,
    totalDuration: 0,
    totalListened: 0,
    overallCompletion: 0
  });

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserProgress();
    }
  }, [isLoaded, user]);

  const fetchUserProgress = async () => {
    try {
      const response = await fetch(`/api/tracking/user-progress?userId=${user?.id}`);
      const data = await response.json();
      setUserProgress(data.progress);
      setTotalStats(data.stats);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to view your progress</div>;
  }

  return (
    <div className="container mx-auto p-6">
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
                  {new Date(song.lastUpdated).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
