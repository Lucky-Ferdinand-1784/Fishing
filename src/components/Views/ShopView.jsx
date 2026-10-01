import React, { useState } from 'react';
import { SHOP_ITEMS } from '../../data/gameData';

export default function ShopView({
  player,
  inventory,
  onBuyItem,
  onSellAllFish,
  audio,
  showToast
}) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'SEMUA BARANG' },
    { id: 'rod', label: 'JORAN PANCING' },
    { id: 'bait', label: 'UMPAN IKAN' },
    { id: 'consumable', label: 'PENYEGAR & JIMAT' },
  ];

  // Calculate total sell value of all fish in inventory
  const fishItems = inventory.filter(item => item.category === 'fish' || item.category === 'Tangkapan' || !item.category);
  const totalFishEarnings = fishItems.reduce((acc, curr) => acc + ((curr.basePrice || 15) * (curr.count || 1)), 0);

  const filteredItems = activeCategory === 'all' 
    ? SHOP_ITEMS 
    : SHOP_ITEMS.filter(item => {
        if (activeCategory === 'consumable') {
          return item.category === 'consumable' || item.category === 'charm';
        }
        return item.category === activeCategory;
      });

  return (
    <div className="space-y-4">
      {/* Trader Banner Header */}
      <div className="pixel-box bg-[#1c1c38] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-amber-900 border-2 border-black flex items-center justify-center text-3xl shadow-[inset_2px_2px_0_#fff4] flex-shrink-0">
            🧔‍♂️
          </div>
          <div>
            <div className="text-[9px] text-amber-400 font-pixel">WARUNG PELAUT TUA BARTHOLOMEW</div>
            <h2 className="text-base text-pixel-goldenSun">PASAR & PERLENGKAPAN PESISIR</h2>
            <p className="font-retro text-base text-pixel-sand">
              "Ahoi! Beli joran tangguh, umpan bercahaya, atau jual hasil tangkapanmu ke sini!"
            </p>
          </div>
        </div>

        {/* Sell All Fish Quick Action */}
        <div className="bg-[#121324] p-3 border-2 border-pixel-purple flex flex-col sm:flex-row items-center gap-3">
          <div className="text-center sm:text-right">
            <span className="text-[8px] text-pixel-sand block">HASIL TANGKAPAN DI TAS:</span>
            <span className="text-xs text-amber-300 font-bold font-pixel">
              {fishItems.length} Jenis ({totalFishEarnings} 🪙)
            </span>
          </div>

          <button
            onClick={() => {
              if (fishItems.length === 0) {
                showToast('❌ Tidak ada ikan di tas untuk dijual.');
                return;
              }
              onSellAllFish(totalFishEarnings);
              audio.playCoinSound();
            }}
            disabled={fishItems.length === 0}
            className={`pixel-btn px-4 py-2 text-[10px] font-bold ${
              fishItems.length > 0 
                ? 'bg-pixel-goldenSun text-black hover:bg-amber-400' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            💰 JUAL SEMUA IKAN (+{totalFishEarnings} 🪙)
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              audio.playBeep(450, 0.04);
              setActiveCategory(cat.id);
            }}
            className={`pixel-btn text-[10px] px-3.5 py-2 font-bold ${
              activeCategory === cat.id 
                ? 'bg-pixel-sunsetOrange text-black' 
                : 'bg-pixel-darkPurple text-pixel-sand hover:bg-pixel-navy'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Shop Goods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isRod = item.category === 'rod';
          const isOwned = (isRod && (item.id === player.equippedRod || inventory.some(i => i.id === item.id))) ||
                          (item.id === 'item_charm' && player.hasCharm);
          const canAfford = player.coins >= item.price;

          return (
            <div 
              key={item.id}
              className="pixel-box bg-pixel-navy p-3.5 flex flex-col justify-between space-y-3"
            >
              <div>
                {/* Header item */}
                <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl filter drop-shadow-[0_2px_0_#000]">{item.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.name}</h4>
                      <span className="text-[8px] text-pixel-lavender uppercase font-pixel">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <span className="font-pixel text-[10px] text-amber-300 bg-black/60 px-2 py-1 border border-black flex-shrink-0">
                    {item.price === 0 ? 'GRATIS' : `${item.price} 🪙`}
                  </span>
                </div>

                {/* Perks & Stats */}
                <div className="mt-2 space-y-1 text-[9px] font-retro text-pixel-sand">
                  {item.bonusCatch > 0 && (
                    <div className="text-emerald-400">✓ Kecepatan Tarikan: +{item.bonusCatch}%</div>
                  )}
                  {item.bonusRare > 0 && (
                    <div className="text-cyan-400">✓ Peluang Ikan Langka: +{item.bonusRare}%</div>
                  )}
                  {item.staminaRestore && (
                    <div className="text-amber-300">⚡ Memulihkan +{item.staminaRestore} Stamina Energi</div>
                  )}
                  <p className="mt-1.5 text-xs text-pixel-sand/90 italic">
                    "{item.description}"
                  </p>
                </div>
              </div>

              {/* Purchase Button */}
              <div className="pt-2">
                {isOwned ? (
                  <button
                    disabled
                    className="w-full pixel-btn bg-[#23273e] text-emerald-400 text-[10px] py-2 cursor-default font-bold"
                  >
                    ✓ SUDAH DIMILIKI
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (!canAfford) {
                        audio.playBeep(200, 0.15, 'sawtooth');
                        showToast('❌ Kerang Emas tidak mencukupi!');
                        return;
                      }
                      onBuyItem(item);
                      audio.playCoinSound();
                    }}
                    className={`w-full pixel-btn text-[10px] py-2 font-bold flex items-center justify-center gap-1.5 ${
                      canAfford 
                        ? 'bg-pixel-sunsetOrange hover:bg-amber-400 text-black' 
                        : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    <span>🛒</span> BELI BARANG ({item.price} 🪙)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
