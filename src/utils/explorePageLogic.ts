import { items } from "@/lib/data";
import { useUser } from '@clerk/nextjs';

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
  }).then(res => res.json())
    .then(data => {
      currentSessionId = data.sessionId;
    });
}

export function updateTrackingProgress(userId: string, songId: string, currentTime: number, duration: number) {
  if (!currentSessionId) return;
  
  // Update progress every 5 seconds
  if (trackingInterval) clearInterval(trackingInterval);
  
  trackingInterval = setInterval(() => {
    fetch('/api/tracking/update-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: currentSessionId,
        userId,
        songId,
        currentTime,
        duration,
        timestamp: new Date().toISOString()
      })
    });
  }, 5000);
}

export function endTrackingSession(userId: string, songId: string, finalTime: number) {
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
      lastPosition: finalTime
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


export function handleClick(e: React.MouseEvent<HTMLButtonElement>, itemData: typeof items[number], user : any) {
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
    }

    function pauseMusic() {
        isPlaying = false;
        // Change pause button icon
        playBtn?.classList.replace('fa-pause', 'fa-play');
        // Set button hover title
        playBtn?.setAttribute('title', 'Play');
        music.pause();

        endTrackingSession(user.id, itemData.id, music.currentTime);
    }

    function loadMusic(song: typeof items[number]) {
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

        updateTrackingProgress(user.id, itemData.id, currentTime, duration);
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
