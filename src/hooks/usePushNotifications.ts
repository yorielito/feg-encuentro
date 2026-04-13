import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log("❌ No es dispositivo físico");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  console.log("existingStatus:", existingStatus);

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
    console.log("request status:", status);
  }

  if (finalStatus !== "granted") {
    console.log("❌ Permiso no concedido");
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("✅ Expo push token:", token);

  return token;
}
