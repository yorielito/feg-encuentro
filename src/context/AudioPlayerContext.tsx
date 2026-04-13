import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import type { SermonItem } from "../types/sermon";

type SermonTrack = {
  id: string;
  title: string;
  mediaUrl: string;
  coverImageUrl?: string;
  speaker?: string; // ✅ opcional
  date?: string; // ✅ opcional
  summary?: string;
};

type AudioContextType = {
  current: SermonTrack | null;
  queue: SermonTrack[];
  currentIndex: number;
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  play: (track: SermonTrack, queue?: SermonTrack[]) => Promise<void>;
  toggle: () => Promise<void>;
  close: () => Promise<void>;
  playNext: () => Promise<void>;
  seekTo: (ratio: number) => Promise<void>;
};

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const soundRef = useRef<Audio.Sound | null>(null);

  const [current, setCurrent] = useState<SermonTrack | null>(null);
  const [queue, setQueue] = useState<SermonTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  async function cleanupCurrentSound() {
    if (soundRef.current) {
      try {
        await soundRef.current.setOnPlaybackStatusUpdate(null);
        await soundRef.current.stopAsync().catch(() => {});
        await soundRef.current.unloadAsync().catch(() => {});
      } catch (error) {
        console.error("cleanup sound error:", error);
      } finally {
        soundRef.current = null;
      }
    }
  }

  async function loadAndPlay(track: SermonTrack) {
    await cleanupCurrentSound();

    const { sound } = await Audio.Sound.createAsync(
      { uri: track.mediaUrl },
      { shouldPlay: true },
      async (status) => {
        if (!status.isLoaded) {
          setIsPlaying(false);
          setPositionMillis(0);
          setDurationMillis(0);
          return;
        }

        setIsPlaying(status.isPlaying ?? false);
        setPositionMillis(status.positionMillis ?? 0);
        setDurationMillis(status.durationMillis ?? 0);

        if (!isSeeking) {
          setPositionMillis(status.positionMillis ?? 0);
        }

        if (status.didJustFinish) {
          await playNext();
        }
      }
    );

    soundRef.current = sound;
    setCurrent(track);
    setIsPlaying(true);
    setPositionMillis(0);
  }

  async function play(track: SermonTrack, nextQueue?: SermonTrack[]) {
    try {
      const finalQueue =
        nextQueue && nextQueue.length > 0 ? nextQueue : [track];

      const foundIndex = finalQueue.findIndex((item) => item.id === track.id);

      setQueue(finalQueue);
      setCurrentIndex(foundIndex >= 0 ? foundIndex : 0);

      await loadAndPlay(track);
    } catch (error) {
      console.error("play error:", error);
    }
  }

  async function toggle() {
    const sound = soundRef.current;
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) return;

      if (status.isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("toggle error:", error);
    }
  }

  async function close() {
    try {
      if (soundRef.current) {
        await soundRef.current.setOnPlaybackStatusUpdate(null);
        await soundRef.current.stopAsync().catch(() => {});
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    } catch (error) {
      console.error("close error:", error);
    } finally {
      setCurrent(null);
      setQueue([]);
      setCurrentIndex(-1);
      setIsPlaying(false);
      setPositionMillis(0);
      setDurationMillis(0);
    }
  }

  async function playNext() {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;

      if (nextIndex >= queue.length) {
        setIsPlaying(false);
        return prevIndex;
      }

      const nextTrack = queue[nextIndex];

      setTimeout(() => {
        loadAndPlay(nextTrack);
      }, 0);

      return nextIndex;
    });
  }

  async function seekTo(ratio: number) {
    const sound = soundRef.current;
    if (!sound || !durationMillis) return;

    const position = ratio * durationMillis;

    try {
      setIsSeeking(true);

      await sound.setPositionAsync(position);
      setPositionMillis(position);
    } catch (e) {
      if (!String(e).includes("interrupted")) {
        console.error("seek error:", e);
      }
    } finally {
      setTimeout(() => {
        setIsSeeking(false); // 🔥 DESBLOQUEA
      }, 120);
    }
  }

  useEffect(() => {
    return () => {
      cleanupCurrentSound();
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        current,
        queue,
        currentIndex,
        isPlaying,
        positionMillis,
        durationMillis,
        play,
        toggle,
        close,
        playNext,
        seekTo,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error("AudioProvider missing");
  }
  return ctx;
}
