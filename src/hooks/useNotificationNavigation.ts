import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { navigationRef } from "../../App";

function getStringValue(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export function useNotificationNavigation() {
  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      const data = remoteMessage.data;
      if (!data) return;

      const type = getStringValue(data.type);

      if (type === "event") {
        const eventId = getStringValue(data.eventId);
        if (!eventId) return;

        navigationRef.navigate("EventDetail", { eventId });
        return;
      }

      if (type === "sermon") {
        const sermonId = getStringValue(data.sermonId);
        if (!sermonId) return;

        navigationRef.navigate("SermonDetail", { sermonId });
        return;
      }

      if (type === "prayer") {
        const prayerEventId = getStringValue(data.prayerEventId);
        if (!prayerEventId) return;

        navigationRef.navigate("PrayerEventDetail", { prayerEventId });
      }
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        const data = remoteMessage?.data;
        if (!data) return;

        const type = getStringValue(data.type);

        if (type === "event") {
          const eventId = getStringValue(data.eventId);
          if (!eventId) return;

          navigationRef.navigate("EventDetail", { eventId });
          return;
        }

        if (type === "sermon") {
          const sermonId = getStringValue(data.sermonId);
          if (!sermonId) return;

          navigationRef.navigate("SermonDetail", { sermonId });
          return;
        }

        if (type === "prayer") {
          const prayerEventId = getStringValue(data.prayerEventId);
          if (!prayerEventId) return;

          navigationRef.navigate("PrayerEventDetail", { prayerEventId });
        }
      });

    return unsubscribe;
  }, []);
}
