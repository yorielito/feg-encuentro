import { StyleSheet, Text, View } from "react-native";
import LegalScreenLayout from "./LegalScreenLayout";

export default function PrivacyScreen() {
  return (
    <LegalScreenLayout title="Política de privacidad">
      <Text style={styles.lead}>
        Esta aplicación muestra información pública de la iglesia, eventos,
        jornadas de oración y sermones. Algunos datos técnicos pueden procesarse
        para el funcionamiento correcto de la app.
      </Text>

      <Section
        title="1. Responsable"
        text={`Iglesia Encuentro con Jesús
[Nombre del responsable]
[Dirección]
[Correo electrónico]
[Teléfono]`}
      />

      <Section
        title="2. Datos que pueden procesarse"
        text={`• Datos técnicos del dispositivo y uso básico de la app.
• Datos introducidos por el usuario en formularios de inscripción a eventos o jornadas de oración.
• Datos necesarios para autenticación, si esta función se habilita en el futuro.
• Tokens de notificaciones push, si el usuario acepta recibir notificaciones.`}
      />

      <Section
        title="3. Finalidad del tratamiento"
        text={`Los datos se utilizan para:
• mostrar contenido de la app,
• gestionar inscripciones,
• enviar notificaciones relacionadas con eventos o novedades,
• mantener la seguridad y el correcto funcionamiento del servicio.`}
      />

      <Section
        title="4. Servicios de terceros"
        text={`La app puede utilizar servicios de terceros para alojamiento, base de datos, almacenamiento y notificaciones, como Firebase u otros proveedores técnicos.`}
      />

      <Section
        title="5. Conservación"
        text={`Los datos se conservarán solo durante el tiempo necesario para prestar el servicio, cumplir obligaciones legales o gestionar las actividades de la iglesia.`}
      />

      <Section
        title="6. Derechos"
        text={`El usuario puede solicitar acceso, rectificación o eliminación de sus datos, así como limitar su tratamiento, contactando a la iglesia mediante los datos de contacto indicados arriba.`}
      />

      <Section
        title="7. Cambios"
        text={`Esta política puede actualizarse para reflejar cambios técnicos, legales o funcionales de la app.`}
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
