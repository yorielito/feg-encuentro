import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { listPublishedEvents } from "../../services/events.service";
import type { EventItem } from "../../types/event";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("es-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function EventsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const featured = items[0] ?? null;
  const rest = items.slice(1);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await listPublishedEvents();
        setItems(data);
      } catch (error) {
        console.error("loadEvents error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await listPublishedEvents();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
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
      <View style={styles.screen}>
        <FlatList
          data={rest}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() =>
                navigation.navigate("EventDetail", { eventId: item.id })
              }
            >
              <View style={styles.cardRow}>
                <View style={styles.dateBox}>
                  <Text style={styles.dateDay}>
                    {new Date(item.startAt).getDate()}
                  </Text>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{item.title}</Text>

                  <Text style={styles.cardMeta}>
                    {formatDate(item.startAt)}
                  </Text>

                  <Text style={styles.cardMeta}>{item.location}</Text>
                </View>
              </View>
            </Pressable>
          )}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Eventos</Text>
                <Text style={styles.subtitle}>
                  Descubre los próximos encuentros de la iglesia.
                </Text>
              </View>

              {featured && (
                <Pressable
                  style={styles.heroCard}
                  onPress={() =>
                    navigation.navigate("EventDetail", {
                      eventId: featured.id,
                    })
                  }
                >
                  <View style={styles.heroImageWrapper}>
                    {/* si tienes imageUrl */}
                    {featured.imageUrl ? (
                      <ImageBackground
                        source={{ uri: featured.imageUrl }}
                        style={styles.heroImage}
                      />
                    ) : (
                      <View style={styles.heroPlaceholder} />
                    )}

                    <View style={styles.heroOverlay} />

                    <View style={styles.heroContent}>
                      <Text style={styles.heroBadge}>Próximo evento</Text>
                      <Text style={styles.heroTitle}>{featured.title}</Text>
                      <Text style={styles.heroMeta}>
                        {formatDate(featured.startAt)} · {featured.location}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            </>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0b0b0f",
  },
  loading: {
    flex: 1,
    backgroundColor: "#0b0b0f",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 20,
    paddingBottom: 32,
    gap: 12,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 8,
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#12121a",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 16,
    marginBottom: 12,
  },
  cardDescription: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  empty: {
    color: "rgba(255,255,255,0.52)",
    fontSize: 14,
    marginTop: 12,
  },

  heroCard: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: "hidden",
  },

  heroImageWrapper: {
    height: 220,
    justifyContent: "flex-end",
  },

  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },

  heroPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#161621",
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  heroContent: {
    padding: 18,
  },

  heroBadge: {
    color: "#d4af37",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  heroMeta: {
    color: "rgba(255,255,255,0.8)",
    marginTop: 6,
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  dateBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "rgba(212,175,55,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  dateDay: {
    color: "#d4af37",
    fontSize: 16,
    fontWeight: "700",
  },

  cardBody: {
    flex: 1,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  cardMeta: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 4,
  },

  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  safe: {
    flex: 1,
    backgroundColor: "#0b0b0f",
  },
});
