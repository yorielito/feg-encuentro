import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Pressable,
  ImageBackground,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSiteSettings } from "../../services/siteSettings.service";
import type { SiteSettingsData } from "../../types/siteSettings";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function ContactScreen() {
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
        {/* HERO */}
        <View style={styles.hero}>
          <ImageBackground
            source={
              settings?.homeContent?.aboutImageUrl
                ? { uri: settings.homeContent.aboutImageUrl }
                : undefined
            }
            style={styles.heroImage}
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
              <Text style={styles.heroTitle}>Contacto</Text>
            </View>
          </ImageBackground>
        </View>

        {/* INFO */}
        <View style={styles.content}>
          <View style={styles.card}>
            {settings?.phone && (
              <ContactItem
                icon="call-outline"
                label="Teléfono"
                value={settings.phone}
                onPress={() => Linking.openURL(`tel:${settings.phone}`)}
              />
            )}

            {settings?.email && (
              <ContactItem
                icon="mail-outline"
                label="Email"
                value={settings.email}
                onPress={() => Linking.openURL(`mailto:${settings.email}`)}
              />
            )}

            {settings?.address && (
              <ContactItem
                icon="location-outline"
                label="Dirección"
                value={settings.address}
                onPress={() =>
                  Linking.openURL(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      settings.address!
                    )}`
                  )
                }
              />
            )}

            {settings?.socialLinks?.instagram && (
              <ContactItem
                icon="logo-instagram"
                label="Instagram"
                value="@Instagram"
                onPress={() =>
                  Linking.openURL(settings.socialLinks!.instagram!)
                }
              />
            )}

            {settings?.socialLinks?.youtube && (
              <ContactItem
                icon="logo-youtube"
                label="YouTube"
                value="Canal"
                onPress={() => Linking.openURL(settings.socialLinks!.youtube!)}
              />
            )}

            {settings?.socialLinks?.facebook && (
              <ContactItem
                icon="logo-facebook"
                label="Facebook"
                value="Página"
                onPress={() => Linking.openURL(settings.socialLinks!.facebook!)}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ContactItem({
  icon,
  label,
  value,
  onPress,
}: {
  icon: any;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
    >
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={18} color="#d4af37" />
        <View>
          <Text style={styles.itemLabel}>{label}</Text>
          <Text style={styles.itemValue}>{value}</Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="rgba(255,255,255,0.5)"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0b0b0f",
  },

  scroll: {
    flex: 1,
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
    height: 220,
    overflow: "hidden",
    backgroundColor: "#161621",
  },

  heroImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
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

  card: {
    backgroundColor: "#12121a",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },

  item: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },

  itemLeft: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  itemLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },

  itemValue: {
    color: "#fff",
    fontSize: 14,
    marginTop: 2,
  },

  pressed: {
    opacity: 0.85,
  },
});
