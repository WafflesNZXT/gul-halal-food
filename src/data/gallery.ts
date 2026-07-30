export type GalleryCategory = "All" | "Food" | "Weddings" | "Family Events" | "Catering Setups";

export type GalleryItem = {
  id: string;
  title: string;
  category: GalleryCategory;
  placeholderColor: string;
  aspectRatio: "square" | "video" | "portrait";
};

export const gallery: GalleryItem[] = [
  { id: "g1", title: "Wedding Biryani Setup", category: "Weddings", placeholderColor: "bg-red-100", aspectRatio: "square" },
  { id: "g2", title: "Fresh Samosas", category: "Food", placeholderColor: "bg-yellow-100", aspectRatio: "portrait" },
  { id: "g3", title: "Family Eid Dinner", category: "Family Events", placeholderColor: "bg-green-100", aspectRatio: "video" },
  { id: "g4", title: "Dessert Table", category: "Catering Setups", placeholderColor: "bg-red-50", aspectRatio: "square" },
  { id: "g5", title: "Corporate Buffet", category: "Catering Setups", placeholderColor: "bg-green-50", aspectRatio: "portrait" },
  { id: "g6", title: "Chicken Karahi", category: "Food", placeholderColor: "bg-red-50", aspectRatio: "square" },
  { id: "g7", title: "Outdoor Reception", category: "Weddings", placeholderColor: "bg-yellow-50", aspectRatio: "video" },
  { id: "g8", title: "Seekh Kebabs", category: "Food", placeholderColor: "bg-red-100", aspectRatio: "square" },
];
