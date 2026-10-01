import React from 'react';

export default function HeaderGame({
  player,
  onToggleSidebar,
  isSidebarOpen,
  audioState,
  onRestCampfire
}) {
  const expPercent = Math.min(100, Math.round((player.exp / player.maxExp) * 100));
  const staminaPercent = Math.min(100, Math.round((player.stamina / player.maxStamina) * 100));

  return (
    <header className="bg-[#121324] border-b-4 border-black px-3 py-2.5 sticky top-0 z-30 shadow-[0_4px_0_#000]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden pixel-btn bg-pixel-sunsetOrange text-black px-2.5 py-1.5 text-xs font-bold"
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? '✖' : '☰ MENU'}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xl filter drop-shadow-[0_2px_0_#000]">🌅</span>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-pixel-goldenSun tracking-wider">PIXEL COAST</span>
              <span className="text-[10px] text-pixel-lavender ml-1 font-retro uppercase">RPG V1.0</span>
            </div>
          </div>
        </div>

        {/* Center: Game Stats HUD (Stamina, EXP, Level) */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-1">
          {/* Level Badge */}
          <div className="pixel-box bg-[#221c38] px-2 py-1 flex items-center gap-1.5 border-pixel-purple flex-shrink-0">
            <span className="text-[9px] text-pixel-goldenSun">LVL</span>
            <span className="text-xs font-bold text-white">{player.level}</span>
          </div>

          {/* EXP Bar */}
          <div className="hidden md:flex flex-col w-28 sm:w-36 flex-shrink-0">
            <div className="flex justify-between text-[8px] text-pixel-sand mb-0.5">
              <span>EXP</span>
              <span>{player.exp}/{player.maxExp}</span>
            </div>
            <div className="h-2.5 w-full bg-black border-2 border-black">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pixel-sunsetOrange transition-all duration-300"
                style={{ width: `${expPercent}%` }}
              />
            </div>
          </div>

          {/* Stamina Bar */}
          <div className="flex flex-col w-24 sm:w-32 flex-shrink-0">
            <div className="flex justify-between text-[8px] text-pixel-sand mb-0.5">
              <span className="text-amber-300 flex items-center gap-0.5">⚡ ENERGI</span>
              <span>{player.stamina}%</span>
            </div>
            <div className="h-2.5 w-full bg-black border-2 border-black">
              <div 
                className={`h-full transition-all duration-300 ${
                  player.stamina > 30 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-400' 
                    : 'bg-red-500 animate-pulse'
                }`}
                style={{ width: `${staminaPercent}%` }}
              />
            </div>
          </div>

          {/* Gold Shells Currency */}
          <div className="pixel-box bg-[#282012] border-amber-600 px-2.5 py-1 flex items-center gap-1.5 flex-shrink-0">
            <span className="text-sm">🪙</span>
            <span className="text-xs font-bold text-amber-300 font-pixel">{player.coins}</span>
            <span className="hidden sm:inline text-[8px] text-amber-200/70">KERANG</span>
          </div>
        </div>

        {/* Right: Quick Rest & Audio toggles */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onRestCampfire}
            title="Pulihkan Energi di Api Unggun"
            className="pixel-btn bg-amber-700 hover:bg-amber-600 text-white text-[9px] px-2 py-1.5 hidden sm:flex items-center gap-1"
          >
            <span>🔥</span> ISTIRAHAT
          </button>

          <button
            onClick={audioState.onToggleMute}
            className="pixel-btn bg-[#232742] text-pixel-sand text-xs px-2 py-1.5"
            title={audioState.isMuted ? "Aktifkan Suara" : "Bisukan Suara"}
          >
            {audioState.isMuted ? '🔇' : '🔊'}
          </button>
        </div>

      </div>
    </header>
  );
}
