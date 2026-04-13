import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  PanResponder,
  ScrollView,
} from "react-native";
import { useAudioPlayer } from "../../context/AudioPlayerContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";

function format(ms?: number) {
  if (!ms || ms < 0) return "00:00";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export default function PlayerScreen() {
  const navigation = useNavigation();

  const {
    current,
    isPlaying,
    toggle,
    positionMillis,
    durationMillis,
    playNext,
    seekTo,
    queue,
    currentIndex,
    play,
  } = useAudioPlayer();

  const [trackWidth, setTrackWidth] = useState(0);
  const [dragProgress, setDragProgress] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!current) return null;

  const progress = durationMillis > 0 ? positionMillis / durationMillis : 0;

  const displayProgress =
    isDragging && dragProgress !== null ? dragProgress : progress;

  const displayTime =
    isDragging && dragProgress !== null
      ? dragProgress * durationMillis
      : positionMillis;

  // swipe down para cerrar
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => {
      return Math.abs(gesture.dy) > 20;
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy > 80) {
        navigation.goBack();
      }
    },
  });

  const pan = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (e) => {
      if (!trackWidth) return;

      setIsDragging(true);

      const x = e.nativeEvent.locationX;
      const ratio = Math.max(0, Math.min(1, x / trackWidth));
      setDragProgress(ratio);
    },

    onPanResponderMove: (e) => {
      if (!trackWidth) return;

      const x = e.nativeEvent.locationX;
      const ratio = Math.max(0, Math.min(1, x / trackWidth));
      setDragProgress(ratio);
    },

    onPanResponderRelease: async () => {
      if (dragProgress !== null) {
        await seekTo(dragProgress);
      }

      setTimeout(() => {
        setIsDragging(false);
        setDragProgress(null);
      }, 120);
    },

    onPanResponderTerminate: () => {
      setIsDragging(false);
      setDragProgress(null);
    },
  });

  return (
    <ScrollView
      style={styles.screen}
      {...panResponder.panHandlers}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HERO */}
      <View style={styles.hero}>
        {current.coverImageUrl ? (
          <Image
            source={{ uri: current.coverImageUrl }}
            style={styles.heroImage}
            resizeMode="cover" // 🔥 IMPORTANTE
          />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Ionicons name="musical-notes" size={60} color="#fff" />
          </View>
        )}

        {/* GRADIENT */}
        <LinearGradient
          colors={["rgba(0,0,0,0.2)", "#0b0b0f"]}
          style={styles.heroGradient}
        />

        {/* CLOSE */}
        <Pressable
          style={styles.closeTop}
          onPress={async () => {
            navigation.goBack();
          }}
        >
          <Ionicons name="chevron-down" size={28} color="#fff" />
        </Pressable>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        {/* INFO */}
        <View style={styles.info}>
          <Text style={styles.title}>{current.title}</Text>

          <View style={styles.metaList}>
            {current.speaker && (
              <View style={styles.metaRow}>
                <Ionicons name="person-outline" size={16} color="#d4af37" />
                <Text style={styles.metaText}>{current.speaker}</Text>
              </View>
            )}

            {current.date && (
              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={16} color="#d4af37" />
                <Text style={styles.metaText}>
                  {new Date(current.date).toLocaleDateString("es-DE")}
                </Text>
              </View>
            )}

            {current.summary && (
              <View style={styles.metaRow}>
                <Ionicons
                  name="document-text-outline"
                  size={16}
                  color="#d4af37"
                />
                <Text style={styles.metaText}>{current.summary}</Text>
              </View>
            )}
          </View>
        </View>

        {/* PROGRESS */}
        <View style={styles.progressWrapper}>
          <View
            style={styles.progressTrack}
            {...pan.panHandlers}
            onLayout={(e) => {
              setTrackWidth(e.nativeEvent.layout.width);
            }}
          >
            <View
              style={[
                styles.progressFill,
                { width: displayProgress * trackWidth },
              ]}
            />

            <View
              style={[styles.thumb, { left: displayProgress * trackWidth - 8 }]}
            />
          </View>

          <View style={styles.timeRow}>
            <Text style={styles.time}>{format(displayTime)}</Text>
            <Text style={styles.time}>{format(durationMillis)}</Text>
          </View>
        </View>

        {/* CONTROLS */}
        <View style={styles.controls}>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="play-skip-back" size={28} color="#fff" />
          </Pressable>

          <Pressable style={styles.playBtn} onPress={toggle}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={32}
              color="#111"
            />
          </Pressable>

          <Pressable style={styles.iconBtn} onPress={playNext}>
            <Ionicons name="play-skip-forward" size={28} color="#fff" />
          </Pressable>
        </View>

        {/* QUEUE */}
        <View style={styles.queue}>
          <Text style={styles.queueTitle}>
            Siguientes ({queue.length - currentIndex - 1})
          </Text>

          {queue.slice(currentIndex + 1, currentIndex + 4).map((item) => (
            <Pressable
              key={item.id}
              style={styles.queueItem}
              onPress={() => play(item, queue)}
            >
              <Text style={styles.queueItemTitle} numberOfLines={1}>
                {item.title}
              </Text>
            </Pressable>
          ))}
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

  header: {
    height: 40,
    justifyContent: "center",
  },

  coverWrapper: {
    alignItems: "center",
    marginTop: 20,
  },

  cover: {
    width: 260,
    height: 260,
    borderRadius: 20,
  },

  coverPlaceholder: {
    width: 260,
    height: 260,
    borderRadius: 20,
    backgroundColor: "#12121a",
    alignItems: "center",
    justifyContent: "center",
  },

  progressWrapper: {
    marginTop: 30,
  },

  timeRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  time: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },

  controls: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },

  iconBtn: {
    padding: 10,
  },

  playBtn: {
    width: 70,
    height: 70,
    borderRadius: 999,
    backgroundColor: "#d4af37",
    alignItems: "center",
    justifyContent: "center",
  },

  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  closeTop: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },

  progressTrack: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    overflow: "visible",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#d4af37",
    borderRadius: 999,
  },

  thumb: {
    position: "absolute",
    top: -5,
    width: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: "#d4af37",
  },

  meta: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 6,
  },

  description: {
    color: "rgba(255,255,255,0.6)",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 20,
  },

  queue: {
    marginTop: 30,
  },

  queueTitle: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 10,
  },

  queueItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },

  queueItemTitle: {
    color: "rgba(255,255,255,0.8)",
  },

  hero: {
    width: "100%",
    height: 340,
    overflow: "hidden",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  content: {
    marginTop: -40, // 🔥 efecto overlay
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  info: {
    marginTop: 20,
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },

  metaList: {
    gap: 12,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)", // 🔥 línea elegante
  },

  metaText: {
    flex: 1,
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    lineHeight: 20,
  },
});
