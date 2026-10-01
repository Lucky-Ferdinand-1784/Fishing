import React, { useState } from 'react';
import { SHOP_ITEMS } from '../../data/gameData';

export default function InventoryView({
  player,
  inventory,
  onEquipRod,
  onEquipBait,
  onUseItem,
  onSellItem,
  audio,
  showToast
}) {
  const [selectedItem, setSelectedItem] = useState(inventory[0] || null);

  const equippedRod = SHOP_ITEMS.find(r => r.id === player.equippedRod) || SHOP_ITEMS[0];
  const equippedBait = SHOP_ITEMS.find(b => b.id === player.equippedBait) || SHOP_ITEMS[4];

  // Fill up to 16 slots for authentic RPG grid
  const TOTAL_SLOTS = 16;
  const gridSlots = Array.from({ length: TOTAL_SLOTS }, (_, i) => inventory[i] || null);

  const handleSelectItem = (item) => {
    if (!item) return;
    audio.playBeep(450, 0.04);
    setSelectedItem(item);
  };

  const handleUse = (item) => {
    if (!item) return;
    onUseItem(item);
    audio.playCoinSound();
  };

  const handleSell = (item) => {
    if (!item) return;
    onSellItem(item);
    audio.playCoinSound();
    // If last one sold, clear selection or pick first available
    setTimeout(() => {
      const remaining = inventory.filter(i => i.id !== item.id || i.count > 1);
      setSelectedItem(remaining[0] || null);
    }, 50);
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="pixel-box bg-[#1b1c38] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎒</span>
          <div>
            <h2 className="text-base text-pixel-goldenSun">TAS & PERLENGKAPAN PETUALANG</h2>
            <p className="font-retro text-base text-pixel-sand">
              Kelola hasil tangkapan laut, umpan, dan peralatan memancingmu.
            </p>
          </div>
        </div>

        <div className="pixel-box bg-black/60 px-3 py-1.5 text-[10px] text-pixel-sand border-pixel-purple">
          KAPASITAS: <span className="text-amber-300 font-bold">{inventory.length} / {TOTAL_SLOTS}</span> SLOT
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Equipment Bar & 16-Slot Inventory Grid */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Equipment Slots */}
          <div className="pixel-box bg-pixel-navy p-3.5">
            <h3 className="text-[10px] text-pixel-goldenSun mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
              <span>⚔️</span> PERLENGKAPAN AKTIF
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Rod Slot */}
              <div className="bg-[#121428] p-2.5 border-2 border-amber-600 flex items-center gap-2.5">
                <span className="text-2xl">{equippedRod.icon}</span>
                <div className="overflow-hidden">
                  <span className="text-[8px] text-amber-400 block font-pixel">JORAN PANCING</span>
                  <span className="text-[10px] text-white font-bold truncate block">{equippedRod.name}</span>
                  <span className="text-[8px] text-emerald-400 font-retro">+{equippedRod.bonusRare}% Langka</span>
                </div>
              </div>

              {/* Bait Slot */}
              <div className="bg-[#121428] p-2.5 border-2 border-cyan-600 flex items-center gap-2.5">
                <span className="text-2xl">{equippedBait.icon}</span>
                <div className="overflow-hidden">
                  <span className="text-[8px] text-cyan-400 block font-pixel">UMPAN AKTIF</span>
                  <span className="text-[10px] text-white font-bold truncate block">{equippedBait.name}</span>
                  <span className="text-[8px] text-cyan-200 font-retro">+{equippedBait.bonusRare}% Tarikan</span>
                </div>
              </div>

              {/* Charm / Relic Slot */}
              <div className="bg-[#121428] p-2.5 border-2 border-purple-600 flex items-center gap-2.5">
                <span className="text-2xl">{player.hasCharm ? '🧿' : '🔒'}</span>
                <div className="overflow-hidden">
                  <span className="text-[8px] text-purple-400 block font-pixel">JIMAT LAUT</span>
                  <span className="text-[10px] text-white font-bold truncate block">
                    {player.hasCharm ? 'Jimat Keberuntungan' : 'Belum Dimiliki'}
                  </span>
                  <span className="text-[8px] text-purple-300 font-retro">
                    {player.hasCharm ? '+20% Kerang Emas' : 'Beli di Pasar'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 16-Slot Grid Backpack */}
          <div className="pixel-box bg-pixel-darkPurple p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs text-pixel-goldenSun uppercase tracking-wider">
                ISI TAS PETUALANG
              </h3>
              <span className="font-retro text-sm text-pixel-sand">
                Klik item untuk melihat detail
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5">
              {gridSlots.map((slot, index) => {
                const isSelected = selectedItem && slot && selectedItem.id === slot.id;

                if (!slot) {
                  return (
                    <div 
                      key={`empty-${index}`}
                      className="aspect-square bg-black/40 border-2 border-dashed border-[#34355a] flex items-center justify-center text-[#444670] font-pixel text-[10px]"
                    >
                      {index + 1}
                    </div>
                  );
                }

                return (
                  <button
                    key={slot.id}
                    onClick={() => handleSelectItem(slot)}
                    className={`aspect-square pixel-btn p-1.5 flex flex-col items-center justify-between relative transition-none ${
                      isSelected 
                        ? 'bg-pixel-sunsetOrange border-white shadow-[0_0_8px_#ff9900]' 
                        : 'bg-[#181a34] border-black hover:bg-[#25284e]'
                    }`}
                  >
                    {/* Item count badge */}
                    {slot.count > 1 && (
                      <span className="absolute top-1 right-1 bg-black/90 text-amber-300 text-[8px] px-1 border border-black font-pixel">
                        x{slot.count}
                      </span>
                    )}

                    {/* Icon */}
                    <span className="text-2xl mt-1 filter drop-shadow-[0_2px_0_#000]">
                      {slot.icon}
                    </span>

                    {/* Name */}
                    <span className={`text-[8px] font-pixel truncate w-full text-center ${
                      isSelected ? 'text-black font-bold' : 'text-pixel-sand'
                    }`}>
                      {slot.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Col: Item Inspector Card */}
        <div className="pixel-box bg-pixel-navy p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs text-pixel-goldenSun border-b-2 border-pixel-purple pb-2 mb-3 uppercase tracking-wider">
              INSPEKTOR ITEM
            </h3>

            {selectedItem ? (
              <div className="space-y-3.5">
                {/* Visual Header */}
                <div className="pixel-box bg-[#101224] p-3 text-center border-pixel-purple">
                  <div className="text-5xl py-2 filter drop-shadow-[0_4px_0_#000]">
                    {selectedItem.icon}
                  </div>
                  <h4 className="text-sm font-bold text-white">{selectedItem.name}</h4>
                  <div className="font-retro text-base text-pixel-lavender italic">
                    {selectedItem.latin || selectedItem.category}
                  </div>
                </div>

                {/* Details Table */}
                <div className="space-y-1.5 bg-black/60 p-2.5 border border-black text-xs font-retro">
                  <div className="flex justify-between text-pixel-sand">
                    <span>Tipe Barang:</span>
                    <span className="text-amber-300 font-bold uppercase">{selectedItem.category || 'Tangkapan'}</span>
                  </div>
                  {selectedItem.weight && (
                    <div className="flex justify-between text-pixel-sand">
                      <span>Berat Tercatat:</span>
                      <span className="text-cyan-300 font-bold">{selectedItem.weight} kg</span>
                    </div>
                  )}
                  <div className="flex justify-between text-pixel-sand">
                    <span>Jumlah di Tas:</span>
                    <span className="text-white font-bold">{selectedItem.count || 1} buah</span>
                  </div>
                  <div className="flex justify-between text-pixel-sand">
                    <span>Harga Jual Toko:</span>
                    <span className="text-amber-300 font-bold font-pixel text-[10px]">
                      {selectedItem.basePrice || selectedItem.price || 10} 🪙
                    </span>
                  </div>
                </div>

                {/* Lore / Description */}
                <div className="p-2.5 bg-[#141528] border-l-4 border-pixel-sunsetOrange text-pixel-sand text-xs font-retro leading-relaxed">
                  "{selectedItem.description || 'Barang koleksi penjelajah laut senja.'}"
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-pixel-lavender font-retro text-lg">
                Pilih salah satu item di tas untuk melihat informasi lengkap.
              </div>
            )}
          </div>

          {/* Action Buttons for Selected Item */}
          {selectedItem && (
            <div className="pt-4 border-t-2 border-pixel-purple space-y-2">
              {selectedItem.category === 'consumable' && (
                <button
                  onClick={() => handleUse(selectedItem)}
                  className="pixel-btn bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] w-full py-2 flex items-center justify-center gap-1"
                >
                  <span>⚡</span> GUNAKAN (+{selectedItem.staminaRestore} ENERGI)
                </button>
              )}

              {selectedItem.category === 'rod' && selectedItem.id !== player.equippedRod && (
                <button
                  onClick={() => {
                    onEquipRod(selectedItem.id);
                    audio.playBeep(600, 0.05);
                    showToast(`✓ Joran Dipasang: ${selectedItem.name}`);
                  }}
                  className="pixel-btn bg-pixel-sunsetOrange text-black font-bold text-[10px] w-full py-2"
                >
                  🎣 PASANG JORAN INI
                </button>
              )}

              {selectedItem.category === 'bait' && selectedItem.id !== player.equippedBait && (
                <button
                  onClick={() => {
                    onEquipBait(selectedItem.id);
                    audio.playBeep(600, 0.05);
                    showToast(`✓ Umpan Dipasang: ${selectedItem.name}`);
                  }}
                  className="pixel-btn bg-cyan-600 text-white font-bold text-[10px] w-full py-2"
                >
                  🪱 PASANG UMPAN INI
                </button>
              )}

              <button
                onClick={() => handleSell(selectedItem)}
                className="pixel-btn bg-[#2a243a] hover:bg-red-900/60 text-amber-300 font-bold text-[10px] w-full py-2 flex items-center justify-center gap-1 border-amber-600"
              >
                <span>🪙</span> JUAL 1 BUAH (+{selectedItem.basePrice || selectedItem.price || 10} KERANG)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
