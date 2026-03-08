import { Alert, View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { API_URL } from "../../constants/api";
import { ScreenHeader } from "../../components/screen-header";
import { styles } from "../../src/screens/patients/styles";

type Patient = {
  id: number;
  name: string;
  dni?: string;
  phone?: string;
};

export default function PatientsScreen() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");

  async function removePatient(patientId: number) {
    try {
      const response = await fetch(`${API_URL}/patients/${patientId}`, {
        method: "DELETE",
      });
      const raw = await response.text();
      const data = raw ? JSON.parse(raw) : {};

      if (!response.ok) {
        Alert.alert("Error", data.error || "No se pudo eliminar el paciente");
        return;
      }

      setPatients((current) => current.filter((patient) => patient.id !== patientId));
      Alert.alert("Paciente eliminado", "El paciente y sus turnos asociados se eliminaron correctamente");
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el paciente. Revisa el backend y vuelve a intentar.");
    }
  }

  function handleDeletePatient(patient: Patient) {
    Alert.alert(
      "Eliminar paciente",
      `Se eliminara ${patient.name} y todos sus turnos asociados. Esta accion no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => removePatient(patient.id),
        },
      ]
    );
  }

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

  function getInitials(name?: string) {
    if (!name) return "?";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <ScreenHeader title="Pacientes" />

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={28} color="#8f8f8f" />
          <TextInput
            placeholder="Buscar por nombre o DNI..."
            placeholderTextColor="#9a9a9a"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView style={styles.listScreen} contentContainerStyle={styles.container}>
        <Text style={styles.counterText}>
          {filteredPatients.length} PACIENTES ENCONTRADOS
        </Text>

        {filteredPatients.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No se encontraron pacientes</Text>
          </View>
        ) : (
          filteredPatients.map((patient) => (
            <TouchableOpacity
              key={patient.id}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => router.push(`/patients/${patient.id}` as any)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(patient.name)}</Text>
              </View>

              <View style={styles.infoBlock}>
                <Text style={styles.cardTitle}>{patient.name}</Text>
                <Text style={styles.cardMeta}>DNI: {patient.dni || "-"}</Text>

                <View style={styles.phoneRow}>
                  <Ionicons name="call" size={18} color="#5f5f5f" />
                  <Text style={styles.phoneText}>{patient.phone || "-"}</Text>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.editButton}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/patients/edit/${patient.id}` as any)}
                >
                  <Ionicons name="pencil" size={24} color="#5a5a5a" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  activeOpacity={0.8}
                  onPress={() => handleDeletePatient(patient)}
                >
                  <Ionicons name="trash-outline" size={24} color="#d83030" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => router.push("/patients/new" as any)}
      >
        <Ionicons name="add" size={34} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
