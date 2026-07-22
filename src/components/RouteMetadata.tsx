import { useEffect } from "react";
import { useLocation } from "wouter";
import { config } from "@/data/config";

const pageMetadata: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Gul Halal Food | Pakistani Halal Catering",
    description: config.description,
  },
  "/menu": {
    title: "Menu | Gul Halal Food",
    description: "Explore Pakistani halal catering menu options from Gul Halal Food.",
  },
  "/catering": {
    title: "Catering Services | Gul Halal Food",
    description: "Pakistani halal catering services for gatherings and celebrations.",
  },
  "/about": {
    title: "About Us | Gul Halal Food",
    description: "Learn about Gul Halal Food, a family-owned Pakistani halal caterer established in 1985.",
  },
  "/gallery": {
    title: "Gallery | Gul Halal Food",
    description: "Explore the Gul Halal Food gallery.",
  },
  "/testimonials": {
    title: "Testimonials | Gul Halal Food",
    description: "Read customer feedback from Gul Halal Food when it becomes available.",
  },
  "/contact": {
    title: "Contact | Gul Halal Food",
    description: "Contact information for Gul Halal Food will be available soon.",
  },
  "/quote": {
    title: "Request a Quote | Gul Halal Food",
    description: "Request pricing information for Pakistani halal catering from Gul Halal Food.",
  },
};

function updateMeta(selector: string, content: string) {
  const element = document.querySelector<HTMLMetaElement>(selector);
  if (element) element.content = content;
}

export function RouteMetadata() {
  const [location] = useLocation();

  useEffect(() => {
    const metadata = pageMetadata[location] ?? pageMetadata["/"];
    document.title = metadata.title;
    updateMeta('meta[name="description"]', metadata.description);
    updateMeta('meta[property="og:title"]', metadata.title);
    updateMeta('meta[property="og:description"]', metadata.description);
    updateMeta('meta[name="twitter:title"]', metadata.title);
    updateMeta('meta[name="twitter:description"]', metadata.description);
  }, [location]);

  return null;
}
