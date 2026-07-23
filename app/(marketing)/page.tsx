"use client";
import AgronNavbar from "@/components/Landing/AgronNavbar";
import HeroSection from "@/components/Landing/HeroSection";
import DJIAgrasCard from "@/components/Landing/DJIAgrasCard";
import ProductCard from "@/components/Landing/ProductCard";
import BirdCard from "@/components/Landing/BirdCard";
import DroneSection from "@/components/Landing/DroneSection";
import WhyAgrone from "@/components/Landing/WhyAgrone";

export default function Home() {
  return (
    // 1. The outermost container (the "frame")
    // Use min-h-screen and a background image/color
    <div className="min-h-screen w-full p-4 flex flex-col">
      {/* 2. The Hero Section (the green "card") */}
      {/* flex-1 makes it take up all available space inside the frame */}
      <section
        id="hero"
        className="relative flex-1 max-h-screen bg-[#4a6741] rounded-[32px] overflow-hidden flex flex-col lg:px-20"
        style={{
          // Note the forward slash at the start.
          // Next.js automatically looks inside the "public" folder.
          backgroundImage:
            "url('/images/Hero_BackGround_[ AI Generated Gemini ]_.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Navbar inside the hero */}
        <div className="pt-4">
          <AgronNavbar />
        </div>

        {/* Content area for your text and DJI Drones */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Your main content goes here */}
          <HeroSection />
          <div
            className="flex justify-between w-full h-full mt-5"
            style={{ height: 420 }}
            ref={(el) => console.log("height:", el?.offsetHeight)}
          >
            <DJIAgrasCard />
            <ProductCard />
          </div>
        </div>
      </section>
      <section className="mt-5">
        <DroneSection />
      </section>
      <section className="mt-5 w-full bg-red-500">
        <WhyAgrone />
      </section>
    </div>
  );
}
