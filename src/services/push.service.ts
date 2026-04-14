import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import messaging from "@react-native-firebase/messaging";

export async function registerDevicePushToken(userId: string) {
  try {
    if (!Device.isDevice) {
      console.log("❌ Push solo funciona en dispositivo físico");
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    console.log("existingStatus:", existingStatus);

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log("request status:", status);
    }

    if (finalStatus !== "granted") {
      console.log("❌ Permisos denegados");
      return null;
    }

    const tokenResponse = await Notifications.getDevicePushTokenAsync();
    const token = String(tokenResponse.data);

    console.log("✅ Device push token:", token);

    await setDoc(
      doc(db, "users", userId, "devices", token),
      {
        token,
        platform: Platform.OS,
        provider: Platform.OS === "android" ? "fcm" : "apns",
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    console.log("✅ Token guardado en Firestore");
    return token;
  } catch (err) {
    console.error("❌ registerDevicePushToken error:", err);
    return null;
  }
}

export async function subscribeToTopics() {
  try {
    await messaging().subscribeToTopic("events");
    await messaging().subscribeToTopic("sermons");
    await messaging().subscribeToTopic("prayer");

    console.log("✅ Subscribed to topics");
  } catch (err) {
    console.error("❌ subscribeToTopics error:", err);
  }
}