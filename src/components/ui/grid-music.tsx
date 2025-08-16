import React, { useRef, useState, useEffect, useCallback } from 'react';

const AudioPlayer: React.FC = () => {
  const songRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // Format seconds to mm:ss
  const formatTime = useCallback((seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
  }, []);

  // Event handlers
  const handleLoadedMetadata = useCallback(() => {
    if (songRef.current && !isNaN(songRef.current.duration)) {
      setDuration(songRef.current.duration);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (songRef.current) {
      setCurrentTime(songRef.current.currentTime);
    }
  }, []);

  const handlePlay = useCallback(() => setIsPlaying(true), []);
  const handlePause = useCallback(() => setIsPlaying(false), []);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!songRef.current) return;
    if (songRef.current.paused) {
      songRef.current.play();
    } else {
      songRef.current.pause();
    }
  };

  const toggleMute = () => {
    if (!songRef.current) return;
    // Directly update the audio element's muted property
    songRef.current.muted = !songRef.current.muted;
    // Sync our React state with the audio element's actual state
    setIsMuted(songRef.current.muted);
  };

  // Seek functionality
  const seek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!songRef.current || !progressBarRef.current || duration === 0) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = progressBarRef.current.clientWidth;
    const newTime = (clickX / width) * duration;
    
    const clampedTime = Math.max(0, Math.min(newTime, duration));
    songRef.current.currentTime = clampedTime;
  };

  useEffect(() => {
    const audio = songRef.current;
    if (!audio) return;

    // Force load and set up event listeners
    audio.load();

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('loadeddata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('loadeddata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [handleLoadedMetadata, handleTimeUpdate, handlePlay, handlePause]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-[#dedede4f] backdrop-blur-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white w-[70%] h-[50%] rounded-lg shadow-lg flex flex-col items-center justify-center select-none">
      <audio ref={songRef} src="/audio/nature.mp3" preload="metadata" muted />

      {/* FIX: Escaped the apostrophe in "Nature's" */}
      <div className='title sfpro w-full flex justify-center text-[0.8rem] text-black '>Nature&apos;s Bliss</div>

      {/* Timestamps */}
      <div className="w-[90%] flex sfpro justify-between text-[0.7rem] font-mono ">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Progress Bar */}
      <div
        className="player-progress bg-[#94050584] w-[95%] h-[5px] !mt-[0.3rem] !mb-[0.7rem] rounded-[5px] cursor-pointer"
        ref={progressBarRef}
        onClick={seek}
      >
        <div
          className="progress bg-[#212121] rounded-[5px] h-full transition-all duration-75 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Controls */}
        <div className=' absolute flex left-1/2 -translate-x-1/2 bottom-[0.2rem] '>
            <i className="fa-solid fa-backward cursor-pointer" title="Previous"></i>
            <i
                className={`fa-solid text-4xl cursor-pointer ${isPlaying ? 'fa-pause' : 'fa-play'
                    }`}
                title={isPlaying ? 'Pause' : 'Play'}
                onClick={togglePlayPause}
            />
            <i className="fa-solid fa-forward cursor-pointer" title="Next"></i>
        </div>

            <i
                className={`fa-solid absolute right-0 bottom-[0.2rem] text-4xl cursor-pointer ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'
                    }`}
                title={isMuted ? 'Unmute' : 'Mute'}
                onClick={toggleMute}
            />

    </div>
  );
};

export default AudioPlayer;