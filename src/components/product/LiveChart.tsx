import { useEffect, useRef } from 'react'

interface LiveChartProps {
  dataPoints?: number
}

/** Reads a hex token from :root and returns an rgba() builder. */
function tokenColor(name: string, fallback: string) {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
  const n = parseInt(hex.replace('#', ''), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  return (alpha = 1) => `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/** Canvas area chart that random-walks every 2 s while visible (synthetic data). */
export function LiveChart({ dataPoints = 40 }: LiveChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const data = useRef<number[]>(
    Array.from({ length: dataPoints }, (_, i) => 50 + Math.sin(i / 3) * 14 + (i % 5) * 2),
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const brand = tokenColor('--brand-400', '#60a5fa')
    let timer: number | null = null
    let visible = false
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const draw = (advance: boolean) => {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.round(rect.width * dpr)
      const height = Math.round(rect.height * dpr)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, rect.width, rect.height)

      if (advance) {
        const last = data.current[data.current.length - 1]
        data.current.push(Math.max(15, Math.min(90, last + Math.random() * 18 - 9)))
        data.current.shift()
      }

      // Horizontal guides only, like the console charts.
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 1; i < 4; i += 1) {
        const y = Math.round((rect.height / 4) * i) + 0.5
        ctx.moveTo(0, y)
        ctx.lineTo(rect.width, y)
      }
      ctx.stroke()

      const step = rect.width / (dataPoints - 1)
      const y = (v: number) => rect.height - (v / 100) * rect.height
      ctx.beginPath()
      data.current.forEach((value, i) => {
        if (i === 0) ctx.moveTo(0, y(value))
        else ctx.lineTo(i * step, y(value))
      })
      ctx.strokeStyle = brand(1)
      ctx.lineWidth = 2
      ctx.lineJoin = 'round'
      ctx.stroke()
      ctx.lineTo(rect.width, rect.height)
      ctx.lineTo(0, rect.height)
      ctx.closePath()

      const fill = ctx.createLinearGradient(0, 0, 0, rect.height)
      fill.addColorStop(0, brand(0.28))
      fill.addColorStop(1, brand(0))
      ctx.fillStyle = fill
      ctx.fill()
    }

    const stop = () => {
      if (timer !== null) window.clearInterval(timer)
      timer = null
    }

    const sync = () => {
      stop()
      draw(false)
      if (visible && !document.hidden && !motionQuery.matches) {
        timer = window.setInterval(() => draw(true), 2000)
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        sync()
      },
      { rootMargin: '80px' },
    )
    io.observe(canvas)
    const ro = new ResizeObserver(() => draw(false))
    ro.observe(canvas)
    document.addEventListener('visibilitychange', sync)
    motionQuery.addEventListener('change', sync)
    draw(false)

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', sync)
      motionQuery.removeEventListener('change', sync)
    }
  }, [dataPoints])

  return <canvas ref={canvasRef} aria-hidden="true" className="block h-48 w-full" />
}
