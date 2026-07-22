export type MenuItem = {
  id: string;
  name: string;
  description: string;
  spiceLevel: number;
  icon: string;
  category: string;
  price: string;
};

export const menu: MenuItem[] = [
  {
    id: "chicken-biryani",
    name: "Chicken Biryani",
    description: "Aromatic basmati rice cooked with tender chicken, exotic spices, and saffron.",
    spiceLevel: 2,
    icon: "🥘",
    category: "Rice Dishes",
    price: "From $12/person"
  },
  {
    id: "beef-haleem",
    name: "Beef Haleem",
    description: "Slow-cooked stew of beef, lentils, and wheat, garnished with fried onions and ginger.",
    spiceLevel: 1,
    icon: "🥣",
    category: "Curries",
    price: "From $14/person"
  },
  {
    id: "chicken-karahi",
    name: "Chicken Karahi",
    description: "Wok-cooked chicken with fresh tomatoes, ginger, green chilies, and coriander.",
    spiceLevel: 3,
    icon: "🍲",
    category: "Curries",
    price: "From $15/person"
  },
  {
    id: "seekh-kebab",
    name: "Seekh Kebab",
    description: "Minced beef or chicken, mixed with herbs and spices, grilled to perfection.",
    spiceLevel: 2,
    icon: "🍢",
    category: "Meat Specialties",
    price: "From $16/person"
  },
  {
    id: "samosas",
    name: "Crispy Samosas",
    description: "Golden pastry triangles stuffed with spiced potatoes, peas, and fresh coriander.",
    spiceLevel: 1,
    icon: "🥟",
    category: "Appetizers",
    price: "$3 each"
  },
  {
    id: "naan-raita",
    name: "Naan & Raita",
    description: "Freshly baked flatbreads served with cooling yogurt, cucumber, and mint dip.",
    spiceLevel: 0,
    icon: "🫓",
    category: "Breads & Sides",
    price: "$4 per serving"
  },
  {
    id: "palak-paneer",
    name: "Palak Paneer",
    description: "Fresh spinach and soft paneer cheese cooked in a creamy, mildly spiced sauce.",
    spiceLevel: 1,
    icon: "🥬",
    category: "Vegetarian",
    price: "From $13/person"
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    description: "Soft milk dumplings soaked in a warm, fragrant cardamom and rose syrup.",
    spiceLevel: 0,
    icon: "🍯",
    category: "Desserts",
    price: "$5 per serving"
  }
];
