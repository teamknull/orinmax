"use client"

import { useState, useEffect } from "react"

export function DNAHelix() {
  const [basePairs, setBasePairs] = useState<string[]>([])

  useEffect(() => {
    // Generate random base pairs only on client side after hydration
    const pairs = []
    for (let i = 0; i < 24; i++) {
      const rand = Math.floor(Math.random() * 4)
      if (rand === 0) pairs.push("at")
      else if (rand === 1) pairs.push("ta")
      else if (rand === 2) pairs.push("cg")
      else pairs.push("gc")
    }
    setBasePairs(pairs)
  }, [])

  // Don't render anything until base pairs are generated (client-side only)
  if (basePairs.length === 0) {
    return null
  }

  return (
    <div className="flex items-center justify-center w-full h-80 bg-card border border-border rounded-lg relative overflow-hidden">
      {/* Simple grid pattern for research feel */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--muted-foreground)) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="dna-container relative z-10">
        {basePairs.map((pair, index) => {
          const left = pair[0]
          const right = pair[1]
          return (
            <div
              key={index}
              className={`bases ${pair} floating-animation`}
              style={{
                animationDelay: `${index * -166.67}ms`, // 4000ms / 24 nodes
              }}
            >
              <span className={`base-label left label-${left}`}>{left.toUpperCase()}</span>
              <span className={`base-label right label-${right}`}>{right.toUpperCase()}</span>
            </div>
          )
        })}
      </div>

      {/* Government-style overlay */}
      <div className="absolute top-4 right-4 text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
        DNA Model v1.0
      </div>
    </div>
  )
}
