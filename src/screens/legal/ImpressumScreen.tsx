import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import LegalScreenLayout from "./LegalScreenLayout";
import { useEffect, useState } from "react";
import { getSiteSettings } from "../../services/siteSettings.service";
import type { SiteSettingsData } from "../../types/siteSettings";
import { Ionicons } from "@expo/vector-icons";

export default function ImpressumScreen() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);

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
      <View
        style={{
          flex: 1,
          backgroundColor: "#0b0b0f",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#d4af37" />
      </View>
    );
  }

  return (
    <LegalScreenLayout title="Impressum">
      <Section title="Dirección">
        <InfoRow
          icon="location-outline"
          label="Dirección"
          value={settings?.address}
        />

        <InfoRow
          icon="business-outline"
          label="Ciudad"
          value={settings?.city}
        />

        <InfoRow icon="earth-outline" label="País" value={settings?.country} />
      </Section>

      <Section title="Contacto">
        <InfoRow icon="call-outline" label="Teléfono" value={settings?.phone} />

        <InfoRow icon="mail-outline" label="Correo" value={settings?.email} />
      </Section>
    </LegalScreenLayout>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
}) {
  if (!value) return null;

  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={16} color="#d4af37" />

      <View style={styles.rowText}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 18,
    paddingTop: 18,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  text: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    lineHeight: 22,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },

  rowText: {
    flex: 1,
  },

  label: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginBottom: 2,
  },

  value: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },

  sectionBody: {
    marginTop: 10,
    gap: 10,
  },
});
