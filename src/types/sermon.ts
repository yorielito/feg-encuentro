export type SermonMediaType = "audio" | "video";

export type SermonItem = {
  id: string;
  title: string;
  slug: string;
  speaker: string;
  summary?: string;
  coverImageUrl?: string;
  mediaUrl: string;
  mediaType: SermonMediaType;
  date: string;
  featured: boolean;
  isPublished: boolean;
  showOnHome?: boolean;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
