import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { API_URL } from "../../constants/api";
import { router } from "expo-router";

type Patient = {
  id: number;
  name: string;
  dni?: string;
  phone?: string;
};

export default function PatientsScreen() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");

  useFocusEffect(
    useCallback(() => {
      async function loadPatients() {
        try {
          const response = await fetch(`${API_URL}/patients`);
          const data = await response.json();
          setPatients(Array.isArray(data) ? data : []);
        } catch (error) {
          console.log("Error cargando pacientes", error);
        }
      }

      loadPatients();
    }, [])
  );

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) => {
      const name = patient.name?.toLowerCase() || "";
      const dni = patient.dni?.toLowerCase() || "";

      return name.includes(query) || dni.includes(query);
    });
  }, [patients, search]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pacientes</Text>
      </View>

      <View style={styles.content}>
        <TextInput
          placeholder="Buscar paciente por nombre o DNI"
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />

        {filteredPatients.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No se encontraron pacientes</Text>
          </View>
        ) : (
          filteredPatients.map((patient) => (
            <TouchableOpacity
              key={patient.id}
              style={styles.card}
              onPress={() => router.push(`/patients/${patient.id}` as any)}
            >
              <Text style={styles.cardTitle}>{patient.name}</Text>
              <Text style={styles.cardSubtitle}>DNI: {patient.dni || "-"}</Text>
              <Text style={styles.cardSubtitle}>Teléfono: {patient.phone || "-"}</Text>
            </TouchableOpacity>
          ))
        )}
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
    paddingBottom: 28,
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "800",
  },
  content: {
    padding: 20,
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 18,
  },
  emptyCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 18,
  },
  emptyText: {
    fontSize: 15,
    color: "#666",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#777",
  },
});
