import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { API_URL } from "../../constants/api";

type PatientType = {
  id: number;
  name: string;
  dni?: string;
  phone?: string;
  email?: string;
  notes?: string;
  birthDate?: string;
};

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams();
  const [patient, setPatient] = useState<PatientType | null>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    async function loadPatient() {
      try {
        const response = await fetch(`${API_URL}/patients/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No se pudo cargar el paciente");
        }

        setPatient(data);
      } catch (error) {
        console.log("Error cargando paciente:", error);
        setPatient(null);
      } finally {
        setLoading(false);
      }
    }

    async function loadAppointments() {
  try {
    const response = await fetch(`${API_URL}/appointments/patient/${id}`);
    const data = await response.json();
    setAppointments(data);
  } catch (error) {
    console.log("Error cargando historial:", error);
  }
}

    if (id) {
      loadPatient();
      loadAppointments();
    }
  }, [id]);

  function getInitials(name: string) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  }

  function calculateAge(birthDate?: string) {
    if (!birthDate) return "-";

    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return "-";

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return `${age} años`;
  }

  function formatDate(date?: string) {
    if (!date) return "-";

    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("es-AR");
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando paciente...</Text>
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.centered}>
        <Text>No se encontró el paciente</Text>
      </View>
    );
  }

  const patientView = {
    initials: getInitials(patient.name || "Paciente"),
    name: patient.name || "Sin nombre",
    dni: patient.dni || "-",
    age: calculateAge(patient.birthDate),
    phone: patient.phone || "-",
    email: patient.email || "-",
    birthDate: formatDate(patient.birthDate),
    notes: patient.notes || "Sin observaciones",
    historyCount: "0 visitas",
    history: [] as { id: number; title: string; status: string }[],
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Ficha del Paciente</Text>
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{patientView.initials}</Text>
        </View>

        <Text style={styles.name}>{patientView.name}</Text>

        <View style={styles.badgesRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>DNI </Text>
            <Text style={styles.badgeValue}>{patientView.dni}</Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>EDAD </Text>
            <Text style={styles.badgeValue}>{patientView.age}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
            <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/appointments/new?patientId=${id}` as any)}
            >
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Nuevo Turno</Text>
            </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="pencil-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Editar datos</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sheet}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>DATOS PERSONALES</Text>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={26} color="#c8102e" />
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>TELÉFONO</Text>
              <Text style={styles.infoValue}>{patientView.phone}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={26} color="#c8102e" />
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>EMAIL</Text>
              <Text style={styles.infoValue}>{patientView.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="gift-outline" size={26} color="#c8102e" />
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>FECHA DE NACIMIENTO</Text>
              <Text style={styles.infoValue}>{patientView.birthDate}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>OBSERVACIONES</Text>

          <View style={styles.noteBox}>
            <Text style={styles.noteText}>{patientView.notes}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>HISTORIAL DE TURNOS</Text>
            <Text style={styles.historyCount}>{patientView.historyCount}</Text>
          </View>

          {appointments.length === 0 ? (
            <Text style={styles.emptyHistoryText}>Sin historial de turnos</Text>
          ) : (
            appointments.map((item) => (
                <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyDot} />

                <View style={styles.historyContent}>
                    <Text style={styles.historyTitle}>
                    {item.date} - {item.time}
                    </Text>
                </View>

                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>
            ))
            )}
        </View>
      </View>
    </ScrollView>
  );
}

const PRIMARY = "#c8102e";
const BG = "#efefef";
const CARD = "#ffffff";
const MUTED = "#8f8f8f";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY,
  },
  content: {
    paddingBottom: 30,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  hero: {
    backgroundColor: PRIMARY,
    paddingTop: 50,
    paddingHorizontal: 22,
    paddingBottom: 28,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    gap: 16,
  },
  topTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor: "rgba(255,255,255,0.18)",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarText: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "700",
  },
  name: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 18,
  },
  badgesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 22,
    flexWrap: "wrap",
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  badgeLabel: {
    color: "#ffd6dc",
    fontSize: 15,
    fontWeight: "700",
  },
  badgeValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 14,
  },
  actionButton: {
    flex: 1,
    minHeight: 58,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.28)",
    backgroundColor: "rgba(255,255,255,0.12)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  sheet: {
    backgroundColor: BG,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    padding: 20,
    minHeight: 700,
  },
  card: {
    backgroundColor: CARD,
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sectionTitle: {
    color: MUTED,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 22,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 22,
    gap: 16,
  },
  infoTextBox: {
    flex: 1,
  },
  infoLabel: {
    color: "#b0b0b0",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  infoValue: {
    color: "#111",
    fontSize: 18,
    fontWeight: "500",
  },
  noteBox: {
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY,
    backgroundColor: "#f7f7f7",
    borderRadius: 18,
    padding: 18,
  },
  noteText: {
    fontSize: 18,
    color: "#333",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  historyCount: {
    color: "#c0c0c0",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyHistoryText: {
    color: "#777",
    fontSize: 16,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  historyDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#2e9e44",
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  statusBadge: {
    backgroundColor: "#dff0df",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statusText: {
    color: "#3b8d3e",
    fontWeight: "700",
    fontSize: 16,
  },
});