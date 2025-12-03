import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: [number, number, number]
  alpha: number
  life: number
  maxLife: number
}

// Vertex Shader - Handles particle positioning
const vertexShaderSource = `
  attribute vec2 a_position;
  attribute float a_size;
  attribute vec4 a_color;

  varying vec4 v_color;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    gl_PointSize = a_size;
    v_color = a_color;
  }
`

// Fragment Shader - Renders glowing particles
const fragmentShaderSource = `
  precision mediump float;

  varying vec4 v_color;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    // Create soft glowing circle
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= v_color.a;

    // Add inner glow
    float innerGlow = 1.0 - smoothstep(0.0, 0.3, dist);
    vec3 color = v_color.rgb + vec3(innerGlow * 0.3);

    gl_FragColor = vec4(color, alpha);
  }
`

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }

  return program
}

interface WebGLBackgroundProps {
  particleCount?: number
  colors?: Array<[number, number, number]>
  speed?: number
  interactive?: boolean
}

export function WebGLBackground({
  particleCount = 150,
  colors = [
    [1.0, 0.843, 0], // Gold
    [1.0, 0.647, 0], // Orange
    [0.545, 0, 1.0], // Purple
    [0, 0.831, 0.667], // Cyan
    [1.0, 0.078, 0.576] // Pink
  ],
  speed = 1,
  interactive = true
}: WebGLBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const animationRef = useRef<number>()
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)

  const createParticle = useCallback((x?: number, y?: number): Particle => {
    const color = colors[Math.floor(Math.random() * colors.length)]
    return {
      x: x ?? (Math.random() * 2 - 1),
      y: y ?? (Math.random() * 2 - 1),
      vx: (Math.random() - 0.5) * 0.002 * speed,
      vy: (Math.random() - 0.5) * 0.002 * speed,
      size: Math.random() * 20 + 5,
      color,
      alpha: Math.random() * 0.5 + 0.3,
      life: 0,
      maxLife: Math.random() * 500 + 300
    }
  }, [colors, speed])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Initialize WebGL
    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true
    })

    if (!gl) {
      console.warn('WebGL not supported, falling back to CSS effects')
      return
    }

    glRef.current = gl

    // Create shaders and program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    if (!vertexShader || !fragmentShader) return

    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) return

    programRef.current = program
    gl.useProgram(program)

    // Enable blending for transparency
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    // Get attribute locations
    const positionLoc = gl.getAttribLocation(program, 'a_position')
    const sizeLoc = gl.getAttribLocation(program, 'a_size')
    const colorLoc = gl.getAttribLocation(program, 'a_color')

    // Create buffers
    const positionBuffer = gl.createBuffer()
    const sizeBuffer = gl.createBuffer()
    const colorBuffer = gl.createBuffer()

    // Initialize particles
    particlesRef.current = Array(particleCount).fill(null).map(() => createParticle())

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -(((e.clientY - rect.top) / rect.height) * 2 - 1),
        active: true
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseleave', handleMouseLeave)
    }

    // Animation loop
    const animate = () => {
      if (!gl || !program) return

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      const particles = particlesRef.current
      const positions: number[] = []
      const sizes: number[] = []
      const particleColors: number[] = []

      particles.forEach((p, i) => {
        // Update particle
        p.x += p.vx
        p.y += p.vy
        p.life++

        // Mouse interaction - attract particles
        if (mouseRef.current.active && interactive) {
          const dx = mouseRef.current.x - p.x
          const dy = mouseRef.current.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 0.3) {
            p.vx += dx * 0.0005
            p.vy += dy * 0.0005
          }
        }

        // Wrap around edges
        if (p.x < -1.2) p.x = 1.2
        if (p.x > 1.2) p.x = -1.2
        if (p.y < -1.2) p.y = 1.2
        if (p.y > 1.2) p.y = -1.2

        // Fade based on life
        const lifeFactor = 1 - (p.life / p.maxLife)
        const alpha = p.alpha * lifeFactor

        // Reset dead particles
        if (p.life >= p.maxLife) {
          particles[i] = createParticle()
        }

        positions.push(p.x, p.y)
        sizes.push(p.size * lifeFactor)
        particleColors.push(p.color[0], p.color[1], p.color[2], alpha)
      })

      // Update position buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(positionLoc)
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

      // Update size buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sizes), gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(sizeLoc)
      gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 0, 0)

      // Update color buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particleColors), gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(colorLoc)
      gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0)

      // Draw particles
      gl.drawArrays(gl.POINTS, 0, particles.length)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particleCount, colors, speed, interactive, createParticle])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: interactive ? 'auto' : 'none',
        zIndex: -1
      }}
    />
  )
}

// Hook for triggering particle bursts
export function useParticleBurst() {
  const triggerBurst = useCallback((x: number, y: number, count: number = 50) => {
    // Dispatch custom event that WebGLBackground can listen to
    window.dispatchEvent(new CustomEvent('particle-burst', {
      detail: { x, y, count }
    }))
  }, [])

  return { triggerBurst }
}
