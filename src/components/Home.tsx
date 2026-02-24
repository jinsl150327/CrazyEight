import React from 'react';
import { Play, Info, Settings, Trophy } from 'lucide-react';

interface HomeProps {
  onStartGame: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartGame }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent p-6 relative overflow-hidden">
      {/* Decorative Cards Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 rotate-12 border-4 border-white rounded-xl w-32 h-48 flex items-center justify-center text-6xl font-bold">8</div>
        <div className="absolute bottom-20 right-10 -rotate-12 border-4 border-white rounded-xl w-32 h-48 flex items-center justify-center text-6xl font-bold text-red-500">♥</div>
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -rotate-6 border-4 border-white rounded-xl w-32 h-48 flex items-center justify-center text-6xl font-bold">♠</div>
      </div>

      <div className="z-10 flex flex-col items-center max-w-2xl w-full text-center">
        {/* Logo/Title Area */}
        <div className="mb-12 relative">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="w-16 h-24 bg-white rounded-lg shadow-xl flex items-center justify-center text-4xl font-black text-slate-900 rotate-[-10deg] border-2 border-slate-200">8</div>
            <div className="w-16 h-24 bg-red-600 rounded-lg shadow-xl flex items-center justify-center text-4xl font-black text-white rotate-[5deg] border-2 border-red-400">8</div>
            <div className="w-16 h-24 bg-slate-900 rounded-lg shadow-xl flex items-center justify-center text-4xl font-black text-white rotate-[-5deg] border-2 border-slate-700">8</div>
          </div>
          <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-white drop-shadow-2xl">
            疯狂 <span className="text-yellow-400 italic">8</span> 点
          </h1>
          <p className="text-emerald-400/80 font-medium tracking-widest uppercase text-sm mt-2">Crazy Eights Classic</p>
        </div>

        {/* Main Actions */}
        <div className="grid gap-4 w-full max-w-xs">
          <button
            onClick={onStartGame}
            className="group relative flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-slate-900 py-5 rounded-2xl font-black text-2xl transition-all active:scale-95 shadow-xl shadow-yellow-400/20"
          >
            <Play fill="currentColor" size={28} />
            开始游戏
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold transition-all border border-white/10">
              <Trophy size={20} />
              排行榜
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold transition-all border border-white/10">
              <Settings size={20} />
              设置
            </button>
          </div>
        </div>

        {/* Rules Summary */}
        <div className="mt-16 bg-black/30 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-left">
          <div className="flex items-center gap-2 mb-4 text-yellow-400">
            <Info size={18} />
            <h3 className="font-bold uppercase tracking-wider text-sm">游戏规则</h3>
          </div>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex gap-2">
              <span className="text-yellow-400">•</span>
              匹配弃牌堆顶部的花色或点数。
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-400">•</span>
              <strong className="text-white">数字 8 是万能牌</strong>，可以随时打出并改变花色。
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-400">•</span>
              无牌可出时必须摸一张牌。
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-400">•</span>
              最先清空手牌的玩家获胜！
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-12 text-white/30 text-xs font-medium uppercase tracking-[0.2em]">
          Powered by 121 Studio & Gemini AI
        </div>
      </div>
    </div>
  );
};

export default Home;
