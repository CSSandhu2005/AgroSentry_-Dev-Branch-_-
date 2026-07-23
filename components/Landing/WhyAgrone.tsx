"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, Play } from "lucide-react";

export default function WhyAgrone() {
  return (
    <section className="relative w-full bg-white pt-12 pb-20 px-4 sm:px-8 font-sans">
      {/* Top Heading */}
      <div className="text-center mb-8 overflow-hidden text-9xl">
        <h2 className="font-bold tracking-tight text-[#0F3822] leading-tight">
          Why AgrOne?
        </h2>
      </div>

      {/* Main Container Card */}
      <div className="w-full bg-[#F5EFE6] rounded-4xl p-5 sm:p-8 md:p-10 space-y-6">
        
        {/* Accordion / Feature List Container */}
        <div className="bg-white mt-22 rounded-2xl shadow-sm border border-gray-100/80 divide-y divide-gray-100 overflow-hidden">
          
          {/* Item 01 - All Scenario Adaptability (Expanded View) */}
          <div className="p-6 sm:p-8 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-4 max-w-md">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F3822] tracking-tight">
                All Scenario Adaptability
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                Fully automatic and manual operation orchard mode variable rate application
              </p>
              <div className="pt-1 text-lg font-bold text-[#0F3822]">
                01
              </div>
            </div>

            {/* Feature Thumbnail */}
            <div className="relative w-full sm:w-64 h-40 sm:h-36 rounded-xl overflow-hidden shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
                alt="Tractor spraying field"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 256px"
              />
            </div>
          </div>

          {/* Item 02: Heavy Payload */}
          <div className="px-6 py-5 sm:px-8 flex items-center justify-between">
            <span className="text-lg sm:text-xl font-bold text-[#0F3822]">
              Heavy Payload
            </span>
            <span className="text-base font-bold text-[#0F3822]">03</span>
          </div>

          {/* Item 03: Four Sprinkler Kit */}
          <div className="px-6 py-5 sm:px-8 flex items-center justify-between">
            <span className="text-lg sm:text-xl font-bold text-[#0F3822]">
              Four Sprinkler Kit
            </span>
            <span className="text-base font-bold text-[#0F3822]">03</span>
          </div>

          {/* Item 04: High Flow Rate */}
          <div className="px-6 py-5 sm:px-8 flex items-center justify-between">
            <span className="text-lg sm:text-xl font-bold text-[#0F3822]">
              High Flow Rate
            </span>
            <span className="text-base font-bold text-[#0F3822]">04</span>
          </div>
        </div>

        {/* Drone Banner Card */}
        <div className="relative w-full h-[420px] sm:h-[480px] rounded-[28px] overflow-hidden">
          {/* Background Image */}
          <img
            src="./images/Drone_Shot_Main_Hero_OverLay_[ 2026 ]_.png"
            alt="Agricultural Drone Aerial View"
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />

          {/* Bottom Left Content Card Overlay */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 max-w-[calc(100%-2rem)] sm:max-w-md">
            
            {/* Play Button badge relative to the card */}
            <div className="absolute -top-5 right-6 z-10">
              <button
                type="button"
                className="w-11 h-11 sm:w-12 sm:h-12 bg-[#82C43C] rounded-full flex items-center justify-center text-[#0F3822] shadow-md hover:scale-105 active:scale-95 transition-transform"
                aria-label="Play video"
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </button>
            </div>

            {/* White Card */}
            <div className="bg-white rounded-[24px] p-6 sm:p-7 shadow-lg space-y-5">
              <h4 className="text-xl sm:text-2xl font-bold text-[#0F3822] leading-tight">
                Spreader & spiral channel spinning disk significantly
              </h4>

              <button
                type="button"
                className="inline-flex items-center gap-2 border border-gray-300 rounded-full pl-4 pr-1.5 py-1.5 text-xs font-semibold tracking-wider text-[#0F3822] uppercase hover:border-[#0F3822] transition-colors"
              >
                View More
                <span className="w-7 h-7 rounded-full bg-[#0F3822] flex items-center justify-center text-white">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}