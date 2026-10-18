import React, { useState } from 'react';
import { Character } from '../../types';
import { ChibiRenderer } from '../../renderer/ChibiRenderer';
import { Plus, Copy, Trash2, Edit2, Download, Upload, Check, X } from 'lucide-react';
import { playSound } from '../../audio/soundEffects';

interface SlotsBarProps {
  characters: Character[];
  activeSlot: number;
  onSelectSlot: (index: number) => void;
  onCreateSlot: () => void;
  onDuplicateSlot: (index: number) => void;
  onDeleteSlot: (index: number) => void;
  onRenameSlot: (index: number, newName: string) => void;
  onExportSlot: (character: Character) => void;
  onImportSlot: () => void;
}

export const SlotsBar: React.FC<SlotsBarProps> = ({
  characters,
  activeSlot,
  onSelectSlot,
  onCreateSlot,
  onDuplicateSlot,
  onDeleteSlot,
  onRenameSlot,
  onExportSlot,
  onImportSlot,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const startRename = (index: number, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditName(currentName);
  };

  const saveRename = (index: number) => {
    if (editName.trim()) {
      onRenameSlot(index, editName.trim());
      playSound('pop');
    }
    setEditingIndex(null);
  };

  return (
    <aside className="w-full lg:w-44 flex lg:flex-col bg-white/90 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-pink-200/70 p-2.5 sm:p-3 gap-2 overflow-x-auto lg:overflow-y-auto shrink-0 z-20">
      <div className="flex lg:flex-col items-center justify-between gap-1 pb-1 lg:border-b border-pink-200/50">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#9B72CF] whitespace-nowrap">
          Slots ({characters.length})
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={onImportSlot}
            title="Importar personaje desde código"
            className="p-1 rounded-lg bg-pink-50 text-[#9B72CF] hover:bg-pink-100 hover:scale-105 transition-all text-xs"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              playSound('pop');
              onCreateSlot();
            }}
            title="Nuevo Slot de Personaje"
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-gradient-to-r from-[#FF6F91] to-[#FF9EAA] text-white font-bold text-xs shadow-sm hover:shadow-cute hover:scale-105 transition-all whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nuevo</span>
          </button>
        </div>
      </div>

      {/* Slots List */}
      <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0 flex-1">
        {characters.map((char, index) => {
          const isActive = index === activeSlot;
          const isRenaming = editingIndex === index;

          return (
            <div
              key={char.id}
              onClick={() => {
                if (!isActive) {
                  playSound('pop');
                  onSelectSlot(index);
                }
              }}
              className={`group relative flex lg:flex-row items-center gap-2 p-1.5 rounded-2xl cursor-pointer transition-all border ${
                isActive
                  ? 'bg-gradient-to-br from-pink-50 to-purple-50 border-[#FF6F91] shadow-cute scale-[1.02]'
                  : 'bg-white/80 hover:bg-pink-50/50 border-pink-100 hover:border-pink-300'
              }`}
            >
              {/* Miniature Avatar Preview */}
              <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl bg-gradient-to-b from-white to-pink-50/70 border border-pink-200 overflow-hidden flex items-center justify-center shrink-0 relative shadow-inner">
                <ChibiRenderer
                  character={char}
                  animate={false}
                  scale={0.5}
                  className="w-24 h-24 absolute -top-3"
                />
                <span className="absolute bottom-0.5 right-1 text-[9px] font-black text-pink-400">
                  #{index + 1}
                </span>
              </div>

              {/* Name & Quick Controls */}
              <div className="flex-1 min-w-0 pr-1">
                {isRenaming ? (
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveRename(index);
                        if (e.key === 'Escape') setEditingIndex(null);
                      }}
                      autoFocus
                      className="w-full text-xs font-bold px-1.5 py-0.5 border border-[#FF6F91] rounded-md focus:outline-none"
                    />
                    <button
                      onClick={() => saveRename(index)}
                      className="p-1 rounded bg-green-500 text-white hover:bg-green-600"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="p-1 rounded bg-gray-400 text-white hover:bg-gray-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-extrabold text-[#3D344B] truncate leading-tight">
                      {char.name}
                    </p>
                    <p className="text-[10px] text-[#9B72CF] truncate font-medium">
                      {char.title || 'Aventurero'}
                    </p>
                  </div>
                )}

                {/* Hover actions when active */}
                {isActive && !isRenaming && (
                  <div className="flex items-center gap-1 mt-1 pt-1 border-t border-pink-200/50">
                    <button
                      onClick={(e) => startRename(index, char.name, e)}
                      title="Renombrar"
                      className="p-1 rounded hover:bg-pink-100 text-[#7A6E85] hover:text-[#FF6F91] transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound('pop');
                        onDuplicateSlot(index);
                      }}
                      title="Duplicar Personaje"
                      className="p-1 rounded hover:bg-pink-100 text-[#7A6E85] hover:text-[#9B72CF] transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound('pop');
                        onExportSlot(char);
                      }}
                      title="Exportar archivo JSON"
                      className="p-1 rounded hover:bg-pink-100 text-[#7A6E85] hover:text-[#2A6F97] transition-colors"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                    {characters.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`¿Eliminar slot de "${char.name}"?`)) {
                            playSound('delete');
                            onDeleteSlot(index);
                          }
                        }}
                        title="Eliminar Slot"
                        className="p-1 rounded hover:bg-red-100 text-[#7A6E85] hover:text-red-500 transition-colors ml-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
