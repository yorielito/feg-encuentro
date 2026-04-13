import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Pressable,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSiteSettings } from "../../services/siteSettings.service";
import type { SiteSettingsData } from "../../types/siteSettings";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function AboutScreen() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#d4af37" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <ImageBackground
            source={
              settings?.homeContent?.aboutImageUrl
                ? { uri: settings.homeContent.aboutImageUrl }
                : undefined
            }
            style={styles.heroImage}
            imageStyle={styles.heroImageInner}
            resizeMode="cover"
          >
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </Pressable>

            <LinearGradient
              colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.6)", "#0b0b0f"]}
              style={StyleSheet.absoluteFillObject}
            />

            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Sobre la iglesia</Text>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.content}>
          <Text style={styles.aboutText}>
            {settings?.homeContent?.aboutText ||
              "Aquí puedes agregar información sobre la iglesia desde el panel de administración."}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0b0b0f",
  },
  scroll: {
    flex: 1,
    backgroundColor: "#0b0b0f",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loading: {
    flex: 1,
    backgroundColor: "#0b0b0f",
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    width: "100%",
    height: 220,
    overflow: "hidden",
    backgroundColor: "#161621",
  },
  heroImage: {
    width: "100%",
    height: 220,
    justifyContent: "flex-end",
  },
  heroImageInner: {
    width: "100%",
    height: "100%",
  },
  heroContent: {
    padding: 20,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 10,
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 20,
  },
  aboutText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    lineHeight: 24,
  },
});
