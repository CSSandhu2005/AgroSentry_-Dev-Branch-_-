import React, { useState } from "react";

const slides = [
  {
    id: 1,
    title: "Heavy Payload",
    image:
      "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&h=500&fit=crop",
  },
  {
    id: 2,
    title: "Smooth Spreading",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=500&fit=crop",
  },
  {
    id: 3,
    title: "Four Sprinkler Kit",
    image:
      "https://images.unsplash.com/photo-1473973266408-ed4e27abdd47?w=600&h=500&fit=crop",
  },
];

const DroneSection: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const getVisible = () => {
    const total = slides.length;
    return [
      slides[current % total],
      slides[(current + 1) % total],
      slides[(current + 2) % total],
    ];
  };

  return (
    <div className="w-full bg-white px-16 py-16">

      {/* ── Top Row: Title + Explore Button ── */}
      <div className="flex items-start justify-between mb-12">
        <div className="flex flex-col">
          {/* Line 1: icons + "Elevates" */}
          <div className="flex items-center gap-3 mb-1">
            {/* Icon cluster */}
            <div className="flex items-center">
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 36,
                  height: 36,
                  background: "#f5f0e2",
                  border: "2px solid #e0dbd0",
                  marginRight: -8,
                  zIndex: 2,
                  position: "relative",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#1b3d1b" />
                </svg>
              </div>
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 44,
                  height: 44,
                  background: "#1b3d1b",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" fill="white" />
                  <circle cx="6" cy="6" r="2" fill="white" />
                  <circle cx="18" cy="6" r="2" fill="white" />
                  <circle cx="6" cy="18" r="2" fill="white" />
                  <circle cx="18" cy="18" r="2" fill="white" />
                </svg>
              </div>
            </div>

            <h1
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: "#1b3d1b",
                lineHeight: 1,
                margin: 0,
              }}
            >
              Elevates
            </h1>
          </div>

          {/* Line 2: "drone agricultural" + asterisk */}
          <div className="flex items-center gap-4">
            <h1
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: "#1b3d1b",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              drone agricultural
            </h1>
            {/* Asterisk badge */}
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: 48,
                height: 48,
                background: "#f5f0e2",
                border: "2px solid #d4cfc4",
                flexShrink: 0,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="2" x2="12" y2="22" stroke="#5a8a3a" strokeWidth="2" strokeLinecap="round" />
                <line x1="2" y1="12" x2="22" y2="12" stroke="#5a8a3a" strokeWidth="2" strokeLinecap="round" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="#5a8a3a" strokeWidth="2" strokeLinecap="round" />
                <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke="#5a8a3a" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Line 3: "operations new heights" */}
          <h1
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "#1b3d1b",
              lineHeight: 1.1,
              marginLeft: 70,
            }}
          >
            operations new heights
          </h1>
        </div>

        {/* Explore Drones button */}
        <button
          className="hover:bg-[#1b3d1b] hover:text-white transition-all duration-300"
          style={{
            padding: "14px 28px",
            borderRadius: 999,
            border: "1.5px solid #1b3d1b",
            background: "transparent",
            color: "#1b3d1b",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            cursor: "pointer",
            marginTop: 50,
            marginRight: 220,
            flexShrink: 0,
          }}
        >
          Explore Drones
        </button>
      </div>

      {/* ── Bottom Row: Left text + nav | Right image cards ── */}
      <div className="flex gap-12 justify-start">

        {/* Left: description + nav arrows */}
        <div className="flex flex-col gap-8 mt-20" style={{ minWidth: 280, maxWidth: 300 }}>
          <p
            style={{
              fontSize: 15,
              color: "#888",
              lineHeight: 1.7,
              fontWeight: 500,  
            }}
          >
            DJI RC Plus has a 7-inch high brightness
            screen and an 8-core processor for
            smooth operations. Intelligent route
            planning minimizes distances flown
            with a full tank.
          </p>

          {/* Nav arrows */}
          <div className="flex gap-3">
            <button
              onClick={prev}
              className="flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
              style={{
                width: 72,
                height: 72,
                borderRadius: 999,
                border: "1.5px solid #006400",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#006400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={next}
              className="flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
              style={{
                width: 72,
                height: 72,
                borderRadius: 999,
                border: "1.5px solid #006400",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#006400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right: 3 image cards */}
        <div className="flex gap-5 flex-1">
          {getVisible().map((slide, i) => (
            <div key={slide.id} className="flex flex-col gap-3 flex-1">
              <div
                className="overflow-hidden"
                style={{
                  borderRadius: 20,
                  height: 550,
                  opacity: i === 0 ? 0.85 : 1,
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#1b3d1b",
                }}
              >
                {slide.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DroneSection;