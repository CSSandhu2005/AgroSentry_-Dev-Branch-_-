import Link from "next/link";
import GoogleReviewCard from "./GoogleReviewCard";

export default function HeroSection() {
  return (
    <div className="relative w-full flex flex-col justify-center mt-7">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-top max-w-8xl mx-auto w-full">

        {/* ── Left Content ── */}
        <div className="flex flex-col space-y-10 z-10">

          {/* Heading */}
          <h1 className="text-9xl md:text-8xl lg:text-[105px] font-medium text-white leading-[1.05] tracking-tight">
            Part of future
            <br />
            <span className="flex items-center gap-4 mt-1">
              Agriculture

              {/* Wheat / grain icon — white stroke circle, matches reference */}
              <span className="inline-flex items-center justify-center mt-11 w-14 h-14 rotate-45 rounded-full border border-white/70 border-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Stem */}
                  <line x1="12" y1="22" x2="12" y2="6" />
                  {/* Grain pairs */}
                  <path d="M12 16 C10 14 7 14 7 11 C7 11 10 10 12 13" />
                  <path d="M12 16 C14 14 17 14 17 11 C17 11 14 10 12 13" />
                  <path d="M12 12 C10 10 7 10 7 7 C7 7 10 6 12 9" />
                  <path d="M12 12 C14 10 17 10 17 7 C17 7 14 6 12 9" />
                  {/* Top tip */}
                  <line x1="12" y1="6" x2="12" y2="3" />
                </svg>
              </span>
            </span>
          </h1>

          {/* Shop All button — compact, matches reference (no extra circle inside) */}
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 w-fit px-7 py-5 rounded-full border border-white/70 border-2 text-white text-base font-light hover:bg-white hover:text-black transition-all duration-500 mt-7"
          >
            <span>Enter App</span>
            {/* Simple long arrow, no circle wrapper */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="102"
              height="24"
              viewBox="0 0 102 14"
              fill="none"   
              className="group-hover:translate-x-1 transition-transform duration-300"
            >
              <line x1="0" y1="7" x2="102" y2="7" stroke="currentColor" strokeWidth="2.9" strokeLinecap="round" />
              <path d="M90 -3 L101.5 7 L90 17" stroke="currentColor" strokeWidth="2.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </Link>
        </div>

        {/* ── Right Content — Floating Review Card ── */}
        <div className="relative flex justify-center lg:justify-end mt-12 lg:mt-0">
          <GoogleReviewCard />
        </div>

      </div>
    </div>
  );
}
