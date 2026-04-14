import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

initializeApp();

export const onEventCreated = onDocumentCreated(
  {
    document: "events/{eventId}",
    region: "europe-west3", // 🔥 Frankfurt
  },
  async (event) => {
    const data = event.data?.data();

    if (!data) return;

    console.log("🔥 Nuevo evento:", data.title);

    await getMessaging().send({
      topic: "events",
      notification: {
        title: "Nuevo evento 🙌",
        body: data.title,
      },
    });
  }
);

export const onSermonCreated = onDocumentCreated(
  {
    document: "sermons/{sermonId}",
    region: "europe-west3",
  },
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    await getMessaging().send({
      topic: "sermons",
      notification: {
        title: "Nuevo sermón 🎧",
        body: data.title,
      },
    });
  }
);

export const onPrayerCreated = onDocumentCreated(
  {
    document: "prayerEvents/{id}",
    region: "europe-west3",
  },
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    await getMessaging().send({
      topic: "prayer",
      notification: {
        title: "Nueva jornada de oración 🙏",
        body: data.title,
      },
    });
  }
);

export const onDeviceTokenCreated = onDocumentCreated(
  {
    document: "users/{userId}/devices/{deviceId}",
    region: "europe-west3",
  },
  async (event) => {
    const data = event.data?.data();
    if (!data?.token) return;

    const token = data.token as string;
    const platform = data.platform as string | undefined;

    console.log("📲 Nuevo token detectado:", token);

    const topics = ["events", "sermons", "prayer"];

    for (const topic of topics) {
      try {
        if (platform === "android") {
          await getMessaging().subscribeToTopic([token], topic);
          console.log(`✅ Token suscrito a ${topic}`);
        } else {
          console.log(
            `ℹ️ Token iOS detectado. Topic ${topic} pendiente de estrategia APNs.`
          );
        }
      } catch (error) {
        console.error(`❌ Error suscribiendo a ${topic}:`, error);
      }
    }
  }
);
