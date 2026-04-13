import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import type { RootStackParamList } from "../navigation/AppNavigator";

type NavigateFn = (
  screen: keyof RootStackParamList,
  params?: RootStackParamList[keyof RootStackParamList]
) => void;

export function useNotificationNavigation(navigate: NavigateFn) {
  useEffect(() => {
    async function handleInitialNotification() {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (!response) return;

      const data = response.notification.request.content.data as {
        type?: string;
        id?: string;
      };

      if (!data?.type || !data?.id) return;

      if (data.type === "event") {
        navigate("EventDetail", { eventId: data.id });
      }

      if (data.type === "prayer") {
        navigate("PrayerEventDetail", { prayerEventId: data.id });
      }

      if (data.type === "sermon") {
        navigate("SermonDetail", { sermonId: data.id });
      }
    }

    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as {
          type?: string;
          id?: string;
        };

        if (!data?.type || !data?.id) return;

        if (data.type === "event") {
          navigate("EventDetail", { eventId: data.id });
        }

        if (data.type === "prayer") {
          navigate("PrayerEventDetail", { prayerEventId: data.id });
        }

        if (data.type === "sermon") {
          navigate("SermonDetail", { sermonId: data.id });
        }
      }
    );

    handleInitialNotification().catch((error) => {
      console.error("handleInitialNotification error:", error);
    });

    return () => {
      sub.remove();
    };
  }, [navigate]);
}
