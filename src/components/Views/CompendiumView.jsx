import React, { useState } from 'react';
import { FISH_DATABASE } from '../../data/gameData';

export default function CompendiumView({ compendium, audio }) {
  const [filterRarity, setFilterRarity] = useState('all');

  const caughtIds = Object.keys(compendium);
  const totalSpecies = FISH_DATABASE.length;
  const caughtSpeciesCount = caughtIds.length;
  const progressPercent = Math.round((caughtSpeciesCount / totalSpecies) * 100);

  const filteredList = filterRarity === 'all'
    ? FISH_DATABASE
    : FISH_DATABASE.filter(f => f.rarity === filterRarity);

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="pixel-box bg-[#1a1c38] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐟</span>
          <div>
            <h2 className="text-base text-pixel-goldenSun">ENSIKLOPEDIA & BUKU KOLEKSI SAMUDRA</h2>
            <p className="font-retro text-base text-pixel-sand">
              Catatan lengkap seluruh spesies ikan dan harta karun perairan pantai senja.
            </p>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="bg-black/60 p-3 border-2 border-pixel-purple flex items-center gap-3">
          <div className="text-right">
            <span className="text-[8px] text-pixel-sand block font-mono">KOLEKSI DITEMUKAN:</span>
            <span className="text-xs text-amber-300 font-bold font-pixel">
              {caughtSpeciesCount} / {totalSpecies} ({progressPercent}%)
            </span>
          </div>

          <div className="w-16 h-3 bg-black border border-white/20">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-pixel-goldenSun"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Rarity Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'SEMUA' },
          { id: 'common', label: 'BIASA' },
          { id: 'rare', label: 'LANGKA' },
          { id: 'epic', label: 'EPIK' },
          { id: 'legendary', label: 'LEGENDARIS' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              audio.playBeep(450, 0.04);
              setFilterRarity(tab.id);
            }}
            className={`pixel-btn text-[10px] px-3 py-1.5 font-bold ${
              filterRarity === tab.id 
                ? 'bg-pixel-sunsetOrange text-black' 
                : 'bg-pixel-darkPurple text-pixel-sand hover:bg-pixel-navy'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Compendium Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredList.map((fish) => {
          const isCaught = Boolean(compendium[fish.id]);
          const record = compendium[fish.id] || {};

          return (
            <div 
              key={fish.id}
              className={`pixel-box p-3 flex flex-col justify-between transition-all ${
                isCaught 
                  ? 'bg-pixel-navy border-black' 
                  : 'bg-[#121320] border-[#25283c] opacity-60'
              }`}
            >
              <div>
                {/* Rarity & ID Badge */}
                <div className="flex items-center justify-between text-[8px] font-pixel mb-2">
                  <span className={`px-1.5 py-0.5 border ${isCaught ? fish.rarityColor : 'text-gray-500 border-gray-700 bg-black/40'}`}>
                    {fish.rarityLabel}
                  </span>
                  <span className="text-pixel-lavender/60">
                    #{fish.id.slice(0, 7)}
                  </span>
                </div>

                {/* Creature Visual */}
                <div className="text-center py-2">
                  {isCaught ? (
                    <div className="text-5xl filter drop-shadow-[0_2px_0_#000] animate-fade-in">
                      {fish.icon}
                    </div>
                  ) : (
                    <div className="text-5xl opacity-20 filter blur-[1px]">
                      ❓
                    </div>
                  )}
                </div>

                {/* Title */}
                <div className="text-center mt-1">
                  <h4 className="text-xs font-bold font-pixel text-white">
                    {isCaught ? fish.name : '??? Belum Ditemukan'}
                  </h4>
                  <div className="font-retro text-sm text-pixel-lavender italic">
                    {isCaught ? fish.latin : 'Perairan belum dijelajahi'}
                  </div>
                </div>

                {/* Description / Lore */}
                <p className="mt-2 text-xs font-retro text-pixel-sand leading-tight">
                  {isCaught ? fish.description : 'Pancing di waktu senja dengan umpan yang sesuai untuk menemukan makhluk ini.'}
                </p>
              </div>

              {/* Recorded stats */}
              <div className="mt-3 pt-2 border-t border-white/10 text-[9px] font-retro flex justify-between text-pixel-sand">
                {isCaught ? (
                  <>
                    <span>Tertangkap: <strong className="text-amber-300">{record.count || 1}x</strong></span>
                    <span>Max: <strong className="text-cyan-300">{record.maxWeight || fish.minWeight} kg</strong></span>
                  </>
                ) : (
                  <span className="text-stone-500 italic text-center w-full">Koleksi Terkunci</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
