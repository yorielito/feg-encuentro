import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { Ionicons } from "@expo/vector-icons";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function MoreScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Más</Text>

        <View style={styles.section}>
          <View style={styles.section}>
            <MenuItem
              title="Contacto"
              icon="call-outline"
              onPress={() => navigation.navigate("Contact")}
            />

            <MenuItem
              title="Sobre la iglesia"
              icon="information-circle-outline"
              onPress={() => navigation.navigate("About")}
            />

            {/* <MenuItem
              title="Donaciones"
              icon="card-outline"
              onPress={() => navigation.navigate("Donations")}
            /> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: any;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
    >
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={18} color="#d4af37" />
        <Text style={styles.itemText}>{title}</Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="rgba(255,255,255,0.5)"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0b0b0f",
  },
  content: {
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 20,
  },
  section: {
    backgroundColor: "#12121a",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  itemText: {
    color: "#fff",
    fontSize: 16,
  },
  arrow: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 18,
  },

  safe: {
    flex: 1,
    backgroundColor: "#0b0b0f",
  },

  pressed: {
    opacity: 0.85,
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
