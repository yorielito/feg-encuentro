import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabs from "./MainTabs";
import EventDetailScreen from "../screens/events/EventDetailScreen";
import PrayerEventDetailScreen from "../screens/prayer/PrayerEventDetailScreen";
import SermonDetailScreen from "../screens/sermons/SermonDetailScreen";
import PlayerScreen from "../screens/player/PlayerScreen";
import AboutScreen from "../screens/about/AboutScreen";
import ContactScreen from "../screens/contact/ContactScreen";
import { NavigatorScreenParams } from "@react-navigation/native";
import PrivacyScreen from "../screens/legal/PrivacyScreen";
import TermsScreen from "../screens/legal/TermsScreen";
import ImpressumScreen from "../screens/legal/ImpressumScreen";

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  SermonDetail: { sermonId: string };
  EventDetail: { eventId: string };
  PrayerEventDetail: { prayerEventId: string };
  Player: undefined;
  About: undefined;
  Contact: undefined;
  Privacy: undefined;
  Terms: undefined;
  Impressum: undefined;
};

export type MainTabParamList = {
  Inicio: undefined;
  Eventos: undefined;
  Sermones: undefined;
  Más: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen
        name="PrayerEventDetail"
        component={PrayerEventDetailScreen}
      />
      <Stack.Screen name="SermonDetail" component={SermonDetailScreen} />
      <Stack.Screen
        name="Player"
        component={PlayerScreen}
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="Impressum" component={ImpressumScreen} />
    </Stack.Navigator>
  );
}
