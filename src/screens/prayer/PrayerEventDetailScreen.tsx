import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getPublishedPrayerEventById } from "../../services/prayerEvents.service";
import { listPrayerSlots } from "../../services/prayerSlots.service";
import type { PrayerEventItem } from "../../types/prayerEvent";
import type { PrayerSlotItem } from "../../types/prayerSlot";
import type { PrayerEventDetailRouteProp } from "../../navigation/types";
import RegistrationModal from "../../components/modal/RegistrationModal";
import { createPrayerRegistration } from "../../services/registrations.service";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("es-DE", {
    dateStyle: "full",
  }).format(date);
}

function formatDay(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("es-DE", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

function getSlotStatus(slot: PrayerSlotItem) {
  if (!slot.isAvailable) return "Cerrado";
  if (slot.reservedCount >= slot.capacity) return "Lleno";
  if (slot.reservedCount > 0) return "Parcial";
  return "Disponible";
}

export default function PrayerEventDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<PrayerEventDetailRouteProp>();
  const { prayerEventId } = route.params;

  const [item, setItem] = useState<PrayerEventItem | null>(null);
  const [slots, setSlots] = useState<PrayerSlotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<PrayerSlotItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function loadPrayerEvent() {
      try {
        const [eventData, slotsData] = await Promise.all([
          getPublishedPrayerEventById(prayerEventId),
          listPrayerSlots(prayerEventId),
        ]);

        setItem(eventData);
        setSlots(slotsData);
      } catch (error) {
        console.error("loadPrayerEvent error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPrayerEvent();
  }, [prayerEventId]);

  const groupedSlots = useMemo(() => {
    const map = new Map<string, PrayerSlotItem[]>();

    for (const slot of slots) {
      const current = map.get(slot.date) ?? [];
      current.push(slot);
      map.set(slot.date, current);
    }

    return Array.from(map.entries());
  }, [slots]);

  function handleOpenRegistration(slot: PrayerSlotItem) {
    const status = getSlotStatus(slot);

    if (status === "Lleno" || status === "Cerrado") {
      return;
    }

    if (!item?.registrationEnabled) {
      return;
    }

    setSelectedSlot(slot);
    setModalVisible(true);
  }

  async function handleRegistrationSubmit(data: {
    name: string;
    email: string;
    phone?: string;
  }) {
    if (!selectedSlot || !item) return;

    try {
      await createPrayerRegistration({
        eventId: item.id,
        slotId: selectedSlot.id,
        fullName: data.name,
        email: data.email,
        phone: data.phone,
        notes: "",
      });

      const updatedSlots = await listPrayerSlots(item.id);
      setSlots(updatedSlots);

      setModalVisible(false);
      setSelectedSlot(null);

      Toast.show({
        type: "success",
        text1: "Inscripción completada 🙌",
        text2: "Tu horario ha sido reservado",
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo completar la inscripción";

      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
      });
    }
  }

  const loadAll = async () => {
    try {
      const [eventData, slotsData] = await Promise.all([
        getPublishedPrayerEventById(prayerEventId),
        listPrayerSlots(prayerEventId),
      ]);

      setItem(eventData);
      setSlots(slotsData);
    } catch (e) {
      console.error(e);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

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
        <Text style={styles.notFound}>Jornada no encontrada.</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.screen}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#d4af37" // iOS
            colors={["#d4af37"]} // Android
          />
        }
        contentContainerStyle={styles.content}
      >
        <ImageBackground
          source={item.imageUrl ? { uri: item.imageUrl } : undefined}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.6)", "#0b0b0f"]}
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
            <Text style={styles.meta}>Desde {formatDate(item.startDate)}</Text>
            {item.endDate ? (
              <Text style={styles.meta}>Hasta {formatDate(item.endDate)}</Text>
            ) : null}
            <Text style={styles.meta}>{item.location}</Text>
          </View>
        </ImageBackground>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Información</Text>

          {item.description ? (
            <Text style={styles.description}>{item.description}</Text>
          ) : (
            <Text style={styles.description}>
              Esta jornada no tiene descripción disponible todavía.
            </Text>
          )}

          <InfoRow
            icon="time-outline"
            label="Horario general"
            value={`${String(item.slotStartHour).padStart(
              2,
              "0"
            )}:00 - ${String(item.slotEndHour).padStart(2, "0")}:00`}
          />

          <InfoRow
            icon="people-outline"
            label="Capacidad por horario"
            value={`${item.maxPeoplePerSlot}`}
          />

          <InfoRow
            icon="checkmark-circle-outline"
            label="Inscripción"
            value={item.registrationEnabled ? "Disponible" : "No disponible"}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Horarios disponibles</Text>

          {groupedSlots.length === 0 ? (
            <Text style={styles.description}>No hay horarios generados.</Text>
          ) : (
            groupedSlots.map(([date, daySlots]) => (
              <View key={date} style={styles.dayGroup}>
                <Text style={styles.dayTitle}>{formatDay(date)}</Text>

                {daySlots.map((slot) => {
                  const status = getSlotStatus(slot);
                  const availableCount = Math.max(
                    slot.capacity - slot.reservedCount,
                    0
                  );

                  const disabled =
                    status === "Lleno" ||
                    status === "Cerrado" ||
                    !item.registrationEnabled;

                  return (
                    <Pressable
                      key={slot.id}
                      onPress={() => handleOpenRegistration(slot)}
                      disabled={disabled}
                      style={({ pressed }) => [
                        styles.slotCard,
                        disabled && styles.slotCardDisabled,
                        pressed && !disabled && styles.slotCardPressed,
                      ]}
                    >
                      <View
                        style={{
                          flexDirection: "column",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Ionicons
                            name="time-outline"
                            size={14}
                            color="#d4af37"
                          />
                          <Text style={styles.slotLabel}>{slot.label}</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <Ionicons
                            name="people-outline"
                            size={12}
                            color="rgba(255,255,255,0.6)"
                          />
                          <Text style={styles.slotMeta}>
                            {availableCount} disponibles · {slot.capacity}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.slotStatus}>
                        <Ionicons
                          name={
                            status === "Disponible"
                              ? "checkmark"
                              : status === "Parcial"
                              ? "time"
                              : "close"
                          }
                          size={12}
                          color="#fff"
                        />
                        <Text style={styles.slotStatusText}>{status}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <RegistrationModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedSlot(null);
        }}
        onSubmit={handleRegistrationSubmit}
      />
    </>
  );
}

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

      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
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

  infoLabel: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    marginBottom: 4,
  },
  infoValue: {
    color: "#fff",
    fontSize: 15,
  },
  dayGroup: {
    marginTop: 8,
    marginBottom: 14,
  },
  dayTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 10,
    textTransform: "capitalize",
  },
  slotCard: {
    backgroundColor: "#1a1a24",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  slotCardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  slotCardDisabled: {
    opacity: 0.55,
  },
  slotLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  slotMeta: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 13,
    marginTop: 4,
  },
  slotStatusAvailable: {
    backgroundColor: "rgba(91,124,255,0.18)",
  },
  slotStatusPartial: {
    backgroundColor: "rgba(212,175,55,0.18)",
  },
  slotStatusFull: {
    backgroundColor: "rgba(255,120,120,0.18)",
  },
  slotStatusClosed: {
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  slotStatusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  slotStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
