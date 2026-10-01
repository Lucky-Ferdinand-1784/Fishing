import React from 'react';

export default function AudioWidget({
  isPlaying,
  isMuted,
  currentTrack,
  progress,
  onTogglePlay,
  onToggleMute,
  onNextTrack,
  onSeekProgress
}) {
  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.round((clickX / rect.width) * 100);
    onSeekProgress(percent);
  };

  return (
    <div className="p-3 border-t-4 border-black bg-[#101222]">
      <div className="pixel-box bg-pixel-navy p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-pixel-goldenSun flex items-center gap-1">
            <span className={`inline-block ${isPlaying ? 'animate-spin' : ''}`}>💿</span> LO-FI CHILL
          </span>
          <span className={`font-retro text-sm ${isPlaying ? 'text-emerald-400' : 'text-pixel-lavender'}`}>
            {isPlaying ? 'PLAYING' : 'PAUSED'}
          </span>
        </div>

        {/* Track name marquee effect */}
        <div className="bg-black p-1.5 border-2 border-[#333] overflow-hidden">
          <div className="text-[10px] text-amber-300 whitespace-nowrap animate-pulse">
            {currentTrack}
          </div>
        </div>

        {/* Retro Sound Progress Bar */}
        <div 
          className="w-full bg-black h-3 border-2 border-black relative cursor-pointer" 
          onClick={handleProgressClick}
          title="Click to seek"
        >
          <div 
            className="h-full bg-gradient-to-r from-pixel-duskRose to-pixel-sunsetOrange transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between gap-1 pt-1">
          <button 
            onClick={onTogglePlay} 
            className={`pixel-btn flex-1 py-1.5 text-[10px] font-bold text-center ${
              isPlaying ? 'bg-pixel-goldenSun text-black' : 'bg-pixel-sunsetOrange text-black'
            }`}
          >
            {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
          </button>
          <button 
            onClick={onNextTrack} 
            className="pixel-btn bg-pixel-purple text-white px-2.5 py-1.5 text-[10px]" 
            title="Next Track"
          >
            ⏭
          </button>
          <button 
            onClick={onToggleMute} 
            className="pixel-btn bg-pixel-darkPurple text-white px-2.5 py-1.5 text-[10px]" 
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>
    </div>
  );
}
