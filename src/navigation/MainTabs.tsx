import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/home/HomeScreen";
import EventsScreen from "../screens/events/EventsScreen";
import MoreScreen from "../screens/more/MoreScreen";
import { Ionicons } from "@expo/vector-icons";
import SermonsScreen from "../screens/sermons/SermonsScreen";
import { MainTabParamList } from "./AppNavigator";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === "Inicio") iconName = "home";
          else if (route.name === "Eventos") iconName = "calendar";
          else if (route.name === "Sermones") iconName = "headset";
          else if (route.name === "Más") iconName = "menu";

          return <Ionicons name={iconName} size={size} color={color} />;
        },

        tabBarActiveTintColor: "#d4af37",
        tabBarInactiveTintColor: "rgba(255,255,255,0.5)",

        tabBarStyle: {
          backgroundColor: "#0b0b0f",
          borderTopColor: "rgba(255,255,255,0.08)",
          height: 74,
          paddingBottom: 8,
          paddingTop: 0,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Eventos" component={EventsScreen} />
      <Tab.Screen name="Sermones" component={SermonsScreen} />
      <Tab.Screen name="Más" component={MoreScreen} />
    </Tab.Navigator>
  );
}
