import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "./AppNavigator";

export type EventDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EventDetail"
>;

export type EventDetailRouteProp = RouteProp<RootStackParamList, "EventDetail">;

export type PrayerEventDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PrayerEventDetail"
>;

export type PrayerEventDetailRouteProp = RouteProp<
  RootStackParamList,
  "PrayerEventDetail"
>;

export type SermonDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SermonDetail"
>;

export type SermonDetailRouteProp = RouteProp<
  RootStackParamList,
  "SermonDetail"
>;
