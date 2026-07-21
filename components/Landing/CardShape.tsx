import React from "react";

const CardShape: React.FC = () => {
  /*
    Original path (notch on LEFT):
    M 10,40  L 70,40  A 10,10 0,0,0 80,30  L 80,10  A 10,10 0,0,1 90,0
    L 140,0  A 10,10 0,0,1 150,10  L 150,190  A 10,10 0,0,1 140,200
    L 10,200  A 10,10 0,0,1 0,190  L 0,50  A 10,10 0,0,1 10,40  Z

    Mirror horizontally across x=150 (total width):
      new_x = 150 - old_x

    Mirrored path (notch on RIGHT):
    M 140,40  L 80,40  A 10,10 0,0,1 70,30  L 70,10  A 10,10 0,0,0 60,0
    L 10,0    A 10,10 0,0,0 0,10   L 0,190   A 10,10 0,0,0 10,200
    L 140,200 A 10,10 0,0,0 150,190 L 150,50  A 10,10 0,0,0 140,40 Z

    Scale up 4x for visibility (multiply all coords by 4):
    Width: 150*4 = 600, Height: 200*4 = 800 ... too tall.
    Let's scale to match the reference card proportions:
    Use scale factor ~3: width=450, height=600
    Actually let's keep original proportions and scale 3x:
    width=150*3=450, height=200*3=600 — still tall.
    
    Better: scale 2.8x, round:
    width ≈ 420, height ≈ 560
    
    Let's just use the exact path scaled 3x for a nice card size:
    All values * 3:
    M 420,120 L 240,120 A 30,30 0,0,1 210,90 L 210,30 A 30,30 0,0,0 180,0
    L 30,0    A 30,30 0,0,0 0,30   L 0,570   A 30,30 0,0,0 30,600
    L 420,600 A 30,30 0,0,0 450,570 L 450,150 A 30,30 0,0,0 420,120 Z
  */

  const path = `
    M 420,120
    L 240,120
    A 30,30 0,0,1 210,90
    L 210,30
    A 30,30 0,0,0 180,0
    L 30,0
    A 30,30 0,0,0 0,30
    L 0,570
    A 30,30 0,0,0 30,600
    L 420,600
    A 30,30 0,0,0 450,570
    L 450,150
    A 30,30 0,0,0 420,120
    Z
  `;

  return (
    <div>
      <svg
        width="450"
        height="600"
        viewBox="0 0 450 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={path} fill="#7dd3fc" />
      </svg>
    </div>
  );
};

export default CardShape;
