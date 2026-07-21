import React from "react";

const avatars: string[] = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&h=80&fit=crop&crop=face",
];

const GoogleReviewCard: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      {/* Card container — holds back card + front card */}
      <div className="relative w-[420px] h-[420px]">

        {/* ── Back card: white rectangle peeking out (folder / 3D effect) ── */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#e8e8e8] rounded-[36px] z-0"
          style={{ width: "calc(100% - 32px)", height: 400 }}
        />

        {/* ── Front green card ── */}
        <div className="absolute top-5 left-0 w-full h-[400px] bg-[#94cd5e] rounded-[36px] z-10 flex flex-col justify-between px-9 pt-9 pb-8">

          {/* Top: Rating + review count */}
          <div>
            <div className="flex items-start gap-1 mb-2">
              <span
                className="text-[72px] font-bold text-white leading-none tracking-tight"
                style={{ letterSpacing: -2 }}
              >
                4.9
              </span>
              {/* Star icon */}
              <svg
                className="w-[30px] h-[30px] mt-2 ml-0.5 shrink-0"
                viewBox="0 0 24 24"
                fill="#ffffff"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
              </svg>
            </div>
            <p
              className="text-white text-base font-normal opacity-95"
              style={{}}
            >
              1200+ Customers Review
            </p>
          </div>

          {/* Middle: Overlapping avatars */}
          <div className="flex items-center">
            {avatars.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`reviewer-${index}`}
                className="w-[54px] h-[54px] rounded-full object-cover border-[1.5px] border-white"
                style={{
                  marginLeft: index === 0 ? 0 : -14,
                  zIndex: avatars.length - index,
                  position: "relative",
                }}
              />
            ))}
          </div>

          {/* Bottom: Google G logo + Asterisk button */}
          <div className="flex items-center justify-between">
            {/* Google "G" logo */}
            <svg
              width="34"
              height="34"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#ffffff"
                d="M44.5 20H24v8h11.8C34.7 33.9 29.9 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.2-2.7-.5-4z"
              />
            </svg>

            {/* Asterisk / sparkle button */}
            <div className="w-[58px] h-[58px] rounded-full bg-[#1e4d2b] flex items-center justify-center cursor-pointer">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="12" y1="2"     x2="12" y2="22"    stroke="#7dc467" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="2"  y1="12"    x2="22" y2="12"    stroke="#7dc467" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="#7dc467" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke="#7dc467" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GoogleReviewCard;
