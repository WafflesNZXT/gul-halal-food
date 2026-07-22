import React from "react";
import { ServiceItem } from "@/data/services";
import * as Icons from "lucide-react";

import { Link } from "wouter";

export function ServiceCard({ service }: { service: ServiceItem }) {
  const Icon = (Icons as any)[service.iconName] || Icons.Star;

  return (
    <div className="bg-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col items-start gap-4">
      <div className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-2 shadow-sm">
        <Icon size={28} strokeWidth={2} />
      </div>
      <h3 className="font-display text-2xl text-foreground">{service.title}</h3>
      <p className="text-foreground/80 text-base leading-relaxed mb-4 flex-1">
        {service.description}
      </p>
      <Link href="/quote" className="text-primary font-bold hover:text-secondary transition-colors inline-flex items-center gap-1 group">
        Request a Quote 
        <Icons.ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
