import { Alert, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { API_URL } from "../../../constants/api";
import { ScreenHeader } from "../../../components/screen-header";
import { PRIMARY, styles } from "../../../src/screens/patient-detail/styles";

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

  function formatHistoryDate(date?: string) {
    if (!date) return "-";

    const parsed = new Date(`${date}T00:00:00`);
    if (isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatStatus(status?: string) {
    if (!status) return "Programado";

    const normalized = status.toLowerCase();

    if (normalized === "atendido") return "Atendido";
    if (normalized === "ausente") return "Ausente";
    if (normalized === "cancelado") return "Cancelado";
    if (normalized === "pendiente") return "Programado";

    return "Programado";
  }

  function getHistoryStatusStyle(status?: string) {
    const normalized = status?.toLowerCase();

    if (normalized === "atendido") {
      return {
        badge: styles.statusBadge,
        text: styles.statusText,
      };
    }

    if (normalized === "ausente") {
      return {
        badge: [styles.statusBadge, styles.statusBadgeDanger],
        text: [styles.statusText, styles.statusTextDanger],
      };
    }

    if (normalized === "cancelado") {
      return {
        badge: [styles.statusBadge, styles.statusBadgeMuted],
        text: [styles.statusText, styles.statusTextMuted],
      };
    }

    return {
      badge: [styles.statusBadge, styles.statusBadgeWarning],
      text: [styles.statusText, styles.statusTextWarning],
    };
  }

  function handleDeletePatient() {
    Alert.alert(
      "Eliminar paciente",
      `Se eliminara ${patient?.name || "este paciente"} y todos sus turnos asociados. Esta accion no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/patients/${id}`, {
                method: "DELETE",
              });
              const raw = await response.text();
              const data = raw ? JSON.parse(raw) : {};

              if (!response.ok) {
                Alert.alert("Error", data.error || "No se pudo eliminar el paciente");
                return;
              }

              Alert.alert("Paciente eliminado", "El paciente y sus turnos asociados se eliminaron correctamente", [
                {
                  text: "OK",
                  onPress: () => router.replace("/patients" as any),
                },
              ]);
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el paciente. Revisa el backend y vuelve a intentar.");
            }
          },
        },
      ]
    );
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
    historyCount: `${appointments.length} ${appointments.length === 1 ? "visita" : "visitas"}`,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.topBar}>
          <ScreenHeader title="Ficha del Paciente" />
        </View>

        <View style={styles.headerDivider} />

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

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/patients/edit/${id}` as any)}
          >
            <Ionicons name="pencil-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Editar datos</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sheet}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>DATOS PERSONALES</Text>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={26} color={PRIMARY} />
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>TELEFONO</Text>
              <Text style={styles.infoValue}>{patientView.phone}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={26} color={PRIMARY} />
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>EMAIL</Text>
              <Text style={styles.infoValue}>{patientView.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="gift-outline" size={26} color={PRIMARY} />
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
              (() => {
                const statusStyles = getHistoryStatusStyle(item.status);

                return (
                  <View key={item.id} style={styles.historyItem}>
                    <View style={styles.historyTopRow}>
                      <View style={styles.historyMetaRow}>
                        <View style={styles.historyDot} />
                        <Ionicons name="calendar-outline" size={18} color="#9a9a9a" />
                        <Text style={styles.historyMetaText}>{formatHistoryDate(item.date)}</Text>
                        <Ionicons name="time-outline" size={18} color="#9a9a9a" />
                        <Text style={styles.historyMetaText}>{item.time || "-"} hs</Text>
                      </View>

                      <View style={statusStyles.badge}>
                        <Text style={statusStyles.text}>{formatStatus(item.status)}</Text>
                      </View>
                    </View>

                    <View style={styles.historyContent}>
                      <Text style={styles.historyTitle}>{item.notes || "Sin detalle"}</Text>
                    </View>

                    <View style={styles.historyDivider} />
                  </View>
                );
              })()
            ))
          )}
        </View>

        <View style={styles.dangerCard}>
          <Text style={styles.dangerTitle}>ZONA DE PELIGRO</Text>
          <Text style={styles.dangerText}>
            Si eliminas este paciente, tambien se borraran todos los turnos asociados.
          </Text>

          <TouchableOpacity
            style={styles.dangerButton}
            activeOpacity={0.85}
            onPress={handleDeletePatient}
          >
            <Text style={styles.dangerButtonText}>Eliminar paciente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
