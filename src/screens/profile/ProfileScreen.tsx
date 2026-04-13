import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#d4af37" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.text}>No has iniciado sesión.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Mi perfil</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.value}>{user.displayName || "—"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email || "—"}</Text>
        </View>

        <Pressable style={styles.buttonGhost} onPress={logout}>
          <Text style={styles.buttonGhostText}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0b0b0f",
    padding: 20,
  },
  loading: {
    flex: 1,
    backgroundColor: "#0b0b0f",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#12121a",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 18,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 18,
  },
  text: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
    marginTop: 10,
  },
  row: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  label: {
    color: "rgba(255,255,255,0.52)",
    fontSize: 13,
    marginBottom: 4,
  },
  value: {
    color: "#fff",
    fontSize: 15,
  },
  buttonGhost: {
    marginTop: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonGhostText: {
    color: "#fff",
    fontWeight: "600",
  },
});
