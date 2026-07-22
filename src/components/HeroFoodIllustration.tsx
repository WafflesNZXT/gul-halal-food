import React from "react";

export function HeroFoodIllustration() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="relative w-full flex items-center justify-center">
      <img
        src={`${basePath}/images/hero-pakistani-feast.png`}
        alt="Delicious Pakistani food feast illustration"
        className="w-full max-w-[560px] h-auto object-contain drop-shadow-2xl"
        style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))" }}
      />
    </div>
  );
}
