import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CardData, GameStatus, Turn, Suit } from '../types';
import { createDeck, shuffleDeck, canPlayCard, SUITS } from '../constants';
import Card from './Card';
import { Trophy, RotateCcw, Info, ChevronUp } from 'lucide-react';

interface GameBoardProps {
  onBackToHome: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ onBackToHome }) => {
  const [deck, setDeck] = useState<CardData[]>([]);
  const [playerHand, setPlayerHand] = useState<CardData[]>([]);
  const [aiHand, setAiHand] = useState<CardData[]>([]);
  const [discardPile, setDiscardPile] = useState<CardData[]>([]);
  const [currentTurn, setCurrentTurn] = useState<Turn>('player');
  const [status, setStatus] = useState<GameStatus>('dealing');
  const [activeSuit, setActiveSuit] = useState<Suit | null>(null);
  const [winner, setWinner] = useState<Turn | null>(null);
  const [message, setMessage] = useState<string>("欢迎来到疯狂8点！");
  const [pendingEight, setPendingEight] = useState<CardData | null>(null);

  // Initialize Game
  const initGame = useCallback(() => {
    const newDeck = shuffleDeck(createDeck());
    const pHand = newDeck.splice(0, 8);
    const aHand = newDeck.splice(0, 8);
    const firstDiscard = newDeck.pop()!;
    
    setDeck(newDeck);
    setPlayerHand(pHand);
    setAiHand(aHand);
    setDiscardPile([firstDiscard]);
    setCurrentTurn('player');
    setStatus('playing');
    setActiveSuit(null);
    setWinner(null);
    setMessage("你的回合！出牌或摸牌。");
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Check for win
  useEffect(() => {
    if (status === 'playing') {
      if (playerHand.length === 0) {
        setWinner('player');
        setStatus('gameOver');
        setMessage("恭喜你赢了！");
      } else if (aiHand.length === 0) {
        setWinner('ai');
        setStatus('gameOver');
        setMessage("AI 赢了，再接再厉！");
      }
    }
  }, [playerHand.length, aiHand.length, status]);

  // AI Turn Logic
  useEffect(() => {
    if (currentTurn === 'ai' && status === 'playing') {
      const timer = setTimeout(() => {
        const topCard = discardPile[discardPile.length - 1];
        const playableCards = aiHand.filter(c => canPlayCard(c, topCard, activeSuit));

        if (playableCards.length > 0) {
          // AI Strategy: Prioritize non-8s first, unless it has to play an 8
          const nonEight = playableCards.find(c => c.rank !== '8');
          const cardToPlay = nonEight || playableCards[0];
          
          playCard(cardToPlay, 'ai');
        } else if (deck.length > 0) {
          drawCard('ai');
        } else {
          setMessage("摸牌堆已空，AI 跳过回合。");
          setCurrentTurn('player');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, status, aiHand, discardPile, activeSuit, deck.length]);

  const playCard = (card: CardData, turn: Turn) => {
    const isEight = card.rank === '8';
    
    if (turn === 'player') {
      setPlayerHand(prev => prev.filter(c => c.id !== card.id));
    } else {
      setAiHand(prev => prev.filter(c => c.id !== card.id));
    }

    setDiscardPile(prev => [...prev, card]);
    setActiveSuit(null); // Reset active suit unless it's an 8

    if (isEight) {
      if (turn === 'player') {
        setStatus('choosingSuit');
        setPendingEight(card);
        setMessage("你打出了 8！请选择一个花色。");
      } else {
        // AI chooses suit it has most of
        const suitCounts = aiHand.reduce((acc, c) => {
          acc[c.suit] = (acc[c.suit] || 0) + 1;
          return acc;
        }, {} as Record<Suit, number>);
        
        const bestSuit = (Object.keys(suitCounts) as Suit[]).sort((a, b) => suitCounts[b] - suitCounts[a])[0] || 'hearts';
        setActiveSuit(bestSuit);
        setMessage(`AI 打出了 8，并将花色改为 ${getSuitName(bestSuit)}。`);
        setCurrentTurn('player');
      }
    } else {
      setMessage(turn === 'player' ? "AI 的回合..." : "你的回合！");
      setCurrentTurn(turn === 'player' ? 'ai' : 'player');
    }
  };

  const drawCard = (turn: Turn) => {
    if (deck.length === 0) return;

    const newDeck = [...deck];
    const card = newDeck.pop()!;
    setDeck(newDeck);

    if (turn === 'player') {
      setPlayerHand(prev => [...prev, card]);
      setMessage("你摸了一张牌。");
      // Check if drawn card is playable
      const topCard = discardPile[discardPile.length - 1];
      if (!canPlayCard(card, topCard, activeSuit)) {
        setCurrentTurn('ai');
      }
    } else {
      setAiHand(prev => [...prev, card]);
      setMessage("AI 摸了一张牌。");
      setCurrentTurn('player');
    }
  };

  const handleSuitSelect = (suit: Suit) => {
    setActiveSuit(suit);
    setStatus('playing');
    setPendingEight(null);
    setMessage(`你选择了 ${getSuitName(suit)}。AI 的回合...`);
    setCurrentTurn('ai');
  };

  const getSuitName = (suit: Suit) => {
    switch (suit) {
      case 'hearts': return '红心';
      case 'diamonds': return '方块';
      case 'clubs': return '梅花';
      case 'spades': return '黑桃';
    }
  };

  if (status === 'dealing' && playerHand.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1a472a] text-white">
        <div className="text-2xl font-bold animate-pulse">正在初始化游戏...</div>
      </div>
    );
  }

  const topCard = discardPile[discardPile.length - 1];

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-between p-4 bg-transparent">
      {/* AI Hand */}
      <div className="w-full flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 bg-black/20 px-4 py-1 rounded-full border border-white/10">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-medium opacity-80">AI 选手 ({aiHand.length} 张)</span>
        </div>
        <div className="flex justify-center -space-x-12 sm:-space-x-16 h-24 sm:h-32">
          {aiHand.map((card, i) => (
            <Card key={card.id} card={card} isFaceUp={false} index={i} className="scale-75 origin-top" />
          ))}
        </div>
      </div>

      {/* Center Board */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="flex items-center gap-12 sm:gap-20">
          {/* Draw Pile */}
          <div className="relative group" onClick={() => currentTurn === 'player' && status === 'playing' && drawCard('player')}>
            <div className="absolute inset-0 bg-blue-900 rounded-xl translate-x-1 translate-y-1" />
            <div className="absolute inset-0 bg-blue-900 rounded-xl translate-x-2 translate-y-2" />
            <Card 
              card={{} as CardData} 
              isFaceUp={false} 
              className={`relative z-10 ${currentTurn === 'player' && status === 'playing' ? 'hover:scale-105 active:scale-95' : 'opacity-50'}`} 
            />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold opacity-60">
              摸牌堆 ({deck.length})
            </div>
          </div>

          {/* Discard Pile */}
          <div className="relative">
            <AnimatePresence mode="popLayout">
              {topCard && (
                <Card 
                  key={topCard.id} 
                  card={topCard} 
                  className="shadow-2xl"
                />
              )}
            </AnimatePresence>
            {activeSuit && (
              <motion.div 
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-yellow-400 z-50"
              >
                <span className={`text-2xl ${activeSuit === 'hearts' || activeSuit === 'diamonds' ? 'text-red-600' : 'text-slate-900'}`}>
                  {activeSuit === 'hearts' ? '♥' : activeSuit === 'diamonds' ? '♦' : activeSuit === 'clubs' ? '♣' : '♠'}
                </span>
              </motion.div>
            )}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold opacity-60">
              弃牌堆
            </div>
          </div>
        </div>

        {/* Status Message */}
        <motion.div 
          key={message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-center max-w-md"
        >
          <p className="text-lg font-medium tracking-wide">{message}</p>
        </motion.div>
      </div>

      {/* Player Hand */}
      <div className="w-full flex flex-col items-center gap-4 pb-4">
        <div className="flex items-center gap-2 bg-black/20 px-4 py-1 rounded-full border border-white/10">
          <div className={`w-2 h-2 rounded-full ${currentTurn === 'player' ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
          <span className="text-sm font-medium opacity-80">你的手牌 ({playerHand.length} 张)</span>
        </div>
        <div className="flex justify-center -space-x-10 sm:-space-x-12 h-36 sm:h-44 px-8 overflow-x-auto max-w-full no-scrollbar">
          {playerHand.map((card, i) => (
            <Card 
              key={card.id} 
              card={card} 
              index={i}
              isPlayable={currentTurn === 'player' && status === 'playing' && canPlayCard(card, topCard, activeSuit)}
              onClick={() => playCard(card, 'player')}
              className="hover:z-50"
            />
          ))}
        </div>
      </div>

      {/* Suit Selector Modal */}
      <AnimatePresence>
        {status === 'choosingSuit' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-white/20 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center"
            >
              <h2 className="text-2xl font-bold mb-2">疯狂 8 点！</h2>
              <p className="text-slate-400 mb-8">请选择接下来要匹配的花色：</p>
              <div className="grid grid-cols-2 gap-4">
                {SUITS.map(suit => (
                  <button
                    key={suit}
                    onClick={() => handleSuitSelect(suit)}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                  >
                    <span className={`text-4xl mb-2 group-hover:scale-125 transition-transform ${suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-white'}`}>
                      {suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : suit === 'clubs' ? '♣' : '♠'}
                    </span>
                    <span className="text-sm font-bold uppercase tracking-widest opacity-60">{getSuitName(suit)}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {status === 'gameOver' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-white text-slate-900 p-10 rounded-[40px] shadow-2xl max-w-md w-full text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />
              
              <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 text-yellow-600">
                <Trophy size={40} />
              </div>
              
              <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter">
                {winner === 'player' ? '你赢了！' : 'AI 获胜'}
              </h2>
              <p className="text-slate-500 mb-10 font-medium">
                {winner === 'player' ? '精彩的对局，你展现了非凡的策略！' : '别灰心，AI 只是运气好了一点点。'}
              </p>
              
              <button
                onClick={initGame}
                className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/20 mb-3"
              >
                <RotateCcw size={24} />
                再来一局
              </button>
              
              <button
                onClick={onBackToHome}
                className="w-full flex items-center justify-center gap-3 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all active:scale-95"
              >
                返回首页
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI Accents */}
      <div className="fixed top-4 left-4 flex gap-2 z-[60]">
        <button 
          onClick={onBackToHome}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-bold backdrop-blur-sm border border-white/10"
        >
          <RotateCcw size={16} className="-scale-x-100" />
          返回
        </button>
      </div>

      <div className="fixed top-4 right-4 flex gap-2">
        <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <Info size={20} className="opacity-60" />
        </button>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default GameBoard;
