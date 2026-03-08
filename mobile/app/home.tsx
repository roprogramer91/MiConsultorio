import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const cards = [
  { title: "Pacientes", subtitle: "Registrar y administrar pacientes", route: "/patients" },
  { title: "Agenda de Turnos", subtitle: "Ver y programar citas médicas", route: "/appointments" },
  { title: "Nuevo Turno", subtitle: "Agregar un turno nuevo", route: "/appointments/new" },
  { title: "Nuevo Paciente", subtitle: "Registrar un paciente", route: "/patients/new" },
];

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Consultorio</Text>
        <Text style={styles.welcome}>Bienvenida, Adri</Text>
      </View>

      <View style={styles.content}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => router.push(card.route as any)}
          >
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#efefef",
    minHeight: "100%",
  },
  header: {
    backgroundColor: "#c8102e",
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 36,
  },

title: {
  color: "white",
  fontSize: 32,
  fontWeight: "800",
  marginBottom: 6,
},

welcome: {
  color: "#ffd7df",
  fontSize: 18,
  fontWeight: "600",
},
  content: {
    padding: 20,
    marginTop: -10,
  },

  card: {
  backgroundColor: "white",
  borderRadius: 24,
  padding: 24,
  marginBottom: 18,
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 4,
},
cardTitle: {
  color: "#111",
  fontSize: 20,
  fontWeight: "800",
  marginBottom: 6,
},
cardSubtitle: {
  color: "#8a8a8a",
  fontSize: 15,
},
});