export type ValueItem = {
  id: string;
  title: string;
  description: string;
  iconName: string;
  colorTheme: "sage" | "cream" | "golden" | "ivory";
};

export const values: ValueItem[] = [
  {
    id: "authentic",
    title: "Authentic Pakistani Flavor",
    description: "We don't cut corners. Our recipes use traditional spices and cooking methods.",
    iconName: "Flame",
    colorTheme: "sage"
  },
  {
    id: "halal",
    title: "Halal Pakistani Food",
    description: "Pakistani halal food prepared for gatherings and events.",
    iconName: "CheckCircle2",
    colorTheme: "cream"
  },
  {
    id: "family",
    title: "Family-Owned Since 1985",
    description: "Three generations of culinary heritage, sharing our family's table with yours.",
    iconName: "Home",
    colorTheme: "golden"
  },
  {
    id: "personal",
    title: "Catering Made Personal",
    description: "Every event gets our undivided attention, from intimate dinners to grand weddings.",
    iconName: "Heart",
    colorTheme: "ivory"
  }
];
