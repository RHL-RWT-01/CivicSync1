"use client"

import { useEffect, useRef, type ReactNode } from "react"

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const show = () => {
      el.style.transitionDelay = `${delay}ms`
      el.classList.add("in")
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            show()
            io.disconnect()
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    )
    io.observe(el)

    // Safety net: some environments (backgrounded tabs, restrictive embeds) never
    // fire IntersectionObserver — reveal anyway so content is never stuck hidden.
    const fallback = window.setTimeout(show, 700)

    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [delay])

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}
