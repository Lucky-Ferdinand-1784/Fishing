import { useState, useRef, useEffect, useCallback } from 'react';

const TRACKS = [
  "♫ Sunset Horizon Lo-Fi.wav",
  "♫ Whispering Waves 8-Bit.wav",
  "♫ Campfire by the Cove.wav"
];

export function useRetroAudio(onNotify) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const audioCtxRef = useRef(null);
  const ambientGainRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const progressTimerRef = useRef(null);

  // Initialize Web Audio Context safely on user interaction
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      const gain = audioCtxRef.current.createGain();
      gain.gain.setValueAtTime(0.08, audioCtxRef.current.currentTime);
      gain.connect(audioCtxRef.current.destination);
      ambientGainRef.current = gain;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // 8-bit retro square beep sound generator
  const playBeep = useCallback((freq = 550, duration = 0.05, type = 'square') => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("AudioContext beep failed:", e);
    }
  }, [getAudioContext, isMuted]);

  // Sound: Fish bite alert ("Ding Ding!")
  const playBiteAlert = useCallback(() => {
    if (isMuted) return;
    playBeep(880, 0.06, 'triangle');
    setTimeout(() => playBeep(1174, 0.12, 'square'), 70);
  }, [playBeep, isMuted]);

  // Sound: Cast rod whoosh
  const playCast = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {}
  }, [getAudioContext, isMuted]);

  // Sound: Water splash
  const playSplash = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      const bufferSize = ctx.sampleRate * 0.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }, [getAudioContext, isMuted]);

  // Sound: Success / Fish caught fanfare
  const playCatchSuccess = useCallback(() => {
    if (isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    notes.forEach((freq, i) => {
      setTimeout(() => {
        playBeep(freq, i === notes.length - 1 ? 0.25 : 0.08, 'triangle');
      }, i * 90);
    });
  }, [playBeep, isMuted]);

  // Sound: Level up trumpet fanfare
  const playLevelUp = useCallback(() => {
    if (isMuted) return;
    const notes = [440, 554, 659, 880, 1108];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        playBeep(freq, 0.15, 'square');
      }, i * 110);
    });
    if (onNotify) onNotify('🎉 LEVEL UP! Status Petualang Naik!');
  }, [playBeep, isMuted, onNotify]);

  // Sound: Gold Coins ding
  const playCoinSound = useCallback(() => {
    if (isMuted) return;
    playBeep(987.77, 0.05, 'sine');
    setTimeout(() => playBeep(1318.51, 0.14, 'sine'), 50);
  }, [playBeep, isMuted]);

  // Sound: Rest / Heal sound
  const playRestSound = useCallback(() => {
    if (isMuted) return;
    const notes = [329.63, 392.00, 493.88, 659.25];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        playBeep(freq, 0.18, 'sine');
      }, i * 120);
    });
  }, [playBeep, isMuted]);

  // Melodic 8-bit chime
  const playChime = useCallback(() => {
    playBeep(440, 0.08);
    setTimeout(() => playBeep(554.37, 0.08), 80);
    setTimeout(() => playBeep(659.25, 0.15), 160);
    if (onNotify) onNotify('✨ Lonceng Pantai Senja!');
  }, [playBeep, onNotify]);

  // Start continuous lo-fi synth chord modulation
  const startLoFiChords = useCallback(() => {
    const ctx = getAudioContext();
    stopLoFiChords();

    // Relaxing sunset chord: Fmaj7 / C9
    const freqs = [174.61, 220.00, 261.63, 329.63];
    oscillatorsRef.current = freqs.map((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      osc.connect(gain);
      if (ambientGainRef.current) {
        gain.connect(ambientGainRef.current);
      }
      osc.start();
      return { osc, gain };
    });
  }, [getAudioContext]);

  const stopLoFiChords = useCallback(() => {
    oscillatorsRef.current.forEach(item => {
      try {
        item.osc.stop();
        item.osc.disconnect();
      } catch (e) {}
    });
    oscillatorsRef.current = [];
  }, []);

  // Toggle playback
  const togglePlay = useCallback(() => {
    if (!isPlaying) {
      startLoFiChords();
      setIsPlaying(true);
      if (onNotify) onNotify('🎵 Musik Santai Senja Dimainkan!');
    } else {
      stopLoFiChords();
      setIsPlaying(false);
      if (onNotify) onNotify('⏸ Musik Dijeda');
    }
  }, [isPlaying, startLoFiChords, stopLoFiChords, onNotify]);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    getAudioContext();
    setIsMuted(prev => {
      const nextMuted = !prev;
      if (ambientGainRef.current && audioCtxRef.current) {
        ambientGainRef.current.gain.setValueAtTime(
          nextMuted ? 0 : 0.08,
          audioCtxRef.current.currentTime
        );
      }
      if (onNotify) onNotify(nextMuted ? '🔇 Audio Dimatikan' : '🔊 Audio Dinyalakan');
      return nextMuted;
    });
  }, [getAudioContext, onNotify]);

  // Next Track
  const nextTrack = useCallback(() => {
    playBeep(700, 0.05);
    setTrackIndex(prev => {
      const next = (prev + 1) % TRACKS.length;
      if (onNotify) onNotify(`Memutar: ${TRACKS[next]}`);
      return next;
    });
  }, [playBeep, onNotify]);

  // Scrub progress bar
  const seekProgress = useCallback((percent) => {
    playBeep(350, 0.04);
    setProgress(Math.min(100, Math.max(0, percent)));
  }, [playBeep]);

  // Handle timer ticker for progress when playing
  useEffect(() => {
    if (isPlaying) {
      progressTimerRef.current = setInterval(() => {
        setProgress(prev => (prev + 1) % 100);
      }, 400);
    } else {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying]);

  // Cleanup audio nodes when unmounting
  useEffect(() => {
    return () => {
      stopLoFiChords();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, [stopLoFiChords]);

  return {
    isPlaying,
    isMuted,
    currentTrack: TRACKS[trackIndex],
    progress,
    togglePlay,
    toggleMute,
    nextTrack,
    seekProgress,
    playBeep,
    playChime,
    playBiteAlert,
    playCast,
    playSplash,
    playCatchSuccess,
    playLevelUp,
    playCoinSound,
    playRestSound
  };
}
