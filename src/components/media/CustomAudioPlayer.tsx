import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Audio } from "expo-av";

type Props = {
  src: string;
  title?: string;
};

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function CustomAudioPlayer({ src, title }: Props) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function setup() {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: src },
        { shouldPlay: false },
        (status) => {
          if (!mounted || !status.isLoaded) return;

          setIsPlaying(status.isPlaying);
          setPositionMillis(status.positionMillis ?? 0);
          setDurationMillis(status.durationMillis ?? 0);
        }
      );

      soundRef.current = sound;
    }

    setup().catch((error) => {
      console.error("Audio setup error:", error);
    });

    return () => {
      mounted = false;

      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, [src]);

  async function togglePlay() {
    const sound = soundRef.current;
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  }

  const progress = durationMillis > 0 ? positionMillis / durationMillis : 0;

  return (
    <View style={styles.wrapper}>
      {title ? <Text style={styles.title}>{title}</Text> : null}

      <View style={styles.row}>
        <Pressable style={styles.button} onPress={togglePlay}>
          <Text style={styles.buttonText}>
            {isPlaying ? "Pausar" : "Reproducir"}
          </Text>
        </Pressable>

        <Text style={styles.time}>
          {formatTime(positionMillis)} / {formatTime(durationMillis)}
        </Text>
      </View>

      <View style={styles.bar}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
    backgroundColor: "#161621",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 16,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#d4af37",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  buttonText: {
    color: "#111",
    fontWeight: "700",
  },
  time: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
  },
  bar: {
    marginTop: 14,
    width: "100%",
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#d4af37",
  },
});
