import { items1 } from "@/lib/data";
import { useUser } from '@clerk/nextjs';

let musicTimer: NodeJS.Timeout | null = null;
let countdownInterval: NodeJS.Timeout | null = null;
let trackingInterval: NodeJS.Timeout | null = null;
let sessionStartTime: number = 0;
let currentSessionId: string | null = null;

export function startTrackingSession(userId: string, songId: string) {
  sessionStartTime = Date.now();
  
  // Create new listening session
  fetch('/api/tracking/start-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      songId,
      sessionStart: new Date().toISOString()
    })
  }).then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
    .then(data => {
      currentSessionId = data.sessionId;
    })
    .catch(error => {
      console.error('Error starting tracking session:', error);
    });
}


export function endTrackingSession(userId: string, songId: string, finalTime: number, timerCompleted : boolean) {
  if (trackingInterval) {
    clearInterval(trackingInterval);
    trackingInterval = null;
  }
  
  if (!currentSessionId) return;
  
  const sessionDuration = (Date.now() - sessionStartTime) / 1000; // in seconds
  
  fetch('/api/tracking/end-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: currentSessionId,
      userId,
      songId,
      sessionEnd: new Date().toISOString(),
      durationListened: Math.min(sessionDuration, finalTime),
      lastPosition: finalTime,
      timerCompleted: timerCompleted
    })
  });
  
  currentSessionId = null;
}

export function explorePageLogic() {
  
  const next = document.querySelector('.next');
  const prev = document.querySelector('.prev');
  

  if (next && prev) {
    next.addEventListener('click', () => {
      const items = document.querySelectorAll('.item');
      document.querySelector('.slide')?.appendChild(items[0]);
    });

    prev.addEventListener('click', () => {
      const items = document.querySelectorAll('.item');
      document.querySelector('.slide')?.prepend(items[items.length - 1]);
    });
  } else {
    console.warn('.next or .prev not found in DOM');
  }
}

let currentAudio: HTMLAudioElement | null = null;
let currentPlayBtn: HTMLElement | null = null;


export function handleClick(e: React.MouseEvent<HTMLButtonElement>, itemData: typeof items1[number], user : any) {
    const button = e.currentTarget,
    item = button.closest(".item"), // Find the closest parent .item
    customDiv = item?.querySelector(".custom") as HTMLElement,
    currentTimeEl = item?.querySelector('#current-time') as HTMLElement,
    durationEl = item?.querySelector('#duration') as HTMLElement,
    progress = item?.querySelector('.progress') as HTMLElement,
    playerProgress = item?.querySelector('.player-progress') as HTMLElement,
    prevBtn = item?.querySelector('#prevSong') as HTMLElement,
    nextBtn = item?.querySelector('#nextSong') as HTMLElement,
    playBtn = item?.querySelector('[data-role="play"]') as HTMLElement;
    const timerDisplay = item?.querySelector('#timer-display') as HTMLElement;
    const timerButtons = item?.querySelectorAll('.timer-btn') as NodeListOf<HTMLElement>;

if (!user) {
    // Redirect to login or show auth modal
    return;
  }

  // Stop previous audio if any
  if (currentAudio) {
    currentAudio.pause();
    if (currentPlayBtn) {
      currentPlayBtn.classList.replace("fa-pause", "fa-play");
      currentPlayBtn.setAttribute("title", "Play");
    }
  }

  // Create new audio
  const music = new Audio(itemData.songUrl);
  music.addEventListener("loadedmetadata", () => {
  const formatTime = (time: number): string =>
    String(Math.floor(time)).padStart(2, "0");

  if (durationEl)
    durationEl.textContent = `${formatTime(music.duration / 60)}:${formatTime(music.duration % 60)}`;
});

  currentAudio = music;
  currentPlayBtn = playBtn;

  let isPlaying = false;

    function togglePlay() {
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    }

    function playMusic() {
        isPlaying = true;
        // Change play button icon
        playBtn?.classList.replace('fa-play', 'fa-pause');
        // Set button hover title
        playBtn?.setAttribute('title', 'Pause');
        music.play();

        startTrackingSession(user.id, itemData.id);


        if (trackingInterval) clearInterval(trackingInterval);
    trackingInterval = setInterval(() => {
        // This heartbeat signal no longer sends currentTime or duration
        fetch('/api/tracking/update-progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: currentSessionId,
                songId: itemData.id
            })
        });
    }, 5000);
    }

    function pauseMusic(options: { isTimerCompletion?: boolean } = {}) {
    const { isTimerCompletion = false } = options; // Default to false

        if (!isPlaying) return; // Prevent multiple calls

        isPlaying = false;
        // Change pause button icon
        playBtn?.classList.replace('fa-pause', 'fa-play');
        // Set button hover title
        playBtn?.setAttribute('title', 'Play');
        music.pause();

        if (trackingInterval) {
        clearInterval(trackingInterval);
        trackingInterval = null;
        }

        if (musicTimer) clearTimeout(musicTimer);
    if (countdownInterval) clearInterval(countdownInterval);
    if (timerDisplay) timerDisplay.textContent = "";

    // Pass the new flag to the tracking function
    endTrackingSession(user.id, itemData.id, music.currentTime, isTimerCompletion);
    }

    function startMusicTimer(durationInSeconds: number) {
        // Clear any previous timers
        if (musicTimer) clearTimeout(musicTimer);
        if (countdownInterval) clearInterval(countdownInterval);

        // 1. Trigger the playMusic function
        if (!isPlaying) {
            playMusic();
        }

        // 2. Set the main timer to pause the music when it ends
        musicTimer = setTimeout(() => {
        pauseMusic({ isTimerCompletion: true });
        if (timerDisplay) timerDisplay.textContent = 'Timer Finished!';
    }, durationInSeconds * 1000);

        // 3. Set the countdown interval to update the display every second
        let remainingTime = durationInSeconds;
        const updateCountdown = () => {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            if (timerDisplay) {
                timerDisplay.textContent = `Time left: ${minutes}:${String(seconds).padStart(2, '0')}`;
            }
            remainingTime--;

            if (remainingTime < 0) {
                if (countdownInterval) clearInterval(countdownInterval);
            }
        };
        
        updateCountdown(); // Run once immediately
        countdownInterval = setInterval(updateCountdown, 1000);
    }

    function loadMusic(song: typeof items1[number]) {
        music.src = song.songUrl;
    }

    function updateProgressBar() {
        const { duration, currentTime } = music;

        if(!isFinite(duration)) return;

        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        const formatTime = (time : number) => String(Math.floor(time)).padStart(2, '0');
        durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
        currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;

    }

    function setProgressBar(e: MouseEvent) {
        const width = playerProgress?.clientWidth;
        const clickX = e.offsetX;
        music.currentTime = (clickX / width) * music.duration;
    }

    if (customDiv) {
        customDiv.classList.remove("hidden");
        customDiv.classList.add("flex","flex-col","items-center","justify-between");
    }

    playBtn.addEventListener('click', togglePlay);

    timerButtons.forEach(button => {
            button.addEventListener('click', () => {
                const time = parseInt(button.dataset.time || '0', 10);
                if (time > 0) {
                    startMusicTimer(time);
                }
            });
        });

    nextBtn.addEventListener('click', () => {
      const items = document.querySelectorAll('.item');
      document.querySelector('.slide')?.appendChild(items[0]);
    });

    prevBtn.addEventListener('click', () => {
      const items = document.querySelectorAll('.item');
      document.querySelector('.slide')?.prepend(items[items.length - 1]);
    });
    
    music.addEventListener('timeupdate', updateProgressBar);
    playerProgress.addEventListener('click', setProgressBar);

    loadMusic(itemData);
}
