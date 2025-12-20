import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useState, useEffect, useRef, ReactNode } from 'react'

// Professional Casino Image Assets
export const CASINO_IMAGES = {
  // Hero backgrounds
  heroBackground: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=1920&q=80',
  casinoFloor: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&q=80',
  neonLights: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80',

  // Game thumbnails
  slots: {
    classic: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&q=80',
    vegas: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80',
    fruit: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
    diamond: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
    dragon: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    ocean: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
  },

  roulette: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&q=80',
  blackjack: 'https://images.unsplash.com/photo-1541278107931-e006523892df?w=800&q=80',
  poker: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?w=800&q=80',
  fishing: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',

  // VIP & Luxury
  vip: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&q=80',
  luxury: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&q=80',
  goldCoins: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80',
  chips: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=800&q=80',

  // Cards & Dice
  cards: 'https://images.unsplash.com/photo-1529480780361-0f5a5a1f7b10?w=800&q=80',
  dice: 'https://images.unsplash.com/photo-1522069213448-443a614da9b6?w=800&q=80',
}

// Animation variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
}

export const fadeInDown = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
}

export const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
}

export const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

// Parallax Image Component
interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  speed?: number
}

export function ParallaxImage({ src, alt, className = '', speed = 0.5 }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const scrolled = window.scrollY
        setOffsetY(scrolled * speed)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div ref={ref} className={`parallax-container ${className}`} style={{ overflow: 'hidden' }}>
      <motion.img
        src={src}
        alt={alt}
        style={{
          y: offsetY,
          scale: 1.2,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </div>
  )
}

// Tilt Card Component
interface TiltCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  intensity?: number
}

export function TiltCard({ children, className = '', glowColor = '#FFD700', intensity = 15 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-0.5, 0.5], [intensity, -intensity])
  const rotateY = useTransform(x, [-0.5, 0.5], [-intensity, intensity])

  const springConfig = { stiffness: 300, damping: 30 }
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`tilt-card ${className}`}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {children}
      <motion.div
        className="tilt-glow"
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: 'inherit',
          background: `radial-gradient(circle at ${50 + x.get() * 50}% ${50 + y.get() * 50}%, ${glowColor}40, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: -1
        }}
      />
    </motion.div>
  )
}

// Magnetic Button Component
interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function MagneticButton({ children, className = '', onClick }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.3)
    y.set((e.clientY - centerY) * 0.3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      className={`magnetic-btn ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}

// Animated Counter Component
interface AnimatedCounterProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
  decimals?: number
}

export function AnimatedCounter({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const startTime = Date.now()
    const startValue = displayValue
    const endValue = value

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (endValue - startValue) * eased

      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return (
    <motion.span
      className={className}
      animate={isAnimating ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      {prefix}{displayValue.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}{suffix}
    </motion.span>
  )
}

// Glowing Orb Background
interface GlowingOrbsProps {
  count?: number
  colors?: string[]
}

export function GlowingOrbs({ count = 5, colors = ['#FFD700', '#8B5CF6', '#00D4AA', '#FF4757'] }: GlowingOrbsProps) {
  const orbs = Array.from({ length: count }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    size: 200 + Math.random() * 400,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 15 + Math.random() * 20
  }))

  return (
    <div className="glowing-orbs" style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0
    }}>
      {orbs.map(orb => (
        <motion.div
          key={orb.id}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: orb.color,
            filter: 'blur(100px)',
            opacity: 0.3,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 60, 0],
            scale: [1, 1.2, 0.9, 1]
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

// Shimmer Effect Component
interface ShimmerProps {
  children: ReactNode
  className?: string
}

export function Shimmer({ children, className = '' }: ShimmerProps) {
  return (
    <div className={`shimmer-wrapper ${className}`} style={{ position: 'relative', overflow: 'hidden' }}>
      {children}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          transform: 'skewX(-20deg)'
        }}
        animate={{
          x: ['-200%', '200%']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}

// Floating Elements
interface FloatingElementProps {
  children: ReactNode
  delay?: number
  duration?: number
  y?: number
}

export function FloatingElement({ children, delay = 0, duration = 3, y = 15 }: FloatingElementProps) {
  return (
    <motion.div
      animate={{
        y: [-y, y, -y]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay
      }}
    >
      {children}
    </motion.div>
  )
}

// Reveal on Scroll Component
interface RevealProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
}

export function Reveal({ children, className = '', direction = 'up', delay = 0 }: RevealProps) {
  const getInitial = () => {
    switch (direction) {
      case 'up': return { opacity: 0, y: 30 }
      case 'down': return { opacity: 0, y: -30 }
      case 'left': return { opacity: 0, x: -50 }
      case 'right': return { opacity: 0, x: 50 }
      default: return { opacity: 0, y: 30 }
    }
  }

  return (
    <motion.div
      className={className}
      initial={getInitial()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}

// Gradient Text Component
interface GradientTextProps {
  children: ReactNode
  gradient?: string
  className?: string
  animate?: boolean
}

export function GradientText({
  children,
  gradient = 'linear-gradient(135deg, #FFE55C, #FFD700, #FFA500)',
  className = '',
  animate = false
}: GradientTextProps) {
  return (
    <motion.span
      className={className}
      style={{
        background: gradient,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundSize: animate ? '200% 200%' : '100% 100%'
      }}
      animate={animate ? {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      } : {}}
      transition={animate ? {
        duration: 5,
        repeat: Infinity,
        ease: 'linear'
      } : {}}
    >
      {children}
    </motion.span>
  )
}

// Particle Explosion
interface ParticleExplosionProps {
  trigger: boolean
  x: number
  y: number
  colors?: string[]
  particleCount?: number
}

export function ParticleExplosion({
  trigger,
  x,
  y,
  colors = ['#FFD700', '#FF6347', '#00D4AA', '#8B5CF6'],
  particleCount = 30
}: ParticleExplosionProps) {
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    color: colors[Math.floor(Math.random() * colors.length)],
    angle: (360 / particleCount) * i + Math.random() * 30,
    velocity: 100 + Math.random() * 200,
    size: 4 + Math.random() * 8
  }))

  return (
    <AnimatePresence>
      {trigger && (
        <div style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 9999 }}>
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              style={{
                position: 'absolute',
                width: particle.size,
                height: particle.size,
                borderRadius: '50%',
                background: particle.color,
                boxShadow: `0 0 10px ${particle.color}`
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [1, 0],
                x: Math.cos(particle.angle * Math.PI / 180) * particle.velocity,
                y: Math.sin(particle.angle * Math.PI / 180) * particle.velocity
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}

// Neon Border Component
interface NeonBorderProps {
  children: ReactNode
  color?: string
  className?: string
  animated?: boolean
}

export function NeonBorder({ children, color = '#FFD700', className = '', animated = true }: NeonBorderProps) {
  return (
    <motion.div
      className={`neon-border-wrapper ${className}`}
      style={{
        position: 'relative',
        padding: 2,
        borderRadius: 'inherit'
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: `linear-gradient(90deg, ${color}, ${color}88, ${color})`,
          backgroundSize: '200% 100%',
          boxShadow: `0 0 20px ${color}40, 0 0 40px ${color}20`
        }}
        animate={animated ? {
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <div style={{
        position: 'relative',
        background: 'var(--bg-card)',
        borderRadius: 'inherit'
      }}>
        {children}
      </div>
    </motion.div>
  )
}

// Game Card Component with Image
interface GameCardProps {
  title: string
  description: string
  image: string
  badge?: string
  badgeColor?: string
  rtp?: string
  maxWin?: string
  href: string
  icon?: string
}

export function GameCard({
  title,
  description,
  image,
  badge,
  badgeColor = '#FFD700',
  rtp,
  maxWin,
  href,
  icon
}: GameCardProps) {
  return (
    <motion.a
      href={href}
      className="game-card-enhanced"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'block',
        textDecoration: 'none',
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)'
      }}
    >
      {/* Image Container */}
      <div style={{
        position: 'relative',
        height: 180,
        overflow: 'hidden'
      }}>
        <motion.img
          src={image}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)'
        }} />

        {/* Icon Overlay */}
        {icon && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 60,
            opacity: 0.9,
            filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.5))'
          }}>
            {icon}
          </div>
        )}

        {/* Badge */}
        {badge && (
          <motion.div
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              padding: '6px 14px',
              background: badgeColor,
              color: '#000',
              fontSize: 11,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: 1,
              borderRadius: 20,
              boxShadow: `0 4px 15px ${badgeColor}50`
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            {badge}
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 24 }}>
        <h3 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 20,
          fontWeight: 700,
          color: '#fff',
          marginBottom: 8
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          marginBottom: 16,
          lineHeight: 1.5
        }}>
          {description}
        </p>

        {/* Stats */}
        {(rtp || maxWin) && (
          <div style={{
            display: 'flex',
            gap: 24,
            paddingTop: 16,
            borderTop: '1px solid var(--border-subtle)'
          }}>
            {rtp && (
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  RTP
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{rtp}</div>
              </div>
            )}
            {maxWin && (
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Max Win
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gold)' }}>{maxWin}</div>
              </div>
            )}
          </div>
        )}

        {/* Play Button */}
        <motion.div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 16,
            color: 'var(--gold)',
            fontWeight: 600
          }}
          whileHover={{ x: 5 }}
        >
          <span>Play Now</span>
          <span>→</span>
        </motion.div>
      </div>

      {/* Hover Glow */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          border: '2px solid transparent',
          pointerEvents: 'none'
        }}
        whileHover={{
          borderColor: 'var(--gold)',
          boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)'
        }}
      />
    </motion.a>
  )
}

// Jackpot Display Component
interface JackpotDisplayProps {
  amount: number
  label?: string
}

export function JackpotDisplay({ amount, label = 'PROGRESSIVE JACKPOT' }: JackpotDisplayProps) {
  const [displayAmount, setDisplayAmount] = useState(amount)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true)
      setDisplayAmount(prev => prev + Math.random() * 50 + 10)
      setTimeout(() => setIsUpdating(false), 300)
    }, 2000 + Math.random() * 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="jackpot-display"
      style={{
        position: 'relative',
        padding: '24px 48px',
        background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.1))',
        border: '2px solid var(--gold)',
        borderRadius: 20,
        textAlign: 'center',
        overflow: 'hidden'
      }}
      animate={isUpdating ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      {/* Animated Border */}
      <motion.div
        style={{
          position: 'absolute',
          inset: -2,
          background: 'linear-gradient(90deg, #FFD700, #FF6347, #FFD700, #00D4AA, #FFD700)',
          backgroundSize: '400% 100%',
          borderRadius: 'inherit',
          zIndex: -1,
          filter: 'blur(3px)'
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      <motion.div
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: 'var(--gold)',
          letterSpacing: 3,
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8
        }}
      >
        <span>🎰</span>
        {label}
      </motion.div>

      <div style={{
        fontFamily: "'Cinzel', serif",
        fontSize: 48,
        fontWeight: 900,
        background: 'linear-gradient(135deg, #FFE55C, #FFD700, #FFA500)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        ${displayAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>

      {/* Glow Effect */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '150%',
          height: '150%',
          background: 'radial-gradient(ellipse, rgba(255,215,0,0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  )
}

// Live Wins Ticker
interface LiveWin {
  id: number
  player: string
  game: string
  amount: number
}

interface LiveWinsTickerProps {
  wins: LiveWin[]
}

export function LiveWinsTicker({ wins }: LiveWinsTickerProps) {
  return (
    <div style={{
      overflow: 'hidden',
      padding: '16px 0',
      background: 'var(--bg-dark)',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
        paddingLeft: 24
      }}>
        <motion.div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#FF4757'
          }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span style={{ fontSize: 12, fontWeight: 700, color: '#FF4757', letterSpacing: 1 }}>
          LIVE WINS
        </span>
      </div>

      <motion.div
        style={{
          display: 'flex',
          gap: 16
        }}
        animate={{
          x: [0, -1000]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        {[...wins, ...wins].map((win, i) => (
          <motion.div
            key={`${win.id}-${i}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: 'var(--bg-glass)',
              borderRadius: 30,
              whiteSpace: 'nowrap',
              border: '1px solid var(--border-subtle)'
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <span style={{ fontWeight: 600 }}>{win.player}</span>
            <span style={{ color: 'var(--text-muted)' }}>won</span>
            <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
              {win.amount.toLocaleString()}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>in</span>
            <span style={{ color: 'var(--text-secondary)' }}>{win.game}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

// VIP Tier Card
interface VIPTierCardProps {
  name: string
  icon: string
  color: string
  cashback: string
  bonus: string
  index: number
}

export function VIPTierCard({ name, icon, color, cashback, bonus, index }: VIPTierCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.03 }}
      style={{
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-light)',
        borderRadius: 20,
        padding: 32,
        textAlign: 'center',
        minWidth: 180,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Glow Background */}
      <motion.div
        style={{
          position: 'absolute',
          top: -50,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 200,
          height: 200,
          background: color,
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.2
        }}
      />

      <FloatingElement duration={2.5} delay={index * 0.3}>
        <div style={{
          fontSize: 48,
          marginBottom: 16,
          filter: `drop-shadow(0 0 20px ${color})`
        }}>
          {icon}
        </div>
      </FloatingElement>

      <h4 style={{
        fontFamily: "'Cinzel', serif",
        fontSize: 18,
        fontWeight: 700,
        color: color,
        marginBottom: 20
      }}>
        {name}
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{cashback}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
            Cashback
          </div>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{bonus}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
            Bonus
          </div>
        </div>
      </div>

      {/* Hover Border Effect */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          border: '2px solid transparent',
          pointerEvents: 'none'
        }}
        whileHover={{
          borderColor: color,
          boxShadow: `0 0 30px ${color}40`
        }}
      />
    </motion.div>
  )
}

// Feature Card
interface FeatureCardProps {
  icon: string
  title: string
  description: string
  index: number
}

export function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      style={{
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-light)',
        borderRadius: 20,
        padding: '40px 32px',
        textAlign: 'center'
      }}
    >
      <motion.div
        style={{
          width: 80,
          height: 80,
          margin: '0 auto 24px',
          background: 'linear-gradient(135deg, var(--bg-card), var(--bg-dark))',
          border: '1px solid var(--border-light)',
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        {icon}
      </motion.div>

      <h3 style={{
        fontFamily: "'Cinzel', serif",
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 12,
        color: '#fff'
      }}>
        {title}
      </h3>

      <p style={{
        fontSize: 14,
        color: 'var(--text-secondary)',
        lineHeight: 1.6
      }}>
        {description}
      </p>
    </motion.div>
  )
}
