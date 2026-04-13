import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { listHomeSermons } from "../../services/sermons.service";
import type { SermonItem } from "../../types/sermon";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { useAudioPlayer } from "../../context/AudioPlayerContext";
import { Ionicons } from "@expo/vector-icons";
import { sermonToTrack } from "../../utils/sermonToTrack";
import { SafeAreaView } from "react-native-safe-area-context";

type Nav = NativeStackNavigationProp<RootStackParamList>;

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("es-DE", {
    dateStyle: "medium",
  }).format(date);
}

export default function SermonsScreen() {
  const [loading, setLoading] = useState(true);
  const [sermons, setSermons] = useState<SermonItem[]>([]);
  const navigation = useNavigation<Nav>();
  const { play, toggle, current, isPlaying } = useAudioPlayer();
  const [refreshing, setRefreshing] = useState(false);

  async function loadSermons() {
    try {
      const data = await listHomeSermons();
      setSermons(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    async function init() {
      await loadSermons();
      setLoading(false);
    }

    init();
  }, []);

  const featured = useMemo(
    () => sermons.find((s) => s.featured) || sermons[0],
    [sermons]
  );

  const rest = sermons.filter((s) => s.id !== featured?.id);

  const audioQueue = useMemo(
    () => sermons.filter((s) => s.mediaType === "audio").map(sermonToTrack),
    [sermons]
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSermons();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#d4af37" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.screen}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#d4af37"
            colors={["#d4af37"]}
          />
        }
        contentContainerStyle={styles.content}
      >
        {/* 🎧 DESTACADO */}
        {featured && (
          <Pressable
            onPress={() =>
              navigation.navigate("SermonDetail", {
                sermonId: featured.id,
              })
            }
            style={styles.featuredContainer}
          >
            <ImageBackground
              source={
                featured.coverImageUrl
                  ? { uri: featured.coverImageUrl }
                  : undefined
              }
              style={styles.featuredImage}
              imageStyle={{ borderRadius: 24 }}
            >
              <View style={styles.overlay} />

              <View style={styles.featuredContent}>
                <Text style={styles.badge}>Sermón destacado</Text>

                <Text style={styles.featuredTitle}>{featured.title}</Text>

                <Text style={styles.featuredMeta}>{featured.speaker}</Text>

                <Pressable
                  style={({ pressed }) => [
                    styles.playButton,
                    current?.id === featured.id &&
                      isPlaying &&
                      styles.playButtonActive,
                    pressed && styles.playButtonPressed,
                  ]}
                  onPress={(e) => {
                    e.stopPropagation(); // 🔥 evita abrir detail

                    if (current?.id === featured.id) {
                      toggle();
                    } else {
                      const track = sermonToTrack(featured);
                      play(track, audioQueue);
                    }
                  }}
                >
                  <View style={styles.playContent}>
                    <Ionicons
                      name={
                        current?.id === featured.id
                          ? isPlaying
                            ? "pause-circle"
                            : "play-circle"
                          : "play-circle"
                      }
                      size={18}
                      color="#111"
                    />

                    <Text style={styles.playText}>
                      {current?.id === featured.id
                        ? isPlaying
                          ? "Pausar"
                          : "Reanudar"
                        : "Escuchar"}
                    </Text>
                  </View>
                </Pressable>
              </View>
            </ImageBackground>
          </Pressable>
        )}

        {/* 📜 LISTA */}
        <View style={styles.list}>
          {rest.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.item, pressed && styles.pressed]}
              onPress={() => {
                const track = sermonToTrack(item);
                play(track, audioQueue);
              }}
            >
              <View style={styles.itemIcon}>
                <Text style={{ fontSize: 16 }}>🎧</Text>
              </View>

              <View style={styles.itemBody}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>

                <Text style={styles.itemMeta}>
                  {item.speaker} · {formatDate(item.date)}
                </Text>
              </View>

              <Text style={styles.itemArrow}>›</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  loading: {
    flex: 1,
    backgroundColor: "#0b0b0f",
    justifyContent: "center",
    alignItems: "center",
  },

  featuredContainer: {
    marginBottom: 24,
  },

  featuredImage: {
    height: 240,
    justifyContent: "flex-end",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 24,
  },

  featuredContent: {
    padding: 20,
  },

  badge: {
    color: "#d4af37",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },

  featuredTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },

  featuredMeta: {
    color: "rgba(255,255,255,0.8)",
    marginTop: 6,
  },

  playButton: {
    marginTop: 14,
    backgroundColor: "#d4af37",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignSelf: "flex-start",
    minHeight: 42,
    justifyContent: "center",
    alignItems: "center",
  },

  playText: {
    color: "#111",
    fontWeight: "700",
    fontSize: 14,
  },

  list: {
    gap: 12,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#12121a",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  itemIcon: {
    marginRight: 12,
  },

  itemBody: {
    flex: 1,
  },

  itemTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  itemMeta: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 4,
  },

  itemArrow: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 18,
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  playButtonActive: {
    backgroundColor: "#f0c95c",
  },

  playButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  playContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  safe: {
    flex: 1,
    backgroundColor: "#0b0b0f",
  },
});
