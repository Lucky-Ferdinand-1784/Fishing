import React, { useState } from 'react';
import { AVATAR_OPTIONS } from '../../data/gameData';

export default function UserProfile({ 
  player, 
  onUpdateAvatar, 
  onUpdateName, 
  onResetGame,
  onExportSave,
  onImportSave
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [tempName, setTempName] = useState(player.name);

  const handleSaveName = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateName(tempName.trim().toUpperCase().slice(0, 14));
      setIsEditing(false);
    }
  };

  return (
    <div className="pixel-box bg-[#15172e] p-3 relative">
      <div className="flex items-center gap-3">
        {/* Interactive Pixel Avatar */}
        <button
          onClick={() => setShowAvatarPicker(prev => !prev)}
          className="w-12 h-12 bg-pixel-purple hover:bg-pixel-sunsetOrange border-2 border-black flex-shrink-0 flex items-center justify-center text-2xl shadow-[inset_2px_2px_0px_#fff3] transition-colors relative group"
          title="Klik untuk ganti Avatar"
        >
          {player.avatar}
          <span className="absolute -bottom-1 -right-1 bg-black text-[8px] px-1 border border-white/40">
            ✏️
          </span>
        </button>

        {/* Name and Level Status */}
        <div className="overflow-hidden flex-1">
          {isEditing ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-1">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                maxLength={14}
                autoFocus
                className="bg-black text-pixel-goldenSun border border-pixel-purple text-[10px] px-1.5 py-0.5 w-full uppercase outline-none"
              />
              <button type="submit" className="text-[10px] text-emerald-400">✓</button>
            </form>
          ) : (
            <div 
              onClick={() => setIsEditing(true)} 
              className="text-[10px] text-pixel-goldenSun truncate cursor-pointer hover:underline flex items-center gap-1"
              title="Klik untuk ubah nama karakter"
            >
              <span>{player.name}</span>
              <span className="text-[8px] opacity-60">✎</span>
            </div>
          )}

          <div className="font-retro text-sm text-emerald-400 flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 inline-block bg-emerald-400 rounded-none animate-ping" />
            <span>LVL {player.level} • {player.title}</span>
          </div>

          <div className="text-[9px] text-pixel-sand font-mono mt-0.5">
            🪙 {player.coins} Kerang Emas
          </div>
        </div>
      </div>

      {/* Save indicator & Data Management links */}
      <div className="mt-2.5 pt-2 border-t border-pixel-purple/50 space-y-1.5 text-[8px] text-pixel-lavender font-retro">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-emerald-400">
            <span>💾</span> Auto-Save Aktif
          </span>
          {onResetGame && (
            <button 
              onClick={onResetGame} 
              className="text-stone-400 hover:text-red-400 underline cursor-pointer"
              title="Mulai Ulang Petualangan dari Nol"
            >
              Reset Data
            </button>
          )}
        </div>

        {/* Export / Import Save Data buttons */}
        <div className="flex items-center justify-between gap-1 pt-0.5 border-t border-white/5">
          <button
            onClick={onExportSave}
            className="text-[8px] bg-black/60 hover:bg-black text-amber-300 px-1.5 py-0.5 border border-pixel-purple flex-1 text-center"
            title="Salin kode data save ke clipboard untuk dipindahkan ke Vercel atau perangkat lain"
          >
            📋 Ekspor Save
          </button>
          <button
            onClick={onImportSave}
            className="text-[8px] bg-black/60 hover:bg-black text-cyan-300 px-1.5 py-0.5 border border-pixel-purple flex-1 text-center"
            title="Tempelkan kode data save dari perangkat lain"
          >
            📥 Impor Save
          </button>
        </div>
      </div>

      {/* Avatar Picker Dropdown */}
      {showAvatarPicker && (
        <div className="mt-3 pt-2 border-t-2 border-pixel-purple bg-[#101222] p-2 pixel-box">
          <div className="text-[8px] text-pixel-lavender mb-1.5 text-center">PILIH KARAKTER AVATAR:</div>
          <div className="grid grid-cols-4 gap-1.5">
            {AVATAR_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  onUpdateAvatar(opt.icon, opt.label);
                  setShowAvatarPicker(false);
                }}
                className={`p-1 text-xl border-2 hover:bg-pixel-sunsetOrange/40 transition-colors ${
                  player.avatar === opt.icon ? 'bg-pixel-sunsetOrange border-white' : 'bg-black/50 border-black'
                }`}
                title={opt.label}
              >
                {opt.icon}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
