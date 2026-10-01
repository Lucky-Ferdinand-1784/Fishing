import React from 'react';
import UserProfile from './UserProfile';
import AudioWidget from './AudioWidget';

const NAV_ITEMS = [
  { id: 'world', label: 'DUNIA PANTAI', icon: '🗺️', code: '01' },
  { id: 'fishing', label: 'MEMANCING', icon: '🎣', code: '02' },
  { id: 'inventory', label: 'TAS & INVENTARIS', icon: '🎒', code: '03' },
  { id: 'shop', label: 'PASAR PESISIR', icon: '🏪', code: '04' },
  { id: 'quests', label: 'PAPAN MISI', icon: '📜', code: '05' },
  { id: 'compendium', label: 'BUKU KOLEKSI', icon: '🐟', code: '06' },
];

export default function Sidebar({
  activeTab,
  onSelectTab,
  isSidebarOpen,
  onCloseSidebar,
  audioState,
  player,
  onUpdateAvatar,
  onUpdateName,
  onResetGame,
  onExportSave,
  onImportSave,
  hasClaimableQuests,
  inventoryCount
}) {
  return (
    <>
      <aside 
        className={`fixed lg:static top-0 left-0 bottom-0 z-40 w-72 bg-pixel-navy border-r-4 border-black flex flex-col justify-between transform transition-transform duration-150 ease-out overflow-hidden shadow-[4px_0_0_#000] ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section: Logo & User Badge */}
        <div className="p-3.5 space-y-3 overflow-y-auto flex-1">
          {/* Brand Header */}
          <div className="pixel-box bg-pixel-darkPurple p-2.5 text-center border-pixel-purple">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-6 h-6 bg-pixel-goldenSun border-2 border-black rounded-none sun-pulse flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-pixel-sunsetOrange" />
              </div>
              <h1 className="text-xs font-bold tracking-tight text-pixel-goldenSun">SUNSET HORIZON</h1>
            </div>
            <p className="font-retro text-base text-pixel-lavender tracking-widest uppercase">
              ~ Seaside RPG Adventure ~
            </p>
          </div>

          {/* User Profile Card */}
          <UserProfile 
            player={player} 
            onUpdateAvatar={onUpdateAvatar}
            onUpdateName={onUpdateName}
            onResetGame={onResetGame}
            onExportSave={onExportSave}
            onImportSave={onImportSave}
          />

          {/* Navigation Buttons */}
          <nav className="space-y-1.5 pt-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              const isQuestTab = item.id === 'quests' && hasClaimableQuests;
              const isInvTab = item.id === 'inventory' && inventoryCount > 0;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`pixel-btn w-full text-left p-2.5 text-[10px] flex items-center justify-between transition-none ${
                    isActive 
                      ? 'active bg-pixel-sunsetOrange text-black font-bold' 
                      : 'bg-[#211a36] text-pixel-sand hover:bg-pixel-darkPurple'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    {isQuestTab && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" title="Ada Misi Selesai!" />
                    )}
                    {isInvTab && (
                      <span className="text-[9px] bg-black/60 px-1 text-pixel-lavender font-mono">
                        {inventoryCount}
                      </span>
                    )}
                    <span className="font-retro text-base bg-black text-pixel-goldenSun px-1 border border-black">
                      {item.code}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Audio Player Widget */}
        <AudioWidget {...audioState} />
      </aside>

      {/* Overlay when mobile sidebar is open */}
      {isSidebarOpen && (
        <div 
          onClick={onCloseSidebar} 
          className="fixed inset-0 bg-black/70 z-30 lg:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
}
