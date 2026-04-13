import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getPublishedSermonById } from "../../services/sermons.service";
import type { SermonItem } from "../../types/sermon";
import type { SermonDetailRouteProp } from "../../navigation/types";
import { useAudioPlayer } from "../../context/AudioPlayerContext";
import { Ionicons } from "@expo/vector-icons";

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("es-DE", {
    dateStyle: "full",
  }).format(date);
}

export default function SermonDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<SermonDetailRouteProp>();
  const { sermonId } = route.params;
  const { play, toggle, current, isPlaying } = useAudioPlayer();

  const [item, setItem] = useState<SermonItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSermon() {
      try {
        const data = await getPublishedSermonById(sermonId);
        setItem(data);
      } catch (error) {
        console.error("loadSermon error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSermon();
  }, [sermonId]);

  async function openVideoUrl() {
    if (!item?.mediaUrl) return;

    try {
      await Linking.openURL(item.mediaUrl);
    } catch (error) {
      console.error("openVideoUrl error:", error);
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#d4af37" />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.loading}>
        <Text style={styles.notFound}>Sermón no encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ImageBackground
        source={item.coverImageUrl ? { uri: item.coverImageUrl } : undefined}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <View style={styles.heroOverlay} />

        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </Pressable>

        <View style={styles.heroInner}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>{item.speaker}</Text>
          <Text style={styles.meta}>{formatDate(item.date)}</Text>
        </View>
      </ImageBackground>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Resumen</Text>

        {item.summary ? (
          <Text style={styles.description}>{item.summary}</Text>
        ) : (
          <Text style={styles.description}>
            Este sermón no tiene resumen disponible.
          </Text>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tipo</Text>
          <Text style={styles.infoValue}>{item.mediaType}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Destacado</Text>
          <Text style={styles.infoValue}>{item.featured ? "Sí" : "No"}</Text>
        </View>

        {item.mediaType === "audio" ? (
          <Pressable
            style={styles.playButton}
            onPress={() => {
              if (current?.id === item.id) {
                toggle();
              } else {
                play({
                  id: item.id,
                  title: item.title,
                  mediaUrl: item.mediaUrl,
                });
              }
            }}
          >
            <View style={styles.playContent}>
              <Ionicons
                name={current?.id === item.id && isPlaying ? "pause" : "play"}
                size={18}
                color="#111"
              />

              <Text style={styles.playText}>
                {current?.id === item.id
                  ? isPlaying
                    ? "Pausar"
                    : "Reanudar"
                  : "Escuchar"}
              </Text>
            </View>
          </Pressable>
        ) : (
          <Pressable style={styles.videoButton} onPress={openVideoUrl}>
            <Text style={styles.videoButtonText}>Abrir video</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0b0b0f",
  },
  content: {
    paddingBottom: 32,
  },
  loading: {
    flex: 1,
    backgroundColor: "#0b0b0f",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  notFound: {
    color: "#fff",
    fontSize: 16,
  },
  hero: {
    minHeight: 340,
    justifyContent: "space-between",
  },
  heroImage: {
    resizeMode: "cover",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  backButton: {
    marginTop: 56,
    marginLeft: 16,
    alignSelf: "flex-start",
    zIndex: 2,
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  heroInner: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    zIndex: 2,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 36,
  },
  meta: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    marginTop: 8,
  },
  card: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#12121a",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 18,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },
  description: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  infoRow: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  infoLabel: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    marginBottom: 4,
  },
  infoValue: {
    color: "#fff",
    fontSize: 15,
    textTransform: "capitalize",
  },
  videoButton: {
    marginTop: 16,
    backgroundColor: "#d4af37",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  videoButtonText: {
    color: "#111",
    fontWeight: "700",
    fontSize: 15,
  },

  playContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
});
