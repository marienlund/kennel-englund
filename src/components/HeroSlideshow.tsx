'use client'

import { useState, useEffect } from 'react'

const slides = [
  { src: '/slide1.jpg', alt: 'Schæferhund i naturen' },
  { src: '/slide2.jpg', alt: 'Schæferhund hvalp' },
  { src: '/slide3.jpg', alt: 'Danmarksmesterskab' },
  { src: '/slide4.jpg', alt: 'Vinderhund med pokaler' },
]

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c2340]/80 via-[#0c2340]/30 to-transparent" />

      {/* Title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-lg">
          Kennel Team Englund
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-blue-100/90 font-medium drop-shadow">
          Schæferhundeopdræt siden 1984
        </p>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === current ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
