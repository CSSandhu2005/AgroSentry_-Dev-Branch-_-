"use client";
import React, { useState } from "react";

const AgronNavbar: React.FC = () => {
  const [dronesOpen, setDronesOpen] = useState<boolean>(false);
  const [servicesOpen, setServicesOpen] = useState<boolean>(false);

  const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
    <svg
      className={`w-3 h-3 opacity-50 flex-shrink-0 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Exact nav link style
  const navLinkClass =
    "flex items-center px-3 py-1.5 text-[13.5px] text-[#3b7036] rounded-full whitespace-nowrap hover:bg-[#f2f2f2] transition-colors duration-150 no-underline cursor-pointer font-semibold";

  const dropdownItemClass =
    "block px-3.5 py-2 text-[13px] text-[#3b7036] rounded-lg hover:bg-[#f2f2f2] transition-colors duration-100 no-underline cursor-pointer";

  return (
    // Background: dark forest/olive green from reference image
    <div className="flex">
      <header className="flex items-center gap-1.5 w-full ">
        {/* ── Separate Logo Pill — white bg, same height as navbar ── */}
        <a
          href="#"
          className="flex items-center gap-1 bg-white rounded-full p-3.5 flex-shrink-0 shadow-sm no-underline "
        >
          {/* Olive-green asterisk icon — matches reference */}
          <svg
            className="w-[22px] h-[22px] block"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Central Rounded Square */}
            <rect
              x="8.5"
              y="8.5"
              width="7"
              height="7"
              rx="1.5"
              fill="#84cc16"
            />
            {/* Four Corner Circles */}
            <circle cx="6.5" cy="6.5" r="3.5" fill="#84cc16" />
            <circle cx="17.5" cy="6.5" r="3.5" fill="#84cc16" />
            <circle cx="6.5" cy="17.5" r="3.5" fill="#84cc16" />
            <circle cx="17.5" cy="17.5" r="3.5" fill="#84cc16" />
          </svg>
          <span className="text-[20px] font-semibold text-[#3b7036] tracking-tight whitespace-nowrap">
            AgroSentry
          </span>
        </a>

        {/* ── Main Navbar Pill — white bg ── */}
        <nav className="flex items-center bg-white rounded-full p-2 pl-10 flex-1 shadow-sm">
          {/* Nav Links */}
          <div className="flex items-center flex-1 font-semibold">
            <a href="#" className={navLinkClass}>
              Home
            </a>

            {/* Drones Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDronesOpen(true)}
              onMouseLeave={() => setDronesOpen(false)}
            >
              <button
                className={`${navLinkClass} gap-1 bg-transparent border-none`}
              >
                Drones
                <ChevronIcon open={dronesOpen} />
              </button>
              <div
                className={`absolute top-[calc(100%+8px)] left-0 bg-white rounded-2xl shadow-[0_8px_28px_rgba(0,0,0,0.13)] min-w-[170px] p-1.5 z-50 transition-all duration-150 ${
                  dronesOpen
                    ? "opacity-100 pointer-events-auto translate-y-0"
                    : "opacity-0 pointer-events-none -translate-y-1"
                }`}
              >
                {[
                  "Agricultural Drones",
                  "Sprayer Drones",
                  "Survey Drones",
                  "Accessories",
                ].map((item) => (
                  <a key={item} href="#" className={dropdownItemClass}>
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <a href="#" className={navLinkClass}>
              How it Works
            </a>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className={`${navLinkClass} gap-1 bg-transparent border-none`}
              >
                Services
                <ChevronIcon open={servicesOpen} />
              </button>
              <div
                className={`absolute top-[calc(100%+8px)] left-0 bg-white rounded-2xl shadow-[0_8px_28px_rgba(0,0,0,0.13)] min-w-[170px] p-1.5 z-50 transition-all duration-150 ${
                  servicesOpen
                    ? "opacity-100 pointer-events-auto translate-y-0"
                    : "opacity-0 pointer-events-none -translate-y-1"
                }`}
              >
                {[
                  "Crop Monitoring",
                  "Spraying Services",
                  "Field Mapping",
                  "Consultancy",
                ].map((item) => (
                  <a key={item} href="#" className={dropdownItemClass}>
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <a href="#" className={navLinkClass}>
              Blog
            </a>
            <a href="#" className={navLinkClass}>
              Contact us
            </a>
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-1.5 ml-1 flex-shrink-0">
            {/* Search — warm creamy beige from reference */}
            <div className="flex items-center gap-1.5 bg-[#f0ebe3] rounded-full p-5 h-[34px] min-w-[240px] font-semibold">
              <svg
                className="w-3.5 h-3.5 flex-shrink-0 text-[#3b7036]"
                viewBox="0 0 20 20"
                fill="none"
              >
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="5.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M13 13l3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="border-none bg-transparent outline-none text-[13px] text-[#3b7036] placeholder:text-[#3b7036] w-[72px]"
              />
            </div>

            {/* Cart — same warm beige as search */}
            <button
              aria-label="Cart"
              className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#f0ebe3] border-none cursor-pointer hover:bg-[#e8e0d6] transition-colors duration-150 flex-shrink-0"
            >
              <svg
                className="w-[20px] h-[20px] text-[#3b7036] block"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="3"
                  y1="6"
                  x2="21"
                  y2="6"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <path
                  d="M16 10a4 4 0 01-8 0"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          
        </nav>
        <a
          href="#"
          className="flex items-center gap-2 bg-white rounded-full px-4 flex-shrink-0 shadow-sm no-underline"
        >
          {/* Olive-green asterisk icon — matches reference */}
          <span className="text-[13px] font-semibold text-[#3b7036] tracking-tight whitespace-nowrap py-5">
            Enter AgroSentry
          </span>
        </a>
      </header>
    </div>
  );
};

export default AgronNavbar;
