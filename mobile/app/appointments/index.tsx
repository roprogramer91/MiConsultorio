import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { API_URL } from "../../constants/api";

type Patient = {
  id: number;
  name: string;
};

type Appointment = {
  id: number;
  patientId: number;
  date: string;
  time: string;
  status: string;
  notes?: string | null;
  patient?: {
    id: number;
    name: string;
  };
};

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPatientFilter, setShowPatientFilter] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | "all">("all");

  useEffect(() => {
    async function loadData() {
      try {
        const [appointmentsRes, patientsRes] = await Promise.all([
          fetch(`${API_URL}/appointments/upcoming`),
          fetch(`${API_URL}/patients`),
        ]);

        const appointmentsData = await appointmentsRes.json();
        const patientsData = await patientsRes.json();

        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
        setPatients(Array.isArray(patientsData) ? patientsData : []);
      } catch (error) {
        console.log("Error cargando turnos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredAppointments = useMemo(() => {
    if (selectedPatientId === "all") return appointments;

    return appointments.filter(
      (appointment) => appointment.patientId === selectedPatientId
    );
  }, [appointments, selectedPatientId]);

  function formatDate(dateString: string) {
    if (!dateString) return "-";

    const date = new Date(`${dateString}T00:00:00`);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("es-AR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusLabel(status?: string) {
    if (!status) return "Pendiente";

    const normalized = status.toLowerCase();

    if (normalized === "pendiente") return "Pendiente";
    if (normalized === "atendido") return "Atendido";
    if (normalized === "programado") return "Programado";
    if (normalized === "cancelado") return "Cancelado";

    return status;
  }

  function getStatusStyle(status?: string) {
    const normalized = status?.toLowerCase();

    if (normalized === "atendido") {
      return {
        badge: styles.statusBadgeSuccess,
        text: styles.statusTextSuccess,
        line: styles.leftLineSuccess,
      };
    }

    if (normalized === "cancelado") {
      return {
        badge: styles.statusBadgeDanger,
        text: styles.statusTextDanger,
        line: styles.leftLineDanger,
      };
    }

    return {
      badge: styles.statusBadgeInfo,
      text: styles.statusTextInfo,
      line: styles.leftLineInfo,
    };
  }

  const selectedPatient =
    selectedPatientId === "all"
      ? null
      : patients.find((p) => p.id === selectedPatientId);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c8102e" />
        <Text style={styles.loadingText}>Cargando turnos...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={30} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Historial de Turnos</Text>
          </View>

          <TouchableOpacity
            style={styles.filterBox}
            onPress={() => setShowPatientFilter((prev) => !prev)}
          >
            <View style={styles.filterLeft}>
              <Ionicons name="people" size={28} color="#fff" />
              <View>
                <Text style={styles.filterTitle}>
                  {selectedPatientId === "all"
                    ? "Todos los pacientes"
                    : selectedPatient?.name || "Paciente"}
                </Text>
                <Text style={styles.filterSubtitle}>
                  Toca para filtrar por paciente
                </Text>
              </View>
            </View>

            <Ionicons
              name={showPatientFilter ? "chevron-up" : "chevron-down"}
              size={28}
              color="#ffd8df"
            />
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.totalText,
            showPatientFilter ? { marginTop: 220 } : null,
          ]}
        >
          {filteredAppointments.length} REGISTROS EN TOTAL
        </Text>

        <View style={styles.list}>
          {filteredAppointments.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No hay turnos para mostrar</Text>
            </View>
          ) : (
            filteredAppointments.map((appointment) => {
              const statusStyles = getStatusStyle(appointment.status);

              return (
                <View key={appointment.id} style={styles.cardWrapper}>
                  <View style={[styles.leftLine, statusStyles.line]} />

                  <View style={styles.card}>
                    <View style={styles.cardTop}>
                      <Text style={styles.patientName}>
                        {appointment.patient?.name || "Paciente sin nombre"}
                      </Text>

                      <View style={[styles.statusBadge, statusStyles.badge]}>
                        <Text style={[styles.statusText, statusStyles.text]}>
                          {getStatusLabel(appointment.status)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <Ionicons
                          name="calendar-outline"
                          size={18}
                          color="#9a9a9a"
                        />
                        <Text style={styles.metaText}>
                          {formatDate(appointment.date)}
                        </Text>
                      </View>

                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={18} color="#9a9a9a" />
                        <Text style={styles.metaText}>{appointment.time} hs</Text>
                      </View>
                    </View>

                    <Text style={styles.reasonText}>
                      {appointment.notes || "Sin detalle"}
                    </Text>

                    <View style={styles.divider} />

                    <View style={styles.actionsRow}>
                      <TouchableOpacity style={styles.actionItem}>
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={24}
                          color="#1976d2"
                        />
                        <Text style={styles.actionBlue}>Estado</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.actionItem}>
                        <Ionicons name="create-outline" size={24} color="#f57c00" />
                        <Text style={styles.actionOrange}>Editar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.iconOnlyAction}>
                        <Ionicons name="trash-outline" size={24} color="#e53935" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {showPatientFilter && (
        <>
          <Pressable
            style={styles.backdrop}
            onPress={() => setShowPatientFilter(false)}
          />

          <View style={styles.filterDropdown}>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => {
                setShowPatientFilter(false);
                router.push("/appointments/new" as any);
              }}
            >
              <Ionicons name="add-circle-outline" size={22} color="#c8102e" />
              <Text style={styles.filterOptionText}>Nuevo turno</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => {
                setSelectedPatientId("all");
                setShowPatientFilter(false);
              }}
            >
              <Ionicons name="people-outline" size={22} color="#555" />
              <Text style={styles.filterOptionText}>Todos los pacientes</Text>
            </TouchableOpacity>

            <ScrollView nestedScrollEnabled style={{ maxHeight: 320 }}>
              {patients.map((patient) => (
                <TouchableOpacity
                  key={patient.id}
                  style={styles.filterOption}
                  onPress={() => {
                    setSelectedPatientId(patient.id);
                    setShowPatientFilter(false);
                  }}
                >
                  <Ionicons name="person-outline" size={22} color="#555" />
                  <Text style={styles.filterOptionText}>{patient.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
}

const PRIMARY = "#c8102e";
const BG = "#efefef";
const CARD = "#ffffff";
const MUTED = "#8f8f8f";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: BG,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  header: {
    backgroundColor: PRIMARY,
    paddingTop: 55,
    paddingBottom: 24,
    paddingHorizontal: 20,
    marginBottom: 18,
    position: "relative",
    zIndex: 20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 22,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  filterBox: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  filterTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  filterSubtitle: {
    color: "#ffd8df",
    fontSize: 14,
    marginTop: 2,
  },
  totalText: {
    color: MUTED,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
    marginHorizontal: 20,
    marginBottom: 18,
  },
  list: {
    paddingHorizontal: 20,
    gap: 16,
  },
  emptyCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  cardWrapper: {
    position: "relative",
  },
  leftLine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    zIndex: 2,
  },
  leftLineSuccess: {
    backgroundColor: "#2e9e44",
  },
  leftLineInfo: {
    backgroundColor: "#1976d2",
  },
  leftLineDanger: {
    backgroundColor: "#e53935",
  },
  card: {
    backgroundColor: CARD,
    borderRadius: 24,
    padding: 20,
    paddingLeft: 28,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 10,
  },
  patientName: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statusBadgeSuccess: {
    backgroundColor: "#dff0df",
  },
  statusBadgeInfo: {
    backgroundColor: "#e3eefc",
  },
  statusBadgeDanger: {
    backgroundColor: "#fde7e7",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "700",
  },
  statusTextSuccess: {
    color: "#3b8d3e",
  },
  statusTextInfo: {
    color: "#1976d2",
  },
  statusTextDanger: {
    color: "#d32f2f",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 15,
    color: "#8d8d8d",
  },
  reasonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#ececec",
    marginBottom: 14,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionBlue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1976d2",
  },
  actionOrange: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f57c00",
  },
  iconOnlyAction: {
    padding: 4,
  },

  filterDropdown: {
    position: "absolute",
    top: 140,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    zIndex: 50,
    elevation: 15,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },

    maxHeight: 420,
  },

filterOption: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  paddingVertical: 16,
  paddingHorizontal: 18,
  borderBottomWidth: 1,
  borderBottomColor: "#f0f0f0",
},

filterOptionText: {
  fontSize: 17,
  color: "#222",
  fontWeight: "500",
},

backdrop: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "transparent",
  zIndex: 40,
},
});