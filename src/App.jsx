import React, { useState, useEffect } from 'react';
import Scanlines from './components/Scanlines';
import Toast from './components/Toast';
import HeaderGame from './components/HeaderGame';
import Sidebar from './components/Sidebar/Sidebar';
import HeroScenic from './components/HeroScenic';

// Game Views
import WorldView from './components/Views/WorldView';
import FishingView from './components/Views/FishingView';
import InventoryView from './components/Views/InventoryView';
import ShopView from './components/Views/ShopView';
import QuestView from './components/Views/QuestView';
import CompendiumView from './components/Views/CompendiumView';

import { useRetroAudio } from './hooks/useRetroAudio';
import { INITIAL_PLAYER, INITIAL_QUESTS } from './data/gameData';

const INITIAL_INVENTORY = [
  {
    id: 'rod_bamboo',
    name: 'Joran Bambu Pantai',
    category: 'rod',
    icon: '🎋',
    count: 1,
    basePrice: 0,
    description: 'Joran sederhana buatan tangan dari bambu pesisir. Andal untuk pemula.',
  },
  {
    id: 'bait_worm',
    name: 'Cacing Pasir Basah',
    category: 'bait',
    icon: '🪱',
    count: 10,
    basePrice: 4,
    bonusRare: 0,
    description: 'Umpan alami favorit ikan-ikan kecil pesisir.',
  },
  {
    id: 'item_coconut',
    name: 'Kelapa Muda Dingin',
    category: 'consumable',
    icon: '🥥',
    count: 2,
    basePrice: 15,
    staminaRestore: 40,
    description: 'Air kelapa segar dipetik langsung dari pohon palem pantai. Memulihkan 40 Stamina.',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('world');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Persistent Player Game State
  const [player, setPlayer] = useState(() => {
    try {
      const saved = localStorage.getItem('pixel_coast_player');
      return saved ? JSON.parse(saved) : INITIAL_PLAYER;
    } catch (e) {
      return INITIAL_PLAYER;
    }
  });

  // Inventory State
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('pixel_coast_inventory');
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch (e) {
      return INITIAL_INVENTORY;
    }
  });

  // Compendium State
  const [compendium, setCompendium] = useState(() => {
    try {
      const saved = localStorage.getItem('pixel_coast_compendium');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Quests State
  const [quests, setQuests] = useState(() => {
    try {
      const saved = localStorage.getItem('pixel_coast_quests');
      return saved ? JSON.parse(saved) : INITIAL_QUESTS;
    } catch (e) {
      return INITIAL_QUESTS;
    }
  });

  const [chestOpened, setChestOpened] = useState(() => {
    try {
      const saved = localStorage.getItem('pixel_coast_chest');
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      return false;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pixel_coast_player', JSON.stringify(player));
    } catch (e) {}
  }, [player]);

  useEffect(() => {
    try {
      localStorage.setItem('pixel_coast_inventory', JSON.stringify(inventory));
    } catch (e) {}
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem('pixel_coast_compendium', JSON.stringify(compendium));
    } catch (e) {}
  }, [compendium]);

  useEffect(() => {
    try {
      localStorage.setItem('pixel_coast_quests', JSON.stringify(quests));
    } catch (e) {}
  }, [quests]);

  useEffect(() => {
    try {
      localStorage.setItem('pixel_coast_chest', JSON.stringify(chestOpened));
    } catch (e) {}
  }, [chestOpened]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  const audio = useRetroAudio(showToast);

  const handleResetGame = () => {
    if (window.confirm('Apakah kamu yakin ingin mereset seluruh progres permainan dari awal? Semua level, koin, ikan, dan tas akan kembali ke status awal.')) {
      localStorage.removeItem('pixel_coast_player');
      localStorage.removeItem('pixel_coast_inventory');
      localStorage.removeItem('pixel_coast_compendium');
      localStorage.removeItem('pixel_coast_quests');
      localStorage.removeItem('pixel_coast_chest');
      setPlayer(INITIAL_PLAYER);
      setInventory(INITIAL_INVENTORY);
      setCompendium({});
      setQuests(INITIAL_QUESTS);
      setChestOpened(false);
      audio.playBeep(300, 0.2, 'sawtooth');
      showToast('🔄 Seluruh data petualangan telah di-reset ke awal!');
    }
  };

  // Export save data to clipboard
  const handleExportSave = () => {
    const saveData = {
      player,
      inventory,
      compendium,
      quests,
      chestOpened,
      timestamp: Date.now()
    };
    try {
      const jsonStr = JSON.stringify(saveData);
      const encoded = btoa(encodeURIComponent(jsonStr));
      navigator.clipboard?.writeText(encoded);
      audio.playCoinSound();
      showToast('📋 Kode Save Data berhasil disalin ke clipboard!');
    } catch (e) {
      showToast('❌ Gagal mengekspor data.');
    }
  };

  // Import save data from pasted code
  const handleImportSave = () => {
    const code = window.prompt('Tempelkan (Paste) kode Save Data yang sudah kamu ekspor:');
    if (!code || !code.trim()) return;
    try {
      const decoded = decodeURIComponent(atob(code.trim()));
      const parsed = JSON.parse(decoded);
      if (parsed.player) setPlayer(parsed.player);
      if (parsed.inventory) setInventory(parsed.inventory);
      if (parsed.compendium) setCompendium(parsed.compendium);
      if (parsed.quests) setQuests(parsed.quests);
      if (typeof parsed.chestOpened === 'boolean') setChestOpened(parsed.chestOpened);
      audio.playCatchSuccess();
      showToast('🎉 Data petualangan berhasil dipulihkan!');
    } catch (err) {
      audio.playBeep(240, 0.2, 'sawtooth');
      showToast('❌ Kode Save Data tidak valid!');
    }
  };

  // Periodic passive stamina recovery (every 45s recovers 5 stamina)
  useEffect(() => {
    const timer = setInterval(() => {
      setPlayer(prev => ({
        ...prev,
        stamina: Math.min(prev.maxStamina, prev.stamina + 5)
      }));
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectTab = (tabId) => {
    audio.playBeep(520, 0.04);
    setActiveTab(tabId);
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const handleToggleSidebar = () => {
    audio.playBeep(440, 0.05);
    setIsSidebarOpen(prev => !prev);
  };

  // Gain EXP & handle Level Up
  const handleGainExp = (amount) => {
    setPlayer(prev => {
      let nextExp = prev.exp + amount;
      let nextLevel = prev.level;
      let nextMaxExp = prev.maxExp;
      let nextCoins = prev.coins;
      let nextStamina = prev.stamina;

      if (nextExp >= nextMaxExp) {
        nextLevel += 1;
        nextExp = nextExp - nextMaxExp;
        nextMaxExp = Math.round(nextMaxExp * 1.45);
        nextCoins += 60; // Level up bonus coins
        nextStamina = prev.maxStamina; // Full stamina refill
        audio.playLevelUp();
        showToast(`🎉 LEVEL UP! Sekarang Level ${nextLevel}! (+60 🪙 & Energi Penuh)`);
      }

      return {
        ...prev,
        level: nextLevel,
        exp: nextExp,
        maxExp: nextMaxExp,
        coins: nextCoins,
        stamina: nextStamina
      };
    });
  };

  // Gain Coins with charm perk
  const handleGainCoins = (amount) => {
    const multiplier = player.hasCharm ? 1.2 : 1.0;
    const finalAmount = Math.round(amount * multiplier);
    setPlayer(prev => ({
      ...prev,
      coins: prev.coins + finalAmount
    }));
  };

  const handleConsumeStamina = (amount) => {
    setPlayer(prev => ({
      ...prev,
      stamina: Math.max(0, prev.stamina - amount)
    }));
  };

  // Campfire Rest
  const handleRestCampfire = () => {
    if (player.stamina >= player.maxStamina) {
      showToast('⚡ Energimu sudah penuh!');
      return;
    }
    audio.playRestSound();
    setPlayer(prev => ({
      ...prev,
      stamina: Math.min(prev.maxStamina, prev.stamina + 35)
    }));
    handleUpdateQuestProgress('q5', 1);
    showToast('🔥 Beristirahat di api unggun pantai... (+35 Energi)');
  };

  // Beachcombing (Search for shells)
  const handleFindShell = () => {
    if (player.stamina < 5) {
      showToast('❌ Tidak cukup energi untuk menyusuri pantai!');
      return;
    }
    handleConsumeStamina(5);
    audio.playBeep(600, 0.05);

    const roll = Math.random() * 100;
    if (roll > 50) {
      const coinsFound = Math.floor(Math.random() * 15) + 10;
      handleGainCoins(coinsFound);
      audio.playCoinSound();
      showToast(`🐚 Menemukan kerang berkilau di pasir! (+${coinsFound} 🪙)`);
    } else if (roll > 20) {
      const baitFound = {
        id: 'bait_worm',
        name: 'Cacing Pasir Basah',
        category: 'bait',
        icon: '🪱',
        count: 3,
        basePrice: 4,
        description: 'Umpan alami favorit ikan-ikan kecil pesisir.'
      };
      setInventory(prev => {
        const existing = prev.find(i => i.id === baitFound.id);
        if (existing) {
          return prev.map(i => i.id === baitFound.id ? { ...i, count: i.count + 3 } : i);
        }
        return [...prev, baitFound];
      });
      audio.playCatchSuccess();
      showToast('🪱 Menemukan 3 Cacing Pasir di balik batuan pantai!');
    } else {
      showToast('🌊 Ombak menyapu pasir... belum menemukan kerang berharga.');
    }
  };

  // Open Coral Chest
  const handleOpenChest = () => {
    if (chestOpened) {
      showToast('📦 Peti karang sudah kosong. Ombak belum membawa harta baru.');
      audio.playBeep(240, 0.1);
      return;
    }
    setChestOpened(true);
    audio.playCatchSuccess();
    handleGainCoins(80);
    handleGainExp(60);

    const bonusItem = {
      id: 'item_coffee',
      name: 'Kopi Tubruk Nelayan',
      category: 'consumable',
      icon: '☕',
      count: 1,
      basePrice: 25,
      staminaRestore: 100,
      description: 'Kopi hitam panas aromatik penghangat malam pesisir. Memulihkan 100 Stamina penuh!'
    };

    setInventory(prev => {
      const existing = prev.find(i => i.id === bonusItem.id);
      if (existing) {
        return prev.map(i => i.id === bonusItem.id ? { ...i, count: i.count + 1 } : i);
      }
      return [...prev, bonusItem];
    });

    handleUpdateQuestProgress('q4', 1);
    showToast('📦 PETI KARANG TERBUKA! Mendapatkan 80 🪙, 60 EXP, dan 1 Kopi Nelayan!');
  };

  // Add Catch to Inventory & Compendium
  const handleAddCatch = (fish, weight) => {
    // Add to inventory
    setInventory(prev => {
      const existing = prev.find(i => i.id === fish.id);
      if (existing) {
        return prev.map(i => i.id === fish.id ? { ...i, count: (i.count || 1) + 1 } : i);
      }
      return [
        ...prev,
        {
          ...fish,
          category: 'fish',
          count: 1,
          weight
        }
      ];
    });

    // Add to compendium
    setCompendium(prev => {
      const curr = prev[fish.id] || { count: 0, maxWeight: 0 };
      return {
        ...prev,
        [fish.id]: {
          count: curr.count + 1,
          maxWeight: Math.max(curr.maxWeight, parseFloat(weight))
        }
      };
    });

    setPlayer(prev => ({
      ...prev,
      totalCaught: (prev.totalCaught || 0) + 1
    }));
  };

  // Update Quest Progress
  const handleUpdateQuestProgress = (questId, amount = 1) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId && !q.completed) {
        const nextCurrent = q.current + amount;
        const isDone = nextCurrent >= q.target;
        return {
          ...q,
          current: nextCurrent,
          completed: isDone
        };
      }
      return q;
    }));
  };

  // Claim Quest Reward
  const handleClaimQuest = (questId) => {
    const targetQuest = quests.find(q => q.id === questId);
    if (!targetQuest || targetQuest.claimed) return;

    setQuests(prev => prev.map(q => q.id === questId ? { ...q, claimed: true } : q));
    handleGainCoins(targetQuest.rewardCoins);
    handleGainExp(targetQuest.rewardExp);
    showToast(`🎁 Hadiah Misi Diambil: +${targetQuest.rewardCoins} 🪙 & +${targetQuest.rewardExp} EXP!`);
  };

  // Buy Shop Item
  const handleBuyItem = (item) => {
    if (player.coins < item.price) return;
    setPlayer(prev => ({ ...prev, coins: prev.coins - item.price }));

    if (item.category === 'charm') {
      setPlayer(prev => ({ ...prev, hasCharm: true }));
      showToast('🧿 Memperoleh Jimat Kerang Keberuntungan! (+20% Kerang Emas)');
      return;
    }

    if (item.category === 'rod') {
      setInventory(prev => {
        if (!prev.some(i => i.id === item.id)) {
          return [...prev, { ...item, count: 1 }];
        }
        return prev;
      });
      setPlayer(prev => ({ ...prev, equippedRod: item.id }));
      showToast(`🎣 Joran Baru Dibeli & Dipasang: ${item.name}!`);
      return;
    }

    // Baits and consumables
    setInventory(prev => {
      const existing = prev.find(i => i.id === item.id);
      const addCount = item.quantity || 1;
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, count: i.count + addCount } : i);
      }
      return [...prev, { ...item, count: addCount }];
    });

    if (item.category === 'bait') {
      setPlayer(prev => ({ ...prev, equippedBait: item.id }));
    }

    showToast(`🛒 Berhasil membeli ${item.name}!`);
  };

  // Sell 1 Item from Inventory
  const handleSellItem = (item) => {
    const sellPrice = item.basePrice || item.price || 10;
    handleGainCoins(sellPrice);

    setInventory(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (!existing) return prev;
      if (existing.count > 1) {
        return prev.map(i => i.id === item.id ? { ...i, count: i.count - 1 } : i);
      }
      return prev.filter(i => i.id !== item.id);
    });

    showToast(`💰 Terjual: ${item.name} (+${sellPrice} 🪙)`);
  };

  // Sell all fish
  const handleSellAllFish = (totalEarnings) => {
    setInventory(prev => prev.filter(i => i.category !== 'fish' && i.category !== 'Tangkapan' && i.category));
    handleGainCoins(totalEarnings);
    showToast(`💰 Semua hasil pancingan terjual! (+${totalEarnings} 🪙)`);
  };

  // Use consumable item
  const handleUseItem = (item) => {
    if (item.category !== 'consumable') return;
    const restoreAmount = item.staminaRestore || 30;

    setPlayer(prev => ({
      ...prev,
      stamina: Math.min(prev.maxStamina, prev.stamina + restoreAmount)
    }));

    setInventory(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (!existing) return prev;
      if (existing.count > 1) {
        return prev.map(i => i.id === item.id ? { ...i, count: i.count - 1 } : i);
      }
      return prev.filter(i => i.id !== item.id);
    });

    showToast(`⚡ Mengonsumsi ${item.name}! (+${restoreAmount} Stamina)`);
  };

  // Avatar and Name updates
  const handleUpdateAvatar = (avatarIcon) => {
    audio.playBeep(650, 0.05);
    setPlayer(prev => ({ ...prev, avatar: avatarIcon }));
    showToast('✓ Avatar Petualang Diperbarui!');
  };

  const handleUpdateName = (newName) => {
    audio.playBeep(650, 0.05);
    setPlayer(prev => ({ ...prev, name: newName }));
    showToast(`✓ Nama Karakter Diubah: ${newName}`);
  };

  const hasClaimableQuests = quests.some(q => q.completed && !q.claimed);

  return (
    <div className="bg-pixel-night text-amber-100 font-pixel selection:bg-pixel-sunsetOrange selection:text-black min-h-screen flex flex-col overflow-x-hidden antialiased relative">
      {/* CRT Scanline Overlay */}
      <Scanlines />

      {/* Top Game Header with HUD & Resources */}
      <HeaderGame 
        player={player}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
        audioState={{
          isPlaying: audio.isPlaying,
          isMuted: audio.isMuted,
          onTogglePlay: audio.togglePlay,
          onToggleMute: audio.toggleMute
        }}
        onRestCampfire={handleRestCampfire}
      />

      <div className="flex-1 flex relative overflow-hidden">
        {/* Game Navigation Sidebar */}
        <Sidebar 
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          player={player}
          onUpdateAvatar={handleUpdateAvatar}
          onUpdateName={handleUpdateName}
          onResetGame={handleResetGame}
          onExportSave={handleExportSave}
          onImportSave={handleImportSave}
          hasClaimableQuests={hasClaimableQuests}
          inventoryCount={inventory.length}
          audioState={{
            isPlaying: audio.isPlaying,
            isMuted: audio.isMuted,
            currentTrack: audio.currentTrack,
            progress: audio.progress,
            onTogglePlay: audio.togglePlay,
            onToggleMute: audio.toggleMute,
            onNextTrack: audio.nextTrack,
            onSeekProgress: audio.seekProgress,
          }}
        />

        {/* Main Game Stage Area */}
        <main className="flex-1 p-3 md:p-6 overflow-y-auto space-y-5">
          {/* Scenic Hero Stage (The Sunset Beach World) */}
          <HeroScenic 
            player={player}
            onStartFishing={() => handleSelectTab('fishing')}
            onRestCampfire={handleRestCampfire}
            onOpenShop={() => handleSelectTab('shop')}
            onFindShell={handleFindShell}
            onOpenChest={handleOpenChest}
            chestOpened={chestOpened}
            audio={audio}
          />

          {/* Active Game Feature Views */}
          {activeTab === 'world' && (
            <WorldView 
              player={player}
              quests={quests}
              onSwitchTab={handleSelectTab}
              onRestCampfire={handleRestCampfire}
              onFindShell={handleFindShell}
              audio={audio}
              showToast={showToast}
            />
          )}

          {activeTab === 'fishing' && (
            <FishingView 
              player={player}
              inventory={inventory}
              onConsumeStamina={handleConsumeStamina}
              onAddCatch={handleAddCatch}
              onGainExp={handleGainExp}
              onGainCoins={handleGainCoins}
              onUpdateQuestProgress={handleUpdateQuestProgress}
              audio={audio}
              showToast={showToast}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView 
              player={player}
              inventory={inventory}
              onEquipRod={(rodId) => setPlayer(p => ({ ...p, equippedRod: rodId }))}
              onEquipBait={(baitId) => setPlayer(p => ({ ...p, equippedBait: baitId }))}
              onUseItem={handleUseItem}
              onSellItem={handleSellItem}
              audio={audio}
              showToast={showToast}
            />
          )}

          {activeTab === 'shop' && (
            <ShopView 
              player={player}
              inventory={inventory}
              onBuyItem={handleBuyItem}
              onSellAllFish={handleSellAllFish}
              audio={audio}
              showToast={showToast}
            />
          )}

          {activeTab === 'quests' && (
            <QuestView 
              quests={quests}
              onClaimQuest={handleClaimQuest}
              audio={audio}
            />
          )}

          {activeTab === 'compendium' && (
            <CompendiumView 
              compendium={compendium}
              audio={audio}
            />
          )}
        </main>
      </div>

      {/* Retro Pixel Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
