import { ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  title: string;
  imageUrl?: string;
  children: ReactNode;
};

export default function LegalScreenLayout({
  title,
  imageUrl,
  children,
}: Props) {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <ImageBackground
            source={imageUrl ? { uri: imageUrl } : undefined}
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
              <Text style={styles.heroTitle}>{title}</Text>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>{children}</View>
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
  hero: {
    width: "100%",
    height: 220,
    overflow: "hidden",
    backgroundColor: "#161621",
  },
  heroImage: {
    width: "100%",
    height: "100%",
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
    fontSize: 24,
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
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 18,
  },
});
