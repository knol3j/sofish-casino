import { useEffect, useRef } from 'react'

// Advanced WebGL Shader Effects for Premium Casino Visuals

// Holographic/Iridescent Shader
const holographicVertexShader = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  varying vec2 v_position;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
    v_position = a_position;
  }
`

const holographicFragmentShader = `
  precision highp float;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  varying vec2 v_texCoord;
  varying vec2 v_position;

  // Noise functions for organic movement
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  // Holographic color based on angle
  vec3 holographic(float angle, float intensity) {
    vec3 col1 = vec3(1.0, 0.2, 0.5);  // Pink
    vec3 col2 = vec3(0.2, 0.8, 1.0);  // Cyan
    vec3 col3 = vec3(1.0, 0.8, 0.2);  // Gold
    vec3 col4 = vec3(0.5, 0.2, 1.0);  // Purple

    float t = angle * 2.0;
    vec3 color = mix(col1, col2, smoothstep(0.0, 0.33, fract(t)));
    color = mix(color, col3, smoothstep(0.33, 0.66, fract(t)));
    color = mix(color, col4, smoothstep(0.66, 1.0, fract(t)));

    return color * intensity;
  }

  void main() {
    vec2 uv = v_texCoord;
    vec2 pos = v_position;

    // Create flowing noise pattern
    float n = fbm(uv * 3.0 + u_time * 0.1);
    float n2 = fbm(uv * 5.0 - u_time * 0.15);

    // Calculate angle for holographic effect
    vec2 mouseEffect = (u_mouse - pos) * 0.5;
    float angle = atan(pos.y + mouseEffect.y, pos.x + mouseEffect.x) / 6.28318 + 0.5;
    angle += n * 0.3 + u_time * 0.05;

    // Holographic color
    float intensity = 0.3 + n2 * 0.4;
    vec3 holoColor = holographic(angle, intensity);

    // Add shimmer
    float shimmer = sin(uv.x * 50.0 + u_time * 2.0) * sin(uv.y * 50.0 + u_time * 1.5);
    shimmer = shimmer * 0.5 + 0.5;
    holoColor += shimmer * 0.1;

    // Vignette
    float vignette = 1.0 - length(pos) * 0.5;
    vignette = smoothstep(0.0, 1.0, vignette);

    // Final color with transparency
    float alpha = (n * 0.3 + 0.1) * vignette;
    gl_FragColor = vec4(holoColor, alpha);
  }
`

// Liquid/Morphing Background Shader
const liquidFragmentShader = `
  precision highp float;

  uniform float u_time;
  uniform vec2 u_resolution;

  varying vec2 v_position;

  #define PI 3.14159265359

  float metaball(vec2 p, vec2 center, float radius) {
    float d = length(p - center);
    return radius / d;
  }

  vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.0, 0.1, 0.2);
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    vec2 uv = v_position;

    // Animated metaballs
    float m = 0.0;

    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      vec2 center = vec2(
        sin(u_time * 0.3 + fi * 1.5) * 0.6,
        cos(u_time * 0.4 + fi * 1.2) * 0.6
      );
      m += metaball(uv, center, 0.15 + sin(u_time + fi) * 0.05);
    }

    // Threshold for blob effect
    float blob = smoothstep(1.5, 2.0, m);

    // Color based on field strength
    vec3 color = palette(m * 0.2 + u_time * 0.1);
    color *= blob;

    // Add glow
    float glow = smoothstep(1.0, 1.5, m) * 0.5;
    color += vec3(1.0, 0.8, 0.3) * glow;

    gl_FragColor = vec4(color, blob * 0.3 + glow * 0.2);
  }
`

// Cyberpunk Grid Shader
const cyberpunkFragmentShader = `
  precision highp float;

  uniform float u_time;
  uniform vec2 u_resolution;

  varying vec2 v_position;
  varying vec2 v_texCoord;

  void main() {
    vec2 uv = v_texCoord;
    vec2 pos = v_position;

    // Perspective grid
    float perspective = 1.0 / (1.0 - pos.y * 0.8);
    vec2 gridUV = vec2(pos.x * perspective, perspective);

    // Animate grid
    gridUV.y += u_time * 0.5;

    // Grid lines
    vec2 grid = abs(fract(gridUV * 10.0) - 0.5);
    float line = min(grid.x, grid.y);
    line = 1.0 - smoothstep(0.0, 0.05, line);

    // Scanlines
    float scanline = sin(uv.y * 800.0) * 0.5 + 0.5;
    scanline = pow(scanline, 0.5) * 0.1 + 0.9;

    // Neon colors
    vec3 neonPink = vec3(1.0, 0.0, 0.5);
    vec3 neonCyan = vec3(0.0, 1.0, 1.0);
    vec3 gridColor = mix(neonPink, neonCyan, sin(u_time + gridUV.y * 0.5) * 0.5 + 0.5);

    // Glow effect
    float glow = line * perspective * 0.5;
    vec3 color = gridColor * glow;

    // Fog/distance fade
    float fog = smoothstep(0.0, 2.0, perspective - 1.0);
    color *= (1.0 - fog * 0.8);

    // Apply scanlines
    color *= scanline;

    // Horizon glow
    float horizon = 1.0 - smoothstep(-0.1, 0.3, pos.y);
    color += neonPink * horizon * 0.3;

    float alpha = (glow + horizon * 0.3) * 0.5;
    gl_FragColor = vec4(color, alpha);
  }
`

// Energy Field Shader
const energyFieldFragmentShader = `
  precision highp float;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  varying vec2 v_position;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    vec2 uv = v_position;

    // Electric arcs
    float arc1 = sin(uv.x * 20.0 + u_time * 5.0 + noise(uv * 5.0 + u_time) * 5.0);
    float arc2 = sin(uv.y * 20.0 + u_time * 4.0 + noise(uv * 4.0 - u_time) * 5.0);
    float arcs = arc1 * arc2;
    arcs = pow(abs(arcs), 3.0);

    // Plasma effect
    float plasma = 0.0;
    for (int i = 0; i < 4; i++) {
      float fi = float(i);
      plasma += sin(uv.x * 10.0 + u_time + fi) * sin(uv.y * 10.0 + u_time * 0.5 + fi);
    }
    plasma = plasma * 0.25 + 0.5;

    // Energy color
    vec3 energyColor = vec3(0.3, 0.7, 1.0);
    vec3 arcColor = vec3(1.0, 1.0, 1.0);

    vec3 color = energyColor * plasma * 0.3;
    color += arcColor * arcs * 0.5;

    // Mouse interaction - energy concentration
    float mouseDist = length(uv - u_mouse);
    float mouseEnergy = 1.0 / (mouseDist * 5.0 + 0.5);
    color += vec3(0.5, 0.8, 1.0) * mouseEnergy * 0.3;

    float alpha = (plasma * 0.2 + arcs * 0.3 + mouseEnergy * 0.2);
    gl_FragColor = vec4(color, alpha * 0.5);
  }
`

// Shader compiler utility
function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program error:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }
  return program
}

interface ShaderBackgroundProps {
  type: 'holographic' | 'liquid' | 'cyberpunk' | 'energy'
  className?: string
}

export function ShaderBackground({ type, className = '' }: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
    if (!gl) return

    // Select fragment shader based on type
    let fragmentSource = holographicFragmentShader
    if (type === 'liquid') fragmentSource = liquidFragmentShader
    else if (type === 'cyberpunk') fragmentSource = cyberpunkFragmentShader
    else if (type === 'energy') fragmentSource = energyFieldFragmentShader

    const vs = createShader(gl, gl.VERTEX_SHADER, holographicVertexShader)
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
    if (!vs || !fs) return

    const program = createProgram(gl, vs, fs)
    if (!program) return

    gl.useProgram(program)

    // Create fullscreen quad
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ])

    const texCoords = new Float32Array([
      0, 0, 1, 0, 0, 1,
      0, 1, 1, 0, 1, 1
    ])

    // Position buffer
    const posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
    const posLoc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    // TexCoord buffer
    const texBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW)
    const texLoc = gl.getAttribLocation(program, 'a_texCoord')
    if (texLoc >= 0) {
      gl.enableVertexAttribArray(texLoc)
      gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0)
    }

    // Uniforms
    const timeLoc = gl.getUniformLocation(program, 'u_time')
    const resLoc = gl.getUniformLocation(program, 'u_resolution')
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse')

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1)
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const startTime = Date.now()
    const animate = () => {
      const time = (Date.now() - startTime) / 1000

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.uniform1f(timeLoc, time)
      gl.uniform2f(resLoc, canvas.width, canvas.height)
      gl.uniform2f(mouseLoc, mouseRef.current.x, mouseRef.current.y)

      gl.drawArrays(gl.TRIANGLES, 0, 6)

      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [type])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  )
}

// Glitch Text Effect Component
export function GlitchText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`glitch-text ${className}`} data-text={text}>
      {text}
      <style>{`
        .glitch-text {
          position: relative;
          display: inline-block;
          animation: glitch-skew 1s infinite linear alternate-reverse;
        }

        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .glitch-text::before {
          left: 2px;
          text-shadow: -2px 0 #ff00c1;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim 5s infinite linear alternate-reverse;
        }

        .glitch-text::after {
          left: -2px;
          text-shadow: -2px 0 #00fff9;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim2 5s infinite linear alternate-reverse;
        }

        @keyframes glitch-anim {
          0% { clip: rect(31px, 9999px, 94px, 0); transform: skew(0.5deg); }
          5% { clip: rect(70px, 9999px, 71px, 0); transform: skew(0.2deg); }
          10% { clip: rect(29px, 9999px, 24px, 0); transform: skew(0.8deg); }
          15% { clip: rect(95px, 9999px, 75px, 0); transform: skew(0.1deg); }
          20% { clip: rect(20px, 9999px, 13px, 0); transform: skew(0.4deg); }
          25% { clip: rect(44px, 9999px, 99px, 0); transform: skew(0.3deg); }
          30% { clip: rect(65px, 9999px, 54px, 0); transform: skew(0.7deg); }
          35% { clip: rect(12px, 9999px, 87px, 0); transform: skew(0.2deg); }
          40% { clip: rect(78px, 9999px, 32px, 0); transform: skew(0.6deg); }
          45% { clip: rect(41px, 9999px, 68px, 0); transform: skew(0.1deg); }
          50% { clip: rect(89px, 9999px, 45px, 0); transform: skew(0.5deg); }
          55% { clip: rect(23px, 9999px, 91px, 0); transform: skew(0.3deg); }
          60% { clip: rect(56px, 9999px, 19px, 0); transform: skew(0.8deg); }
          65% { clip: rect(74px, 9999px, 63px, 0); transform: skew(0.2deg); }
          70% { clip: rect(38px, 9999px, 82px, 0); transform: skew(0.4deg); }
          75% { clip: rect(92px, 9999px, 27px, 0); transform: skew(0.6deg); }
          80% { clip: rect(17px, 9999px, 76px, 0); transform: skew(0.1deg); }
          85% { clip: rect(61px, 9999px, 48px, 0); transform: skew(0.7deg); }
          90% { clip: rect(35px, 9999px, 84px, 0); transform: skew(0.3deg); }
          95% { clip: rect(83px, 9999px, 22px, 0); transform: skew(0.5deg); }
          100% { clip: rect(49px, 9999px, 97px, 0); transform: skew(0.2deg); }
        }

        @keyframes glitch-anim2 {
          0% { clip: rect(65px, 9999px, 39px, 0); transform: skew(0.3deg); }
          5% { clip: rect(28px, 9999px, 87px, 0); transform: skew(0.6deg); }
          10% { clip: rect(91px, 9999px, 15px, 0); transform: skew(0.1deg); }
          15% { clip: rect(43px, 9999px, 72px, 0); transform: skew(0.8deg); }
          20% { clip: rect(76px, 9999px, 34px, 0); transform: skew(0.2deg); }
          25% { clip: rect(19px, 9999px, 95px, 0); transform: skew(0.5deg); }
          30% { clip: rect(58px, 9999px, 51px, 0); transform: skew(0.4deg); }
          35% { clip: rect(84px, 9999px, 23px, 0); transform: skew(0.7deg); }
          40% { clip: rect(37px, 9999px, 68px, 0); transform: skew(0.1deg); }
          45% { clip: rect(96px, 9999px, 42px, 0); transform: skew(0.6deg); }
          50% { clip: rect(14px, 9999px, 79px, 0); transform: skew(0.3deg); }
          55% { clip: rect(67px, 9999px, 26px, 0); transform: skew(0.8deg); }
          60% { clip: rect(32px, 9999px, 93px, 0); transform: skew(0.2deg); }
          65% { clip: rect(81px, 9999px, 47px, 0); transform: skew(0.5deg); }
          70% { clip: rect(25px, 9999px, 86px, 0); transform: skew(0.4deg); }
          75% { clip: rect(69px, 9999px, 18px, 0); transform: skew(0.7deg); }
          80% { clip: rect(52px, 9999px, 74px, 0); transform: skew(0.1deg); }
          85% { clip: rect(88px, 9999px, 31px, 0); transform: skew(0.6deg); }
          90% { clip: rect(21px, 9999px, 62px, 0); transform: skew(0.3deg); }
          95% { clip: rect(73px, 9999px, 89px, 0); transform: skew(0.8deg); }
          100% { clip: rect(46px, 9999px, 55px, 0); transform: skew(0.2deg); }
        }

        @keyframes glitch-skew {
          0% { transform: skew(0deg); }
          20% { transform: skew(0deg); }
          21% { transform: skew(1deg); }
          22% { transform: skew(-1deg); }
          23% { transform: skew(0deg); }
          100% { transform: skew(0deg); }
        }
      `}</style>
    </span>
  )
}

// Neon Border Component
export function NeonBorder({ children, color = '#FFD700', intensity = 1, animated = true }: {
  children: React.ReactNode
  color?: string
  intensity?: number
  animated?: boolean
}) {
  return (
    <div className="neon-border-wrapper">
      {children}
      <style>{`
        .neon-border-wrapper {
          position: relative;
          border: 2px solid ${color};
          border-radius: 16px;
          box-shadow:
            0 0 ${5 * intensity}px ${color},
            0 0 ${10 * intensity}px ${color},
            0 0 ${20 * intensity}px ${color},
            inset 0 0 ${5 * intensity}px ${color}20;
          ${animated ? 'animation: neon-flicker 3s ease-in-out infinite;' : ''}
        }

        @keyframes neon-flicker {
          0%, 100% {
            box-shadow:
              0 0 ${5 * intensity}px ${color},
              0 0 ${10 * intensity}px ${color},
              0 0 ${20 * intensity}px ${color},
              inset 0 0 ${5 * intensity}px ${color}20;
          }
          50% {
            box-shadow:
              0 0 ${8 * intensity}px ${color},
              0 0 ${16 * intensity}px ${color},
              0 0 ${32 * intensity}px ${color},
              inset 0 0 ${8 * intensity}px ${color}30;
          }
          52% {
            box-shadow:
              0 0 ${2 * intensity}px ${color},
              0 0 ${5 * intensity}px ${color},
              0 0 ${10 * intensity}px ${color},
              inset 0 0 ${2 * intensity}px ${color}10;
          }
          54% {
            box-shadow:
              0 0 ${8 * intensity}px ${color},
              0 0 ${16 * intensity}px ${color},
              0 0 ${32 * intensity}px ${color},
              inset 0 0 ${8 * intensity}px ${color}30;
          }
        }
      `}</style>
    </div>
  )
}
