import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

type Props = {
  onSubmit: (data: {
    name: string;
    email: string;
    phone?: string;
  }) => Promise<void>;
};

export default function RegistrationForm({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!name.trim() || !email.trim()) {
      setError("Nombre y email son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      });

      setName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      console.error(err);
      setError("No se pudo completar la inscripción.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Inscripción</Text>

      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Teléfono (opcional)"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <Pressable
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Enviando..." : "Inscribirme"}
        </Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    backgroundColor: "#12121a",
    borderRadius: 20,
    padding: 16,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#1c1c26",
    borderRadius: 12,
    padding: 12,
    color: "#fff",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#d4af37",
    padding: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  buttonText: {
    color: "#111",
    fontWeight: "700",
  },
  error: {
    color: "#ff9c9c",
    marginTop: 10,
  },
});
