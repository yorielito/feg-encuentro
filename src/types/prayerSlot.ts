export type PrayerSlotItem = {
  id: string;
  prayerEventId: string;
  date: string;
  dayKey: string;
  hour: number;
  label: string;
  capacity: number;
  reservedCount: number;
  isAvailable: boolean;
  startAt: string;
  endAt: string;
  createdAt?: string;
  updatedAt?: string;
};
