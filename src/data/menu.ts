export type ProteinOption = {
  id: string;
  label: string;
};

export type OptionItem = {
  id: string;
  label: string;
  description?: string;
};

/** A configurable extra option group shown on the dish detail page */
export type ExtraOptionGroup = {
  id: string;           // key stored in CartItemConfig.extras
  label: string;        // display label shown above the picker
  required?: boolean;   // default true; set false for optional selections
  type?: "select" | "boolean"; // default "select"
  options?: OptionItem[]; // required when type === "select"
  showWhen?: { field: string; value: string }; // only shown when another field matches
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
  extraOptions?: ExtraOptionGroup[]; // additional structured selectors
  icon: string;
  category: string;
  price: string; // kept for backwards-compat display
};

// ─── Reusable option sets ─────────────────────────────────────────────────────

export const RICE_TYPE_OPTIONS: OptionItem[] = [
  { id: "plain", label: "Plain white rice" },
  { id: "zeera", label: "Zeera rice" },
  { id: "chinese-fried", label: "Chinese fried rice" },
  { id: "tarka", label: "Tarka rice" },
];

export const NAAN_TYPE_OPTIONS: OptionItem[] = [
  { id: "regular", label: "Regular naan" },
  { id: "garlic", label: "Garlic naan" },
];

// ─── Menu items ───────────────────────────────────────────────────────────────

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
    id: "pulao",
    slug: "pulao",
    name: "Pulao",
    description:
      "Fragrant slow-cooked rice with whole spices — choose from chicken, beef, mutton, mutter (peas), or Afghani style.",
    shortDescription:
      "Fragrant rice cooked with whole spices. Choose your style: chicken, beef, mutton, mutter/peas, or Afghani.",
    longDescription:
      "Pulao is a beloved Pakistani rice dish where long-grain rice is cooked directly in a seasoned broth with whole spices, giving every grain a rich, aromatic flavour. Unlike biryani, pulao is lighter and more subtly spiced. Choose from chicken pulao, beef pulao, mutton pulao, or mutter pulao — \"mutter\" or \"mutar\" simply means peas in Urdu, so mutter pulao is a fragrant pea and rice dish. The Afghani style uses a whole-spice, caramelised-onion technique for a distinctively sweet and savoury character.",
    flavorHighlights: [
      "Aromatic whole spices",
      "Long-grain basmati",
      "Slow-cooked broth",
      "Caramelised onions",
      "Choice of chicken, beef, mutton, peas, or Afghani style",
    ],
    ingredients: ["Basmati rice", "Whole spices", "Onions", "Broth", "Cardamom", "Cumin"],
    servingNotes: "Available for catering. A lighter alternative to biryani, ideal as part of a spread.",
    image: "/images/menu/pulao.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 1,
    spiceCustomizable: true,
    extraOptions: [
      {
        id: "type",
        label: "Pulao style",
        required: true,
        type: "select",
        options: [
          { id: "chicken", label: "Chicken" },
          { id: "beef", label: "Beef" },
          { id: "mutton", label: "Mutton" },
          { id: "mutter", label: "Mutter / Mutar (peas)", description: "Mutter means peas — a fragrant pea pulao" },
          { id: "afghani", label: "Afghani style", description: "Whole-spice, caramelised-onion technique" },
        ],
      },
    ],
    icon: "🍚",
    category: "Rice Dishes",
    price: "Contact for pricing",
  },
  {
    id: "plain-white-rice",
    slug: "plain-white-rice",
    name: "Plain White Rice",
    description:
      "Perfectly steamed rice — choose plain white, zeera, Chinese fried, or tarka style.",
    shortDescription:
      "Steamed rice available as plain white, zeera, Chinese fried, or tarka rice.",
    longDescription:
      "Sometimes the best accompaniment is beautifully cooked rice. Choose plain steamed white rice as a simple side, zeera rice with its warmth of cumin seeds, Chinese fried rice with its savoury wok-tossed flavour, or tarka rice — finished with a buttery spiced tarka poured over at serving. Each style pairs perfectly with any curry or main dish on the spread.",
    flavorHighlights: [
      "Fluffy long-grain rice",
      "Four available styles",
      "Cumin option (zeera)",
      "Wok-fried option (Chinese)",
      "Buttery tarka finish",
    ],
    ingredients: ["Basmati rice", "Water", "Salt", "Cumin (optional)", "Butter (optional)"],
    servingNotes: "Ideal as a base or side for any curry. Select your preferred rice style.",
    image: "/images/menu/plain-white-rice.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 0,
    spiceCustomizable: false,
    extraOptions: [
      {
        id: "riceType",
        label: "Rice style",
        required: true,
        type: "select",
        options: RICE_TYPE_OPTIONS,
      },
    ],
    icon: "🍚",
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
    id: "korma",
    slug: "korma",
    name: "Korma",
    description:
      "A rich, mildly spiced curry of meat slow-cooked in a creamy yogurt and nut-based sauce.",
    shortDescription:
      "Rich, mild curry with your choice of chicken, beef, or mutton in a creamy yogurt sauce.",
    longDescription:
      "Korma is the jewel of milder Pakistani curries — tender meat braised low and slow in a smooth sauce of yogurt, cream, and whole spices. It is aromatic rather than fiery, with a warmth that comes from cardamom, cinnamon, and slow caramelised onion rather than chilli. An excellent choice for guests who prefer gentler heat alongside bolder dishes on the spread.",
    flavorHighlights: [
      "Creamy yogurt sauce",
      "Cardamom & cinnamon",
      "Slow-braised meat",
      "Caramelised onion",
      "Choice of chicken, beef, or mutton",
    ],
    ingredients: ["Yogurt", "Cream", "Cardamom", "Cinnamon", "Onions", "Whole spices"],
    servingNotes: "Mild and aromatic. Pairs beautifully with naan or plain rice.",
    image: "/images/menu/korma.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 1,
    spiceCustomizable: true,
    proteinOptions: [
      { id: "chicken", label: "Chicken" },
      { id: "beef", label: "Beef" },
      { id: "mutton", label: "Mutton" },
    ],
    icon: "🍛",
    category: "Curries",
    price: "Contact for pricing",
  },
  {
    id: "aloo-gosht",
    slug: "aloo-gosht",
    name: "Aloo Gosht",
    description:
      "A hearty Pakistani stew of tender meat and potatoes — aloo means potato, gosht means meat.",
    shortDescription:
      "Classic Pakistani stew of potato and meat — aloo means potato, gosht means meat.",
    longDescription:
      "Aloo Gosht is one of the most homely and satisfying dishes in Pakistani cooking. \"Aloo\" means potato and \"gosht\" means meat — so this is exactly what it says: a warming, slow-cooked stew where tender chunks of beef or mutton meet soft potato in a rich, spiced tomato-based gravy. The potato absorbs the flavours beautifully as it cooks, creating a thick, hearty curry perfect for cold days or large family-style servings.",
    flavorHighlights: [
      "Tender potato (aloo)",
      "Slow-cooked meat (gosht)",
      "Tomato-based gravy",
      "Whole spices",
      "Choice of beef or mutton",
    ],
    ingredients: ["Potato", "Beef or mutton", "Tomatoes", "Onions", "Whole spices", "Coriander"],
    servingNotes: "A hearty family-style stew. Excellent with naan or rice.",
    image: "/images/menu/aloo-gosht.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 2,
    spiceCustomizable: true,
    proteinOptions: [
      { id: "beef", label: "Beef" },
      { id: "mutton", label: "Mutton" },
    ],
    icon: "🥘",
    category: "Curries",
    price: "Contact for pricing",
  },
  {
    id: "kofta-curry",
    slug: "kofta-curry",
    name: "Kofta Curry",
    description:
      "Spiced minced-meat meatballs simmered in a rich, aromatic tomato-based curry sauce.",
    shortDescription:
      "Spiced meatballs in rich tomato curry. Choose chicken or beef kofta.",
    longDescription:
      "Kofta Curry features tender minced-meat meatballs — seasoned with herbs and spices — simmered in a deep, aromatic tomato and onion curry. The kofta soak up the sauce as they cook, becoming meltingly soft inside. Choose chicken or beef for a hearty dish that looks impressive on a buffet and pairs equally well with naan or rice.",
    flavorHighlights: [
      "Spiced minced-meat kofta",
      "Tomato & onion gravy",
      "Aromatic whole spices",
      "Herbs & coriander",
      "Choice of chicken or beef",
    ],
    ingredients: ["Minced meat", "Onions", "Tomatoes", "Herbs", "Garam masala", "Coriander"],
    servingNotes: "Pairs well with naan or rice. A crowd-pleasing catering dish.",
    image: "/images/menu/kofta-curry.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 2,
    spiceCustomizable: true,
    proteinOptions: [
      { id: "chicken", label: "Chicken" },
      { id: "beef", label: "Beef" },
    ],
    icon: "🥘",
    category: "Curries",
    price: "Contact for pricing",
  },
  {
    id: "achar-gosht",
    slug: "achar-gosht",
    name: "Achar Gosht",
    description:
      "Meat curry cooked in bold pickled spices — gosht means meat. A sharp, tangy, deeply flavoured dish.",
    shortDescription:
      "Bold pickled-spice meat curry — gosht means meat. Choose chicken, beef, or mutton.",
    longDescription:
      "Achar Gosht is a distinctive Pakistani curry that gets its bold, tangy character from achar — pickled spices. \"Gosht\" means meat. The combination of mustard seeds, fenugreek, nigella, fennel, and dried chilies creates a sharp, intensely aromatic sauce unlike any ordinary curry. The meat — your choice of chicken, beef, or mutton — is cooked until tender in this punchy masala, resulting in a flavour that is savoury, slightly sour, and deeply satisfying.",
    flavorHighlights: [
      "Pickled achar spices",
      "Mustard & fenugreek",
      "Tangy, bold flavour",
      "Nigella & fennel seeds",
      "Choice of chicken, beef, or mutton",
    ],
    ingredients: ["Meat", "Mustard seeds", "Fenugreek", "Nigella seeds", "Fennel", "Dried chilli", "Tomatoes"],
    servingNotes: "Bold and tangy. Best paired with plain naan or rice to balance the flavours.",
    image: "/images/menu/achar-gosht.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 3,
    spiceCustomizable: true,
    proteinOptions: [
      { id: "chicken", label: "Chicken" },
      { id: "beef", label: "Beef" },
      { id: "mutton", label: "Mutton" },
    ],
    icon: "🥘",
    category: "Curries",
    price: "Contact for pricing",
  },
  {
    id: "nihari",
    slug: "nihari",
    name: "Nihari",
    description:
      "A rich, slow-braised beef stew with bone marrow, whole spices, and a deeply savoury, velvety sauce. A Pakistani breakfast classic.",
    shortDescription:
      "Slow-braised beef stew with bone marrow and deep whole-spice flavour — a beloved Pakistani classic.",
    longDescription:
      "Nihari is one of the most revered dishes in Pakistani cuisine. Beef — typically with bone-in cuts and marrow — is slow-cooked for hours in a richly spiced gravy until the meat is falling-off-the-bone tender and the sauce has become deep, dark, and velvety. Traditionally eaten as a special breakfast or celebratory meal in Lahore and Karachi, Nihari has crossed into every occasion that calls for something truly special. Finished with ginger julienne, fresh coriander, a squeeze of lemon, and fried onions.",
    flavorHighlights: [
      "Slow-braised beef",
      "Bone marrow richness",
      "Deep whole-spice gravy",
      "Ginger & coriander garnish",
      "Fried onions",
    ],
    ingredients: ["Beef", "Bone marrow", "Whole spices", "Ginger", "Fried onions", "Coriander"],
    servingNotes: "Beef only. Best served with warm naan for dipping into the rich gravy.",
    image: "/images/menu/nihari.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 2,
    spiceCustomizable: true,
    icon: "🥣",
    category: "Curries",
    price: "Contact for pricing",
  },
  {
    id: "daal",
    slug: "daal",
    name: "Daal",
    description:
      "Slow-cooked spiced lentils — choose your daal type and whether to have it with rice or naan.",
    shortDescription:
      "Spiced lentils served your way — choose mixed, mash, or chana daal, then pick rice or naan.",
    longDescription:
      "Daal is the ultimate comfort dish of Pakistan. Earthy lentils are slow-simmered with onions, tomatoes, cumin, and warming spices until thick and rich. We offer three styles: mixed daal (a blend of lentils for a rounded flavour), mash daal (creamy white lentils, softer and more delicate), and chana daal (split chickpea lentils with a nuttier, heartier bite). Choose to have it served with rice — in four styles from plain white to zeera, Chinese fried, or tarka — or with naan, either regular or garlic.",
    flavorHighlights: [
      "Slow-cooked spiced lentils",
      "Three daal types: mixed, mash, chana",
      "Cumin & turmeric",
      "Served with rice or naan",
      "Fresh coriander tarka",
    ],
    ingredients: ["Lentils", "Onions", "Tomatoes", "Cumin", "Turmeric", "Coriander"],
    servingNotes: "A comforting Pakistani staple. Serves as a main or an accompaniment.",
    image: "/images/menu/daal.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 1,
    spiceCustomizable: true,
    extraOptions: [
      {
        id: "daalType",
        label: "Daal type",
        required: true,
        type: "select",
        options: [
          { id: "mixed", label: "Mixed daal", description: "A blend of lentils — rounded, rich flavour" },
          { id: "mash", label: "Mash daal", description: "Creamy white lentils — soft and delicate" },
          { id: "chana", label: "Chana daal", description: "Split chickpea lentils — nuttier, heartier" },
        ],
      },
      {
        id: "base",
        label: "Served with",
        required: true,
        type: "select",
        options: [
          { id: "rice", label: "Rice" },
          { id: "naan", label: "Naan" },
        ],
      },
      {
        id: "riceType",
        label: "Rice style",
        required: true,
        type: "select",
        options: RICE_TYPE_OPTIONS,
        showWhen: { field: "base", value: "rice" },
      },
      {
        id: "naanType",
        label: "Naan type",
        required: true,
        type: "select",
        options: NAAN_TYPE_OPTIONS,
        showWhen: { field: "base", value: "naan" },
      },
    ],
    icon: "🍲",
    category: "Curries",
    price: "Contact for pricing",
  },
  {
    id: "lahori-chany",
    slug: "lahori-chany",
    name: "Lahori Chany",
    description:
      "Bold, tangy Lahori-style chickpeas cooked with a punchy blend of tomatoes, tamarind, and whole spices.",
    shortDescription:
      "Lahori-style chickpeas — tangy, spiced, and full of bold street-food flavour.",
    longDescription:
      "Lahori Chany is Lahore's famous street-food chickpea dish and a proud symbol of the city's vibrant food culture. Chickpeas are slow-cooked in a sharp, tangy masala of tomatoes, tamarind, dried ginger, and a bold blend of whole spices. The result is thick, deeply savoury, and punchy — typically served with bhature (puffed fried bread) or naan, and garnished with julienned ginger, coriander, and a squeeze of lime.",
    flavorHighlights: [
      "Lahori-style chickpeas",
      "Tangy tamarind",
      "Bold tomato masala",
      "Dried ginger",
      "Street-food character",
    ],
    ingredients: ["Chickpeas", "Tomatoes", "Tamarind", "Dried ginger", "Whole spices", "Coriander"],
    servingNotes: "Best served with naan or bhature. A Lahori street-food classic.",
    image: "/images/menu/lahori-chany.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 2,
    spiceCustomizable: true,
    icon: "🫘",
    category: "Curries",
    price: "Contact for pricing",
  },
  {
    id: "curry-pakora",
    slug: "curry-pakora",
    name: "Curry Pakora",
    description:
      "Crispy chickpea-battered fritters simmered in a tangy, spiced yogurt curry. Can be served with rice.",
    shortDescription:
      "Crispy fritters simmered in tangy spiced yogurt curry — optionally served with rice.",
    longDescription:
      "Curry Pakora is a uniquely satisfying dish: golden chickpea-batter fritters are first fried until crispy, then added to a tangy, yogurt-based curry and simmered until they soak up the sauce while keeping a pleasant bite. The contrast of the slightly crunchy fritters against the smooth, spiced curry is what makes this dish so memorable. It can be served on its own as a main or over rice for a more complete plate — choose your preferred rice style.",
    flavorHighlights: [
      "Crispy chickpea fritters",
      "Tangy yogurt curry",
      "Gram flour batter",
      "Warming spices",
      "Optional rice pairing",
    ],
    ingredients: ["Chickpea fritters", "Yogurt", "Gram flour", "Tomatoes", "Onions", "Whole spices"],
    servingNotes: "Served on its own or over rice. A comforting Pakistani classic.",
    image: "/images/menu/curry-pakora.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 2,
    spiceCustomizable: true,
    extraOptions: [
      {
        id: "rice",
        label: "Serve with rice?",
        required: false,
        type: "boolean",
      },
      {
        id: "riceType",
        label: "Rice style",
        required: true,
        type: "select",
        options: RICE_TYPE_OPTIONS,
        showWhen: { field: "rice", value: "yes" },
      },
    ],
    icon: "🍛",
    category: "Curries",
    price: "Contact for pricing",
  },
  // ── Vegetarian ────────────────────────────────────────────────────────────────
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
  {
    id: "palak-aloo",
    slug: "palak-aloo",
    name: "Palak Aloo",
    description:
      "A simple vegetarian curry of spinach and potato — palak means spinach, aloo means potato.",
    shortDescription:
      "Hearty spinach and potato curry — palak means spinach, aloo means potato.",
    longDescription:
      "Palak Aloo is a comforting, wholesome vegetarian dish. \"Palak\" means spinach and \"aloo\" means potato in Urdu — so this is a fresh spinach curry with tender potato chunks, cooked with onions, tomatoes, ginger, garlic, and warming spices. Less cream-heavy than palak paneer, it has a brighter, more rustic flavour and works beautifully as part of a vegetarian spread or alongside meat dishes.",
    flavorHighlights: [
      "Fresh spinach (palak)",
      "Tender potato (aloo)",
      "Ginger & garlic",
      "Tomato base",
      "Wholesome & vegetarian",
    ],
    ingredients: ["Spinach", "Potato", "Tomatoes", "Onions", "Ginger", "Garlic", "Cumin"],
    servingNotes: "Vegetarian. Pairs well with naan or rice.",
    image: "/images/menu/palak-aloo.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 1,
    spiceCustomizable: true,
    icon: "🥬",
    category: "Vegetarian",
    price: "Contact for pricing",
  },
  {
    id: "fried-mixed-veggies",
    slug: "fried-mixed-veggies",
    name: "Fried Mixed Veggies",
    description:
      "A colourful stir of seasonal vegetables cooked in a lightly spiced, aromatic masala.",
    shortDescription:
      "Seasonal vegetables stir-fried in a light, aromatic masala — colourful and vegetarian.",
    longDescription:
      "Our Fried Mixed Veggies is a vibrant medley of seasonal vegetables — bell peppers, courgette, carrots, onions, and more — cooked over high heat in a light, aromatic masala. It is not a heavy curry; instead it keeps a pleasant fresh bite and a clean, lively flavour. An excellent addition to any spread as a lighter vegetarian option that complements richer meat dishes.",
    flavorHighlights: [
      "Seasonal vegetables",
      "Light masala",
      "Bell peppers & courgette",
      "Aromatic spices",
      "Vegetarian & colourful",
    ],
    ingredients: ["Bell peppers", "Courgette", "Carrots", "Onions", "Tomatoes", "Cumin", "Coriander"],
    servingNotes: "Vegetarian. A lighter side that brightens any catering spread.",
    image: "/images/menu/fried-mixed-veggies.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 1,
    spiceCustomizable: true,
    icon: "🥦",
    category: "Vegetarian",
    price: "Contact for pricing",
  },
  {
    id: "bangan",
    slug: "bangan",
    name: "Bangan",
    description:
      "Bangan means eggplant — a rich, smoky eggplant dish available in standard, Afghani, or Bagareh style.",
    shortDescription:
      "Bangan means eggplant. Choose standard, Afghani, or Bagareh style for this versatile vegetarian dish.",
    longDescription:
      "\"Bangan\" is the Urdu word for eggplant, and this dish showcases just how versatile it can be. The standard style slow-cooks eggplant with tomatoes, onions, and spices until it is deeply tender and richly flavoured. The Afghani style uses a whole-spice, yogurt-based preparation for a creamier, more aromatic result. Bagareh style is a South Asian technique where the eggplant is cooked with a fragrant peanut and coconut-enriched masala, giving it a nutty depth — similar to a bagara baingan.",
    flavorHighlights: [
      "Eggplant (bangan)",
      "Three available styles",
      "Smoky & tender",
      "Vegetarian",
      "Afghani and Bagareh options",
    ],
    ingredients: ["Eggplant", "Tomatoes", "Onions", "Yogurt (Afghani)", "Peanuts (Bagareh)", "Whole spices"],
    servingNotes: "Vegetarian. Each style has a distinct character — ask us about the styles.",
    image: "/images/menu/bangan.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 2,
    spiceCustomizable: true,
    extraOptions: [
      {
        id: "style",
        label: "Bangan style",
        required: true,
        type: "select",
        options: [
          {
            id: "standard",
            label: "Standard",
            description: "Slow-cooked with tomatoes, onions, and spices",
          },
          {
            id: "afghani",
            label: "Afghani",
            description: "Yogurt-based, aromatic whole-spice preparation",
          },
          {
            id: "bagareh",
            label: "Bagareh",
            description: "Peanut & coconut-enriched masala, nutty depth",
          },
        ],
      },
    ],
    icon: "🍆",
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
  {
    id: "halwa",
    slug: "halwa",
    name: "Halwa",
    description:
      "A fragrant Pakistani sweet — choose sooji halwa (semolina) or gajar halwa (carrot).",
    shortDescription:
      "Pakistani halwa — choose sooji (semolina) or gajar (carrot). Both are warmly spiced and fragrant.",
    longDescription:
      "Halwa is a beloved Pakistani sweet with many regional varieties. Sooji halwa is made from semolina toasted in ghee and simmered with sugar, cardamom, and rose water until it becomes a rich, slightly grainy, beautifully fragrant sweet — traditionally served at gatherings and religious occasions. Gajar halwa (\"gajar\" means carrot) is a slow-cooked dessert where carrots are simmered in full-fat milk for hours until they become sweet, soft, and deeply aromatic, finished with cardamom and topped with pistachios. Both are warming, sweet, and comforting.",
    flavorHighlights: [
      "Sooji (semolina) or Gajar (carrot)",
      "Ghee-toasted",
      "Cardamom & rose water",
      "Warming and sweet",
      "Pistachios",
    ],
    ingredients: ["Semolina or carrot", "Ghee", "Sugar", "Cardamom", "Rose water", "Milk", "Pistachios"],
    servingNotes: "Served warm. Both styles are equally popular at celebrations.",
    image: "/images/menu/halwa.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 0,
    spiceCustomizable: false,
    extraOptions: [
      {
        id: "type",
        label: "Halwa type",
        required: true,
        type: "select",
        options: [
          { id: "sooji", label: "Sooji halwa", description: "Semolina toasted in ghee with cardamom and rose water" },
          { id: "gajar", label: "Gajar halwa", description: "Gajar means carrot — slow-cooked carrots in milk with cardamom" },
        ],
      },
    ],
    icon: "🍮",
    category: "Desserts",
    price: "Contact for pricing",
  },
  {
    id: "falooda",
    slug: "falooda",
    name: "Falooda",
    description:
      "A Pakistani layered dessert drink — rose syrup, vermicelli, basil seeds, milk, optional jello, and optional ice cream.",
    shortDescription:
      "Pakistani dessert drink with rose syrup, vermicelli, and milk. Customise with jello and ice cream.",
    longDescription:
      "Falooda is a beloved Pakistani dessert drink — a layered, visually stunning creation built from chilled milk, rose syrup, thin rice vermicelli, and soaked basil seeds (tukmaria). It is refreshing, fragrant, and utterly unique. Customise yours: add jello for extra colour and texture, add ice cream to make it a full indulgent sundae (choose strawberry or vanilla), or keep it simple and let the rose milk base do the work.",
    flavorHighlights: [
      "Rose syrup",
      "Rice vermicelli",
      "Basil seeds (tukmaria)",
      "Chilled rose milk",
      "Optional jello & ice cream",
    ],
    ingredients: ["Rose syrup", "Vermicelli", "Basil seeds", "Milk", "Jello (optional)", "Ice cream (optional)"],
    servingNotes: "Served chilled. A show-stopping Pakistani dessert for any occasion.",
    image: "/images/menu/falooda.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 0,
    spiceCustomizable: false,
    extraOptions: [
      {
        id: "jello",
        label: "Include jello?",
        required: false,
        type: "boolean",
      },
      {
        id: "iceCream",
        label: "Include ice cream?",
        required: false,
        type: "boolean",
      },
      {
        id: "iceCreamFlavor",
        label: "Ice cream flavor",
        required: true,
        type: "select",
        options: [
          { id: "strawberry", label: "Strawberry" },
          { id: "vanilla", label: "Vanilla" },
        ],
        showWhen: { field: "iceCream", value: "yes" },
      },
    ],
    icon: "🥤",
    category: "Desserts",
    price: "Contact for pricing",
  },
  {
    id: "zarda-rice",
    slug: "zarda-rice",
    name: "Zarda Rice",
    description:
      "Festive sweet saffron rice cooked with sugar, cardamom, rose water, dried fruits, and nuts.",
    shortDescription:
      "Festive sweet saffron rice with cardamom, rose water, dried fruits, and nuts.",
    longDescription:
      "Zarda Rice is a celebration dessert — fragrant basmati rice cooked with saffron and food colouring to a vivid golden-orange, then sweetened and perfumed with cardamom and rose water. Decorated with raisins, cherries, coconut, and a scattering of almonds and pistachios, it is as beautiful as it is delicious. Traditionally served at weddings, Eid, and festive gatherings, zarda is a Pakistani table centrepiece in its own right.",
    flavorHighlights: [
      "Saffron & golden colour",
      "Cardamom & rose water",
      "Sweet festive rice",
      "Raisins, cherries, coconut",
      "Almonds & pistachios",
    ],
    ingredients: ["Basmati rice", "Saffron", "Sugar", "Cardamom", "Rose water", "Raisins", "Nuts"],
    servingNotes: "A festive Pakistani sweet rice, traditionally served at weddings and celebrations.",
    image: "/images/menu/zarda-rice.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 0,
    spiceCustomizable: false,
    icon: "🍚",
    category: "Desserts",
    price: "Contact for pricing",
  },
  {
    id: "sweet-custard",
    slug: "sweet-custard",
    name: "Sweet Custard with Fruit",
    description:
      "A smooth, lightly set Pakistani custard served cold with mixed fresh and tinned fruit.",
    shortDescription:
      "Cold creamy custard with mixed fresh and seasonal fruit — a classic Pakistani party dessert.",
    longDescription:
      "Sweet Custard with Fruit is a staple of Pakistani party desserts — creamy, lightly flavoured custard served chilled and topped generously with a mix of fresh and seasonal fruit. Simple but universally loved, it is the dessert that ends almost every Pakistani family celebration. Light, refreshing, and a welcome palate cleanser after a full spread of rich curries and biryanis.",
    flavorHighlights: [
      "Smooth chilled custard",
      "Mixed fresh fruit",
      "Light vanilla flavour",
      "Refreshing & creamy",
      "Pakistani party classic",
    ],
    ingredients: ["Custard powder", "Milk", "Sugar", "Vanilla", "Mixed fruit"],
    servingNotes: "Served cold. A crowd-pleasing dessert for all ages.",
    image: "/images/menu/sweet-custard.png",
    pricingLabel: "Contact for pricing",
    featured: true,
    available: true,
    spiceLevel: 0,
    spiceCustomizable: false,
    icon: "🍮",
    category: "Desserts",
    price: "Contact for pricing",
  },
];
