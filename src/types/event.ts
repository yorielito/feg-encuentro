export type EventItem = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl: string;
  startAt: string;
  endAt?: string;
  location: string;
  featured: boolean;
  capacity?: number;
  registrationEnabled: boolean;
  status: "upcoming" | "closed" | "past";
  isPublished: boolean;
  showOnHome: boolean;
  isArchived?: boolean;
};
