// import { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { listPublishedPrayerEvents } from "../../services/prayerEvents.service";
// import type { PrayerEventItem } from "../../types/prayerEvent";
// import type { RootStackParamList } from "../../navigation/AppNavigator";

// function formatDate(dateString: string) {
//   const date = new Date(`${dateString}T00:00:00`);

//   if (Number.isNaN(date.getTime())) return dateString;

//   return new Intl.DateTimeFormat("es-DE", {
//     dateStyle: "medium",
//   }).format(date);
// }

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// export default function PrayerEventsScreen() {
//   const navigation = useNavigation<NavigationProp>();
//   const [items, setItems] = useState<PrayerEventItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function loadPrayerEvents() {
//       try {
//         const data = await listPublishedPrayerEvents();
//         setItems(data);
//       } catch (error) {
//         console.error("loadPrayerEvents error:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadPrayerEvents();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loading}>
//         <ActivityIndicator size="large" color="#d4af37" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.screen}>
//       <FlatList
//         data={items}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.content}
//         ListHeaderComponent={
//           <View style={styles.header}>
//             <Text style={styles.title}>Jornadas de oración</Text>
//             <Text style={styles.subtitle}>
//               Elige una jornada y luego selecciona un horario disponible.
//             </Text>
//           </View>
//         }
//         ListEmptyComponent={
//           <Text style={styles.empty}>No hay jornadas disponibles.</Text>
//         }
//         renderItem={({ item }) => (
//           <Pressable
//             style={styles.card}
//             onPress={() =>
//               navigation.navigate("PrayerEventDetail", {
//                 prayerEventId: item.id,
//               })
//             }
//           >
//             <Text style={styles.cardTitle}>{item.title}</Text>
//             <Text style={styles.cardMeta}>
//               Desde {formatDate(item.startDate)}
//             </Text>
//             {item.endDate ? (
//               <Text style={styles.cardMeta}>
//                 Hasta {formatDate(item.endDate)}
//               </Text>
//             ) : null}
//             <Text style={styles.cardMeta}>
//               Horario {String(item.slotStartHour).padStart(2, "0")}:00 -{" "}
//               {String(item.slotEndHour).padStart(2, "0")}:00
//             </Text>
//             <Text style={styles.cardMeta}>{item.location}</Text>
//             {item.description ? (
//               <Text style={styles.cardDescription} numberOfLines={3}>
//                 {item.description}
//               </Text>
//             ) : null}
//           </Pressable>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: "#0b0b0f",
//   },
//   loading: {
//     flex: 1,
//     backgroundColor: "#0b0b0f",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   content: {
//     padding: 20,
//     paddingBottom: 32,
//     gap: 12,
//   },
//   header: {
//     marginBottom: 16,
//   },
//   title: {
//     color: "#fff",
//     fontSize: 28,
//     fontWeight: "700",
//   },
//   subtitle: {
//     marginTop: 8,
//     color: "rgba(255,255,255,0.72)",
//     fontSize: 15,
//     lineHeight: 22,
//   },
//   card: {
//     backgroundColor: "#12121a",
//     borderRadius: 18,
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.08)",
//     padding: 16,
//     marginBottom: 12,
//   },
//   cardTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   cardMeta: {
//     color: "rgba(255,255,255,0.68)",
//     fontSize: 14,
//     marginTop: 6,
//   },
//   cardDescription: {
//     color: "rgba(255,255,255,0.82)",
//     fontSize: 14,
//     lineHeight: 21,
//     marginTop: 10,
//   },
//   empty: {
//     color: "rgba(255,255,255,0.52)",
//     fontSize: 14,
//     marginTop: 12,
//   },
// });
