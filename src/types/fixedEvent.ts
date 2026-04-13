export type FixedEventItem = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl: string;
  dayLabel: string;
  startTime: string;
  endTime?: string;
  location: string;
  isPublished: boolean;
  showOnHome: boolean;
  sortOrder: number;
  isArchived?: boolean;
};
