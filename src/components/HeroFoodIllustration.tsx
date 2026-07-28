import React from "react";

export function HeroFoodIllustration() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="relative w-full flex items-center justify-center">
      <img
        src={`${basePath}/images/hero-pakistani-feast.webp`}
        alt="Delicious Pakistani food feast illustration"
        className="w-full max-w-[660px] h-auto object-contain"
        style={{ filter: "drop-shadow(0 18px 32px rgba(43, 62, 37, 0.16))" }}
      />
    </div>
  );
}
