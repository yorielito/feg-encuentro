import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { useState } from "react";
import AppNavigator, {
  RootStackParamList,
} from "./src/navigation/AppNavigator";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import Toast from "react-native-toast-message";
import { AudioProvider } from "./src/context/AudioPlayerContext";
import MiniPlayer from "./src/components/media/MiniPlayer";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

function navigateFromNotification(
  screen: keyof RootStackParamList,
  params?: RootStackParamList[keyof RootStackParamList]
) {
  if (!navigationRef.isReady()) return;

  if (screen === "Main") {
    navigationRef.navigate("Main");
    return;
  }

  if (screen === "EventDetail" && params && "eventId" in params) {
    navigationRef.navigate("EventDetail", { eventId: params.eventId });
    return;
  }

  if (screen === "PrayerEventDetail" && params && "prayerEventId" in params) {
    navigationRef.navigate("PrayerEventDetail", {
      prayerEventId: params.prayerEventId,
    });
    return;
  }

  if (screen === "SermonDetail" && params && "sermonId" in params) {
    navigationRef.navigate("SermonDetail", { sermonId: params.sermonId });
    return;
  }

  if (screen === "Player") {
    navigationRef.navigate("Player");
  }
}

function RootContent() {
  const { loading } = useAuth();
  const [currentRouteName, setCurrentRouteName] = useState<string>("");

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0b0b0f",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#d4af37" />
      </View>
    );
  }

  return (
    <AudioProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          const route = navigationRef.getCurrentRoute();
          setCurrentRouteName(route?.name ?? "");
        }}
        onStateChange={() => {
          const route = navigationRef.getCurrentRoute();
          setCurrentRouteName(route?.name ?? "");
        }}
      >
        <AppNavigator />
        <MiniPlayer currentRouteName={currentRouteName} />
      </NavigationContainer>
    </AudioProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootContent />
      <Toast />
    </AuthProvider>
  );
}
