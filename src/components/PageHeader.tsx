import React from "react";
import { DecorativeFlourish } from "./DecorativeFlourish";
import { motion } from "framer-motion";

export function PageHeader({ title, description }: { title: string, description?: string }) {
  return (
    <div className="bg-primary pt-32 pb-16 px-4 md:px-6 relative overflow-hidden text-center">
      {/* Decorative leaf pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="leaf-pattern-header" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M20,50 C20,30 40,20 50,20 C60,20 80,30 80,50 C80,70 60,80 50,80 C40,80 20,70 20,50 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#leaf-pattern-header)" className="text-white" />
        </svg>
      </div>
      
      <div className="container mx-auto relative z-10 max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center justify-center gap-3 w-full">
            <DecorativeFlourish className="text-secondary w-6 h-6 rotate-180 hidden sm:block" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-white">{title}</h1>
            <DecorativeFlourish className="text-secondary w-6 h-6 hidden sm:block" />
          </div>
          {description && (
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">{description}</p>
          )}
        </motion.div>
      </div>
      
    </div>
  );
}
