import { StyleSheet, Text, View } from "react-native";
import LegalScreenLayout from "./LegalScreenLayout";

export default function TermsScreen() {
  return (
    <LegalScreenLayout title="Términos y condiciones">
      <Text style={styles.lead}>
        El uso de esta aplicación implica la aceptación de estos términos.
      </Text>

      <Section
        title="1. Objeto"
        text={`La app ofrece información sobre la iglesia, eventos, jornadas de oración, sermones y otros contenidos relacionados con la comunidad.`}
      />

      <Section
        title="2. Uso permitido"
        text={`El usuario se compromete a utilizar la app de forma lícita, respetuosa y conforme a su finalidad. No está permitido un uso que afecte la seguridad, estabilidad o disponibilidad del servicio.`}
      />

      <Section
        title="3. Contenido"
        text={`La iglesia procura mantener la información actualizada, pero no garantiza que todos los contenidos estén permanentemente completos, exactos o disponibles.`}
      />

      <Section
        title="4. Inscripciones y formularios"
        text={`Cuando la app permita registros o reservas, el usuario deberá facilitar información veraz. La iglesia podrá modificar, cancelar o reorganizar actividades cuando sea necesario.`}
      />

      <Section
        title="5. Propiedad intelectual"
        text={`Los textos, imágenes, audios, sermones, diseños y demás contenidos de la app pertenecen a la iglesia o a sus respectivos titulares, salvo indicación distinta.`}
      />

      <Section
        title="6. Disponibilidad"
        text={`La app puede sufrir interrupciones, actualizaciones o cambios sin previo aviso.`}
      />

      <Section
        title="7. Responsabilidad"
        text={`La iglesia no asume responsabilidad por daños derivados de interrupciones técnicas, errores de terceros o usos indebidos de la aplicación, salvo en los casos exigidos por la ley.`}
      />

      <Section
        title="8. Modificaciones"
        text={`Estos términos pueden actualizarse en cualquier momento. La versión vigente será la publicada en la app y en la web oficial.`}
      />
    </LegalScreenLayout>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lead: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 20,
  },
  section: {
    marginTop: 18,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
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
});
