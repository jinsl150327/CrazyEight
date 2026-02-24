import React from 'react';
import { motion } from 'motion/react';
import { CardData, Suit } from '../types';

interface CardProps {
  card: CardData;
  isFaceUp?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
  index?: number;
}

const SuitIcon = ({ suit, className }: { suit: Suit; className?: string }) => {
  switch (suit) {
    case 'hearts': return <span className={`text-red-600 ${className}`}>♥</span>;
    case 'diamonds': return <span className={`text-red-600 ${className}`}>♦</span>;
    case 'clubs': return <span className={`text-slate-900 ${className}`}>♣</span>;
    case 'spades': return <span className={`text-slate-900 ${className}`}>♠</span>;
  }
};

const Card: React.FC<CardProps> = ({ card, isFaceUp = true, onClick, isPlayable = false, className = "", index = 0 }) => {
  if (!card && isFaceUp) return null;

  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={isPlayable ? { y: -20, scale: 1.05 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={`relative w-24 h-36 sm:w-28 sm:h-40 rounded-xl shadow-lg cursor-pointer transition-shadow duration-200 
        ${isFaceUp ? 'bg-white' : 'bg-blue-800 border-4 border-white'} 
        ${isPlayable ? 'ring-4 ring-yellow-400 shadow-yellow-400/50' : 'hover:shadow-xl'}
        ${className}`}
      style={{
        zIndex: index,
      }}
    >
      {isFaceUp ? (
        <div className="flex flex-col h-full p-2 select-none">
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-center">
              <span className={`text-lg font-bold leading-none ${card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-600' : 'text-slate-900'}`}>
                {card.rank}
              </span>
              <SuitIcon suit={card.suit} className="text-sm" />
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <SuitIcon suit={card.suit} className="text-4xl" />
          </div>
          
          <div className="flex justify-end items-end rotate-180">
            <div className="flex flex-col items-center">
              <span className={`text-lg font-bold leading-none ${card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-600' : 'text-slate-900'}`}>
                {card.rank}
              </span>
              <SuitIcon suit={card.suit} className="text-sm" />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-16 h-24 border-2 border-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white/20 text-4xl font-bold">8</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Card;
