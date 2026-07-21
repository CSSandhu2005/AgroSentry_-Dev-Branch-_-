import React from "react";

const DJIAgrasCard = () => {
  return (
    <div className="w-1/2" style={{ height: 420 }}>
      <div className="relative" style={{ width: 750, height: 380 }}>
        <div
          className="absolute flex items-center justify-center rounded-full bg-[#94cd5e] cursor-pointer z-20 right-6 "
          style={{ width: 90, height: 90 }}
        >
          <svg  width="52" height="52" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 16L16 4M16 4H9M16 4V11"
              stroke="#1a3a1a"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Change items-center to items-stretch on the card div */}
        <div
          className="absolute inset-0 bg-[#f5f0e2] flex px-2.75 py-3.75 items-stretch gap-5"
          style={{
            clipPath:
              "path('M 30,0 L 585,0 A 40,40 0,0,1 625,40 L 625,60 A 40,40 0,0,0 665,100 L 700,100 A 40,40 0,0,1 740,140 L 740,350 A 30,30 0,0,1 710,380 L 30,380 A 30,30 0,0,1 0,350 L 0,30 A 30,30 0,0,1 30,0 Z')",
          }}
        >
          <div className="flex-shrink-0 overflow-hidden rounded-[20px] w-1/2">
            <img
              src="./images/Hero_Drone_1_.png"
              alt="DJI Agras T50"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col pr-8 py-6 flex-1 justify-center relative">
            <div className="flex flex-col gap-2 mb-17">
              <h2 className="text-[#1b3d1b] font-bold leading-tight text-3xl">
                Garud Agro T50
              </h2>
              <p
                className="text-[#555] font-semibold"
                style={{ fontSize: 14, lineHeight: 1.6 }}
              >
                Fully automatic and manual operation
                <br />
                orchard mode variable rate
              </p>
            </div>

            <button
              className="w-fit hover:bg-[#2d5a27] hover:text-white transition-all duration-300 absolute left-0 bottom-12"
              style={{
                padding: "15px 20px",
                borderRadius: 999,
                border: "2px solid #2d5a27",
                background: "transparent",
                color: "#2d5a27",
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              VIEW DETAILS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DJIAgrasCard;
