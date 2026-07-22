export type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Ayesha R.",
    role: "Wedding Client",
    content: "Gul Halal Food catered our wedding for 300 guests. The biryani was exactly like what my grandmother used to make. Everyone kept asking who the caterer was!",
    rating: 5
  },
  {
    id: "t2",
    name: "Tariq M.",
    role: "Family Gathering",
    content: "We hired them for our son's Aqeeqah. The team was so professional, and the food was incredibly fresh and flavorful. The Haleem was the star of the show.",
    rating: 5
  },
  {
    id: "t3",
    name: "Sarah K.",
    role: "Community Event Organizer",
    content: "Working with the Gul family is always a joy. They handle large-scale Iftar dinners with grace, and the quality never drops, whether it's for 50 people or 500.",
    rating: 5
  },
  {
    id: "t4",
    name: "M. Ahmed",
    role: "Corporate Lunch",
    content: "Our team was blown away by the lunch spread. Finding a caterer that delivers both exceptional taste and reliable service isn't easy, but Gul Halal Food exceeded expectations.",
    rating: 5
  },
  {
    id: "t5",
    name: "Fatima S.",
    role: "Birthday Party",
    content: "The custom menu they created for my daughter's sweet sixteen was perfect. The seekh kebabs were a huge hit, and their staff was wonderful to work with.",
    rating: 5
  }
];
