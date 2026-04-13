import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { useAudioPlayer } from "../../context/AudioPlayerContext";

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  currentRouteName?: string;
};

export default function MiniPlayer({ currentRouteName }: Props) {
  const navigation = useNavigation<Nav>();
  const { current, toggle, close, isPlaying } = useAudioPlayer();

  if (!current) return null;

  if (currentRouteName === "Player") return null;

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        navigation.navigate("Player");
      }}
    >
      <View style={styles.info}>
        <Text style={styles.label}>Reproduciendo</Text>
        <Text style={styles.title} numberOfLines={1}>
          {current.title}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.iconButton}
          onPress={(e) => {
            e.stopPropagation();
            toggle();
          }}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={18}
            color="#111"
          />
        </Pressable>

        <Pressable
          style={styles.closeButton}
          onPress={(e) => {
            e.stopPropagation();
            close();
          }}
        >
          <Ionicons name="close" size={18} color="#fff" />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 76,
    left: 12,
    right: 12,
    backgroundColor: "#12121a",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    color: "rgba(255,255,255,0.52)",
    fontSize: 11,
    marginBottom: 3,
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "#d4af37",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
});
