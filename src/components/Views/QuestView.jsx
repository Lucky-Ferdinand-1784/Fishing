import React from 'react';

export default function QuestView({
  quests,
  onClaimQuest,
  audio
}) {
  const completedCount = quests.filter(q => q.completed || q.claimed).length;

  return (
    <div className="space-y-4">
      {/* Quest Board Header */}
      <div className="pixel-box bg-[#1b1c36] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📜</span>
          <div>
            <h2 className="text-base text-pixel-goldenSun">PAPAN MISI & TANTANGAN PESISIR</h2>
            <p className="font-retro text-base text-pixel-sand">
              Selesaikan tugas harian nelayan untuk mengumpulkan Kerang Emas dan EXP!
            </p>
          </div>
        </div>

        <div className="pixel-box bg-black/60 px-3 py-1.5 text-[10px] text-pixel-sand border-pixel-purple">
          PROGRES: <span className="text-emerald-400 font-bold">{completedCount} / {quests.length}</span> SELESAI
        </div>
      </div>

      {/* Quest Cards List */}
      <div className="space-y-3">
        {quests.map((quest) => {
          const isDone = quest.current >= quest.target;
          const progressPercent = Math.min(100, Math.round((quest.current / quest.target) * 100));

          return (
            <div 
              key={quest.id}
              className={`pixel-box p-4 transition-all ${
                quest.claimed 
                  ? 'bg-[#15162a] opacity-75 border-black' 
                  : isDone 
                    ? 'bg-gradient-to-r from-[#211a3c] to-[#342416] border-pixel-goldenSun shadow-[0_0_10px_#f7cd7933]' 
                    : 'bg-pixel-navy border-pixel-purple'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left: Icon, Title & Desc */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-black/60 border-2 border-black flex items-center justify-center text-2xl flex-shrink-0">
                    {quest.icon || '📜'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white font-pixel">{quest.title}</h4>
                      {isDone && !quest.claimed && (
                        <span className="text-[8px] bg-emerald-500 text-black px-1.5 py-0.5 font-bold animate-pulse">
                          SIAP KLAIM!
                        </span>
                      )}
                    </div>
                    <p className="font-retro text-base text-pixel-sand mt-0.5">
                      {quest.desc}
                    </p>

                    {/* Rewards Preview */}
                    <div className="flex items-center gap-3 mt-1.5 text-[9px] font-pixel">
                      <span className="text-amber-300">+{quest.rewardCoins} 🪙 Kerang</span>
                      <span className="text-emerald-400">+{quest.rewardExp} EXP</span>
                    </div>
                  </div>
                </div>

                {/* Right: Progress Bar & Claim Button */}
                <div className="sm:w-52 flex-shrink-0 space-y-2">
                  <div className="flex justify-between text-[9px] text-pixel-sand font-mono">
                    <span>PROGRES</span>
                    <span>{quest.current} / {quest.target} {quest.unit}</span>
                  </div>

                  <div className="h-3 w-full bg-black border-2 border-black">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        isDone ? 'bg-emerald-400' : 'bg-pixel-sunsetOrange'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {quest.claimed ? (
                    <div className="text-center font-retro text-sm text-emerald-400 font-bold py-1">
                      ✓ HADIAH TELAH DIAMBIL
                    </div>
                  ) : isDone ? (
                    <button
                      onClick={() => {
                        onClaimQuest(quest.id);
                        audio.playCoinSound();
                      }}
                      className="pixel-btn w-full bg-pixel-goldenSun hover:bg-amber-400 text-black font-bold text-[10px] py-1.5 animate-bounce shadow-md"
                    >
                      🎁 KLAIM HADIAH!
                    </button>
                  ) : (
                    <div className="text-center font-retro text-sm text-pixel-lavender py-1">
                      Sedang Berlangsung...
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
