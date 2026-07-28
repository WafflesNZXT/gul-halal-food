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
  customizationLabel?: string; // label for the proteinOptions selector when it's not protein
  icon: string;
  category: string;
  price: string; // kept for backwards-compat display
};

export const menu: MenuItem[] = [
  // ── Rice Dishes ──────────────────────────────────────────────────────────────
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
    id: "daal-chawal",
    slug: "daal-chawal",
    name: "Daal Chawal",
    description:
      "A comforting classic — slow-cooked spiced lentils served with steamed basmati rice. \"Chawal\" means rice in Urdu.",
    shortDescription:
      "Slow-cooked spiced lentils with steamed basmati rice — chawal means rice.",
    longDescription:
      "Daal Chawal is the ultimate comfort dish of Pakistan. Earthy lentils are slow-simmered with onions, tomatoes, cumin, and warming spices until thick and rich, then ladled alongside perfectly steamed basmati rice. The word \"chawal\" simply means rice in Urdu — so what you're getting is the wholesome pairing of daal and rice that generations of Pakistani families have eaten with love. A reliable, satisfying choice for any gathering.",
    flavorHighlights: [
      "Spiced lentils",
      "Steamed basmati rice",
      "Cumin",
      "Turmeric",
      "Fresh coriander",
    ],
    ingredients: ["Lentils", "Basmati rice", "Onions", "Tomatoes", "Cumin", "Turmeric"],
    servingNotes: "Available for catering. Share your event details when requesting this dish.",
    image: "/images/menu/daal-chawal.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 1,
    spiceCustomizable: true,
    icon: "🍲",
    category: "Rice Dishes",
    price: "Contact for pricing",
  },
  // ── Curries ───────────────────────────────────────────────────────────────────
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
      "Chicken Karahi brings together chicken, fresh tomatoes, ginger, green chilies, and coriander in a vivid, savory Pakistani dish made for sharing. Cooked fast in a rounded karahi pan to keep the flavours bright and the sauce glossy.",
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
    id: "palak-paneer",
    slug: "palak-paneer",
    name: "Palak Paneer",
    description:
      "Fresh spinach and soft paneer cheese cooked in a creamy, mildly spiced sauce.",
    shortDescription: "Creamy spinach curry with soft paneer cheese, mildly spiced.",
    longDescription:
      "Palak Paneer is a vegetarian favourite: vibrant green spinach puréed with cream and warm spices, then finished with cubes of fresh paneer. It is rich without being heavy, and its mild heat makes it a welcome dish for guests who prefer a gentler spice level alongside bolder curries on the spread.",
    flavorHighlights: ["Fresh spinach", "Paneer cheese", "Cream", "Mild spices", "Garam masala"],
    ingredients: ["Spinach", "Paneer", "Cream", "Onions", "Garam masala"],
    servingNotes: "Vegetarian. Available for catering.",
    image: "/images/menu/palak-paneer.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 1,
    spiceCustomizable: true,
    icon: "🥬",
    category: "Vegetarian",
    price: "Contact for pricing",
  },
  // ── Meat Specialties ─────────────────────────────────────────────────────────
  {
    id: "seekh-kebab",
    slug: "seekh-kebab",
    name: "Seekh Kebab",
    description:
      "Minced beef or chicken, mixed with herbs and spices, grilled to perfection.",
    shortDescription: "Herb-spiced minced meat skewers grilled over charcoal.",
    longDescription:
      "Seekh Kebab are a crowd-pleaser at any catered event. Freshly minced beef or chicken is blended with coriander, green chillies, onion, and warming spices, then shaped onto skewers and grilled over high heat until charred and juicy on the outside, tender inside. Perfect as a starter or alongside naan and chutneys.",
    flavorHighlights: [
      "Minced meat",
      "Fresh herbs",
      "Whole spices",
      "Charcoal grill",
      "Coriander",
      "Green chillies",
    ],
    ingredients: ["Minced beef or chicken", "Coriander", "Green chillies", "Onion", "Spices"],
    servingNotes: "Available for catering. Pairs well with naan and raita.",
    image: "/images/menu/seekh-kebab.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 2,
    spiceCustomizable: true,
    proteinOptions: [
      { id: "beef", label: "Beef" },
      { id: "chicken", label: "Chicken" },
    ],
    icon: "🍢",
    category: "Meat Specialties",
    price: "Contact for pricing",
  },
  {
    id: "wraps",
    slug: "wraps",
    name: "Wraps",
    description:
      "Soft flatbread wraps filled with tender chicken, crisp salad, and a signature sauce.",
    shortDescription: "Chicken, fresh salad, and sauce wrapped in soft flatbread.",
    longDescription:
      "Our Wraps are a lighter, hand-held option perfect for guests who want something satisfying without sitting down to a full plate. Tender marinated chicken is tucked into soft flatbread with fresh lettuce, tomato, and our signature sauce. A great choice for casual events, buffets, or anywhere people are standing and mingling.",
    flavorHighlights: [
      "Marinated chicken",
      "Fresh salad",
      "Signature sauce",
      "Soft flatbread",
    ],
    ingredients: ["Chicken", "Lettuce", "Tomato", "Flatbread", "Sauce"],
    servingNotes: "Available for catering. Great for standing events and buffets.",
    image: "/images/menu/wraps.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 1,
    spiceCustomizable: true,
    icon: "🌯",
    category: "Meat Specialties",
    price: "Contact for pricing",
  },
  {
    id: "chicken-65",
    slug: "chicken-65",
    name: "Chicken 65",
    description:
      "Crispy spiced fried chicken — bold with chilli, curry leaf, and aromatic spices.",
    shortDescription: "Crispy deep-fried chicken with bold chilli and aromatic spice marinade.",
    longDescription:
      "Chicken 65 is a boldly flavoured fried chicken dish that has become a favourite across South Asia. Chicken pieces are marinated in a punchy blend of chillies, ginger, garlic, and spices, then deep-fried until golden and irresistibly crispy. The heat is real, but balanced — it comes with a satisfying crunch and an aroma that draws everyone to the serving tray first.",
    flavorHighlights: [
      "Crispy fried chicken",
      "Chilli marinade",
      "Ginger & garlic",
      "Curry leaves",
      "Yogurt-based coating",
    ],
    ingredients: ["Chicken", "Chillies", "Ginger", "Garlic", "Yogurt", "Spices"],
    servingNotes: "Served as an appetizer or side. A high-demand dish for events.",
    image: "/images/menu/chicken-65.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 3,
    spiceCustomizable: true,
    icon: "🍗",
    category: "Appetizers",
    price: "Contact for pricing",
  },
  // ── Appetizers ────────────────────────────────────────────────────────────────
  {
    id: "samosas",
    slug: "samosas",
    name: "Crispy Samosas",
    description:
      "Golden pastry triangles stuffed with spiced potatoes, peas, and fresh coriander.",
    shortDescription: "Crispy golden pastry filled with spiced potato and peas.",
    longDescription:
      "Our Samosas are a staple of any Pakistani gathering. Flaky, golden pastry is filled with a warmly spiced mixture of mashed potato, green peas, and fresh coriander, then fried until perfectly crisp. Served in a pile alongside green chutney and tamarind sauce, they disappear from the table almost immediately.",
    flavorHighlights: [
      "Crispy pastry",
      "Spiced potatoes",
      "Green peas",
      "Fresh coriander",
      "Tamarind chutney",
    ],
    ingredients: ["Potato", "Green peas", "Coriander", "Pastry", "Cumin", "Garam masala"],
    servingNotes: "Served as an appetizer. A popular choice for all events.",
    image: "/images/menu/samosas.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 1,
    spiceCustomizable: false,
    icon: "🥟",
    category: "Appetizers",
    price: "Contact for pricing",
  },
  // ── Breads & Sides ────────────────────────────────────────────────────────────
  {
    id: "naan-raita",
    slug: "naan-raita",
    name: "Naan & Raita",
    description:
      "Freshly baked flatbreads served with cooling yogurt, cucumber, and mint dip.",
    shortDescription: "Fresh-baked naan paired with a cooling cucumber and mint yogurt dip.",
    longDescription:
      "Our Naan & Raita is a classic pairing designed to accompany the rest of the spread. Soft, pillowy naan comes straight from the tandoor alongside a chilled raita — yogurt blended with cucumber, mint, and a pinch of cumin. The raita balances spicier dishes and refreshes the palate between bites.",
    flavorHighlights: [
      "Fresh-baked naan",
      "Cucumber yogurt",
      "Mint",
      "Cumin",
      "Cooling and mild",
    ],
    ingredients: ["Flour", "Yogurt", "Cucumber", "Mint", "Cumin"],
    servingNotes: "Ideal as a side alongside curries and grilled dishes.",
    image: "/images/menu/naan-raita.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 0,
    spiceCustomizable: false,
    icon: "🫓",
    category: "Breads & Sides",
    price: "Contact for pricing",
  },
  {
    id: "naan",
    slug: "naan",
    name: "Naan",
    description:
      "Soft tandoor-baked flatbread — available plain or as garlic naan with herbed butter.",
    shortDescription: "Tandoor-baked flatbread available as regular or garlic naan.",
    longDescription:
      "Our Naan is baked fresh in a traditional tandoor oven, giving it the characteristic soft centre and lightly charred spots that make it so satisfying. Choose plain regular naan or upgrade to garlic naan — slathered with herbed garlic butter the moment it comes out of the oven. Either way, it is perfect for scooping up curry, wrapping around kebabs, or simply eating on its own.",
    flavorHighlights: [
      "Tandoor-baked",
      "Soft and pillowy",
      "Charred spots",
      "Garlic butter option",
    ],
    ingredients: ["Flour", "Yogurt", "Yeast", "Garlic (optional)", "Butter"],
    servingNotes: "Available regular or garlic. Pairs with any curry or side.",
    image: "/images/menu/naan.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 0,
    spiceCustomizable: false,
    proteinOptions: [
      { id: "regular", label: "Regular" },
      { id: "garlic", label: "Garlic" },
    ],
    customizationLabel: "Naan style",
    icon: "🫓",
    category: "Breads & Sides",
    price: "Contact for pricing",
  },
  // ── Desserts ──────────────────────────────────────────────────────────────────
  {
    id: "gulab-jamun",
    slug: "gulab-jamun",
    name: "Gulab Jamun",
    description:
      "Soft milk dumplings soaked in a warm, fragrant cardamom and rose syrup.",
    shortDescription: "Soft milk dumplings in warm rose and cardamom syrup.",
    longDescription:
      "Gulab Jamun are a beloved South Asian dessert — small, dark-golden dumplings made from reduced milk solids, deep-fried and then soaked in a warm syrup perfumed with rose water, cardamom, and a touch of saffron. They are soft, syrupy, and intensely sweet in the best possible way. A traditional finish to any Pakistani catered meal.",
    flavorHighlights: [
      "Milk dumplings",
      "Rose syrup",
      "Cardamom",
      "Saffron",
      "Warm and syrupy",
    ],
    ingredients: ["Milk powder", "Rose water", "Cardamom", "Sugar syrup", "Saffron"],
    servingNotes: "Served warm. A classic Pakistani dessert for celebrations.",
    image: "/images/menu/gulab-jamun.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 0,
    spiceCustomizable: false,
    icon: "🍯",
    category: "Desserts",
    price: "Contact for pricing",
  },
  {
    id: "keer",
    slug: "keer",
    name: "Keer",
    description:
      "A fragrant Pakistani rice pudding simmered in milk with cardamom, rose water, and topped with pistachios.",
    shortDescription: "Creamy Pakistani rice pudding with cardamom, rose water, and pistachios.",
    longDescription:
      "Keer is the classic Pakistani rice pudding dessert — rice grains slowly cooked down in full-fat milk until thick and creamy, then sweetened and perfumed with cardamom and rose water. A scattering of crushed pistachios adds colour and a gentle crunch. It is traditionally served at celebrations and festive gatherings, and makes a beautiful, light finish to a large catered spread.",
    flavorHighlights: [
      "Slow-cooked rice",
      "Creamy milk",
      "Cardamom",
      "Rose water",
      "Pistachios",
    ],
    ingredients: ["Rice", "Milk", "Sugar", "Cardamom", "Rose water", "Pistachios"],
    servingNotes: "Served warm or at room temperature. A festive Pakistani dessert.",
    image: "/images/menu/keer.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 0,
    spiceCustomizable: false,
    icon: "🍚",
    category: "Desserts",
    price: "Contact for pricing",
  },
];
