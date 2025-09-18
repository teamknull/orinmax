"use client"

import { useMemo } from "react"

export function DNAHelix() {
  // Generate random base pairs like in the original code
  const basePairs = useMemo(() => {
    const pairs = []
    for (let i = 0; i < 24; i++) {
      const rand = Math.floor(Math.random() * 4)
      if (rand === 0) pairs.push("at")
      else if (rand === 1) pairs.push("ta")
      else if (rand === 2) pairs.push("cg")
      else pairs.push("gc")
    }
    return pairs
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="dna-container">
        {basePairs.map((pair, index) => {
          const left = pair[0]
          const right = pair[1]
          return (
            <div
              key={index}
              className={`bases ${pair}`}
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
    </div>
  )
}
