export type PushTokenItem = {
  id: string;
  token: string;
  platform: "ios" | "android" | "unknown";
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};
