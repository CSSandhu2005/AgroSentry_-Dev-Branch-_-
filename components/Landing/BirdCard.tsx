"use client";

import React from "react";

/*
  Button: 60x60, sits at bottom:0 right:0 of the 600x400 card.
  Notch must accommodate the button perfectly.
  
  Button occupies: x=540..600, y=340..400 (bottom-right corner)
  Notch center circle = button center = (570, 370), radius = 40 (button r=30 + 10px gap)
  
  Arc start on right edge:  y = 370 - 40 = 330
  Arc end on bottom edge:   x = 570 - 40 = 530
  
  So path goes:
  ... L 600,330  ← down right edge to notch start
  A 40,40 0,0,0 530,400  ← concave arc (sweep=0 = counter-clockwise = concave)
  L 24,400 ...  ← continue along bottom
*/

const BirdCard: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative" style={{ width: 600, height: 400 }}>

        {/* Card with perfectly fitted concave notch at bottom-right */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&h=400&fit=crop')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            clipPath:
              "path('M 24,0 L 576,0 A 24,24 0,0,1 600,24 L 600,330 A 40,40 0,0,0 530,400 L 24,400 A 24,24 0,0,0 0,376 L 0,24 A 24,24 0,0,1 24,0 Z')",
          }}
        />

        {/* Bird button — center at (570, 370), exactly in the notch */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            width: 60,
            height: 60,
            backgroundColor: "#000",
            borderRadius: 999,
            bottom: 0,
            right: 0,
          }}
        >
          <span
            className="text-white font-semibold tracking-widest"
            style={{ fontSize: 14 }}
          >
            Bi
          </span>
        </div>
      </div>
    </div>
  );
};

export default BirdCard;