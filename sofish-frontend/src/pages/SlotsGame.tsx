import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSpinSlots, useUserBalance } from '../hooks/useGames'
import { GlowingOrbs, GradientText, FloatingElement } from '../components/EnhancedUI'
import { GameHeader } from '../components/GameHeader'

interface SlotTheme {
  name: string
  subtitle: string
  symbols: string[]
  colors: {
    primary: string
    secondary: string
    accent: string
    glow: string
  }
  minBet: number
  multipliers: { [key: string]: number }
  background: string
  reels?: number
  layout?: 'classic' | 'megaways' | 'cluster'
}

const THEMES: { [key: string]: SlotTheme } = {
  pharaoh: {
    name: "PHARAOH'S TOMB",
    subtitle: 'Ancient Egyptian Riches',
    symbols: ['🪲', '🏺', '👁️', '⚱️', '🐫', '🛕', '🦅'],
    colors: { primary: '#FFD700', secondary: '#B8860B', accent: '#000080', glow: 'rgba(255, 215, 0, 0.5)' },
    minBet: 50,
    multipliers: { '👁️👁️👁️👁️👁️': 1000, '🪲🪲🪲🪲🪲': 500, '🏺🏺🏺🏺🏺': 250 },
    background: 'linear-gradient(135deg, #1A1100 0%, #332200 50%, #1A1100 100%)',
    reels: 5,
    layout: 'classic'
  },
  cyber: {
    name: 'CYBER SCATTER',
    subtitle: 'Neon Megaways',
    symbols: ['🤖', '⚡', '💻', '🔋', '🚀', '🛸', '🎆'],
    colors: { primary: '#FF00FF', secondary: '#00FFFF', accent: '#39FF14', glow: 'rgba(255, 0, 255, 0.5)' },
    minBet: 20,
    multipliers: { '🤖🤖🤖🤖🤖🤖': 5000, '⚡⚡⚡⚡⚡⚡': 1000, '💻💻💻💻💻💻': 500 },
    background: 'linear-gradient(135deg, #0d0221 0%, #260a42 50%, #0d0221 100%)',
    reels: 6,
    layout: 'megaways'
  },
  sugar: {
    name: 'SUGAR RUSH',
    subtitle: 'Sweet Cluster Pays',
    symbols: ['🍬', '🍭', '🧁', '🍩', '🍫', '🍦', '🍡'],
    colors: { primary: '#FF69B4', secondary: '#00FA9A', accent: '#87CEFA', glow: 'rgba(255, 105, 180, 0.5)' },
    minBet: 10,
    multipliers: { '🍬🍬🍬🍬🍬': 800, '🍭🍭🍭🍭🍭': 400, '🧁🧁🧁🧁🧁': 200 },
    background: 'linear-gradient(135deg, #FFB6C1 0%, #FFE4E1 50%, #FFC0CB 100%)',
    reels: 5,
    layout: 'cluster'
  },
  wildwest: {
    name: 'WILD WEST HEIST',
    subtitle: 'Frontier Hold & Spin',
    symbols: ['🤠', '🐎', '🧨', '🧲', '🚂', '💰', '🌵'],
    colors: { primary: '#DAA520', secondary: '#8B4513', accent: '#A0522D', glow: 'rgba(218, 165, 32, 0.5)' },
    minBet: 25,
    multipliers: { '🤠🤠🤠🤠': 400, '💰💰💰💰': 200, '🧨🧨🧨🧨': 100 },
    background: 'linear-gradient(135deg, #2b1d14 0%, #4a3424 50%, #2b1d14 100%)',
    reels: 4,
    layout: 'classic'
  },
  forest: {
    name: 'MYSTIC FOREST',
    subtitle: 'Enchanted Fantasy Wins',
    symbols: ['🧚', '🦄', '🍄', '🔮', '🦉', '🌿', '⭐'],
    colors: { primary: '#32CD32', secondary: '#8A2BE2', accent: '#FFD700', glow: 'rgba(50, 205, 50, 0.5)' },
    minBet: 15,
    multipliers: { '🧚🧚🧚🧚🧚': 800, '🦄🦄🦄🦄🦄': 400, '🔮🔮🔮🔮🔮': 200 },
    background: 'linear-gradient(135deg, #0a1f0a 0%, #1f0a33 50%, #0a1f0a 100%)',
    reels: 5,
    layout: 'classic'
  },
  ninja: {
    name: 'NEON NINJA',
    subtitle: 'Cyberpunk Action Megaways',
    symbols: ['🥷', '⚔️', '🏮', '🐉', '💨', '🌑', '⛩️'],
    colors: { primary: '#FF3131', secondary: '#1F51FF', accent: '#FFFFFF', glow: 'rgba(255, 49, 49, 0.5)' },
    minBet: 30,
    multipliers: { '🥷🥷🥷🥷🥷🥷': 6000, '🐉🐉🐉🐉🐉🐉': 1500, '⚔️⚔️⚔️⚔️⚔️⚔️': 600 },
    background: 'linear-gradient(135deg, #120305 0%, #0a1128 50%, #120305 100%)',
    reels: 6,
    layout: 'megaways'
  },
  pirate: {
    name: "PIRATE'S BOUNTY",
    subtitle: 'High Sea Treasures',
    symbols: ['🏴‍☠️', '⚓', '🦜', '🧭', '💣', '💰', '🗺️'],
    colors: { primary: '#DAA520', secondary: '#000080', accent: '#8B4513', glow: 'rgba(218, 165, 32, 0.5)' },
    minBet: 25,
    multipliers: { '🏴‍☠️🏴‍☠️🏴‍☠️🏴‍☠️🏴‍☠️': 1000, '💰💰💰💰💰': 500, '🗺️🗺️🗺️🗺️🗺️': 250 },
    background: 'linear-gradient(135deg, #0b1d3a 0%, #1a1100 50%, #0b1d3a 100%)',
    reels: 5,
    layout: 'classic'
  },
  galactic: {
    name: 'GALACTIC GEMS',
    subtitle: 'Deep Space Hold & Spin',
    symbols: ['💎', '🪐', '☄️', '🔭', '🛸', '🌟', '👨‍🚀'],
    colors: { primary: '#FF00FF', secondary: '#00FFFF', accent: '#000000', glow: 'rgba(255, 0, 255, 0.5)' },
    minBet: 40,
    multipliers: { '💎💎💎💎': 500, '☄️☄️☄️☄️': 250, '🛸🛸🛸🛸': 150 },
    background: 'linear-gradient(135deg, #05051a 0%, #1a051a 50%, #05051a 100%)',
    reels: 4,
    layout: 'classic'
  },
  olympus: {
    name: 'OLYMPUS GLORY',
    subtitle: 'Godly Megaways',
    symbols: ['⚡', '👑', '🏺', '🏛️', '🦅', '🔥', '🛡️'],
    colors: { primary: '#FFD700', secondary: '#FFFFFF', accent: '#87CEEB', glow: 'rgba(255, 215, 0, 0.5)' },
    minBet: 40,
    multipliers: { '⚡⚡⚡⚡⚡⚡': 8000, '👑👑👑👑👑👑': 2000, '🏺🏺🏺🏺🏺🏺': 800 },
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%)',
    reels: 6,
    layout: 'megaways'
  },
  vampire: {
    name: "VAMPIRE'S KISS",
    subtitle: 'Immortal Riches',
    symbols: ['🦇', '🩸', '🧛', '🏰', '🍷', '🥀', '🔮'],
    colors: { primary: '#FF0000', secondary: '#800080', accent: '#000000', glow: 'rgba(255, 0, 0, 0.5)' },
    minBet: 20,
    multipliers: { '🧛🧛🧛🧛🧛': 1200, '🩸🩸🩸🩸🩸': 600, '🦇🦇🦇🦇🦇': 300 },
    background: 'linear-gradient(135deg, #0f0000 0%, #3a0000 50%, #0f0000 100%)',
    reels: 5,
    layout: 'classic'
  },
  leprechaun: {
    name: "LEPRECHAUN'S LUCK",
    subtitle: 'Rainbow Jackpots',
    symbols: ['☘️', '🌈', '🎩', '🍀', '🍺', '💰', '🍄'],
    colors: { primary: '#00FF00', secondary: '#FFD700', accent: '#008000', glow: 'rgba(0, 255, 0, 0.5)' },
    minBet: 10,
    multipliers: { '☘️☘️☘️☘️☘️': 800, '🌈🌈🌈🌈🌈': 400, '🎩🎩🎩🎩🎩': 200 },
    background: 'linear-gradient(135deg, #004d00 0%, #008000 50%, #004d00 100%)',
    reels: 5,
    layout: 'classic'
  },
  viking: {
    name: 'VIKING VAULT',
    subtitle: 'Norse Hold & Spin',
    symbols: ['🪓', '🛡️', '⚔️', '🍺', '🚢', '🐺', '❄️'],
    colors: { primary: '#A0522D', secondary: '#4682B4', accent: '#C0C0C0', glow: 'rgba(160, 82, 45, 0.5)' },
    minBet: 25,
    multipliers: { '🪓🪓🪓🪓': 500, '🛡️🛡️🛡️🛡️': 250, '⚔️⚔️⚔️⚔️': 150 },
    background: 'linear-gradient(135deg, #1c2331 0%, #39424e 50%, #1c2331 100%)',
    reels: 4,
    layout: 'classic'
  },
  safari: {
    name: 'SAFARI STRIKE',
    subtitle: 'Wild Savannah Payouts',
    symbols: ['🦁', '🐘', '🦒', '🦓', '🐆', '🌍', '💎'],
    colors: { primary: '#FFA500', secondary: '#DEB887', accent: '#556B2F', glow: 'rgba(255, 165, 0, 0.5)' },
    minBet: 15,
    multipliers: { '🦁🦁🦁🦁🦁': 1000, '🐘🐘🐘🐘🐘': 500, '🦒🦒🦒🦒🦒': 250 },
    background: 'linear-gradient(135deg, #4b3621 0%, #8b5a2b 50%, #4b3621 100%)',
    reels: 5,
    layout: 'classic'
  },
  mafia: {
    name: 'MAFIA MAYHEM',
    subtitle: '1920s Syndicate Megaways',
    symbols: ['🕴️', '💣', '💼', '🍸', '💰', '🔫', '🎲'],
    colors: { primary: '#B22222', secondary: '#2F4F4F', accent: '#FFD700', glow: 'rgba(178, 34, 34, 0.5)' },
    minBet: 50,
    multipliers: { '🕴️🕴️🕴️🕴️🕴️🕴️': 7000, '💣💣💣💣💣💣': 2000, '💼💼💼💼💼💼': 1000 },
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
    reels: 6,
    layout: 'megaways'
  },
  classic: {
    name: '777 CLASSIC',
    subtitle: 'The Original Vegas Experience',
    symbols: ['🍒', '🔔', '💎', '⭐', 'BAR', '7️⃣', '💰'],
    colors: { primary: '#FFD700', secondary: '#FF6347', accent: '#9370DB', glow: 'rgba(255, 215, 0, 0.5)' },
    minBet: 10,
    multipliers: { '7️⃣7️⃣7️⃣': 777, '💎💎💎': 100, '⭐⭐⭐': 50 },
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
  },
  fruit: {
    name: 'FRUIT MANIA',
    subtitle: 'Sweet & Juicy Wins',
    symbols: ['🍒', '🍋', '🍊', '🍇', '🍉', '🍓', '🍌'],
    colors: { primary: '#FF1493', secondary: '#32CD32', accent: '#FF8C00', glow: 'rgba(255, 20, 147, 0.5)' },
    minBet: 5,
    multipliers: { '🍒🍒🍒': 50, '🍋🍋🍋': 40, '🍊🍊🍊': 30 },
    background: 'linear-gradient(135deg, #2d1f3d 0%, #1a2a1a 50%, #0f1f0f 100%)'
  },
  diamond: {
    name: 'DIAMOND DELUXE',
    subtitle: 'High Roller VIP Experience',
    symbols: ['💎', '💍', '👑', '⭐', '🔷', '✨', '🌟'],
    colors: { primary: '#00D9FF', secondary: '#9D00FF', accent: '#FFD700', glow: 'rgba(0, 217, 255, 0.5)' },
    minBet: 50,
    multipliers: { '💎💎💎': 500, '💍💍💍': 250, '👑👑👑': 200 },
    background: 'linear-gradient(135deg, #0a1628 0%, #1a0a28 50%, #0a0a1a 100%)'
  },
  dragon: {
    name: "DRAGON'S FORTUNE",
    subtitle: 'Legendary Asian Jackpots',
    symbols: ['🐉', '🔥', '🏮', '🎋', '⚡', '🌙', '🔮'],
    colors: { primary: '#FF0000', secondary: '#FFD700', accent: '#8B0000', glow: 'rgba(255, 0, 0, 0.5)' },
    minBet: 100,
    multipliers: { '🐉🐉🐉': 888, '🔥🔥🔥': 188, '🏮🏮🏮': 88 },
    background: 'linear-gradient(135deg, #2a0a0a 0%, #1a1a0a 50%, #0a0a0a 100%)'
  },
  vegas: {
    name: 'VEGAS NIGHTS',
    subtitle: 'Sin City Glamour',
    symbols: ['🎰', '🎲', '🃏', '💵', '🎩', '🍾', '🌃'],
    colors: { primary: '#FFD700', secondary: '#000000', accent: '#FF0000', glow: 'rgba(255, 215, 0, 0.5)' },
    minBet: 25,
    multipliers: { '🎰🎰🎰': 300, '🎲🎲🎲': 150, '🃏🃏🃏': 100 },
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
  },
  ocean: {
    name: 'OCEAN TREASURES',
    subtitle: 'Deep Sea Riches',
    symbols: ['🐚', '🦀', '🐙', '🐠', '⚓', '🏴‍☠️', '💰'],
    colors: { primary: '#00CED1', secondary: '#4169E1', accent: '#FFD700', glow: 'rgba(0, 206, 209, 0.5)' },
    minBet: 20,
    multipliers: { '🏴‍☠️🏴‍☠️🏴‍☠️': 400, '💰💰💰': 200, '⚓⚓⚓': 100 },
    background: 'linear-gradient(135deg, #0a1a2a 0%, #0a2a3a 50%, #0a0a1a 100%)'
  }
}

export function SlotsGame() {
  const { theme = 'classic' } = useParams<{ theme: string }>()
  const currentTheme = THEMES[theme] || THEMES.classic
  const numReels = currentTheme.reels || 3
  const [betAmount, setBetAmount] = useState(currentTheme.minBet)
  const [result, setResult] = useState<number[] | null>(null)
  const [winAmount, setWinAmount] = useState<number>(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showWin, setShowWin] = useState(false)
  const [reelPositions, setReelPositions] = useState(Array(numReels).fill(0))
  const [reelBlurs, setReelBlurs] = useState(Array(numReels).fill(0))
  const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, color: string }>>([])
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationType, setCelebrationType] = useState<'normal' | 'big' | 'mega' | 'jackpot'>('normal')
  const [isAnticipation, setIsAnticipation] = useState(false)
  const [redMode, setRedMode] = useState(false)
  const animationFrameRef = useRef<number>()

  const spinMutation = useSpinSlots()
  const { data: balanceData, refetch: refetchBalance } = useUserBalance()

  const SYMBOL_HEIGHT = 120

  // Reset bet when theme changes
  useEffect(() => {
    const reelsCount = currentTheme.reels || 3
    setBetAmount(currentTheme.minBet)
    setResult(null)
    setShowWin(false)
    setReelPositions(Array(reelsCount).fill(0))
    setReelBlurs(Array(reelsCount).fill(0))
  }, [theme, currentTheme.minBet, currentTheme.reels])

  const animateReel = (reelIndex: number, targetSymbol: number, duration: number) => {
    const startTime = Date.now()
    const startPosition = reelPositions[reelIndex]
    const totalSpins = 3 + reelIndex
    const targetPosition = targetSymbol + (totalSpins * currentTheme.symbols.length)
    const distance = (targetPosition - startPosition) * SYMBOL_HEIGHT

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      let eased: number
      let blurAmount: number

      if (progress < 0.15) {
        // Acceleration
        const accelProgress = progress / 0.15
        eased = 0.5 * Math.pow(accelProgress, 2) * 0.15
        blurAmount = accelProgress * 15
      } else if (progress < 0.85) {
        // Constant high speed
        const constProgress = (progress - 0.15) / 0.7
        eased = 0.075 + (constProgress * 0.75)
        blurAmount = 15
      } else {
        // Deceleration with elastic bounce
        const decelProgress = (progress - 0.85) / 0.15
        const c4 = (2 * Math.PI) / 4.5
        eased = 0.825 + (0.175 * (decelProgress === 1
          ? 1
          : Math.pow(2, -10 * decelProgress) * Math.sin((decelProgress * 10 - 0.75) * c4) + 1))
        blurAmount = Math.max(0, (1 - decelProgress) * 15)
      }

      const currentPositionPx = startPosition * SYMBOL_HEIGHT + distance * eased
      const currentPositionIndex = (currentPositionPx / SYMBOL_HEIGHT) % currentTheme.symbols.length

      setReelPositions(prev => {
        const newPositions = [...prev]
        newPositions[reelIndex] = currentPositionIndex
        return newPositions
      })

      setReelBlurs(prev => {
        const newBlurs = [...prev]
        newBlurs[reelIndex] = blurAmount
        return newBlurs
      })

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setReelPositions(prev => {
          const newPositions = [...prev]
          newPositions[reelIndex] = targetSymbol
          return newPositions
        })
        setReelBlurs(prev => {
          const newBlurs = [...prev]
          newBlurs[reelIndex] = 0
          return newBlurs
        })
      }
    }

    animate()
  }

  const handleSpin = async () => {
    if (isSpinning) return

    setIsSpinning(true)
    setShowWin(false)
    setShowCelebration(false)
    setParticles([])
    setIsAnticipation(false)
    setRedMode(false)

    try {
      const data = await spinMutation.mutateAsync({ betAmount, theme })

      const isTease = data.result.length > 2 && new Set(data.result.slice(0, data.result.length - 1)).size === 1
      const spinDurations = Array(numReels).fill(0).map((_, i) => isTease && i === numReels - 1 ? 4500 : 1600 + i * 400)

      if (isTease) {
        setTimeout(() => setIsAnticipation(true), 2000)
      }

      spinDurations.forEach((duration, reelIndex) => {
        animateReel(reelIndex, data.result[reelIndex] - 1, duration)
      })

      setTimeout(() => {
        setResult(data.result)
        setWinAmount(data.winAmount)
        setIsSpinning(false)
        setIsAnticipation(false)
        refetchBalance()

        if (data.isWin) {
          setShowWin(true)
          const multiplier = data.winAmount / betAmount

          if (multiplier >= 100) {
            setCelebrationType('jackpot')
            setRedMode(true)
            triggerJackpotCelebration()
          } else if (multiplier >= 50) {
            setCelebrationType('mega')
            setRedMode(true)
            triggerMegaWin()
          } else if (multiplier >= 10) {
            setCelebrationType('big')
            triggerBigWin()
          } else {
            setCelebrationType('normal')
            triggerNormalWin()
          }
          setShowCelebration(true)
        }
      }, Math.max(...spinDurations) + 300)

    } catch (error) {
      console.error('Spin failed:', error)
      setIsSpinning(false)
      setIsAnticipation(false)
    }
  }

  const createParticle = (color?: string) => {
    const id = Date.now() + Math.random()
    const particle = {
      id,
      x: 20 + Math.random() * 60,
      y: Math.random() * 100,
      color: color || currentTheme.colors.primary
    }
    setParticles(prev => [...prev, particle])
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id))
    }, 3000)
  }

  const triggerNormalWin = () => {
    for (let i = 0; i < 30; i++) {
      setTimeout(() => createParticle(), i * 30)
    }
  }

  const triggerBigWin = () => {
    for (let i = 0; i < 60; i++) {
      setTimeout(() => createParticle(), i * 20)
    }
  }

  const triggerMegaWin = () => {
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        createParticle([currentTheme.colors.primary, currentTheme.colors.secondary, currentTheme.colors.accent][Math.floor(Math.random() * 3)])
      }, i * 15)
    }
    document.body.classList.add('screen-shake')
    setTimeout(() => document.body.classList.remove('screen-shake'), 600)
  }

  const triggerJackpotCelebration = () => {
    for (let i = 0; i < 150; i++) {
      setTimeout(() => {
        createParticle(['#FFD700', '#FF6347', '#9370DB', '#00CED1', '#FF1493'][Math.floor(Math.random() * 5)])
      }, i * 10)
    }
    document.body.classList.add('screen-shake')
    setTimeout(() => document.body.classList.remove('screen-shake'), 1000)
  }

  const getSymbol = (value: number) => {
    const index = Math.floor(value + currentTheme.symbols.length) % currentTheme.symbols.length
    return currentTheme.symbols[index] || '❓'
  }

  const maxBet = () => {
    const max = Math.min(1000, balanceData?.balance || 0)
    setBetAmount(max)
  }

  return (
    <motion.div
      className="slots-page"
      style={{ background: currentTheme.background }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient Background Effects */}
      <div className="ambient-bg">
        <GlowingOrbs
          count={5}
          colors={[currentTheme.colors.primary, currentTheme.colors.secondary, currentTheme.colors.accent]}
        />
      </div>

      <div className="container">
        {/* Header */}
        <motion.div
          className="game-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/slots-hub" className="back-btn">
            <motion.span whileHover={{ x: -3 }}>←</motion.span>
            <span>All Slots</span>
          </Link>

          <motion.div
            className="header-info"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <h1 className="game-title" style={{ color: currentTheme.colors.primary }}>
              <GradientText gradient={`linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`}>
                {currentTheme.name}
              </GradientText>
            </h1>
            <p className="game-subtitle">{currentTheme.subtitle}</p>
          </motion.div>

          <motion.div
            className="balance-card"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="balance-label">BALANCE</div>
            <motion.div
              className="balance-value"
              style={{ color: currentTheme.colors.primary }}
              animate={showWin ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <FloatingElement duration={2} y={3}>
                <span className="balance-icon">💰</span>
              </FloatingElement>
              <span className="balance-amount">{balanceData?.balance?.toLocaleString() || 0}</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Slot Machine */}
        <div className={`slot-machine ${redMode ? 'red-mode-active' : ''}`}>
          {/* Top Decorations */}
          <div className="machine-top">
            {/* Dynamic Character & Jackpots */}
            <GameHeader
              redMode={redMode}
              isSpinning={isSpinning}
              characterNormal="⚡🧔⚡"
              characterRed="🌩️😡⚡"
            />

            <div className="marquee-lights">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className={`light ${isSpinning ? 'spinning' : ''}`}
                  style={{
                    background: redMode ? '#FF0000' : currentTheme.colors.primary,
                    animationDelay: `${i * 0.08}s`,
                    boxShadow: `0 0 10px ${redMode ? 'rgba(255,0,0,0.8)' : currentTheme.colors.glow}`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Main Display */}
          <div className={`machine-body ${isAnticipation ? 'anticipation-active' : ''}`}>
            {/* Win Line Indicator */}
            <div className="win-line" style={{ background: redMode ? '#FF0000' : currentTheme.colors.primary, boxShadow: `0 0 20px ${redMode ? 'rgba(255,0,0,0.8)' : currentTheme.colors.glow}` }} />

            {/* Reels */}
            <div className={`reels-container reels-${numReels}`}>
              {[...Array(numReels)].map((_, reelIndex) => (
                <div key={reelIndex} className={`reel-wrapper ${isAnticipation && reelIndex === numReels - 1 ? 'anticipation-glow' : ''}`}>
                  <div className="reel-frame" style={{ borderColor: redMode ? '#FF0000' : `${currentTheme.colors.primary}40` }}>
                    <div
                      className="reel"
                      style={{
                        filter: `blur(${reelBlurs[reelIndex]}px)`,
                        transform: `translateY(${-((reelPositions[reelIndex] % currentTheme.symbols.length) * SYMBOL_HEIGHT) + SYMBOL_HEIGHT}px)`
                      }}
                    >
                      {/* Extended symbols for smooth scrolling */}
                      {[...currentTheme.symbols, ...currentTheme.symbols, ...currentTheme.symbols].map((symbol, symIndex) => (
                        <div key={symIndex} className="symbol">
                          {symbol}
                        </div>
                      ))}
                    </div>

                    {/* Gradient Overlays */}
                    <div className="reel-gradient-top" />
                    <div className="reel-gradient-bottom" />
                  </div>

                  {/* Reel Glow on Stop */}
                  {!isSpinning && result && (
                    <div
                      className="reel-glow-effect"
                      style={{
                        animationDelay: `${reelIndex * 0.15}s`,
                        boxShadow: `0 0 40px ${currentTheme.colors.glow}, inset 0 0 30px ${currentTheme.colors.glow}`
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Current Result Display */}
            {result && !isSpinning && (
              <div className="result-display">
                {result.map((r, i) => (
                  <span key={i} className="result-symbol">
                    {getSymbol(r - 1)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Win Display Overlay */}
          {showCelebration && showWin && winAmount > 0 && (
            <div className={`win-overlay ${celebrationType}`}>
              <div className="win-content">
                {celebrationType === 'jackpot' && (
                  <>
                    <div className="win-icon">🎰</div>
                    <div className="win-label jackpot-text">JACKPOT!</div>
                  </>
                )}
                {celebrationType === 'mega' && (
                  <>
                    <div className="win-icon">🔥</div>
                    <div className="win-label mega-text">MEGA WIN!</div>
                  </>
                )}
                {celebrationType === 'big' && (
                  <>
                    <div className="win-icon">⭐</div>
                    <div className="win-label big-text">BIG WIN!</div>
                  </>
                )}
                {celebrationType === 'normal' && (
                  <>
                    <div className="win-icon">✨</div>
                    <div className="win-label">YOU WIN!</div>
                  </>
                )}
                <div className="win-amount" style={{ color: currentTheme.colors.primary }}>
                  +{winAmount.toLocaleString()}
                </div>
                <div className="win-tokens">TOKENS</div>
              </div>
            </div>
          )}

          {/* Particles */}
          <div className="particles-container">
            {particles.map(particle => (
              <div
                key={particle.id}
                className="particle"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  background: particle.color,
                  boxShadow: `0 0 10px ${particle.color}`
                }}
              />
            ))}
          </div>

          {/* Bottom Decorations */}
          <div className="machine-bottom">
            <div className="marquee-lights">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className={`light ${isSpinning ? 'spinning' : ''}`}
                  style={{
                    background: redMode ? '#FF0000' : currentTheme.colors.primary,
                    animationDelay: `${i * 0.08}s`,
                    boxShadow: `0 0 10px ${redMode ? 'rgba(255,0,0,0.8)' : currentTheme.colors.glow}`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-section">
          {/* Bet Controls */}
          <div className="bet-panel">
            <div className="panel-header">
              <span className="panel-icon">💰</span>
              <span>BET AMOUNT</span>
            </div>

            <div className="bet-controls">
              <button
                className="bet-btn minus"
                onClick={() => setBetAmount(Math.max(1, betAmount - 10))}
                disabled={isSpinning}
              >
                -10
              </button>

              <div className="bet-display">
                <input
                  type="number"
                  className="bet-input"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(1, Math.min(1000, Number(e.target.value))))}
                  disabled={isSpinning}
                />
              </div>

              <button
                className="bet-btn plus"
                onClick={() => setBetAmount(Math.min(1000, betAmount + 10))}
                disabled={isSpinning}
              >
                +10
              </button>
            </div>

            <div className="quick-bets">
              {[10, 25, 50, 100, 250, 500].map((amount) => (
                <button
                  key={amount}
                  className={`quick-bet ${betAmount === amount ? 'active' : ''}`}
                  onClick={() => setBetAmount(amount)}
                  disabled={isSpinning}
                  style={betAmount === amount ? { borderColor: currentTheme.colors.primary, color: currentTheme.colors.primary } : {}}
                >
                  {amount}
                </button>
              ))}
              <button className="quick-bet max-btn" onClick={maxBet} disabled={isSpinning}>
                MAX
              </button>
            </div>
          </div>

          {/* Spin Button */}
          <motion.button
            className={`spin-btn ${isSpinning ? 'spinning' : ''}`}
            onClick={handleSpin}
            disabled={isSpinning || !balanceData || balanceData.balance < betAmount}
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
              boxShadow: `0 8px 40px ${currentTheme.colors.glow}`
            }}
            whileHover={{ scale: 1.05, boxShadow: `0 12px 50px ${currentTheme.colors.glow}` }}
            whileTap={{ scale: 0.95 }}
            animate={isSpinning ? { rotate: [0, 5, -5, 0] } : {}}
            transition={isSpinning ? { duration: 0.3, repeat: Infinity } : { duration: 0.2 }}
          >
            <div className="spin-btn-content">
              <AnimatePresence mode="wait">
                {isSpinning ? (
                  <motion.div
                    key="spinning"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                  >
                    <motion.div
                      className="spinner"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <span>SPINNING...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="spin"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                  >
                    <motion.span
                      className="spin-icon"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      🎰
                    </motion.span>
                    <span>SPIN</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>

          {balanceData && balanceData.balance < betAmount && (
            <div className="insufficient-alert">
              <span>⚠️</span>
              <span>Insufficient balance</span>
              <Link to="/daily-bonus" className="claim-link">Claim Bonus</Link>
            </div>
          )}
        </div>

        {/* Paytable */}
        <div className="paytable">
          <div className="paytable-header">
            <span className="paytable-icon">📋</span>
            <h3>PAYTABLE</h3>
          </div>

          <div className="paytable-grid">
            {Object.entries(currentTheme.multipliers).slice(0, 3).map(([combo, mult]) => (
              <div key={combo} className="paytable-item jackpot-item">
                <div className="combo">{combo.replace(/(.)/gu, '$1 ').trim()}</div>
                <div className="payout" style={{ color: currentTheme.colors.primary }}>{mult}x</div>
                {mult >= 500 && <div className="jackpot-badge">JACKPOT</div>}
              </div>
            ))}
            <div className="paytable-item">
              <div className="combo">Any 3 Matching</div>
              <div className="payout">10x</div>
            </div>
            <div className="paytable-item">
              <div className="combo">Any 2 Matching</div>
              <div className="payout">2x</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .slots-page {
          min-height: 100vh;
          padding: 100px 0 60px;
          position: relative;
          overflow: hidden;
        }

        /* Ambient Background */
        .ambient-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
        }

        .ambient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(150px);
          opacity: 0.15;
          animation: float-orb 20s ease-in-out infinite;
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          top: -100px;
          right: -100px;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          bottom: -100px;
          left: -100px;
          animation-delay: -5s;
        }

        .orb-3 {
          width: 300px;
          height: 300px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -10s;
        }

        @keyframes float-orb {
          0%, 100% { transform: scale(1) translate(0, 0); }
          33% { transform: scale(1.1) translate(20px, -20px); }
          66% { transform: scale(0.9) translate(-20px, 20px); }
        }

        /* Header */
        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          position: relative;
          z-index: 1;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background: var(--bg-card);
          color: var(--text-primary);
        }

        .header-info {
          text-align: center;
        }

        .game-title {
          font-family: 'Cinzel', serif;
          font-size: 42px;
          font-weight: 900;
          margin-bottom: 8px;
          text-shadow: 0 0 30px currentColor;
          letter-spacing: 4px;
        }

        .game-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
          letter-spacing: 2px;
        }

        .balance-card {
          padding: 16px 24px;
          background: var(--bg-glass);
          border: 1px solid var(--border-gold);
          border-radius: var(--radius-lg);
          text-align: center;
        }

        .balance-label {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 2px;
          margin-bottom: 4px;
        }

        .balance-value {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Cinzel', serif;
          font-size: 24px;
          font-weight: 800;
        }

        .balance-icon {
          font-size: 20px;
        }

        /* Slot Machine */
        .slot-machine {
          max-width: 700px;
          margin: 0 auto 40px;
          position: relative;
          z-index: 1;
        }

        .machine-top, .machine-bottom {
          padding: 12px;
        }

        .marquee-lights {
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
        }

        .light {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: blink 2s ease-in-out infinite;
        }

        .light.spinning {
          animation: blink-fast 0.3s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }

        @keyframes blink-fast {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .machine-body {
          background: linear-gradient(180deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6));
          border-radius: var(--radius-xl);
          padding: 40px;
          position: relative;
          border: 2px solid var(--border-light);
          box-shadow: inset 0 0 80px rgba(0,0,0,0.8);
        }

        .win-line {
          position: absolute;
          left: 40px;
          right: 40px;
          top: 50%;
          height: 3px;
          transform: translateY(-50%);
          z-index: 10;
          border-radius: 2px;
          animation: line-glow 2s ease-in-out infinite;
        }

        @keyframes line-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .reels-container {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .reel-wrapper {
          position: relative;
        }

        .reel-frame {
          width: 160px;
          height: 360px;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.9) 100%);
          border-radius: var(--radius-lg);
          border: 3px solid;
          position: relative;
        }

        .reel {
          position: absolute;
          width: 100%;
          transition: filter 0.1s linear;
        }

        .symbol {
          height: ${SYMBOL_HEIGHT}px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 70px;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
        }

        .reel-gradient-top,
        .reel-gradient-bottom {
          position: absolute;
          left: 0;
          right: 0;
          height: 80px;
          pointer-events: none;
          z-index: 5;
        }

        .reel-gradient-top {
          top: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent);
        }

        .reel-gradient-bottom {
          bottom: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
        }

        .reel-glow-effect {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: var(--radius-lg);
          animation: reel-flash 0.6s ease-out;
          pointer-events: none;
        }

        @keyframes reel-flash {
          0% { opacity: 0; }
          30% { opacity: 1; }
          100% { opacity: 0; }
        }

        .result-display {
          display: none;
        }

        /* Win Overlay */
        .win-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 20;
          animation: win-popup 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes win-popup {
          0% { transform: translate(-50%, -50%) scale(0) rotate(-10deg); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.1) rotate(5deg); }
          100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
        }

        .win-content {
          padding: 32px 64px;
          background: var(--bg-glass-dark);
          backdrop-filter: blur(20px);
          border: 2px solid var(--border-gold);
          border-radius: var(--radius-xl);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), var(--shadow-gold);
        }

        .win-icon {
          font-size: 48px;
          margin-bottom: 8px;
          animation: bounce 0.5s ease-in-out infinite;
        }

        .win-label {
          font-family: 'Cinzel', serif;
          font-size: 28px;
          font-weight: 900;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .jackpot-text {
          font-size: 36px;
          background: linear-gradient(90deg, #FFD700, #FF6347, #FFD700);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: rainbow-text 1s linear infinite;
        }

        .mega-text {
          color: #FF6347;
          text-shadow: 0 0 20px rgba(255, 99, 71, 0.5);
        }

        .big-text {
          color: #9370DB;
          text-shadow: 0 0 20px rgba(147, 112, 219, 0.5);
        }

        @keyframes rainbow-text {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .win-amount {
          font-family: 'Cinzel', serif;
          font-size: 48px;
          font-weight: 900;
          text-shadow: 0 0 30px currentColor;
        }

        .win-tokens {
          font-size: 14px;
          color: var(--text-muted);
          letter-spacing: 2px;
        }

        /* Jackpot specific animations */
        .win-overlay.jackpot .win-content {
          animation: jackpot-glow 0.5s ease-in-out infinite alternate;
        }

        @keyframes jackpot-glow {
          0% { box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,215,0,0.3); }
          100% { box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(255,215,0,0.6); }
        }

        /* Particles */
        .particles-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: particle-rise 3s ease-out forwards;
        }

        @keyframes particle-rise {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-400px) scale(0) rotate(720deg);
            opacity: 0;
          }
        }

        /* Controls */
        .controls-section {
          max-width: 700px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .bet-panel {
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          padding: 24px;
          margin-bottom: 24px;
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          color: var(--gold);
          letter-spacing: 2px;
          margin-bottom: 20px;
        }

        .panel-icon {
          font-size: 16px;
        }

        .bet-controls {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .bet-btn {
          width: 60px;
          height: 50px;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .bet-btn:hover:not(:disabled) {
          background: var(--bg-card-hover);
          border-color: var(--gold);
        }

        .bet-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .bet-display {
          flex: 1;
        }

        .bet-input {
          width: 100%;
          height: 50px;
          background: var(--bg-dark);
          border: 2px solid var(--border-gold);
          border-radius: var(--radius-md);
          color: var(--gold);
          font-family: 'Cinzel', serif;
          font-size: 28px;
          font-weight: 800;
          text-align: center;
          outline: none;
        }

        .bet-input:focus {
          box-shadow: 0 0 20px var(--gold-glow);
        }

        .quick-bets {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .quick-bet {
          flex: 1;
          min-width: 60px;
          padding: 12px;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quick-bet:hover:not(:disabled) {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }

        .quick-bet.active {
          background: rgba(255,215,0,0.15);
        }

        .quick-bet:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .max-btn {
          background: var(--gradient-gold);
          color: var(--bg-deepest);
          border-color: transparent;
        }

        /* Spin Button */
        .spin-btn {
          width: 100%;
          padding: 24px;
          border: none;
          border-radius: var(--radius-xl);
          font-size: 24px;
          font-weight: 900;
          font-family: 'Cinzel', serif;
          color: var(--bg-deepest);
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 3px;
          margin-bottom: 16px;
        }

        .spin-btn:hover:not(:disabled) {
          transform: translateY(-4px);
          box-shadow: 0 12px 50px var(--gold-glow);
        }

        .spin-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .spin-btn-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .spin-icon {
          font-size: 28px;
        }

        .spin-btn .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(0,0,0,0.2);
          border-top-color: var(--bg-deepest);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .spin-btn.spinning {
          animation: btn-pulse 1s ease-in-out infinite;
        }

        @keyframes btn-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .insufficient-alert {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 71, 87, 0.1);
          border: 1px solid var(--red);
          border-radius: var(--radius-md);
          color: var(--red);
          font-size: 14px;
        }

        .claim-link {
          color: var(--gold);
          font-weight: 600;
          text-decoration: underline;
        }

        /* Paytable */
        .paytable {
          max-width: 700px;
          margin: 40px auto 0;
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          padding: 24px;
          position: relative;
          z-index: 1;
        }

        .paytable-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .paytable-icon {
          font-size: 24px;
        }

        .paytable-header h3 {
          font-family: 'Cinzel', serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--gold);
          letter-spacing: 2px;
        }

        .paytable-grid {
          display: grid;
          gap: 12px;
        }

        .paytable-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: var(--bg-dark);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
        }

        .paytable-item:hover {
          border-color: var(--border-gold);
          transform: translateX(8px);
        }

        .jackpot-item {
          border-color: var(--border-gold);
          background: rgba(255,215,0,0.05);
        }

        .combo {
          font-size: 24px;
        }

        .payout {
          font-family: 'Cinzel', serif;
          font-size: 20px;
          font-weight: 800;
        }

        .jackpot-badge {
          padding: 4px 12px;
          background: var(--gradient-gold);
          color: var(--bg-deepest);
          font-size: 10px;
          font-weight: 800;
          border-radius: var(--radius-full);
          letter-spacing: 1px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .slots-page {
            padding: 80px 0 40px;
          }

          .game-header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .back-btn {
            align-self: flex-start;
          }

          .game-title {
            font-size: 28px;
          }

          .machine-body {
            padding: 24px 16px;
          }

          .reels-container {
            gap: 12px;
          }

          .reel-frame {
            width: 100px;
            height: 240px;
          }

          .symbol {
            height: 80px;
            font-size: 45px;
          }

          .win-content {
            padding: 24px 32px;
          }

          .win-amount {
            font-size: 36px;
          }

          .bet-controls {
            flex-wrap: wrap;
          }

          .spin-btn {
            font-size: 18px;
            padding: 20px;
          }

          .combo {
            font-size: 18px;
          }
        }

        /* NEW POLISH STYLES */
        .red-mode-active .machine-body {
          box-shadow: 0 0 50px rgba(255, 0, 0, 0.8), inset 0 0 50px rgba(255, 0, 0, 0.5);
          border-color: #FF0000;
          animation: pulse-red 1s infinite alternate;
        }
        
        @keyframes pulse-red {
          from { box-shadow: 0 0 30px rgba(255, 0, 0, 0.6), inset 0 0 30px rgba(255, 0, 0, 0.4); }
          to { box-shadow: 0 0 60px rgba(255, 0, 0, 1), inset 0 0 60px rgba(255, 0, 0, 0.8); }
        }

        .anticipation-active .reel-wrapper:not(:last-child) {
          opacity: 0.5;
          filter: grayscale(0.5);
        }

        .anticipation-glow {
          box-shadow: 0 0 40px #00D9FF;
          border-radius: 10px;
          animation: pulse-anticipation 0.2s infinite;
          z-index: 10;
        }
        
        @keyframes pulse-anticipation {
          0% { box-shadow: 0 0 20px #00D9FF; }
          50% { box-shadow: 0 0 60px #00D9FF; }
          100% { box-shadow: 0 0 20px #00D9FF; }
        }
      `}</style>
    </motion.div>
  )
}
