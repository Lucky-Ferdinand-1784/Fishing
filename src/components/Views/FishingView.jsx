import React, { useState, useEffect, useRef } from 'react';
import { FISH_DATABASE, SHOP_ITEMS } from '../../data/gameData';

export default function FishingView({
  player,
  inventory,
  onConsumeStamina,
  onAddCatch,
  onGainExp,
  onGainCoins,
  onUpdateQuestProgress,
  audio,
  showToast
}) {
  // State: 'idle' | 'waiting' | 'bite' | 'reeling' | 'result'
  const [phase, setPhase] = useState('idle');
  const [biteTimer, setBiteTimer] = useState(null);
  const [currentFish, setCurrentFish] = useState(null);
  const [catchResult, setCatchResult] = useState(null);

  // Timing minigame state
  const [reelPosition, setReelPosition] = useState(0); // 0 to 100
  const reelDirectionRef = useRef(1);
  const reelAnimRef = useRef(null);

  const equippedRod = SHOP_ITEMS.find(item => item.id === player.equippedRod) || SHOP_ITEMS[0];
  const equippedBait = SHOP_ITEMS.find(item => item.id === player.equippedBait) || SHOP_ITEMS[4];

  // Animate the tension slider when in 'reeling' phase
  useEffect(() => {
    if (phase === 'reeling') {
      let pos = 10;
      const speed = 2.2 + (currentFish ? currentFish.difficulty * 0.8 : 1);
      
      const interval = setInterval(() => {
        setReelPosition(prev => {
          let next = prev + speed * reelDirectionRef.current;
          if (next >= 95) {
            reelDirectionRef.current = -1;
            next = 95;
          } else if (next <= 5) {
            reelDirectionRef.current = 1;
            next = 5;
          }
          return next;
        });
      }, 20);

      return () => clearInterval(interval);
    }
  }, [phase, currentFish]);

  // Cast rod action
  const handleCast = () => {
    if (player.stamina < 10) {
      showToast('❌ Stamina tidak cukup! Istirahatlah di Api Unggun.');
      audio.playBeep(220, 0.15, 'sawtooth');
      return;
    }

    onConsumeStamina(10);
    audio.playCast();
    setPhase('waiting');
    setCatchResult(null);

    // Pick random fish based on rod & bait bonuses
    const rareBonus = (equippedRod.bonusRare || 0) + (equippedBait.bonusRare || 0);
    const roll = Math.random() * 100;

    let pool = FISH_DATABASE.filter(f => f.rarity === 'common');
    if (roll + rareBonus > 88) {
      pool = FISH_DATABASE.filter(f => f.rarity === 'legendary' || f.rarity === 'epic');
    } else if (roll + rareBonus > 55) {
      pool = FISH_DATABASE.filter(f => f.rarity === 'rare' || f.rarity === 'epic');
    }

    const selectedFish = pool[Math.floor(Math.random() * pool.length)] || FISH_DATABASE[0];
    setCurrentFish(selectedFish);

    // Random wait time before bite (1.8s - 3.8s)
    const delay = Math.max(1200, 3200 - (equippedRod.bonusCatch || 0) * 20);
    const timer = setTimeout(() => {
      audio.playSplash();
      setTimeout(() => {
        audio.playBiteAlert();
        setPhase('bite');
      }, 200);
    }, delay);

    setBiteTimer(timer);
  };

  // When player clicks "TARIK / HOOK" on bite
  const handleHook = () => {
    if (phase !== 'bite') return;
    audio.playBeep(720, 0.08);
    setPhase('reeling');
  };

  // Stop tension slider in reel minigame
  const handleReelAttempt = () => {
    if (phase !== 'reeling' || !currentFish) return;

    // Green zone is between 35% and 65%
    const inSweetSpot = reelPosition >= 36 && reelPosition <= 64;
    const inYellowZone = reelPosition >= 20 && reelPosition <= 80;

    if (inSweetSpot || inYellowZone) {
      // SUCCESS CATCH
      const isPerfect = inSweetSpot;
      const weightBonus = (Math.random() * (currentFish.maxWeight - currentFish.minWeight)).toFixed(2);
      const finalWeight = (parseFloat(currentFish.minWeight) + parseFloat(weightBonus)).toFixed(2);
      const coinMultiplier = isPerfect ? 1.3 : 1.0;
      const expMultiplier = isPerfect ? 1.4 : 1.0;

      const finalCoins = Math.round(currentFish.basePrice * coinMultiplier);
      const finalExp = Math.round(currentFish.exp * expMultiplier);

      audio.playCatchSuccess();

      const result = {
        fish: currentFish,
        weight: finalWeight,
        isPerfect,
        coinsEarned: finalCoins,
        expEarned: finalExp,
      };

      setCatchResult(result);
      setPhase('result');

      // Update state in App
      onAddCatch(currentFish, finalWeight);
      onGainExp(finalExp);
      onGainCoins(finalCoins);
      onUpdateQuestProgress('q1', 1); // Tangkapan pertama
      onUpdateQuestProgress('q2', 1); // Koleksi
      onUpdateQuestProgress('q3', 1); // Nelayan handal
      if (currentFish.rarity === 'rare' || currentFish.rarity === 'epic' || currentFish.rarity === 'legendary') {
        onUpdateQuestProgress('q4', 1); // Harta karun / langka
      }

      showToast(`🎣 Tangkapan Berhasil: ${currentFish.name}! (+${finalCoins} 🪙, +${finalExp} EXP)`);
    } else {
      // ESCAPED
      audio.playBeep(240, 0.25, 'sawtooth');
      setCatchResult({
        escaped: true,
        fish: currentFish
      });
      setPhase('result');
      showToast('💦 Kail terlepas! Ikan meloloskan diri ke laut dalam.');
    }
  };

  const handleReset = () => {
    setPhase('idle');
    setCatchResult(null);
    setCurrentFish(null);
  };

  return (
    <div className="space-y-4">
      {/* Fishing Header Panel */}
      <div className="pixel-box bg-[#1a1c38] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎣</span>
            <div>
              <h2 className="text-base text-pixel-goldenSun">DERMAGA PEMANCINGAN SENJA</h2>
              <p className="font-retro text-base text-pixel-sand">
                Lemparkan kail ke samudra jingga dan tarik ikan saat umpan disambar!
              </p>
            </div>
          </div>
        </div>

        {/* Current Equipment Badges */}
        <div className="flex items-center gap-2 bg-black/50 p-2 border border-pixel-purple">
          <div className="text-[9px]">
            <span className="text-pixel-lavender block text-[8px]">JORAN AKTIF:</span>
            <span className="text-amber-300 font-bold">{equippedRod.icon} {equippedRod.name}</span>
          </div>
          <div className="h-6 w-px bg-white/20 mx-1" />
          <div className="text-[9px]">
            <span className="text-pixel-lavender block text-[8px]">UMPAN:</span>
            <span className="text-cyan-300 font-bold">{equippedBait.icon} {equippedBait.name}</span>
          </div>
        </div>
      </div>

      {/* Main Fishing Interactive Arena */}
      <div className="pixel-box bg-gradient-to-b from-[#1b1e3f] via-[#2d2244] to-[#162738] p-6 text-center min-h-[340px] flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Ambient Wave Graphic */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0e1d2c] to-transparent pointer-events-none opacity-80" />

        {/* PHASE 1: IDLE */}
        {phase === 'idle' && (
          <div className="space-y-4 max-w-md animate-fade-in z-10">
            <div className="text-6xl animate-bounce" style={{ animationDuration: '3s' }}>
              🌊
            </div>
            <div>
              <h3 className="text-sm text-pixel-goldenSun">PERAIRAN SIAP DIPANCING</h3>
              <p className="font-retro text-lg text-pixel-sand mt-1">
                Kondisi laut tenang. Ikan-ikan perairan senja sedang aktif mencari makan.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCast}
                className="pixel-btn bg-pixel-sunsetOrange hover:bg-amber-400 text-black font-bold text-xs px-6 py-3 shadow-lg"
              >
                🎣 LEMPAR KAIL (KONSUMSI 10 ENERGI)
              </button>
            </div>

            <div className="text-[9px] text-pixel-lavender font-mono">
              ⚡ Sisa Energi: {player.stamina}% • Peluang Langka: +{(equippedRod.bonusRare || 0) + (equippedBait.bonusRare || 0)}%
            </div>
          </div>
        )}

        {/* PHASE 2: WAITING FOR BITE */}
        {phase === 'waiting' && (
          <div className="space-y-3 z-10 animate-fade-in">
            {/* Animated bobber on water */}
            <div className="relative inline-block my-4">
              <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-black animate-bounce mx-auto shadow-[0_4px_0_#000]" style={{ animationDuration: '1.2s' }}>
                <div className="w-full h-1/2 bg-white rounded-t-full" />
              </div>
              <div className="w-16 h-2 bg-cyan-400/40 rounded-full blur-xs mx-auto mt-2 animate-ping" />
            </div>

            <h3 className="text-sm text-amber-300 animate-pulse">
              MENUNGGU SAMBARAN IKAN...
            </h3>
            <p className="font-retro text-lg text-pixel-sand">
              Tetap waspada! Bersiaplah mengklik tombol saat tanda seru muncul.
            </p>
          </div>
        )}

        {/* PHASE 3: BITE ALERT */}
        {phase === 'bite' && (
          <div className="space-y-3 z-10 animate-bounce">
            <div className="text-6xl text-red-500 font-pixel filter drop-shadow-[0_0_12px_#ff0000]">
              ❗❗
            </div>
            <h3 className="text-base text-yellow-300 font-bold uppercase tracking-wider animate-pulse">
              UMPAN DISAMBAR! IKAN MEMAKAN!
            </h3>
            <div className="pt-2">
              <button
                onClick={handleHook}
                className="pixel-btn bg-red-600 hover:bg-red-500 text-white font-bold text-sm px-8 py-3 shadow-[0_0_15px_#ff4400] animate-pulse"
              >
                ⚡ TARIK SEKARANG! (HOOK)
              </button>
            </div>
          </div>
        )}

        {/* PHASE 4: REELING TIMING MINIGAME */}
        {phase === 'reeling' && (
          <div className="space-y-4 max-w-lg w-full z-10 animate-fade-in">
            <div>
              <span className="text-2xl animate-spin inline-block">🌀</span>
              <h3 className="text-sm text-pixel-goldenSun mt-1">TARIK JORAN DENGAN TIMING TEPAT!</h3>
              <p className="font-retro text-base text-pixel-sand">
                Hentikan jarum saat berada di zona HIJAU (PERFECT) atau KUNING!
              </p>
            </div>

            {/* Tension Meter Bar */}
            <div className="w-full bg-black h-10 border-4 border-black relative p-1 shadow-[inset_0_2px_4px_#000]">
              {/* Red Zone Left */}
              <div className="absolute top-1 bottom-1 left-1 w-[20%] bg-red-800/80 border-r border-black" />
              {/* Yellow Zone Left */}
              <div className="absolute top-1 bottom-1 left-[20%] w-[16%] bg-yellow-600/80 border-r border-black" />
              {/* Green Sweet Spot Center */}
              <div className="absolute top-1 bottom-1 left-[36%] w-[28%] bg-emerald-500 border-x-2 border-black flex items-center justify-center">
                <span className="text-[8px] text-black font-bold font-pixel tracking-wider">PERFECT!</span>
              </div>
              {/* Yellow Zone Right */}
              <div className="absolute top-1 bottom-1 left-[64%] w-[16%] bg-yellow-600/80 border-l border-black" />
              {/* Red Zone Right */}
              <div className="absolute top-1 bottom-1 right-1 w-[20%] bg-red-800/80 border-l border-black" />

              {/* Oscillating Slider Needle */}
              <div 
                className="absolute top-0 bottom-0 w-3 bg-white border-2 border-black shadow-[0_0_8px_#fff] z-20 -ml-1.5 transition-none"
                style={{ left: `${reelPosition}%` }}
              />
            </div>

            {/* Hit Button */}
            <button
              onClick={handleReelAttempt}
              className="pixel-btn bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm px-8 py-3 w-full shadow-[0_4px_0_#000]"
            >
              🎯 TEKAN UNTUK MENGANGKAT IKAN!
            </button>
          </div>
        )}

        {/* PHASE 5: CATCH RESULT POPUP */}
        {phase === 'result' && catchResult && (
          <div className="pixel-box bg-[#141528] border-pixel-purple p-5 max-w-md w-full z-10 animate-fade-in">
            {catchResult.escaped ? (
              <div className="space-y-3">
                <div className="text-5xl">💨</div>
                <h3 className="text-sm text-red-400">IKAN BERHASIL MELARIKAN DIRI!</h3>
                <p className="font-retro text-lg text-pixel-sand">
                  Tarikannya terlalu kuat atau timing tarikan terlewat. Cobalah gunakan Joran yang lebih tangguh!
                </p>
                <button
                  onClick={handleReset}
                  className="pixel-btn bg-pixel-sunsetOrange text-black font-bold text-xs px-5 py-2 mt-2"
                >
                  🔄 COBA LAGI
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Rarity & Header */}
                <div className="flex items-center justify-between border-b border-white/20 pb-2">
                  <span className={`text-[9px] px-2 py-0.5 border font-bold uppercase ${catchResult.fish.rarityColor}`}>
                    {catchResult.fish.rarityLabel}
                  </span>
                  {catchResult.isPerfect && (
                    <span className="text-[9px] text-amber-300 font-pixel animate-pulse">
                      ✨ PERFECT HOOK (+BONUS)
                    </span>
                  )}
                </div>

                {/* Creature Visual */}
                <div className="text-6xl py-1 filter drop-shadow-[0_4px_0_#000]">
                  {catchResult.fish.icon}
                </div>

                <div>
                  <h3 className="text-base text-pixel-goldenSun">{catchResult.fish.name}</h3>
                  <div className="font-retro text-base text-pixel-lavender italic">
                    {catchResult.fish.latin}
                  </div>
                </div>

                {/* Weight & Stats */}
                <div className="grid grid-cols-3 gap-2 bg-black/60 p-2.5 border border-pixel-purple text-center">
                  <div>
                    <span className="text-[8px] text-pixel-sand block">BERAT</span>
                    <span className="text-xs text-white font-bold">{catchResult.weight} kg</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-pixel-sand block">NILAI</span>
                    <span className="text-xs text-amber-300 font-bold">+{catchResult.coinsEarned} 🪙</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-pixel-sand block">EXP</span>
                    <span className="text-xs text-emerald-400 font-bold">+{catchResult.expEarned}</span>
                  </div>
                </div>

                <p className="font-retro text-sm text-pixel-sand px-2">
                  "{catchResult.fish.description}"
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleReset}
                    className="pixel-btn flex-1 bg-pixel-sunsetOrange hover:bg-amber-400 text-black font-bold text-xs py-2.5"
                  >
                    🎣 PANCING LAGI
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
