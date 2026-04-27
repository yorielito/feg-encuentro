import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getPublishedEventById } from "../../services/events.service";
import type { EventItem } from "../../types/event";
import type { EventDetailRouteProp } from "../../navigation/types";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color="#d4af37" />

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("es-DE", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

export default function EventDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<EventDetailRouteProp>();
  const { eventId } = route.params;

  const [item, setItem] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await getPublishedEventById(eventId);
        setItem(data);
      } catch (error) {
        console.error("loadEvent error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

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
        <Text style={styles.notFound}>Evento no encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ImageBackground
        source={item.imageUrl ? { uri: item.imageUrl } : undefined}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.18)", "rgba(0,0,0,0.55)", "#0b0b0f"]}
          style={StyleSheet.absoluteFillObject}
        />

        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </Pressable>

        <View style={styles.heroInner}>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.heroMetaList}>
            <View style={styles.heroMetaRow}>
              <Ionicons name="calendar-outline" size={15} color="#d4af37" />
              <Text style={styles.meta}>{formatDate(item.startAt)}</Text>
            </View>

            <View style={styles.heroMetaRow}>
              <Ionicons name="location-outline" size={15} color="#d4af37" />
              <Text style={styles.meta}>{item.location}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Información</Text>

        {item.description ? (
          <Text style={styles.description}>{item.description}</Text>
        ) : (
          <Text style={styles.description}>
            Este evento no tiene descripción disponible todavía.
          </Text>
        )}

        {item.endAt ? (
          <InfoRow
            icon="time-outline"
            label="Finaliza"
            value={formatDate(item.endAt)}
          />
        ) : null}

        <InfoRow
          icon="information-circle-outline"
          label="Estado"
          value={item.status}
        />

        <InfoRow
          icon="checkmark-circle-outline"
          label="Inscripción"
          value={item.registrationEnabled ? "Disponible" : "No disponible"}
        />
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
    position: "relative",
    top: 60,
    left: 16,
    zIndex: 10,

    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",

    alignItems: "center",
    justifyContent: "center",
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
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 12,
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
    lineHeight: 21,
  },
  heroMetaList: {
    marginTop: 12,
    gap: 8,
  },

  heroMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  infoContent: {
    flex: 1,
  },
});
