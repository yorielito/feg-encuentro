import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSiteSettings } from "../../services/siteSettings.service";
import { listHomeFixedEvents } from "../../services/fixedEvents.service";
import { listHomeEvents } from "../../services/events.service";
import { listHomePrayerEvents } from "../../services/prayerEvents.service";
import { listHomeSermons } from "../../services/sermons.service";
import type { SiteSettingsData } from "../../types/siteSettings";
import type { FixedEventItem } from "../../types/fixedEvent";
import type { EventItem } from "../../types/event";
import type { PrayerEventItem } from "../../types/prayerEvent";
import type { SermonItem } from "../../types/sermon";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { useAudioPlayer } from "../../context/AudioPlayerContext";
import { sermonToTrack } from "../../utils/sermonToTrack";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, PanResponder } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("es-DE", {
    dateStyle: "medium",
  }).format(date);
}

function formatHourRange(startTime: string, endTime?: string) {
  return endTime ? `${startTime} - ${endTime}` : startTime;
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [fixedEvents, setFixedEvents] = useState<FixedEventItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [prayerEvents, setPrayerEvents] = useState<PrayerEventItem[]>([]);
  const [sermons, setSermons] = useState<SermonItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { play, toggle, current, isPlaying } = useAudioPlayer();
  const [selectedFixedEvent, setSelectedFixedEvent] =
    useState<FixedEventItem | null>(null);
  const translateY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    async function init() {
      await loadHome();
      setLoading(false);
    }

    init();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHome();
    setRefreshing(false);
  };

  async function loadHome() {
    try {
      setLoading(true);

      // SETTINGS
      try {
        const settingsData = await getSiteSettings();
        console.log("✅ settings OK");
        setSettings(settingsData);
      } catch (e) {
        console.error("❌ settings error:", e);
      }

      // FIXED EVENTS
      try {
        const fixedData = await listHomeFixedEvents();
        console.log("✅ fixedEvents OK");
        setFixedEvents(fixedData);
      } catch (e) {
        console.error("❌ fixedEvents error:", e);
      }

      // EVENTS
      try {
        const eventsData = await listHomeEvents();
        console.log("✅ events OK");
        setEvents(eventsData);
      } catch (e) {
        console.error("❌ events error:", e);
      }

      // PRAYER EVENTS
      try {
        const prayerData = await listHomePrayerEvents();
        console.log("✅ prayerEvents OK");
        setPrayerEvents(prayerData);
      } catch (e) {
        console.error("❌ prayerEvents error:", e);
      }

      // SERMONS
      try {
        const sermonsData = await listHomeSermons();
        console.log("✅ sermons OK");
        setSermons(sermonsData);
      } catch (e) {
        console.error("❌ sermons error:", e);
      }
  
    } catch (error) {
      console.error("💥 loadHome fatal error:", error);
    } finally {
      setLoading(false);
    }
  }

  const homeContent = settings?.homeContent;
  const featuredPrayer = prayerEvents[0] ?? null;
  const featuredSermon = useMemo(
    () => sermons.find((item) => item.featured) ?? sermons[0] ?? null,
    [sermons]
  );

  const audioQueue = useMemo(
    () => sermons.filter((s) => s.mediaType === "audio").map(sermonToTrack),
    [sermons]
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        return gesture.dy > 8 && Math.abs(gesture.dx) < 20;
      },

      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },

      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) {
          Animated.timing(translateY, {
            toValue: 600,
            duration: 220,
            useNativeDriver: true,
          }).start(() => {
            translateY.setValue(0);
            setSelectedFixedEvent(null);
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },

      onPanResponderTerminate: () => {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#d4af37" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {settings?.churchName || "Encuentro"}
        </Text>

        <Pressable
          style={styles.headerButton}
          onPress={() => setMenuOpen(true)}
        >
          <Text style={styles.headerButtonText}>☰</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#d4af37" // iOS
            colors={["#d4af37"]} // Android
          />
        }
      >
        <ImageBackground
          source={
            homeContent?.heroImageUrl
              ? { uri: homeContent.heroImageUrl }
              : undefined
          }
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />

          <View style={styles.heroInner}>
            <Text style={styles.heroEyebrow}>
              {settings?.city} · {settings?.churchName}
            </Text>

            <Text style={styles.heroTitle}>
              {homeContent?.heroTitle || "Encuentro con Jesús"}
            </Text>

            <Text style={styles.heroSubtitle}>
              {homeContent?.heroSubtitle || "Bienvenido a nuestra comunidad"}
            </Text>

            <View style={styles.heroActions}>
              <Pressable
                style={styles.heroButtonPrimary}
                onPress={() => {
                  navigation.navigate("Main", {
                    screen: "Eventos",
                  });
                }}
              >
                <Text style={styles.heroButtonPrimaryText}>Ver eventos</Text>
              </Pressable>

              {featuredPrayer ? (
                <Pressable
                  style={styles.heroButtonSecondary}
                  onPress={() =>
                    navigation.navigate("PrayerEventDetail", {
                      prayerEventId: featuredPrayer.id,
                    })
                  }
                >
                  <Text style={styles.heroButtonSecondaryText}>Oración</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        </ImageBackground>

        {events.length > 0 ? (
          <Section
            title="Próximos eventos"
            description="Lo que viene en los próximos días dentro de la iglesia."
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carousel}
            >
              {events.slice(0, 6).map((item) => (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.carouselCard,
                    pressed && styles.cardPressed,
                  ]}
                  onPress={() =>
                    navigation.navigate("EventDetail", { eventId: item.id })
                  }
                >
                  <ImageBackground
                    source={item.imageUrl ? { uri: item.imageUrl } : undefined}
                    style={styles.carouselImage}
                    imageStyle={styles.carouselImageInner}
                  >
                    <View style={styles.carouselOverlay} />

                    <View style={styles.carouselContent}>
                      <Text style={styles.eventCardTag}>Evento</Text>

                      <Text style={styles.carouselTitle} numberOfLines={2}>
                        {item.title}
                      </Text>

                      <Text style={styles.carouselMeta}>
                        {formatDate(item.startAt)}
                      </Text>

                      <Text style={styles.carouselMeta} numberOfLines={1}>
                        {item.location}
                      </Text>

                      <Text style={styles.carouselAction}>Ver detalle →</Text>
                    </View>
                  </ImageBackground>
                </Pressable>
              ))}
            </ScrollView>
          </Section>
        ) : null}

        {featuredPrayer ? (
          <Section
            title="Jornada de oración"
            description="Reserva tu espacio y únete a un tiempo especial de oración."
          >
            <Pressable
              style={({ pressed }) => [
                styles.highlightCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() =>
                navigation.navigate("PrayerEventDetail", {
                  prayerEventId: featuredPrayer.id,
                })
              }
            >
              <Text style={styles.highlightEyebrow}>Destacado</Text>
              <Text style={styles.highlightTitle}>{featuredPrayer.title}</Text>
              <Text style={styles.highlightText}>
                Desde {formatDate(featuredPrayer.startDate)}
              </Text>
              <Text style={styles.highlightText}>
                Horario {String(featuredPrayer.slotStartHour).padStart(2, "0")}
                :00 - {String(featuredPrayer.slotEndHour).padStart(2, "0")}:00
              </Text>
              <Text style={styles.highlightText}>
                {featuredPrayer.location}
              </Text>
              <Text style={styles.highlightAction}>Reservar horario →</Text>
            </Pressable>
          </Section>
        ) : null}

        {featuredSermon ? (
          <Section
            title="Sermones"
            description="Mensajes para escuchar, meditar y compartir."
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sermonsCarousel}
            >
              {sermons.slice(0, 6).map((item) => (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.card,
                    current?.id === item.id && styles.cardActive,
                    pressed && styles.cardPressed,
                  ]}
                  onPress={() => {
                    const track = sermonToTrack(item);

                    if (current?.id === item.id) {
                      toggle();
                    } else {
                      play(track, audioQueue);
                    }
                  }}
                >
                  <Text style={styles.sermonIcon}>🎧</Text>
                  <Text style={styles.cardTitle}>{item.title}</Text>

                  <Text style={styles.cardMeta}>
                    {item.speaker} · {formatDate(item.date)}
                  </Text>

                  {current?.id === item.id && (
                    <Text style={styles.playingBadge}>
                      {isPlaying ? "Reproduciendo" : "Pausado"}
                    </Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </Section>
        ) : null}

        {fixedEvents.length > 0 ? (
          <Section
            title="Encuentros semanales"
            description="Nuestros espacios fijos para crecer en comunidad y fe."
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.fixedCarousel}
            >
              {fixedEvents.map((item) => (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.fixedCard,
                    pressed && styles.cardPressed,
                  ]}
                  onPress={() => setSelectedFixedEvent(item)}
                >
                  <View style={styles.fixedBadge}>
                    <Text style={styles.fixedBadgeText}>{item.dayLabel}</Text>
                  </View>

                  {/* CONTENT */}
                  <Text style={styles.fixedTitle}>{item.title}</Text>

                  <Text style={styles.fixedMeta}>
                    🕒 {formatHourRange(item.startTime, item.endTime)}
                  </Text>

                  <Text style={styles.fixedMeta}>📍 {item.location}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Section>
        ) : null}

        <View style={styles.finalCta}>
          <Text style={styles.finalCtaTitle}>
            {homeContent?.finalCtaTitle || "Te esperamos"}
          </Text>
          <Text style={styles.finalCtaText}>
            {homeContent?.finalCtaText ||
              "Explora los próximos encuentros y forma parte de nuestra comunidad."}
          </Text>

          <Pressable
            style={styles.finalCtaButton}
            onPress={() => {
              if (events[0]) {
                navigation.navigate("EventDetail", { eventId: events[0].id });
              } else if (featuredPrayer) {
                navigation.navigate("PrayerEventDetail", {
                  prayerEventId: featuredPrayer.id,
                });
              }
            }}
          >
            <Text style={styles.finalCtaButtonText}>Comenzar</Text>
          </Pressable>
        </View>
      </ScrollView>
      {menuOpen && (
        <View style={styles.menuOverlay}>
          <Pressable
            style={styles.menuBackdrop}
            onPress={() => setMenuOpen(false)}
          />

          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Menú</Text>

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate("Privacy");
              }}
            >
              <Text style={styles.menuItemText}>Privacidad</Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate("Terms");
              }}
            >
              <Text style={styles.menuItemText}>Términos y condiciones</Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate("Impressum");
              }}
            >
              <Text style={styles.menuItemText}>Impressum</Text>
            </Pressable>
          </View>
        </View>
      )}
      {selectedFixedEvent && (
        <Modal
          visible
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedFixedEvent(null)}
        >
          <View style={styles.modalOverlay}>
            <Pressable
              style={styles.modalBackdrop}
              onPress={() => setSelectedFixedEvent(null)}
            />

            <Animated.View
              style={[styles.sheet, { transform: [{ translateY }] }]}
              {...panResponder.panHandlers}
            >
              {/* HANDLE */}
              <View style={styles.sheetHandle} />

              {/* CLOSE */}
              <Pressable
                style={styles.sheetCloseButton}
                onPress={() => setSelectedFixedEvent(null)}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </Pressable>

              {/* HERO */}
              <View style={styles.sheetHero}>
                {selectedFixedEvent.imageUrl ? (
                  <ImageBackground
                    source={{ uri: selectedFixedEvent.imageUrl }}
                    style={styles.sheetHeroImage}
                  />
                ) : (
                  <View style={styles.sheetHeroPlaceholder}>
                    <Ionicons name="calendar-outline" size={42} color="#fff" />
                  </View>
                )}

                <LinearGradient
                  colors={["rgba(0,0,0,0.18)", "rgba(0,0,0,0.55)", "#0b0b0f"]}
                  style={styles.sheetHeroGradient}
                />

                <View style={styles.sheetHeroContent}>
                  <Text style={styles.sheetBadge}>Encuentro semanal</Text>
                  <Text style={styles.sheetTitle}>
                    {selectedFixedEvent.title}
                  </Text>
                </View>
              </View>

              {/* 🔥 SCROLL CORRECTO */}
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.sheetContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.sheetInfoCard}>
                  <View style={styles.sheetRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color="#d4af37"
                    />
                    <Text style={styles.sheetText}>
                      {selectedFixedEvent.dayLabel}
                    </Text>
                  </View>

                  <View style={styles.sheetRow}>
                    <Ionicons name="time-outline" size={16} color="#d4af37" />
                    <Text style={styles.sheetText}>
                      {formatHourRange(
                        selectedFixedEvent.startTime,
                        selectedFixedEvent.endTime
                      )}
                    </Text>
                  </View>

                  <View style={styles.sheetRow}>
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color="#d4af37"
                    />
                    <Text style={styles.sheetText}>
                      {selectedFixedEvent.location}
                    </Text>
                  </View>

                  {selectedFixedEvent.description && (
                    <View style={styles.sheetDescriptionBlock}>
                      <View style={styles.sheetRow}>
                        <Ionicons
                          name="document-text-outline"
                          size={16}
                          color="#d4af37"
                        />
                        <Text style={styles.sheetText}>Descripción</Text>
                      </View>

                      <Text style={styles.sheetDescription}>
                        {selectedFixedEvent.description}
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            </Animated.View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {description ? (
        <Text style={styles.sectionDescription}>{description}</Text>
      ) : null}
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0b0b0f",
  },
  screen: {
    flex: 1,
    backgroundColor: "#0b0b0f",
  },
  content: {
    flexGrow: 1, // 🔥 LA CLAVE
  },
  loading: {
    flex: 1,
    backgroundColor: "#0b0b0f",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
    backgroundColor: "#0b0b0f",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#12121a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  headerButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  hero: {
    minHeight: 360,
    justifyContent: "flex-end",
    marginTop: -1,
  },
  heroImage: {
    resizeMode: "cover",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.56)",
  },
  heroInner: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  heroEyebrow: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    marginBottom: 10,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.84)",
    fontSize: 15,
    marginTop: 12,
    lineHeight: 23,
    maxWidth: 420,
  },
  heroActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 22,
    flexWrap: "wrap",
  },
  heroButtonPrimary: {
    backgroundColor: "#d4af37",
    minHeight: 48,
    borderRadius: 999,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  heroButtonPrimaryText: {
    color: "#111",
    fontWeight: "700",
    fontSize: 14,
  },
  heroButtonSecondary: {
    minHeight: 48,
    borderRadius: 999,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  heroButtonSecondaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  sectionDescription: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  sectionBody: {
    gap: 14,
    marginTop: 16,
  },
  carousel: {
    paddingRight: 20,
  },
  fixedCarouselCard: {
    width: 180,
    backgroundColor: "#12121a",
    borderRadius: 18,
    padding: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  fixedCarouselDay: {
    color: "#d4af37",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  fixedCarouselTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  fixedCarouselMeta: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 12,
    marginTop: 4,
  },
  carouselCard: {
    width: 240,
    height: 160,
    marginRight: 14,
    borderRadius: 20,
    overflow: "hidden",
  },
  carouselImage: {
    flex: 1,
    justifyContent: "flex-end",
  },
  carouselImageInner: {
    resizeMode: "cover",
  },
  carouselOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  carouselContent: {
    padding: 14,
  },
  carouselTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  carouselMeta: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 12,
    marginTop: 4,
  },
  carouselAction: {
    color: "#d4af37",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 8,
  },
  eventCardTag: {
    color: "#d4af37",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  highlightCard: {
    backgroundColor: "#161621",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.25)",
    padding: 22,
  },
  highlightEyebrow: {
    color: "#d4af37",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },
  highlightTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28,
  },
  highlightText: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 21,
  },
  highlightAction: {
    color: "#d4af37",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 16,
  },
  sermonCarouselCard: {
    width: 200,
    backgroundColor: "#12121a",
    borderRadius: 18,
    padding: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  sermonIcon: {
    fontSize: 18,
    marginBottom: 8,
  },
  sermonCarouselTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  sermonCarouselMeta: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 12,
    marginTop: 6,
  },
  finalCta: {
    marginTop: 32,
    marginHorizontal: 20,
    backgroundColor: "#12121a",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 22,
  },
  finalCtaTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  finalCtaText: {
    color: "rgba(255,255,255,0.74)",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
  finalCtaButton: {
    marginTop: 18,
    backgroundColor: "#d4af37",
    minHeight: 50,
    borderRadius: 999,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  finalCtaButtonText: {
    color: "#111",
    fontSize: 14,
    fontWeight: "700",
  },

  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
  },

  menuBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  menuContainer: {
    width: 260,
    backgroundColor: "#0b0b0f",
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.08)",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  menuTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },

  menuItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },

  menuItemText: {
    color: "#fff",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#12121a",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 16,
    width: 220,
  },

  cardActive: {
    borderColor: "#d4af37",
    backgroundColor: "rgba(212,175,55,0.08)",
  },

  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
  },

  cardMeta: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    marginTop: 4,
  },

  playingBadge: {
    marginTop: 8,
    color: "#d4af37",
    fontSize: 12,
    fontWeight: "700",
  },

  sermonsCarousel: {
    gap: 14,
  },

  fixedCardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  fixedDay: {
    backgroundColor: "rgba(212,175,55,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
  },

  fixedDayText: {
    color: "#d4af37",
    fontSize: 12,
    fontWeight: "700",
  },

  fixedContent: {
    flex: 1,
  },

  modalContent: {
    backgroundColor: "#12121a",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  modalClose: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 10,
  },

  modalCloseText: {
    color: "#fff",
    fontSize: 16,
  },

  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },

  modalInfo: {
    gap: 12,
  },

  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  modalIcon: {
    fontSize: 16,
  },

  modalText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },

  modalButton: {
    marginTop: 20,
    backgroundColor: "#d4af37",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },

  modalButtonText: {
    color: "#111",
    fontWeight: "700",
  },

  fixedCarousel: {
    paddingRight: 10,
    gap: 14,
  },

  fixedCard: {
    width: 200, // 🔥 clave para horizontal scroll
    backgroundColor: "#12121a",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 16,
    justifyContent: "space-between",
  },

  fixedBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(212,175,55,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 10,
  },

  fixedBadgeText: {
    color: "#d4af37",
    fontSize: 11,
    fontWeight: "700",
  },

  fixedTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  fixedMeta: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    marginTop: 4,
  },

  sheetIcon: {
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.68)",
    justifyContent: "flex-end",
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  sheet: {
    width: "100%",
    height: "90%",
    backgroundColor: "#0b0b0f",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },

  sheetHandle: {
    width: 42,
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.28)",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 6,
  },

  sheetCloseButton: {
    position: "absolute",
    top: 30,
    right: 16,
    zIndex: 30,

    width: 38,
    height: 38,
    borderRadius: 999,

    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",

    alignItems: "center",
    justifyContent: "center",
  },

  sheetHero: {
    width: "100%",
    height: 220,
    justifyContent: "flex-end",
  },

  sheetHeroImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  sheetHeroPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#161621",
    alignItems: "center",
    justifyContent: "center",
  },

  sheetHeroGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  sheetHeroContent: {
    paddingHorizontal: 20,
    paddingBottom: 18,
  },

  sheetBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(212,175,55,0.18)",
    color: "#d4af37",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 10,
  },

  sheetTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 30,
  },

  sheetScroll: {
    flex: 1,
  },

  sheetContent: {
    padding: 20,
    paddingBottom: 28,
  },

  sheetInfoCard: {
    backgroundColor: "#12121a",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 18,
    gap: 14,
  },

  sheetRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  sheetText: {
    flex: 1,
    color: "rgba(255,255,255,0.84)",
    fontSize: 14,
    lineHeight: 20,
  },

  sheetDescriptionBlock: {
    marginTop: 6,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },

  sheetDescription: {
    marginTop: 10,
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    lineHeight: 22,
  },
});
