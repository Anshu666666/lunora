'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChartListeningHistory } from '@/components/ui/chart-listening-history'
import { Star } from "lucide-react"; 
import { ArrowUp, ArrowDown } from 'lucide-react';

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

interface MonthlyStats {
  currentMonthTotal: number;
  percentageChange: number;
}

// const MonthlyListenCard = () => {
//   const [stats, setStats] = useState<MonthlyStats | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMonthlyStats = async () => {
//       try {
//         const response = await fetch('/api/tracking/monthly-stats');
//         if (!response.ok) {
//           throw new Error('Failed to fetch monthly stats');
//         }
//         const data: MonthlyStats = await response.json();
//         setStats(data);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMonthlyStats();
//   }, []);

//   if (loading) {
//     return <div className="bg-gray-800 p-4 rounded-lg text-center">Loading monthly stats...</div>;
//   }
  
//   if (!stats) {
//      return <div className="bg-gray-800 p-4 rounded-lg text-center">Could not load stats.</div>;
//   }

//   const isPositive = stats.percentageChange >= 0;

//   return (
//     <div className="bg-[#1c1c1e] p-4 rounded-xl shadow-lg w-full max-w-xs">
//       <div className="flex justify-between items-center mb-2">
//         <p className="text-sm text-gray-400">Time Listened</p>
//       </div>
//       <div className="flex items-end justify-between">
//         <p className="text-4xl font-bold text-white">
//           {formatTime(stats.currentMonthTotal)}
//         </p>
//         <div className={`flex items-center px-2 py-1 rounded-full text-sm ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
//           {isPositive ? <ArrowUp size={16} className="mr-1" /> : <ArrowDown size={16} className="mr-1" />}
//           <span>{stats.percentageChange.toFixed(1)}%</span>
//         </div>
//       </div>
//       <p className="text-xs text-gray-500 mt-2">This month vs last</p>
//     </div>
//   );
// };

export default function TrackingPage() {
  const { user, isLoaded } = useUser();
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [favoriteSong, setFavoriteSong] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [listeningData, setListeningData] = useState<ListeningData[]>([]);
  const [timeRange, setTimeRange] = useState('30d');
  const [totalStats, setTotalStats] = useState({
    totalSongs: 0,
    totalDuration: 0,
    totalListened: 0,
    overallCompletion: 0
  });

  // useEffect(() => {
  //   async function fetchDashboardData() {
  //     try {
  //       // Fetch data in parallel for better performance
  //       const [activityResponse, favoriteResponse] = await Promise.all([
  //         fetch(`/api/tracking/daily-activity?period=${timeRange}`),
  //         fetch('/api/tracking/favorite-song')
  //       ]);

  //       if (activityResponse.ok) {
  //         const activityData = await activityResponse.json();
  //         setListeningData(activityData);
  //       }

  //       // ✨ 2. Handle the response for the favorite song
  //       if (favoriteResponse.ok) {
  //         const favoriteData = await favoriteResponse.json();
  //         setFavoriteSong(favoriteData.favoriteSong);
  //       }

  //     } catch (error) {
  //       console.error("Error fetching dashboard data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchDashboardData();
  // }, [timeRange]);

  // useEffect(() => {
  //   if (isLoaded && user) {
  //     fetchUserProgress();
  //   }
  // }, [isLoaded, user]);

// const fetchUserProgress = useCallback(async () => {
//     if (!user) return; // Guard clause in case user is not available

//     try {
//       // Set loading to true at the start of the fetch
//       setLoading(true); 
//       const response = await fetch(`/api/tracking/user-progress?userId=${user.id}`);
//       const data = await response.json();
//       setUserProgress(data.progress);
//       setTotalStats(data.stats);
//     } catch (error) {
//       console.error('Error fetching user progress:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [user]); // The function depends on `user`.

//   useEffect(() => {
//     if (isLoaded && user) {
//       fetchUserProgress();
//     }
//   // ✨ FIX 3: Add the memoized `fetchUserProgress` to the dependency array.
//   }, [isLoaded, user, fetchUserProgress]);

//   if (!isLoaded || loading) {
//     return <div>Loading...</div>;
//   }

//   if (!user) {
//     return <div>Please sign in to view your progress</div>;
//   }

  return (
    <div className=" mx-auto w-[100vw] px-[7.5vw] py-[4rem] sfpro bg-[url('/images/mountain-bg.jpg')] bg-cover ">
      <h1 className="text-3xl font-bold mb-[2rem] ">Your Listening Progress</h1>
      
      {/* Overall Stats */}
      <div className="tracking-grid w-[90%] mx-auto flex flex-col md:flex-row ">

          <div className="tracking-grid-left grid-cols-2 md:w-[50%] w-full grid h-[65vh] md:mr-[0.5rem] md:mb-0 mb-[0.5rem] gap-[1rem] text-black">
            <div className='  rounded-bl-[20px] rounded-tl-[20px] rounded-tr-[20px] p-[1.5rem] bg-[#0000003e] backdrop-blur-lg border border-[#a4a4a434] shadow-[4px_3px_10px_rgba(255,255,255,0.2)] ' >
              <p className="text-[1rem] text-gray-400">Total Songs</p>
              <p className="text-[3rem] font-bold text-white ">{totalStats.totalSongs}</p>
            </div>
            <div className='  rounded-br-[20px] rounded-tl-[20px] rounded-tr-[20px] p-[1.5rem] bg-[#0000003e] backdrop-blur-lg border border-[#a4a4a434] shadow-[4px_3px_10px_rgba(255,255,255,0.2)]' ></div>
            <div className='  rounded-tl-[20px] rounded-bl-[20px] rounded-br-[20px] p-[1.5rem] bg-[#0000003e] backdrop-blur-lg border border-[#a4a4a434] shadow-[4px_3px_10px_rgba(255,255,255,0.2)] ' >
              <p className="text-[1rem] text-gray-400">Total Songs</p>
              <p className="text-[3rem] font-bold text-white ">{totalStats.totalSongs}</p>
            </div>
            <div className='  rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] p-[1.5rem] bg-[#0000003e] backdrop-blur-lg border border-[#a4a4a434] shadow-[4px_3px_10px_rgba(255,255,255,0.2)]' ></div>


            {/* <div className="bg-blue-100 p-4 rounded-xl shadow-lg  ">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-400">Total Songs</p>
            </div>
            <p className="text-4xl font-bold text-white ">{totalStats.totalSongs}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-xl shadow-lg  ">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-400">Total Duration</p>
            </div>
            <p className="text-4xl font-bold text-white ">{formatTime(totalStats.totalDuration)}</p>
          </div>
        <MonthlyListenCard />
          <div className="bg-purple-100 p-4 rounded-xl shadow-lg ">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-400">Overall Completion</p>
            </div>
            <p className="text-4xl font-bold text-white ">{(totalStats.overallCompletion || 0).toFixed(1)}%</p>
          </div> */}
          </div>

          <div className="tracking-grid-right h-[65vh] rounded-[20px] md:w-[50%] w-full md:ml-[0.5rem] md:mt-0 mt-[0.5rem] bg-[#0000003e] backdrop-blur-lg border border-[#a4a4a434] shadow-[4px_3px_10px_rgba(255,255,255,0.2)]">

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

      <div>
        <label htmlFor="timeRangeSelect">Select Time Range: </label>
        <select
          id="timeRangeSelect"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="30d">Last 30 Days</option>
          <option value="3m">Last 3 Months</option>
        </select>
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


