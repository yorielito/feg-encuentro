import type { SermonItem } from "../types/sermon";

export function sermonToTrack(sermon: SermonItem) {
  return {
    id: sermon.id,
    title: sermon.title,
    mediaUrl: sermon.mediaUrl,
    coverImageUrl: sermon.coverImageUrl || undefined,
    speaker: sermon.speaker || undefined,
    date: sermon.date || undefined,
    summary: sermon.summary || undefined,
  };
}
