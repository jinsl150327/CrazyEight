/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import GameBoard from './components/GameBoard';
import Home from './components/Home';
import { Palette } from 'lucide-react';

const BACKGROUND_COLORS = [
  { name: '经典绿', value: '#1a472a' },
  { name: '深邃蓝', value: '#1e3a8a' },
  { name: '皇家紫', value: '#4c1d95' },
  { name: '炭黑色', value: '#111827' },
  { name: '酒红色', value: '#450a0a' },
];

export default function App() {
  const [view, setView] = useState<'home' | 'game'>('home');
  const [bgColor, setBgColor] = useState(BACKGROUND_COLORS[0].value);
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <div 
      className="min-h-screen text-white font-sans selection:bg-emerald-500/30 transition-colors duration-700"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background Color Picker */}
      <div className="fixed bottom-4 right-4 z-[1000]">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 shadow-lg transition-all active:scale-95"
          title="更改背景颜色"
        >
          <Palette size={24} />
        </button>

        {showColorPicker && (
          <div className="absolute bottom-16 right-0 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl flex flex-col gap-2 min-w-[120px]">
            {BACKGROUND_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => {
                  setBgColor(color.value);
                  setShowColorPicker(false);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-left"
              >
                <div 
                  className="w-4 h-4 rounded-full border border-white/20" 
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-xs font-medium">{color.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {view === 'home' ? (
        <Home onStartGame={() => setView('game')} />
      ) : (
        <GameBoard onBackToHome={() => setView('home')} />
      )}
    </div>
  );
}
