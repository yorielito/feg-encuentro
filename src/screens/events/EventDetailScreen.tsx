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
import RegistrationForm from "../../components/forms/RegistrationForm";
import { createRegistration } from "../../services/registrations.service";

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
        <View style={styles.heroOverlay} />

        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </Pressable>

        <View style={styles.heroInner}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>{formatDate(item.startAt)}</Text>
          <Text style={styles.meta}>{item.location}</Text>
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
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Finaliza</Text>
            <Text style={styles.infoValue}>{formatDate(item.endAt)}</Text>
          </View>
        ) : null}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Estado</Text>
          <Text style={styles.infoValue}>{item.status}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Inscripción</Text>
          <Text style={styles.infoValue}>
            {item.registrationEnabled ? "Disponible" : "No disponible"}
          </Text>
        </View>
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
  },
});
