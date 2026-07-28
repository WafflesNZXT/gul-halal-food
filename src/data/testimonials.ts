export type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  rating?: number;
  isTemporary?: boolean;
};

// Temporary development content. Replace only with customer-approved testimonials.
export const testimonials: Testimonial[] = [
  {
    id: "temporary-1",
    name: "Client testimonial",
    role: "Temporary development content",
    content: "Customer feedback will be shared here soon.",
    isTemporary: true,
  },
  {
    id: "temporary-2",
    name: "Client testimonial",
    role: "Temporary development content",
    content: "Customer feedback will be shared here soon.",
    isTemporary: true,
  },
  {
    id: "temporary-3",
    name: "Client testimonial",
    role: "Temporary development content",
    content: "Customer feedback will be shared here soon.",
    isTemporary: true,
  },
];
