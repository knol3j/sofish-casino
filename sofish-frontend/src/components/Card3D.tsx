import { useState, useRef, useEffect, ReactNode } from 'react'

interface Card3DProps {
  children: ReactNode
  className?: string
  glowColor?: string
  intensity?: number
  perspective?: number
  maxRotation?: number
  glare?: boolean
  border?: boolean
}

export function Card3D({
  children,
  className = '',
  glowColor = '#FFD700',
  intensity = 1,
  perspective = 1000,
  maxRotation = 15,
  glare = true,
  border = true
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    const rotateX = (mouseY / (rect.height / 2)) * -maxRotation
    const rotateY = (mouseX / (rect.width / 2)) * maxRotation

    setRotation({ x: rotateX, y: rotateY })

    // Glare position
    const glareX = ((e.clientX - rect.left) / rect.width) * 100
    const glareY = ((e.clientY - rect.top) / rect.height) * 100
    setGlarePosition({ x: glareX, y: glareY })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <div
      className={`card-3d-container ${className}`}
      style={{ perspective: `${perspective}px` }}
    >
      <div
        ref={cardRef}
        className={`card-3d ${isHovered ? 'hovered' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          '--glow-color': glowColor,
          '--intensity': intensity,
        } as React.CSSProperties}
      >
        {children}

        {/* Glare effect */}
        {glare && (
          <div
            className="card-3d-glare"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
              opacity: isHovered ? 1 : 0
            }}
          />
        )}

        {/* Border glow */}
        {border && <div className="card-3d-border" />}
      </div>

      <style>{`
        .card-3d-container {
          display: inline-block;
        }

        .card-3d {
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.1s ease-out, box-shadow 0.3s ease;
          border-radius: 16px;
          overflow: hidden;
        }

        .card-3d.hovered {
          box-shadow:
            0 25px 50px rgba(0, 0, 0, 0.5),
            0 0 30px var(--glow-color, #FFD700)40,
            0 0 60px var(--glow-color, #FFD700)20;
        }

        .card-3d-glare {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 10;
          transition: opacity 0.3s ease;
          border-radius: inherit;
        }

        .card-3d-border {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 18px;
          background: linear-gradient(
            135deg,
            var(--glow-color, #FFD700) 0%,
            transparent 40%,
            transparent 60%,
            var(--glow-color, #FFD700) 100%
          );
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .card-3d.hovered .card-3d-border {
          opacity: 0.5;
          animation: border-rotate 3s linear infinite;
        }

        @keyframes border-rotate {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Holographic Card Effect
export function HolographicCard({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setPosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    })
  }

  return (
    <div
      ref={cardRef}
      className={`holo-card ${isHovered ? 'hovered' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--mouse-x': position.x,
        '--mouse-y': position.y,
        '--rotation-x': `${(position.y - 0.5) * -20}deg`,
        '--rotation-y': `${(position.x - 0.5) * 20}deg`,
      } as React.CSSProperties}
    >
      <div className="holo-card-content">
        {children}
      </div>
      <div className="holo-card-shine" />
      <div className="holo-card-rainbow" />

      <style>{`
        .holo-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          transform-style: preserve-3d;
          perspective: 1000px;
          transition: transform 0.2s ease-out;
          cursor: pointer;
        }

        .holo-card.hovered {
          transform: rotateX(var(--rotation-x)) rotateY(var(--rotation-y)) scale(1.02);
        }

        .holo-card-content {
          position: relative;
          z-index: 1;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: inherit;
        }

        .holo-card-shine {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle at calc(var(--mouse-x) * 100%) calc(var(--mouse-y) * 100%),
            rgba(255, 255, 255, 0.4) 0%,
            transparent 50%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 2;
          border-radius: inherit;
        }

        .holo-card.hovered .holo-card-shine {
          opacity: 1;
        }

        .holo-card-rainbow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            calc(var(--mouse-x) * 360deg),
            rgba(255, 0, 128, 0.3),
            rgba(0, 255, 255, 0.3),
            rgba(255, 255, 0, 0.3),
            rgba(128, 0, 255, 0.3)
          );
          mix-blend-mode: color-dodge;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 3;
          border-radius: inherit;
        }

        .holo-card.hovered .holo-card-rainbow {
          opacity: 0.5;
        }

        .holo-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: conic-gradient(
            from calc(var(--mouse-x) * 360deg),
            #ff0080,
            #00ffff,
            #ffff00,
            #ff0080
          );
          border-radius: 22px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .holo-card.hovered::before {
          opacity: 0.7;
          animation: holo-border 3s linear infinite;
        }

        @keyframes holo-border {
          0% { filter: hue-rotate(0deg) brightness(1); }
          50% { filter: hue-rotate(180deg) brightness(1.2); }
          100% { filter: hue-rotate(360deg) brightness(1); }
        }
      `}</style>
    </div>
  )
}

// Floating Animation Wrapper
export function FloatingElement({
  children,
  amplitude = 10,
  duration = 3,
  delay = 0,
  className = ''
}: {
  children: ReactNode
  amplitude?: number
  duration?: number
  delay?: number
  className?: string
}) {
  return (
    <div
      className={`floating-element ${className}`}
      style={{
        animation: `float ${duration}s ease-in-out ${delay}s infinite`,
        '--amplitude': `${amplitude}px`
      } as React.CSSProperties}
    >
      {children}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(calc(var(--amplitude) * -0.5)) rotate(1deg);
          }
          50% {
            transform: translateY(calc(var(--amplitude) * -1)) rotate(0deg);
          }
          75% {
            transform: translateY(calc(var(--amplitude) * -0.5)) rotate(-1deg);
          }
        }

        .floating-element {
          will-change: transform;
        }
      `}</style>
    </div>
  )
}

// Magnetic Button
export function MagneticButton({
  children,
  className = '',
  onClick
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) * 0.3
    const deltaY = (e.clientY - centerY) * 0.3
    setPosition({ x: deltaX, y: deltaY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <button
      ref={buttonRef}
      className={`magnetic-button ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
    >
      <span className="magnetic-button-content" style={{
        transform: `translate(${position.x * 0.5}px, ${position.y * 0.5}px)`
      }}>
        {children}
      </span>

      <style>{`
        .magnetic-button {
          position: relative;
          padding: 20px 48px;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          border: none;
          border-radius: 16px;
          color: #0A0F1C;
          font-family: 'Cinzel', serif;
          font-size: 20px;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease;
          overflow: hidden;
        }

        .magnetic-button::before {
          content: '';
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
          transition: left 0.5s ease;
        }

        .magnetic-button:hover::before {
          left: 100%;
        }

        .magnetic-button:hover {
          box-shadow:
            0 10px 40px rgba(255, 215, 0, 0.4),
            0 0 80px rgba(255, 215, 0, 0.2);
        }

        .magnetic-button-content {
          display: flex;
          align-items: center;
          gap: 12px;
          transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </button>
  )
}

// Ripple Effect
export function RippleEffect({ color = '#FFD700' }: { color?: string }) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])

  const createRipple = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples(prev => [...prev, { x, y, id }])
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id))
    }, 1000)
  }

  return (
    <div className="ripple-container" onClick={createRipple}>
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            background: color
          }}
        />
      ))}

      <style>{`
        .ripple-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .ripple {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: ripple-expand 1s ease-out forwards;
          opacity: 0.5;
        }

        @keyframes ripple-expand {
          to {
            transform: translate(-50%, -50%) scale(50);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
