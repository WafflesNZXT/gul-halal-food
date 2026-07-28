export type MenuItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  longDescription?: string;
  ingredients?: string[];
  servingNotes?: string;
  image?: string;
  pricingLabel?: string;
  featured?: boolean;
  available?: boolean;
  spiceLevel: number;
  icon: string;
  category: string;
  price: string;
};

export const menu: MenuItem[] = [
  {
    id: "chicken-biryani",
    slug: "chicken-biryani",
    name: "Chicken Biryani",
    description: "Aromatic basmati rice cooked with tender chicken, exotic spices, and saffron.",
    shortDescription: "Fragrant basmati rice layered with chicken and whole spices.",
    longDescription: "A classic Pakistani biryani with aromatic basmati rice, tender chicken, and a balanced blend of spices. It is a comforting centerpiece for catered gatherings.",
    ingredients: ["Basmati rice", "Chicken", "Whole spices", "Saffron"],
    servingNotes: "Available for catering. Share your event details when requesting this dish.",
    image: "/images/menu/chicken-biryani.webp",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 2,
    icon: "🥘",
    category: "Rice Dishes",
    price: "Contact for pricing"
  },
  {
    id: "beef-haleem",
    slug: "beef-haleem",
    name: "Beef Haleem",
    description: "Slow-cooked stew of beef, lentils, and wheat, garnished with fried onions and ginger.",
    shortDescription: "A slow-cooked, hearty blend of beef, lentils, and wheat.",
    longDescription: "Beef Haleem is a rich, slow-cooked Pakistani dish with beef, lentils, and wheat. Its comforting texture and savory depth make it a thoughtful addition to a catering menu.",
    ingredients: ["Beef", "Lentils", "Wheat", "Fried onions", "Ginger"],
    servingNotes: "Available for catering. Share your event details when requesting this dish.",
    image: "/images/menu/beef-haleem.webp",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 1,
    icon: "🥣",
    category: "Curries",
    price: "Contact for pricing"
  },
  {
    id: "chicken-karahi",
    slug: "chicken-karahi",
    name: "Chicken Karahi",
    description: "Wok-cooked chicken with fresh tomatoes, ginger, green chilies, and coriander.",
    shortDescription: "Chicken cooked with tomatoes, ginger, chilies, and coriander.",
    longDescription: "Chicken Karahi brings together chicken, fresh tomatoes, ginger, green chilies, and coriander in a vivid, savory Pakistani dish made for sharing.",
    ingredients: ["Chicken", "Fresh tomatoes", "Ginger", "Green chilies", "Coriander"],
    servingNotes: "Available for catering. Share your event details when requesting this dish.",
    image: "/images/menu/chicken-karahi.webp",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 3,
    icon: "🍲",
    category: "Curries",
    price: "Contact for pricing"
  },
  {
    id: "seekh-kebab",
    slug: "seekh-kebab",
    name: "Seekh Kebab",
    description: "Minced beef or chicken, mixed with herbs and spices, grilled to perfection.",
    spiceLevel: 2,
    icon: "🍢",
    category: "Meat Specialties",
    price: "Contact for pricing"
  },
  {
    id: "samosas",
    slug: "samosas",
    name: "Crispy Samosas",
    description: "Golden pastry triangles stuffed with spiced potatoes, peas, and fresh coriander.",
    spiceLevel: 1,
    icon: "🥟",
    category: "Appetizers",
    price: "Contact for pricing"
  },
  {
    id: "naan-raita",
    slug: "naan-raita",
    name: "Naan & Raita",
    description: "Freshly baked flatbreads served with cooling yogurt, cucumber, and mint dip.",
    spiceLevel: 0,
    icon: "🫓",
    category: "Breads & Sides",
    price: "Contact for pricing"
  },
  {
    id: "palak-paneer",
    slug: "palak-paneer",
    name: "Palak Paneer",
    description: "Fresh spinach and soft paneer cheese cooked in a creamy, mildly spiced sauce.",
    spiceLevel: 1,
    icon: "🥬",
    category: "Vegetarian",
    price: "Contact for pricing"
  },
  {
    id: "gulab-jamun",
    slug: "gulab-jamun",
    name: "Gulab Jamun",
    description: "Soft milk dumplings soaked in a warm, fragrant cardamom and rose syrup.",
    spiceLevel: 0,
    icon: "🍯",
    category: "Desserts",
    price: "Contact for pricing"
  }
];
