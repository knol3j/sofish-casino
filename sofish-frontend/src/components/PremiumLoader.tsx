import { useEffect, useRef } from 'react'

interface PremiumLoaderProps {
  size?: number
  variant?: 'casino' | 'slot' | 'dice' | 'chips' | 'roulette'
  color?: string
  text?: string
}

export function PremiumLoader({
  size = 80,
  variant = 'casino',
  color = '#FFD700',
  text
}: PremiumLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size * 2
    canvas.height = size * 2

    let rotation = 0
    let pulsePhase = 0

    const drawCasinoLoader = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = size * 0.4

      // Outer glow
      const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius * 1.2)
      gradient.addColorStop(0, `${color}40`)
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2)
      ctx.fill()

      // Draw rotating segments
      const segments = 8
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2 + rotation
        const alpha = (Math.sin(pulsePhase + i * 0.5) + 1) / 2 * 0.8 + 0.2

        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(angle)

        // Segment
        ctx.beginPath()
        ctx.moveTo(radius * 0.3, 0)
        ctx.lineTo(radius * 0.8, 0)
        ctx.lineWidth = 4
        ctx.strokeStyle = color
        ctx.globalAlpha = alpha
        ctx.lineCap = 'round'
        ctx.stroke()

        // Dot at end
        ctx.beginPath()
        ctx.arc(radius * 0.85, 0, 3, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()

        ctx.restore()
      }

      // Center chip
      const chipPulse = Math.sin(pulsePhase * 2) * 0.1 + 1
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.scale(chipPulse, chipPulse)

      // Chip body
      ctx.beginPath()
      ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2)
      const chipGrad = ctx.createLinearGradient(-radius * 0.25, -radius * 0.25, radius * 0.25, radius * 0.25)
      chipGrad.addColorStop(0, '#FFE55C')
      chipGrad.addColorStop(0.5, color)
      chipGrad.addColorStop(1, '#CC9900')
      ctx.fillStyle = chipGrad
      ctx.fill()

      // Chip edge
      ctx.strokeStyle = '#CC9900'
      ctx.lineWidth = 2
      ctx.stroke()

      // Dollar sign
      ctx.fillStyle = '#0A0F1C'
      ctx.font = `bold ${radius * 0.3}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('$', 0, 0)

      ctx.restore()
    }

    const drawSlotLoader = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      const symbols = ['7', '7', '7']
      const offsetY = Math.sin(pulsePhase * 3) * 10

      symbols.forEach((sym, i) => {
        const x = centerX + (i - 1) * (size * 0.35)
        const y = centerY + offsetY * (i === 1 ? -1 : 1)

        // Slot background
        ctx.fillStyle = '#1E293B'
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.roundRect(x - size * 0.15, y - size * 0.2, size * 0.3, size * 0.4, 8)
        ctx.fill()
        ctx.stroke()

        // Symbol
        ctx.fillStyle = color
        ctx.font = `bold ${size * 0.25}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = color
        ctx.shadowBlur = 10
        ctx.fillText(sym, x, y)
        ctx.shadowBlur = 0
      })
    }

    const drawDiceLoader = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const diceSize = size * 0.4

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation * 0.5)

      // 3D dice effect
      const bounce = Math.abs(Math.sin(pulsePhase * 2)) * 10

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.beginPath()
      ctx.ellipse(5, diceSize / 2 + 10 - bounce / 2, diceSize * 0.6, diceSize * 0.2, 0, 0, Math.PI * 2)
      ctx.fill()

      // Dice body
      ctx.translate(0, -bounce)
      ctx.fillStyle = '#FFFFFF'
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(-diceSize / 2, -diceSize / 2, diceSize, diceSize, 8)
      ctx.fill()
      ctx.stroke()

      // Dots (showing 6)
      ctx.fillStyle = '#0A0F1C'
      const dotSize = diceSize * 0.1
      const positions = [
        [-0.25, -0.25], [0.25, -0.25],
        [-0.25, 0], [0.25, 0],
        [-0.25, 0.25], [0.25, 0.25]
      ]
      positions.forEach(([px, py]) => {
        ctx.beginPath()
        ctx.arc(px * diceSize, py * diceSize, dotSize, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.restore()
    }

    const drawChipsLoader = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      const chipColors = ['#FF4757', '#FFD700', '#00D4AA', '#A855F7']
      const chipCount = 4

      for (let i = 0; i < chipCount; i++) {
        const angle = (i / chipCount) * Math.PI * 2 + rotation
        const distance = size * 0.3
        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance
        const chipRadius = size * 0.12

        // Stack effect
        for (let j = 2; j >= 0; j--) {
          ctx.save()
          ctx.translate(x, y - j * 4)

          // Chip
          ctx.beginPath()
          ctx.arc(0, 0, chipRadius, 0, Math.PI * 2)
          ctx.fillStyle = chipColors[i]
          ctx.fill()
          ctx.strokeStyle = '#FFFFFF'
          ctx.lineWidth = 2
          ctx.stroke()

          // Inner pattern
          ctx.beginPath()
          ctx.arc(0, 0, chipRadius * 0.6, 0, Math.PI * 2)
          ctx.strokeStyle = '#FFFFFF'
          ctx.lineWidth = 1
          ctx.stroke()

          ctx.restore()
        }
      }

      // Center glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size * 0.2)
      gradient.addColorStop(0, `${color}60`)
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, size * 0.2, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawRouletteLoader = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const wheelRadius = size * 0.4

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation * 2)

      // Wheel segments
      const segments = 12
      const colors = ['#FF4757', '#1E293B']
      for (let i = 0; i < segments; i++) {
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, wheelRadius, (i / segments) * Math.PI * 2, ((i + 1) / segments) * Math.PI * 2)
        ctx.closePath()
        ctx.fillStyle = colors[i % 2]
        ctx.fill()
        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Center
      ctx.beginPath()
      ctx.arc(0, 0, wheelRadius * 0.2, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()

      ctx.restore()

      // Ball
      const ballAngle = -rotation * 3
      const ballRadius = wheelRadius * 0.85
      const ballX = centerX + Math.cos(ballAngle) * ballRadius
      const ballY = centerY + Math.sin(ballAngle) * ballRadius

      ctx.beginPath()
      ctx.arc(ballX, ballY, 6, 0, Math.PI * 2)
      ctx.fillStyle = '#FFFFFF'
      ctx.shadowColor = '#FFFFFF'
      ctx.shadowBlur = 10
      ctx.fill()
      ctx.shadowBlur = 0
    }

    const animate = () => {
      rotation += 0.03
      pulsePhase += 0.05

      switch (variant) {
        case 'slot':
          drawSlotLoader()
          break
        case 'dice':
          drawDiceLoader()
          break
        case 'chips':
          drawChipsLoader()
          break
        case 'roulette':
          drawRouletteLoader()
          break
        default:
          drawCasinoLoader()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [size, variant, color])

  return (
    <div className="premium-loader">
      <canvas ref={canvasRef} />
      {text && <div className="loader-text">{text}</div>}

      <style>{`
        .premium-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .loader-text {
          font-family: 'Cinzel', serif;
          font-size: 14px;
          font-weight: 600;
          color: ${color};
          text-transform: uppercase;
          letter-spacing: 2px;
          animation: loader-text-pulse 1.5s ease-in-out infinite;
        }

        @keyframes loader-text-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// Full page loading overlay
export function LoadingOverlay({ visible, text = 'Loading...' }: { visible: boolean; text?: string }) {
  if (!visible) return null

  return (
    <div className="loading-overlay">
      <PremiumLoader size={100} variant="casino" text={text} />

      <style>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(3, 7, 18, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: overlay-fade-in 0.3s ease-out;
        }

        @keyframes overlay-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
