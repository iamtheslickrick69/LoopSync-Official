import React from 'react';
import { motion } from 'framer-motion';

interface AIOrbProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  isListening?: boolean;
  isThinking?: boolean;
}

/**
 * AIOrb - A beautiful, Siri-style AI orb component
 * Multi-color gradient orb with flowing animations, realistic glow effects
 * Perfect for representing Coro AI assistant
 */
export const AIOrb: React.FC<AIOrbProps> = ({
  size = 'medium',
  className = '',
  isListening = false,
  isThinking = false,
}) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Main orb with animated gradient */}
      <motion.div
        className={`ai-orb ${sizeClasses[size]}`}
        animate={{
          scale: isListening ? [1, 1.1, 1] : isThinking ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: isListening ? 1.5 : isThinking ? 2 : 0,
          repeat: isListening || isThinking ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />

      {/* Outer glow rings - pulse when active */}
      {(isListening || isThinking) && (
        <>
          <motion.div
            className={`absolute ${sizeClasses[size]} rounded-full border-2 border-orb-blue/30`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            style={{
              filter: 'blur(2px)',
            }}
          />
          <motion.div
            className={`absolute ${sizeClasses[size]} rounded-full border-2 border-orb-purple/30`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.5,
            }}
            style={{
              filter: 'blur(2px)',
            }}
          />
        </>
      )}

      {/* Center particle effect for thinking state */}
      {isThinking && (
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              animate={{
                x: [0, Math.cos((i * Math.PI * 2) / 8) * 40, 0],
                y: [0, Math.sin((i * Math.PI * 2) / 8) * 40, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Listening state - voice wave effect */}
      {isListening && (
        <div className="absolute inset-0 flex items-center justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-white/80 rounded-full"
              animate={{
                height: [8, 24, 8],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AIOrb;
