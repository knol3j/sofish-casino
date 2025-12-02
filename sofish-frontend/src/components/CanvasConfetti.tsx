import { useEffect, useRef, useCallback, useState } from 'react'

interface ConfettiParticle {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  width: number
  height: number
  color: string
  type: 'rect' | 'circle' | 'coin' | 'star'
  gravity: number
  drag: number
  wobble: number
  wobbleSpeed: number
  opacity: number
}

const COLORS = [
  '#FFD700', '#FFA500', '#FF6B6B', '#A855F7', '#00D4AA',
  '#00BFFF', '#FF1493', '#32CD32', '#FF4500', '#9370DB'
]

const COIN_IMAGE = '🪙'
const STAR_IMAGE = '⭐'
const DIAMOND_IMAGE = '💎'

interface CanvasConfettiProps {
  active: boolean
  intensity?: 'low' | 'medium' | 'high' | 'jackpot'
  duration?: number
  onComplete?: () => void
}

export function CanvasConfetti({
  active,
  intensity = 'medium',
  duration = 5000,
  onComplete
}: CanvasConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<ConfettiParticle[]>([])
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>(0)

  const createParticle = useCallback((centerX?: number, centerY?: number): ConfettiParticle => {
    const canvas = canvasRef.current
    if (!canvas) return {} as ConfettiParticle

    const x = centerX ?? Math.random() * canvas.width
    const y = centerY ?? -20
    const angle = Math.random() * Math.PI * 2
    const velocity = Math.random() * 8 + 4

    const types: Array<'rect' | 'circle' | 'coin' | 'star'> = ['rect', 'rect', 'rect', 'circle', 'coin', 'star']

    return {
      x,
      y,
      vx: Math.cos(angle) * velocity * (Math.random() - 0.5) * 4,
      vy: Math.sin(angle) * velocity - Math.random() * 4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      width: Math.random() * 12 + 6,
      height: Math.random() * 8 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      type: types[Math.floor(Math.random() * types.length)],
      gravity: 0.2 + Math.random() * 0.1,
      drag: 0.99,
      wobble: 0,
      wobbleSpeed: Math.random() * 0.1,
      opacity: 1
    }
  }, [])

  useEffect(() => {
    if (!active) {
      particlesRef.current = []
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    // Particle counts based on intensity
    const particleCounts = {
      low: 100,
      medium: 200,
      high: 400,
      jackpot: 800
    }

    const spawnRate = {
      low: 50,
      medium: 100,
      high: 150,
      jackpot: 200
    }

    startTimeRef.current = Date.now()
    let lastSpawn = 0
    const spawnInterval = intensity === 'jackpot' ? 30 : intensity === 'high' ? 50 : 80

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTimeRef.current

      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn new particles during active phase
      if (elapsed < duration * 0.6 && now - lastSpawn > spawnInterval) {
        const count = Math.floor(spawnRate[intensity] / 10)
        for (let i = 0; i < count; i++) {
          if (particlesRef.current.length < particleCounts[intensity]) {
            // Spawn from random positions along top and sides
            const spawnX = Math.random() * canvas.width
            const spawnY = Math.random() < 0.7 ? -20 : Math.random() * canvas.height * 0.3
            particlesRef.current.push(createParticle(spawnX, spawnY))
          }
        }
        lastSpawn = now
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        // Physics
        p.vy += p.gravity
        p.vx *= p.drag
        p.vy *= p.drag
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed
        p.wobble += p.wobbleSpeed
        p.x += Math.sin(p.wobble) * 0.5

        // Fade out
        if (elapsed > duration * 0.7) {
          p.opacity -= 0.02
        }

        // Remove if off screen or faded
        if (p.y > canvas.height + 50 || p.opacity <= 0) {
          return false
        }

        // Draw particle
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = p.opacity

        if (p.type === 'rect') {
          ctx.fillStyle = p.color
          ctx.shadowColor = p.color
          ctx.shadowBlur = 10
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height)
        } else if (p.type === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.width / 2, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.shadowColor = p.color
          ctx.shadowBlur = 15
          ctx.fill()
        } else if (p.type === 'coin' || p.type === 'star') {
          ctx.font = `${p.width * 2}px Arial`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.shadowColor = '#FFD700'
          ctx.shadowBlur = 20
          ctx.fillText(p.type === 'coin' ? COIN_IMAGE : (Math.random() > 0.5 ? STAR_IMAGE : DIAMOND_IMAGE), 0, 0)
        }

        ctx.restore()
        return true
      })

      // Continue animation or complete
      if (particlesRef.current.length > 0 || elapsed < duration) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        onComplete?.()
      }
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [active, intensity, duration, createParticle, onComplete])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10000
      }}
    />
  )
}

// Golden rain effect for wins
export function GoldenRain({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    interface Coin {
      x: number
      y: number
      vy: number
      rotation: number
      rotationSpeed: number
      size: number
      emoji: string
    }

    const coins: Coin[] = []
    const emojis = ['🪙', '💰', '💵', '💎', '⭐', '✨']

    for (let i = 0; i < 50; i++) {
      coins.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        size: Math.random() * 30 + 20,
        emoji: emojis[Math.floor(Math.random() * emojis.length)]
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      coins.forEach(coin => {
        coin.y += coin.vy
        coin.rotation += coin.rotationSpeed

        if (coin.y > canvas.height + 50) {
          coin.y = -50
          coin.x = Math.random() * canvas.width
        }

        ctx.save()
        ctx.translate(coin.x, coin.y)
        ctx.rotate(coin.rotation)
        ctx.font = `${coin.size}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = '#FFD700'
        ctx.shadowBlur = 20
        ctx.fillText(coin.emoji, 0, 0)
        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  )
}
