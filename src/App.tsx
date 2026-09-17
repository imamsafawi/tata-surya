import { useState, useEffect, useRef, useCallback } from 'react';

interface PlanetData {
  name: string;
  radius: number; // visual radius in px
  orbitRadius: number; // orbital distance in px
  size: string; // real diameter
  distance: string; // distance from sun
  orbitalPeriod: string;
  color: string;
  glowColor: string;
  speed: number; // base angular speed (radians per second)
  description: string;
}

const planets: PlanetData[] = [
  {
    name: 'Mercury',
    radius: 6,
    orbitRadius: 70,
    size: '4,879 km',
    distance: '57.9 million km',
    orbitalPeriod: '88 days',
    color: '#b5b5b5',
    glowColor: 'rgba(181, 181, 181, 0.4)',
    speed: 4.15,
    description: 'The smallest planet and closest to the Sun. It has no atmosphere and extreme temperature variations.',
  },
  {
    name: 'Venus',
    radius: 10,
    orbitRadius: 110,
    size: '12,104 km',
    distance: '108.2 million km',
    orbitalPeriod: '225 days',
    color: '#e8cda0',
    glowColor: 'rgba(232, 205, 160, 0.4)',
    speed: 1.62,
    description: 'The hottest planet with a thick toxic atmosphere. It rotates backwards compared to most planets.',
  },
  {
    name: 'Earth',
    radius: 11,
    orbitRadius: 155,
    size: '12,756 km',
    distance: '149.6 million km',
    orbitalPeriod: '365.25 days',
    color: '#4da6ff',
    glowColor: 'rgba(77, 166, 255, 0.4)',
    speed: 1.0,
    description: 'Our home planet — the only known world with liquid water on its surface and life.',
  },
  {
    name: 'Mars',
    radius: 8,
    orbitRadius: 200,
    size: '6,792 km',
    distance: '227.9 million km',
    orbitalPeriod: '687 days',
    color: '#e07050',
    glowColor: 'rgba(224, 112, 80, 0.4)',
    speed: 0.53,
    description: 'The Red Planet, known for its iron oxide surface. It has the largest volcano in the solar system.',
  },
  {
    name: 'Jupiter',
    radius: 22,
    orbitRadius: 270,
    size: '142,984 km',
    distance: '778.6 million km',
    orbitalPeriod: '11.86 years',
    color: '#d4a574',
    glowColor: 'rgba(212, 165, 116, 0.4)',
    speed: 0.084,
    description: 'The largest planet with a Great Red Spot storm. It has at least 95 known moons.',
  },
  {
    name: 'Saturn',
    radius: 18,
    orbitRadius: 340,
    size: '120,536 km',
    distance: '1,433.5 million km',
    orbitalPeriod: '29.46 years',
    color: '#f0d890',
    glowColor: 'rgba(240, 216, 144, 0.4)',
    speed: 0.034,
    description: 'Famous for its stunning ring system made of ice and rock. It could float in water if there were a big enough ocean.',
  },
  {
    name: 'Uranus',
    radius: 14,
    orbitRadius: 400,
    size: '51,118 km',
    distance: '2,872.5 million km',
    orbitalPeriod: '84.01 years',
    color: '#7de8e8',
    glowColor: 'rgba(125, 232, 232, 0.4)',
    speed: 0.012,
    description: 'An ice giant that rotates on its side. It has a blue-green color from methane in its atmosphere.',
  },
  {
    name: 'Neptune',
    radius: 13,
    orbitRadius: 455,
    size: '49,528 km',
    distance: '4,495.1 million km',
    orbitalPeriod: '164.8 years',
    color: '#4466ff',
    glowColor: 'rgba(68, 102, 255, 0.4)',
    speed: 0.006,
    description: 'The windiest planet with speeds up to 2,100 km/h. It has a deep blue color and 16 known moons.',
  },
];

function App() {
  const [angles, setAngles] = useState<number[]>(
    planets.map(() => Math.random() * Math.PI * 2)
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const animate = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setAngles((prev) =>
        prev.map((angle, i) => angle + planets[i].speed * speedMultiplier * delta)
      );

      animationRef.current = requestAnimationFrame(animate);
    },
    [speedMultiplier]
  );

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);

  const getPlanetPosition = (index: number) => {
    const planet = planets[index];
    const x = Math.cos(angles[index]) * planet.orbitRadius;
    const y = Math.sin(angles[index]) * planet.orbitRadius * 0.4; // Elliptical perspective
    return { x, y };
  };

  const speedOptions = [0.25, 0.5, 1, 2, 5, 10];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a2e] via-[#0d0d3b] to-[#000011] text-white overflow-hidden relative">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 2 + 2 + 's',
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 text-center pt-4 pb-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
          🌌 Solar System Explorer
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Click on any planet to learn more about it
        </p>
      </header>

      {/* Solar System Visualization */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center"
        style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}
      >
        {/* Sun */}
        <div className="absolute z-10">
          <div
            className="rounded-full relative"
            style={{
              width: '50px',
              height: '50px',
              background: 'radial-gradient(circle at 35% 35%, #fff7a0, #ffcc00, #ff8800, #cc4400)',
              boxShadow: '0 0 40px 15px rgba(255, 200, 0, 0.5), 0 0 80px 30px rgba(255, 150, 0, 0.3), 0 0 120px 50px rgba(255, 100, 0, 0.15)',
            }}
          />
        </div>

        {/* Orbit paths */}
        {planets.map((planet, i) => (
          <div
            key={`orbit-${i}`}
            className="absolute rounded-full border border-white/10"
            style={{
              width: planet.orbitRadius * 2 + 'px',
              height: planet.orbitRadius * 2 * 0.4 + 'px',
              left: `calc(50% - ${planet.orbitRadius}px)`,
              top: `calc(50% - ${planet.orbitRadius * 0.4}px)`,
            }}
          />
        ))}

        {/* Planets */}
        {planets.map((planet, i) => {
          const pos = getPlanetPosition(i);
          const isSelected = selectedPlanet === i;
          const isHovered = hoveredPlanet === i;
          const zIndex = pos.y > 0 ? 20 : 5;

          return (
            <div
              key={`planet-${i}`}
              className="absolute cursor-pointer transition-transform duration-200"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                left: '50%',
                top: '50%',
                zIndex: zIndex,
              }}
              onClick={() => setSelectedPlanet(isSelected ? null : i)}
              onMouseEnter={() => setHoveredPlanet(i)}
              onMouseLeave={() => setHoveredPlanet(null)}
            >
              {/* Planet body */}
              <div
                className="rounded-full transition-all duration-200"
                style={{
                  width: planet.radius * 2 + 'px',
                  height: planet.radius * 2 + 'px',
                  background: `radial-gradient(circle at 35% 35%, ${lightenColor(planet.color, 40)}, ${planet.color}, ${darkenColor(planet.color, 30)})`,
                  boxShadow: isSelected
                    ? `0 0 20px 8px ${planet.glowColor}, 0 0 40px 15px ${planet.glowColor}`
                    : isHovered
                    ? `0 0 15px 5px ${planet.glowColor}`
                    : `0 0 8px 2px ${planet.glowColor}`,
                  transform: isSelected || isHovered ? 'scale(1.3)' : 'scale(1)',
                }}
              />
              {/* Saturn's ring */}
              {planet.name === 'Saturn' && (
                <div
                  className="absolute rounded-full border-2 border-yellow-200/50"
                  style={{
                    width: planet.radius * 3.2 + 'px',
                    height: planet.radius * 0.8 + 'px',
                    left: `calc(50% - ${planet.radius * 1.6}px)`,
                    top: `calc(50% - ${planet.radius * 0.4}px)`,
                    transform: 'rotateX(70deg)',
                  }}
                />
              )}
              {/* Planet label */}
              {(isHovered || isSelected) && (
                <div
                  className="absolute text-xs font-medium text-white/90 whitespace-nowrap pointer-events-none"
                  style={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                    top: planet.radius * 2 + 6 + 'px',
                    textShadow: '0 0 4px rgba(0,0,0,0.8)',
                  }}
                >
                  {planet.name}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Controls Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-4">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
          >
            {isPlaying ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                <span className="text-sm">Pause</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                <span className="text-sm">Play</span>
              </>
            )}
          </button>

          {/* Speed Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Speed:</span>
            <div className="flex gap-1">
              {speedOptions.map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSpeedMultiplier(speed)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    speedMultiplier === speed
                      ? 'bg-blue-500/80 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setAngles(planets.map(() => Math.random() * Math.PI * 2));
              setSelectedPlanet(null);
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20 text-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
      </div>

      {/* Planet Info Panel */}
      {selectedPlanet !== null && (
        <div className="fixed top-20 right-4 z-50 w-80 bg-black/70 backdrop-blur-xl rounded-2xl border border-white/15 shadow-2xl overflow-hidden animate-fade-in">
          <div
            className="h-2"
            style={{ background: `linear-gradient(90deg, ${planets[selectedPlanet].color}, transparent)` }}
          />
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold" style={{ color: planets[selectedPlanet].color }}>
                {planets[selectedPlanet].name}
              </h2>
              <button
                onClick={() => setSelectedPlanet(null)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div
                className="rounded-full"
                style={{
                  width: Math.min(planets[selectedPlanet].radius * 2.5, 60) + 'px',
                  height: Math.min(planets[selectedPlanet].radius * 2.5, 60) + 'px',
                  background: `radial-gradient(circle at 35% 35%, ${lightenColor(planets[selectedPlanet].color, 40)}, ${planets[selectedPlanet].color})`,
                  boxShadow: `0 0 15px 5px ${planets[selectedPlanet].glowColor}`,
                }}
              />
              <p className="text-sm text-gray-300 leading-relaxed">
                {planets[selectedPlanet].description}
              </p>
            </div>

            <div className="space-y-2">
              <InfoRow label="Diameter" value={planets[selectedPlanet].size} icon="📏" />
              <InfoRow label="Distance from Sun" value={planets[selectedPlanet].distance} icon="📐" />
              <InfoRow label="Orbital Period" value={planets[selectedPlanet].orbitalPeriod} icon="🔄" />
            </div>
          </div>
        </div>
      )}

      {/* Planet Quick Nav */}
      <div className="fixed top-20 left-4 z-50 hidden md:block">
        <div className="bg-black/50 backdrop-blur-md rounded-xl border border-white/10 p-3">
          <p className="text-xs text-gray-400 mb-2 font-medium">Planets</p>
          <div className="space-y-1">
            {planets.map((planet, i) => (
              <button
                key={i}
                onClick={() => setSelectedPlanet(selectedPlanet === i ? null : i)}
                className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-left transition-colors ${
                  selectedPlanet === i ? 'bg-white/15' : 'hover:bg-white/10'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: planet.color }}
                />
                <span className="text-xs text-gray-200">{planet.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
      <span className="text-base">{icon}</span>
      <div>
        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}

// Utility functions for color manipulation
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return `rgb(${R}, ${G}, ${B})`;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return `rgb(${R}, ${G}, ${B})`;
}

export default App;
