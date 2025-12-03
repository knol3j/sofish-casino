import { useRef, useEffect, useState, useCallback } from 'react'

interface Symbol {
  emoji: string
  value: number
  color: string
}

const SYMBOLS: Symbol[] = [
  { emoji: '7️⃣', value: 100, color: '#FF0000' },
  { emoji: '💎', value: 75, color: '#00BFFF' },
  { emoji: '🍒', value: 50, color: '#FF1493' },
  { emoji: '🔔', value: 40, color: '#FFD700' },
  { emoji: '⭐', value: 30, color: '#FFFF00' },
  { emoji: '🍋', value: 20, color: '#FFFF00' },
  { emoji: '🍊', value: 15, color: '#FFA500' },
  { emoji: '🍇', value: 10, color: '#8B008B' },
]

interface SlotMachine3DProps {
  onSpin?: (result: number[], winAmount: number) => void
  betAmount?: number
  disabled?: boolean
}

export function SlotMachine3D({ onSpin, betAmount = 10, disabled = false }: SlotMachine3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<number[]>([0, 0, 0])
  const animationRef = useRef<number>()
  const reelPositionsRef = useRef([0, 0, 0])
  const reelVelocitiesRef = useRef([0, 0, 0])
  const targetPositionsRef = useRef([0, 0, 0])
  const stoppedRef = useRef([false, false, false])

  const REEL_WIDTH = 150
  const REEL_HEIGHT = 400
  const SYMBOL_SIZE = 100
  const VISIBLE_SYMBOLS = 3

  const drawSlotMachine = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear
    ctx.clearRect(0, 0, width, height)

    // Machine background with gradient
    const machineGrad = ctx.createLinearGradient(0, 0, 0, height)
    machineGrad.addColorStop(0, '#1a1a2e')
    machineGrad.addColorStop(0.5, '#16213e')
    machineGrad.addColorStop(1, '#0f0f23')
    ctx.fillStyle = machineGrad
    ctx.fillRect(0, 0, width, height)

    // Draw frame
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 4
    ctx.strokeRect(10, 10, width - 20, height - 20)

    // Inner glow
    const glowGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2)
    glowGrad.addColorStop(0, 'rgba(255, 215, 0, 0.1)')
    glowGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = glowGrad
    ctx.fillRect(0, 0, width, height)

    // Draw reels
    const reelStartX = (width - REEL_WIDTH * 3 - 40) / 2
    const reelStartY = 50

    for (let reelIndex = 0; reelIndex < 3; reelIndex++) {
      const reelX = reelStartX + reelIndex * (REEL_WIDTH + 20)
      const reelY = reelStartY
      const position = reelPositionsRef.current[reelIndex]

      // Reel background
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(reelX, reelY, REEL_WIDTH, REEL_HEIGHT - 100, 10)
      ctx.clip()

      // Reel gradient background
      const reelGrad = ctx.createLinearGradient(reelX, reelY, reelX, reelY + REEL_HEIGHT - 100)
      reelGrad.addColorStop(0, 'rgba(0, 0, 0, 0.8)')
      reelGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0.3)')
      reelGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.3)')
      reelGrad.addColorStop(1, 'rgba(0, 0, 0, 0.8)')
      ctx.fillStyle = reelGrad
      ctx.fillRect(reelX, reelY, REEL_WIDTH, REEL_HEIGHT - 100)

      // Draw symbols
      const symbolOffset = position % SYMBOL_SIZE
      const startSymbol = Math.floor(position / SYMBOL_SIZE)

      for (let i = -1; i <= VISIBLE_SYMBOLS; i++) {
        const symbolIndex = ((startSymbol + i) % SYMBOLS.length + SYMBOLS.length) % SYMBOLS.length
        const symbol = SYMBOLS[symbolIndex]
        const symbolY = reelY + i * SYMBOL_SIZE - symbolOffset + SYMBOL_SIZE / 2

        if (symbolY > reelY - SYMBOL_SIZE && symbolY < reelY + REEL_HEIGHT - 100) {
          // Symbol glow
          if (!isSpinning || reelVelocitiesRef.current[reelIndex] < 5) {
            const glowSize = SYMBOL_SIZE * 0.6
            const symGlow = ctx.createRadialGradient(
              reelX + REEL_WIDTH / 2, symbolY, 0,
              reelX + REEL_WIDTH / 2, symbolY, glowSize
            )
            symGlow.addColorStop(0, symbol.color + '40')
            symGlow.addColorStop(1, 'transparent')
            ctx.fillStyle = symGlow
            ctx.beginPath()
            ctx.arc(reelX + REEL_WIDTH / 2, symbolY, glowSize, 0, Math.PI * 2)
            ctx.fill()
          }

          // Draw symbol
          ctx.font = `${SYMBOL_SIZE * 0.6}px Arial`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(symbol.emoji, reelX + REEL_WIDTH / 2, symbolY)
        }
      }

      ctx.restore()

      // Reel frame
      ctx.strokeStyle = '#FFD700'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(reelX, reelY, REEL_WIDTH, REEL_HEIGHT - 100, 10)
      ctx.stroke()

      // Shine effect on top
      const shineGrad = ctx.createLinearGradient(reelX, reelY, reelX, reelY + 50)
      shineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)')
      shineGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = shineGrad
      ctx.beginPath()
      ctx.roundRect(reelX, reelY, REEL_WIDTH, 50, [10, 10, 0, 0])
      ctx.fill()
    }

    // Win line
    const lineY = reelStartY + (REEL_HEIGHT - 100) / 2
    ctx.strokeStyle = '#FF0000'
    ctx.lineWidth = 3
    ctx.setLineDash([10, 5])
    ctx.beginPath()
    ctx.moveTo(reelStartX - 20, lineY)
    ctx.lineTo(reelStartX + REEL_WIDTH * 3 + 40, lineY)
    ctx.stroke()
    ctx.setLineDash([])

    // Win line arrows
    ctx.fillStyle = '#FF0000'
    ctx.beginPath()
    ctx.moveTo(reelStartX - 20, lineY)
    ctx.lineTo(reelStartX - 35, lineY - 10)
    ctx.lineTo(reelStartX - 35, lineY + 10)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(reelStartX + REEL_WIDTH * 3 + 40, lineY)
    ctx.lineTo(reelStartX + REEL_WIDTH * 3 + 55, lineY - 10)
    ctx.lineTo(reelStartX + REEL_WIDTH * 3 + 55, lineY + 10)
    ctx.closePath()
    ctx.fill()

    // Top lights
    const lightCount = 15
    const lightRadius = 8
    for (let i = 0; i < lightCount; i++) {
      const lightX = 30 + i * ((width - 60) / (lightCount - 1))
      const lightY = 25
      const hue = (Date.now() / 20 + i * 25) % 360

      ctx.beginPath()
      ctx.arc(lightX, lightY, lightRadius, 0, Math.PI * 2)
      ctx.fillStyle = `hsl(${hue}, 100%, ${isSpinning ? '70%' : '50%'})`
      ctx.fill()

      if (isSpinning) {
        ctx.shadowColor = `hsl(${hue}, 100%, 70%)`
        ctx.shadowBlur = 15
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    // Bottom lights
    for (let i = 0; i < lightCount; i++) {
      const lightX = 30 + i * ((width - 60) / (lightCount - 1))
      const lightY = height - 25
      const hue = (Date.now() / 20 + i * 25 + 180) % 360

      ctx.beginPath()
      ctx.arc(lightX, lightY, lightRadius, 0, Math.PI * 2)
      ctx.fillStyle = `hsl(${hue}, 100%, ${isSpinning ? '70%' : '50%'})`
      ctx.fill()

      if (isSpinning) {
        ctx.shadowColor = `hsl(${hue}, 100%, 70%)`
        ctx.shadowBlur = 15
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }
  }, [isSpinning])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 550
    const height = 450
    canvas.width = width
    canvas.height = height

    const animate = () => {
      // Update reel positions with physics
      for (let i = 0; i < 3; i++) {
        if (!stoppedRef.current[i]) {
          reelPositionsRef.current[i] += reelVelocitiesRef.current[i]

          // Deceleration
          if (isSpinning) {
            const stopTime = 1500 + i * 500
            const elapsed = Date.now() - (animationRef.current || Date.now())

            if (elapsed > stopTime) {
              // Slow down with elastic easing
              const targetPos = targetPositionsRef.current[i]
              const diff = targetPos - (reelPositionsRef.current[i] % (SYMBOLS.length * SYMBOL_SIZE))

              if (Math.abs(reelVelocitiesRef.current[i]) > 0.5) {
                reelVelocitiesRef.current[i] *= 0.95
              } else {
                stoppedRef.current[i] = true
                reelVelocitiesRef.current[i] = 0
                // Snap to position
                reelPositionsRef.current[i] = Math.round(reelPositionsRef.current[i] / SYMBOL_SIZE) * SYMBOL_SIZE
              }
            }
          }
        }
      }

      // Check if all reels stopped
      if (stoppedRef.current.every(s => s) && isSpinning) {
        setIsSpinning(false)
        // Calculate result
        const finalResult = reelPositionsRef.current.map(pos => {
          const symbolIndex = Math.floor((pos / SYMBOL_SIZE) % SYMBOLS.length)
          return (symbolIndex + SYMBOLS.length) % SYMBOLS.length
        })
        setResult(finalResult)

        // Check win
        if (finalResult[0] === finalResult[1] && finalResult[1] === finalResult[2]) {
          const winMultiplier = SYMBOLS[finalResult[0]].value
          onSpin?.(finalResult, betAmount * winMultiplier)
        } else {
          onSpin?.(finalResult, 0)
        }
      }

      drawSlotMachine(ctx, width, height)
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isSpinning, drawSlotMachine, betAmount, onSpin])

  const spin = () => {
    if (isSpinning || disabled) return

    setIsSpinning(true)
    stoppedRef.current = [false, false, false]

    // Set random targets
    targetPositionsRef.current = [
      Math.floor(Math.random() * SYMBOLS.length) * SYMBOL_SIZE,
      Math.floor(Math.random() * SYMBOLS.length) * SYMBOL_SIZE,
      Math.floor(Math.random() * SYMBOLS.length) * SYMBOL_SIZE
    ]

    // Set initial velocities (staggered)
    reelVelocitiesRef.current = [30, 30, 30]
  }

  return (
    <div className="slot-machine-3d">
      <canvas ref={canvasRef} />

      <button
        className={`spin-button-3d ${isSpinning ? 'spinning' : ''}`}
        onClick={spin}
        disabled={isSpinning || disabled}
      >
        <span className="spin-text">{isSpinning ? 'SPINNING...' : 'SPIN'}</span>
        <span className="spin-glow" />
      </button>

      <style>{`
        .slot-machine-3d {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .slot-machine-3d canvas {
          border-radius: 20px;
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.5),
            0 0 40px rgba(255, 215, 0, 0.2),
            inset 0 0 60px rgba(0, 0, 0, 0.3);
        }

        .spin-button-3d {
          position: relative;
          padding: 20px 60px;
          font-family: 'Cinzel', serif;
          font-size: 28px;
          font-weight: 900;
          color: #0A0F1C;
          background: linear-gradient(135deg, #FFE55C 0%, #FFD700 50%, #FFA500 100%);
          border: none;
          border-radius: 16px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow:
            0 8px 30px rgba(255, 215, 0, 0.4),
            inset 0 2px 0 rgba(255, 255, 255, 0.3);
        }

        .spin-button-3d:hover:not(:disabled) {
          transform: translateY(-4px) scale(1.02);
          box-shadow:
            0 12px 40px rgba(255, 215, 0, 0.6),
            inset 0 2px 0 rgba(255, 255, 255, 0.3);
        }

        .spin-button-3d:active:not(:disabled) {
          transform: translateY(-2px) scale(1);
        }

        .spin-button-3d:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .spin-button-3d.spinning {
          animation: button-pulse 0.5s ease-in-out infinite;
        }

        @keyframes button-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .spin-text {
          position: relative;
          z-index: 1;
          letter-spacing: 4px;
        }

        .spin-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: shine 2s ease-in-out infinite;
        }

        @keyframes shine {
          0% { left: -100%; }
          50%, 100% { left: 100%; }
        }
      `}</style>
    </div>
  )
}
