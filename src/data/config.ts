export type SocialLinks = {
  facebook?: string;
  instagram?: string;
  twitter?: string;
};

export const config = {
  businessName: "Gul Halal Food",
  slogan: "Excellence in halal food since 1985",
  established: 1985,
  description: "Family-owned Pakistani halal catering.",
  websiteUrl: undefined as string | undefined,
  phone: undefined as string | undefined,
  email: undefined as string | undefined,
  address: undefined as string | undefined,
  city: undefined as string | undefined,
  state: undefined as string | undefined,
  postalCode: undefined as string | undefined,
  serviceArea: undefined as string | undefined,
  hours: [] as string[],
  social: {} as SocialLinks,
  forms: {
    onlineSubmissionAvailable: false,
  },
} as const;
