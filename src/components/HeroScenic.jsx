import React, { useState, useEffect } from 'react';
import bgImage from '../assets/background.jpg';

const SPEECH_LINES = [
  "Ombaknya begitu tenang dan damai...",
  "Matahari senja ini sungguh menakjubkan!",
  "Waktunya melempar kail dan menangkap ikan langka!",
  "Hangatnya pasir pantai di sore hari...",
  "Semoga ada peti harta karun yang hanyut!",
  "Angin laut berhembus lembut..."
];

export default function HeroScenic({
  player,
  onStartFishing,
  onRestCampfire,
  onOpenShop,
  onFindShell,
  onOpenChest,
  chestOpened,
  audio
}) {
  const [speech, setSpeech] = useState("Selamat datang di Teluk Senja!");
  const [charPos, setCharPos] = useState({ x: 38, y: 80 }); // percentage
  const [isWalking, setIsWalking] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('sunset'); // 'sunset', 'twilight', 'night'

  // Change character speech periodically
  useEffect(() => {
    const timer = setInterval(() => {
      const line = SPEECH_LINES[Math.floor(Math.random() * SPEECH_LINES.length)];
      setSpeech(line);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const handleStageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    // Keep character mostly in the lower beach area (y between 70% and 92%)
    const clampedY = Math.min(92, Math.max(72, y));
    const clampedX = Math.min(88, Math.max(10, x));

    setIsWalking(true);
    audio.playBeep(320, 0.04);
    setCharPos({ x: clampedX, y: clampedY });
    setTimeout(() => setIsWalking(false), 500);
  };

  return (
    <section className="pixel-box bg-pixel-navy p-3 md:p-5 relative overflow-hidden">
      {/* Stage Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b-2 border-pixel-purple pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-pulse">🌅</span>
          <div>
            <div className="text-[9px] text-pixel-sunsetOrange uppercase tracking-widest flex items-center gap-1.5">
              <span>TELUK SENJA ABADI</span>
              <span className="text-emerald-400 font-mono text-[8px]">• LIVE RETRO STAGE</span>
            </div>
            <h2 className="text-sm md:text-base text-pixel-goldenSun">
              SUNSET COVE & HARBOR
            </h2>
          </div>
        </div>

        {/* Atmosphere Controls & Chime */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              audio.playChime();
              setSpeech("✨ Menikmati semilir lonceng senja!");
            }} 
            className="pixel-btn bg-pixel-duskRose hover:bg-pixel-sunsetOrange text-white text-[9px] px-2.5 py-1.5 flex items-center gap-1"
          >
            <span>🔔</span> LONCENG PANTAI
          </button>
          
          <button
            onClick={() => {
              audio.playBeep(480, 0.05);
              setTimeOfDay(prev => prev === 'sunset' ? 'twilight' : prev === 'twilight' ? 'night' : 'sunset');
            }}
            className="pixel-btn bg-pixel-darkPurple text-pixel-sand text-[9px] px-2 py-1.5"
            title="Ubah Filter Suasana Senja"
          >
            {timeOfDay === 'sunset' ? '🌇 SENJA' : timeOfDay === 'twilight' ? '🌆 REMANG' : '🌃 MALAM'}
          </button>
        </div>
      </div>

      {/* The Scenic Pixel Art Canvas Viewport */}
      <div 
        onClick={handleStageClick}
        className="relative w-full h-72 sm:h-96 rounded-none border-4 border-black overflow-hidden shadow-[0_6px_0_#000] cursor-crosshair select-none group"
      >
        {/* Real Pixel Art Scenery Image */}
        <img 
          src={bgImage} 
          alt="Sunset Pixel Beach" 
          className={`w-full h-full object-cover transition-filter duration-700 ${
            timeOfDay === 'twilight' ? 'brightness-75 contrast-110 hue-rotate-15' : 
            timeOfDay === 'night' ? 'brightness-50 contrast-125 saturate-75 hue-rotate-30' : ''
          }`}
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Ambient Twinkling Stars in Twilight / Night */}
        {(timeOfDay === 'twilight' || timeOfDay === 'night') && (
          <div className="absolute inset-0 pointer-events-none">
            <span className="absolute top-6 left-1/4 text-white text-xs animate-ping">✦</span>
            <span className="absolute top-12 left-1/2 text-amber-200 text-xs animate-pulse">✧</span>
            <span className="absolute top-8 right-1/4 text-cyan-200 text-xs animate-ping">✦</span>
            <span className="absolute top-16 right-10 text-white text-[10px] animate-pulse">✧</span>
          </div>
        )}

        {/* Floating Animated Pixel Boat on the Water */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onOpenShop();
            audio.playCoinSound();
          }}
          className="absolute top-[48%] left-[28%] sm:left-[35%] cursor-pointer transform hover:scale-110 transition-transform z-10 group/boat animate-bounce"
          style={{ animationDuration: '3.5s' }}
          title="Klik Perahu: Kunjungi Pasar Pesisir Nelayan"
        >
          <div className="relative">
            <span className="text-3xl filter drop-shadow-[0_2px_0_#000]">⛵</span>
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black/85 text-pixel-goldenSun text-[8px] px-1.5 py-0.5 border border-amber-400 whitespace-nowrap opacity-0 group-hover/boat:opacity-100 transition-opacity">
              WARUNG PELAUT
            </div>
          </div>
        </div>

        {/* INTERACTIVE HOTSPOTS ON THE WORLD */}
        
        {/* Hotspot 1: Dermaga Mancing (Fishing Pier) */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onStartFishing();
          }}
          className="absolute top-[58%] right-[18%] sm:right-[24%] z-10 cursor-pointer group/pier"
          title="Klik untuk Mulai Memancing!"
        >
          <div className="pixel-btn bg-pixel-sunsetOrange text-black text-[9px] px-2 py-1 font-bold flex items-center gap-1 shadow-lg animate-pulse">
            <span>🎣</span>
            <span className="hidden sm:inline">SPOT MANCING</span>
          </div>
        </div>

        {/* Hotspot 2: Api Unggun Pantai (Campfire) */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onRestCampfire();
          }}
          className="absolute bottom-[10%] left-[12%] z-10 cursor-pointer group/fire"
          title="Klik Api Unggun: Istirahat & Pulihkan Stamina"
        >
          <div className="relative flex flex-col items-center">
            {/* Animated Smoke particle */}
            <span className="text-xs text-white/50 -mb-1 animate-pulse">~</span>
            <span className="text-2xl filter drop-shadow-[0_0_8px_#ff7700]">🔥</span>
            <div className="bg-black/90 text-amber-300 text-[8px] px-1.5 py-0.5 border border-amber-600 mt-0.5 font-pixel whitespace-nowrap">
              API UNGGUN
            </div>
          </div>
        </div>

        {/* Hotspot 3: Peti Karang Misterius (Treasure Chest) */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onOpenChest();
          }}
          className="absolute bottom-[14%] right-[10%] z-10 cursor-pointer group/chest"
          title="Klik Peti Karang untuk Mencari Harta Karun!"
        >
          <div className="relative flex flex-col items-center">
            <span className={`text-2xl filter drop-shadow-[0_2px_0_#000] ${chestOpened ? 'opacity-70' : 'animate-bounce'}`}>
              {chestOpened ? '📭' : '📦'}
            </span>
            <div className="bg-black/90 text-amber-200 text-[8px] px-1.5 py-0.5 border border-yellow-500 mt-0.5 font-pixel whitespace-nowrap">
              {chestOpened ? 'PETI KOSONG' : 'PETI HARTA'}
            </div>
          </div>
        </div>

        {/* WALKING PLAYER AVATAR ON THE SHORE */}
        <div 
          className="absolute z-20 pointer-events-none transition-all duration-500 ease-out flex flex-col items-center"
          style={{ 
            left: `${charPos.x}%`, 
            top: `${charPos.y}%`,
            transform: 'translate(-50%, -75%)'
          }}
        >
          {/* Speech Bubble */}
          <div className="bg-black/90 text-amber-200 border-2 border-pixel-goldenSun px-2 py-1 text-[9px] mb-1 font-retro rounded-none max-w-[180px] text-center shadow-[2px_2px_0_#000] animate-fade-in">
            {speech}
          </div>

          {/* Avatar Icon */}
          <div className={`text-3xl filter drop-shadow-[0_4px_0_#000] ${isWalking ? 'animate-bounce' : ''}`}>
            {player.avatar}
          </div>

          {/* Player Name Tag */}
          <div className="bg-black/80 text-pixel-goldenSun text-[7px] px-1 border border-black font-pixel mt-0.5">
            {player.name}
          </div>
        </div>

        {/* Stage Hint Footer Inside Viewport */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/75 px-3 py-1 border border-white/20 text-[8px] text-pixel-sand font-retro hidden sm:block pointer-events-none">
          💡 Klik di area pasir pantai untuk menggerakkan karakter
        </div>
      </div>

      {/* Quick Action Dock Buttons Below Stage */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
        <button
          onClick={onStartFishing}
          className="pixel-btn bg-pixel-sunsetOrange text-black font-bold text-[10px] p-2 flex items-center justify-center gap-1.5"
        >
          <span>🎣</span>
          <span>MEMANCING</span>
        </button>

        <button
          onClick={onRestCampfire}
          className="pixel-btn bg-amber-800 hover:bg-amber-700 text-amber-100 text-[10px] p-2 flex items-center justify-center gap-1.5"
        >
          <span>🔥</span>
          <span>ISTIRAHAT (+25)</span>
        </button>

        <button
          onClick={onFindShell}
          className="pixel-btn bg-[#2a2e52] hover:bg-[#343966] text-pixel-sand text-[10px] p-2 flex items-center justify-center gap-1.5"
        >
          <span>🐚</span>
          <span>CARI KERANG</span>
        </button>

        <button
          onClick={onOpenShop}
          className="pixel-btn bg-pixel-purple hover:bg-pixel-darkPurple text-pixel-goldenSun text-[10px] p-2 flex items-center justify-center gap-1.5"
        >
          <span>🏪</span>
          <span>PASAR PELAUT</span>
        </button>
      </div>
    </section>
  );
}
