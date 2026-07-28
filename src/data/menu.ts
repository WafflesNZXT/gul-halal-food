export type ProteinOption = {
  id: string;
  label: string;
};

export type MenuItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  longDescription?: string;
  flavorHighlights?: string[];
  ingredients?: string[];
  servingNotes?: string;
  image?: string;
  pricingLabel?: string;
  basePrice?: number;
  featured?: boolean;
  available?: boolean;
  spiceLevel: number; // 0–3 suggested level
  spiceCustomizable?: boolean; // default true when omitted
  proteinOptions?: ProteinOption[];
  icon: string;
  category: string;
  price: string; // kept for backwards-compat display
};

export const menu: MenuItem[] = [
  {
    id: "biryani",
    slug: "biryani",
    name: "Biryani",
    description:
      "Aromatic basmati rice cooked with tender chicken, beef, or mutton, exotic spices, and saffron.",
    shortDescription:
      "Fragrant basmati rice layered with your choice of chicken, beef, or mutton and whole spices.",
    longDescription:
      "Our Biryani is a celebration of fragrance and flavour. Aromatic basmati rice is slow-cooked with your chosen protein — chicken, beef, or mutton — alongside saffron, fried onions, and a carefully balanced blend of whole spices. Each portion is prepared with a single meat so your choice is the star of the dish, never mixed. A true centrepiece for any catered gathering.",
    flavorHighlights: [
      "Basmati rice",
      "Whole spices",
      "Saffron",
      "Fried onions",
      "Choice of chicken, beef, or mutton",
    ],
    ingredients: ["Basmati rice", "Whole spices", "Saffron", "Fried onions"],
    servingNotes: "Available for catering. Share your event details when requesting this dish.",
    image: "/images/menu/biryani.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 2,
    spiceCustomizable: true,
    proteinOptions: [
      { id: "chicken", label: "Chicken" },
      { id: "beef", label: "Beef" },
      { id: "mutton", label: "Mutton" },
    ],
    icon: "🥘",
    category: "Rice Dishes",
    price: "Contact for pricing",
  },
  {
    id: "haleem",
    slug: "haleem",
    name: "Haleem",
    description:
      "Slow-cooked haleem made with wheat, lentils, aromatic spices, and your choice of chicken or beef, garnished with fried onions and ginger.",
    shortDescription:
      "A hearty slow-cooked blend of wheat, lentils, and your choice of chicken or beef.",
    longDescription:
      "Haleem is a beloved Pakistani classic: wheat and lentils simmered for hours with aromatic spices until they reach a deeply savoury, thick consistency. Choose chicken or beef — each is cooked separately into the haleem, not combined. Finished with crispy fried onions, fresh ginger, and a squeeze of lemon.",
    flavorHighlights: [
      "Wheat",
      "Lentils",
      "Slow-cooked meat",
      "Fried onions",
      "Ginger",
      "Choice of chicken or beef",
    ],
    ingredients: ["Wheat", "Lentils", "Fried onions", "Ginger"],
    servingNotes: "Available for catering. Share your event details when requesting this dish.",
    image: "/images/menu/haleem.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 1,
    spiceCustomizable: true,
    proteinOptions: [
      { id: "chicken", label: "Chicken" },
      { id: "beef", label: "Beef" },
    ],
    icon: "🥣",
    category: "Curries",
    price: "Contact for pricing",
  },
  {
    id: "chicken-karahi",
    slug: "chicken-karahi",
    name: "Chicken Karahi",
    description:
      "Wok-cooked chicken with fresh tomatoes, ginger, green chilies, and coriander.",
    shortDescription: "Chicken cooked with tomatoes, ginger, chilies, and coriander.",
    longDescription:
      "Chicken Karahi brings together chicken, fresh tomatoes, ginger, green chilies, and coriander in a vivid, savory Pakistani dish made for sharing.",
    flavorHighlights: ["Chicken", "Fresh tomatoes", "Ginger", "Green chilies", "Coriander"],
    ingredients: ["Chicken", "Fresh tomatoes", "Ginger", "Green chilies", "Coriander"],
    servingNotes: "Available for catering. Share your event details when requesting this dish.",
    image: "/images/menu/chicken-karahi.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 3,
    spiceCustomizable: true,
    icon: "🍲",
    category: "Curries",
    price: "Contact for pricing",
  },
  {
    id: "seekh-kebab",
    slug: "seekh-kebab",
    name: "Seekh Kebab",
    description:
      "Minced beef or chicken, mixed with herbs and spices, grilled to perfection.",
    flavorHighlights: ["Minced meat", "Fresh herbs", "Whole spices", "Charcoal grill"],
    image: "/images/menu/seekh-kebab.png",
    spiceLevel: 2,
    spiceCustomizable: true,
    icon: "🍢",
    category: "Meat Specialties",
    price: "Contact for pricing",
  },
  {
    id: "samosas",
    slug: "samosas",
    name: "Crispy Samosas",
    description:
      "Golden pastry triangles stuffed with spiced potatoes, peas, and fresh coriander.",
    flavorHighlights: ["Crispy pastry", "Spiced potatoes", "Peas", "Fresh coriander"],
    image: "/images/menu/samosas.png",
    spiceLevel: 1,
    spiceCustomizable: false,
    icon: "🥟",
    category: "Appetizers",
    price: "Contact for pricing",
  },
  {
    id: "naan-raita",
    slug: "naan-raita",
    name: "Naan & Raita",
    description:
      "Freshly baked flatbreads served with cooling yogurt, cucumber, and mint dip.",
    flavorHighlights: ["Fresh-baked naan", "Yogurt", "Cucumber", "Mint"],
    image: "/images/menu/naan-raita.png",
    spiceLevel: 0,
    spiceCustomizable: false,
    icon: "🫓",
    category: "Breads & Sides",
    price: "Contact for pricing",
  },
  {
    id: "palak-paneer",
    slug: "palak-paneer",
    name: "Palak Paneer",
    description:
      "Fresh spinach and soft paneer cheese cooked in a creamy, mildly spiced sauce.",
    flavorHighlights: ["Fresh spinach", "Paneer cheese", "Cream", "Mild spices"],
    image: "/images/menu/palak-paneer.png",
    spiceLevel: 1,
    spiceCustomizable: true,
    icon: "🥬",
    category: "Vegetarian",
    price: "Contact for pricing",
  },
  {
    id: "gulab-jamun",
    slug: "gulab-jamun",
    name: "Gulab Jamun",
    description:
      "Soft milk dumplings soaked in a warm, fragrant cardamom and rose syrup.",
    flavorHighlights: ["Milk dumplings", "Rose syrup", "Cardamom", "Saffron"],
    image: "/images/menu/gulab-jamun.png",
    spiceLevel: 0,
    spiceCustomizable: false,
    icon: "🍯",
    category: "Desserts",
    price: "Contact for pricing",
  },
];
