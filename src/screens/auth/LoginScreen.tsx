import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import {
  useGoogleRequest,
  signInWithGoogleIdToken,
} from "../../services/auth.service";

export default function LoginScreen() {
  const { request, response, promptAsync } = useGoogleRequest();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function resolveGoogleResponse() {
      if (response?.type !== "success") return;

      const idToken = response.authentication?.idToken;
      if (!idToken) {
        setError("No se pudo obtener el token de Google.");
        return;
      }

      try {
        setSubmitting(true);
        setError("");
        await signInWithGoogleIdToken(idToken);
      } catch (err) {
        console.error(err);
        setError("No se pudo iniciar sesión con Google.");
      } finally {
        setSubmitting(false);
      }
    }

    resolveGoogleResponse();
  }, [response]);

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Acceso</Text>
        <Text style={styles.title}>Encuentro con Jesús</Text>
        <Text style={styles.text}>
          Inicia sesión para gestionar tu perfil e inscripciones.
        </Text>

        <Pressable
          style={[
            styles.button,
            (!request || submitting) && styles.buttonDisabled,
          ]}
          onPress={() => promptAsync()}
          disabled={!request || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#111" />
          ) : (
            <Text style={styles.buttonText}>Entrar con Google</Text>
          )}
        </Pressable>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0b0b0f",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#12121a",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 24,
  },
  eyebrow: {
    color: "#d4af37",
    fontSize: 13,
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  text: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#d4af37",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 18,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: "#111",
    fontSize: 15,
    fontWeight: "700",
  },
  error: {
    color: "#ff9c9c",
    marginTop: 14,
    fontSize: 14,
  },
});
