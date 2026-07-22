export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  iconName: string;
};

export const services: ServiceItem[] = [
  {
    id: "weddings",
    title: "Weddings",
    description: "Make your big day unforgettable with authentic, abundant meals that bring families together.",
    iconName: "HeartHandshake"
  },
  {
    id: "family-gatherings",
    title: "Family Gatherings",
    description: "Enjoy the company of your loved ones while we handle the cooking, just like home.",
    iconName: "Users"
  },
  {
    id: "community-events",
    title: "Community Events",
    description: "Large-scale catering with consistent quality, perfect for Eid, Iftars, and community celebrations.",
    iconName: "Globe2"
  },
  {
    id: "corporate",
    title: "Corporate Events",
    description: "Impress your colleagues and clients with premium, flavorful halal lunches and dinners.",
    iconName: "Briefcase"
  },
  {
    id: "birthdays",
    title: "Birthdays & Celebrations",
    description: "Festive dishes that add joy and flavor to your special milestones.",
    iconName: "PartyPopper"
  },
  {
    id: "custom",
    title: "Custom Catering",
    description: "Have a specific menu in mind? We'll work with you to create the perfect culinary experience.",
    iconName: "ChefHat"
  }
];
