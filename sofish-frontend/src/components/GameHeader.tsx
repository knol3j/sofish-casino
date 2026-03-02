import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface GameHeaderProps {
    redMode: boolean
    isSpinning: boolean
    characterNormal?: string
    characterRed?: string
}

export function GameHeader({ redMode, isSpinning, characterNormal = '🎲', characterRed = '🔥🎰🔥' }: GameHeaderProps) {
    const [jackpots, setJackpots] = useState({ mega: 1000000, major: 100000, minor: 10000, mini: 1000 })

    useEffect(() => {
        const interval = setInterval(() => {
            setJackpots(prev => ({
                mega: prev.mega + Math.random() * 10,
                major: prev.major + Math.random() * 5,
                minor: prev.minor + Math.random() * 2,
                mini: prev.mini + Math.random() * 1
            }))
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className={`dynamic-header ${redMode ? 'red-mode' : ''}`}>
            <motion.div
                className={`character-dynamic ${redMode ? 'enraged' : ''}`}
                animate={isSpinning ? { y: [-5, 5, -5] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
            >
                {redMode ? characterRed : characterNormal}
            </motion.div>
            <div className="jackpots-display">
                <div className="jackpot-tier mega">
                    <span className="tier-name">MEGA</span>
                    <span className="tier-value">${Math.floor(jackpots.mega).toLocaleString()}</span>
                </div>
                <div className="jackpot-tier major">
                    <span className="tier-name">MAJOR</span>
                    <span className="tier-value">${Math.floor(jackpots.major).toLocaleString()}</span>
                </div>
                <div className="jackpot-tier minor">
                    <span className="tier-name">MINOR</span>
                    <span className="tier-value">${Math.floor(jackpots.minor).toLocaleString()}</span>
                </div>
                <div className="jackpot-tier mini">
                    <span className="tier-name">MINI</span>
                    <span className="tier-value">${Math.floor(jackpots.mini).toLocaleString()}</span>
                </div>
            </div>
            <style>{`
        /* NEW POLISH STYLES */
        .dynamic-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
          position: relative;
        }
        
        .character-dynamic {
          font-size: 64px;
          margin-bottom: 10px;
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
          transition: all 0.3s ease;
          z-index: 10;
        }

        .character-dynamic.enraged {
          transform: scale(1.2);
          text-shadow: 0 0 30px rgba(255, 0, 0, 0.9);
          animation: character-shake 0.5s infinite;
        }
        
        @keyframes character-shake {
          0% { transform: translate(1px, 1px) rotate(0deg) scale(1.2); }
          10% { transform: translate(-1px, -2px) rotate(-1deg) scale(1.2); }
          20% { transform: translate(-3px, 0px) rotate(1deg) scale(1.2); }
          30% { transform: translate(3px, 2px) rotate(0deg) scale(1.2); }
          40% { transform: translate(1px, -1px) rotate(1deg) scale(1.2); }
          50% { transform: translate(-1px, 2px) rotate(-1deg) scale(1.2); }
          60% { transform: translate(-3px, 1px) rotate(0deg) scale(1.2); }
          70% { transform: translate(3px, 1px) rotate(-1deg) scale(1.2); }
          80% { transform: translate(-1px, -1px) rotate(1deg) scale(1.2); }
          90% { transform: translate(1px, 2px) rotate(0deg) scale(1.2); }
          100% { transform: translate(1px, -2px) rotate(-1deg) scale(1.2); }
        }

        .jackpots-display {
          display: flex;
          gap: 15px;
          background: rgba(0, 0, 0, 0.6);
          padding: 10px 20px;
          border-radius: 12px;
          border: 2px solid var(--gold);
          box-shadow: inset 0 0 20px rgba(255, 215, 0, 0.2), 0 0 15px rgba(255, 215, 0, 0.4);
        }

        .jackpot-tier {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 100px;
        }

        .tier-name {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          color: #fff;
          text-shadow: 0 0 5px currentColor;
        }
        
        .tier-value {
          font-family: 'Cinzel', serif;
          font-weight: 900;
          font-size: 18px;
        }

        .jackpot-tier.mega .tier-name { color: #FFD700; }
        .jackpot-tier.mega .tier-value { color: #FFF; text-shadow: 0 0 10px #FFD700; }
        
        .jackpot-tier.major .tier-name { color: #FF6347; }
        .jackpot-tier.major .tier-value { color: #FFF; text-shadow: 0 0 10px #FF6347; }
        
        .jackpot-tier.minor .tier-name { color: #00CED1; }
        .jackpot-tier.minor .tier-value { color: #FFF; text-shadow: 0 0 10px #00CED1; }
        
        .jackpot-tier.mini .tier-name { color: #32CD32; }
        .jackpot-tier.mini .tier-value { color: #FFF; text-shadow: 0 0 10px #32CD32; }
      `}</style>
        </div>
    )
}
