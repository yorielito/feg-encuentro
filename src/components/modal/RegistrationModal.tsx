import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    phone?: string;
  }) => Promise<void>;
};

export default function RegistrationModal({
  visible,
  onClose,
  onSubmit,
}: Props) {
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

      onClose();
    } catch (err) {
      console.error(err);

      setError("No se pudo completar la inscripción.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
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
          />

          <TextInput
            placeholder="Teléfono (opcional)"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
          />

          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {loading ? "Enviando..." : "Confirmar"}
            </Text>
          </Pressable>

          <Pressable onPress={onClose}>
            <Text style={styles.cancel}>Cancelar</Text>
          </Pressable>

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#12121a",
    borderRadius: 20,
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#1c1c26",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#d4af37",
    padding: 14,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#111",
    fontWeight: "700",
  },
  cancel: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 10,
  },
  error: {
    color: "#ff9c9c",
    marginTop: 10,
  },
});
