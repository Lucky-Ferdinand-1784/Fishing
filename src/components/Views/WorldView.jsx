import React from 'react';

export default function WorldView({
  player,
  quests,
  onSwitchTab,
  onRestCampfire,
  onFindShell,
  audio,
  showToast
}) {
  const activeQuest = quests.find(q => !q.claimed);

  return (
    <div className="space-y-4">
      {/* 3 Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Waktu Senja & Cuaca */}
        <div className="pixel-box bg-pixel-darkPurple p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-pixel-goldenSun mb-2">
              <span className="flex items-center gap-1">
                <span>🌇</span> WAKTU SENJA
              </span>
              <span className="font-mono text-[10px] text-amber-300">17:48 WIB</span>
            </div>
            <p className="font-retro text-2xl text-white">
              Matahari jingga keemasan perlahan menyentuh bibir samudra.
            </p>
          </div>

          <div className="mt-3 text-[10px] text-pixel-sand bg-black/50 p-2 border border-black font-retro space-y-0.5">
            <div>Suhu: 26°C • Angin Sejuk Pantai</div>
            <div className="text-emerald-400">Status Ombak: Tenang (Ideal untuk Memancing)</div>
          </div>
        </div>

        {/* Card 2: Status Petualang & Energi */}
        <div className="pixel-box bg-pixel-navy p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-pixel-sunsetOrange mb-2">
              <span className="flex items-center gap-1">
                <span>⚡</span> ENERGI & STAMINA
              </span>
              <span className="font-mono text-emerald-400">{player.stamina} / {player.maxStamina}</span>
            </div>
            <p className="font-retro text-2xl text-pixel-sand">
              {player.stamina > 30 
                ? 'Tubuhmu bugar dan siap menjelajah laut senja!' 
                : 'Energi menipis! Beristirahatlah di api unggun pantai.'}
            </p>
          </div>

          <button 
            onClick={onRestCampfire} 
            className="mt-3 w-full pixel-btn bg-amber-700 hover:bg-amber-600 text-white text-[10px] py-2 font-bold flex items-center justify-center gap-1.5"
          >
            <span>🔥</span> ISTIRAHAT DI API UNGGUN (+25 ENERGI)
          </button>
        </div>

        {/* Card 3: Misi Aktif Terdekat */}
        <div className="pixel-box bg-[#1b2b3a] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-emerald-400 mb-2">
              <span className="flex items-center gap-1">
                <span>📜</span> MISI AKTIF
              </span>
              <span className="font-mono text-[10px] text-amber-300">
                {activeQuest ? `${activeQuest.current}/${activeQuest.target}` : 'SELESAI'}
              </span>
            </div>
            <p className="font-retro text-2xl text-emerald-100">
              {activeQuest ? activeQuest.title : 'Semua misi pantai telah tuntas diselesaikan!'}
            </p>
          </div>

          <button 
            onClick={() => onSwitchTab('quests')} 
            className="mt-3 w-full pixel-btn bg-pixel-goldenSun text-black text-[10px] py-2 font-bold flex items-center justify-center gap-1.5"
          >
            <span>📋</span> BUKA PAPAN MISI
          </button>
        </div>
      </div>

      {/* Beach Exploration Quick Actions Section */}
      <div className="pixel-box bg-[#15172d] p-4">
        <h3 className="text-xs text-pixel-goldenSun mb-3 uppercase tracking-wider flex items-center gap-1.5">
          <span>🏖️</span> AKTIVITAS JELAJAH PESISIR
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div 
            onClick={() => onSwitchTab('fishing')}
            className="pixel-btn bg-[#1d1f3b] hover:bg-[#282a50] p-3 cursor-pointer text-left flex items-start gap-3"
          >
            <span className="text-3xl">🎣</span>
            <div>
              <div className="text-xs font-bold text-pixel-goldenSun">Dermaga Pancing</div>
              <p className="font-retro text-sm text-pixel-sand mt-0.5">
                Lemparkan kail ke air laut dan uji refleksmu menangkap ikan langka.
              </p>
            </div>
          </div>

          <div 
            onClick={onFindShell}
            className="pixel-btn bg-[#1d1f3b] hover:bg-[#282a50] p-3 cursor-pointer text-left flex items-start gap-3"
          >
            <span className="text-3xl">🐚</span>
            <div>
              <div className="text-xs font-bold text-cyan-300">Menyusuri Bibir Pantai</div>
              <p className="font-retro text-sm text-pixel-sand mt-0.5">
                Kumpulkan kerang hias, kaca laut, atau koin yang tersapu ombak pantai.
              </p>
            </div>
          </div>

          <div 
            onClick={() => onSwitchTab('shop')}
            className="pixel-btn bg-[#1d1f3b] hover:bg-[#282a50] p-3 cursor-pointer text-left flex items-start gap-3"
          >
            <span className="text-3xl">🏪</span>
            <div>
              <div className="text-xs font-bold text-amber-300">Warung Pelaut Bartholomew</div>
              <p className="font-retro text-sm text-pixel-sand mt-0.5">
                Tukarkan ikan hasil tangkapan menjadi Kerang Emas & upgrade joranmu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
