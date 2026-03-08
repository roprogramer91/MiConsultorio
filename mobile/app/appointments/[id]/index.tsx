import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { API_URL } from "../../../constants/api";
import { ScreenHeader } from "../../../components/screen-header";
import { styles } from "../../../src/screens/appointment-detail/styles";

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
    dni?: string | null;
  };
};

const STATUS_OPTIONS = [
  { key: "pendiente", label: "Programado", icon: "time-outline" },
  { key: "atendido", label: "Atendido", icon: "checkmark-circle-outline" },
  { key: "ausente", label: "Ausente", icon: "person-outline" },
  { key: "cancelado", label: "Cancelar", icon: "close-circle-outline" },
];

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadAppointment() {
      try {
        const response = await fetch(`${API_URL}/appointments/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No se pudo cargar el turno");
        }

        setAppointment(data || null);
      } catch (error) {
        console.log("Error cargando turno:", error);
        setAppointment(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadAppointment();
    }
  }, [id]);

  const appointmentView = useMemo(() => {
    if (!appointment) return null;

    const date = new Date(`${appointment.date}T00:00:00`);
    const formattedDate = isNaN(date.getTime())
      ? appointment.date
      : date.toLocaleDateString("es-AR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });

    const initials = (appointment.patient?.name || "Paciente")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

    return {
      id: appointment.id,
      patientId: appointment.patientId,
      patientName: appointment.patient?.name || "Paciente sin nombre",
      patientDni: appointment.patient?.dni || "-",
      initials,
      formattedDate:
        typeof formattedDate === "string"
          ? formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
          : "-",
      time: `${appointment.time} hrs`,
      status: appointment.status || "pendiente",
      reason: appointment.notes || "Sin detalle",
    };
  }, [appointment]);

  function getStatusChipStyle(status?: string) {
    const normalized = status?.toLowerCase();

    if (normalized === "atendido") {
      return {
        badge: [styles.statusChip, styles.statusChipSuccess],
        text: styles.statusChipTextSuccess,
      };
    }

    if (normalized === "cancelado") {
      return {
        badge: [styles.statusChip, styles.statusChipDanger],
        text: styles.statusChipTextMuted,
      };
    }

    if (normalized === "ausente") {
      return {
        badge: [styles.statusChip, styles.statusChipWarning],
        text: styles.statusChipTextDanger,
      };
    }

    return {
      badge: [styles.statusChip, styles.statusChipInfo],
      text: styles.statusChipTextInfo,
    };
  }

  function getStatusCardStyle(status: string) {
    if (status === "atendido") {
      return {
        card: [styles.statusActionCard, styles.statusActionCardSuccess],
        text: styles.statusActionTextSuccess,
        iconColor: "#2f8c3c",
      };
    }

    if (status === "cancelado") {
      return {
        card: [styles.statusActionCard, styles.statusActionCardDanger],
        text: styles.statusActionTextMuted,
        iconColor: "#444444",
      };
    }

    if (status === "ausente") {
      return {
        card: [styles.statusActionCard, styles.statusActionCardDanger],
        text: styles.statusActionTextDanger,
        iconColor: "#d32f2f",
      };
    }

    return {
      card: [styles.statusActionCard, styles.statusActionCardInfo],
      text: styles.statusActionTextInfo,
      iconColor: "#2f7ed8",
    };
  }

  async function handleUpdateStatus(status: string) {
    if (!appointmentView || updatingStatus) {
      return;
    }

    try {
      setUpdatingStatus(status);

      const response = await fetch(`${API_URL}/appointments/${appointmentView.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo actualizar el estado");
      }

      setAppointment((current) => (current ? { ...current, status: data.status } : current));
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado del turno");
    } finally {
      setUpdatingStatus(null);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando turno...</Text>
      </View>
    );
  }

  if (!appointmentView) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No se encontró el turno</Text>
      </View>
    );
  }

  const statusChipStyles = getStatusChipStyle(appointmentView.status);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <ScreenHeader title="Detalle del Turno" />

          <TouchableOpacity
            style={styles.editFab}
            activeOpacity={0.85}
            onPress={() => router.push(`/appointments/edit/${appointmentView.id}` as any)}
          >
            <Ionicons name="pencil" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.patientCard}>
          <View style={styles.patientAvatar}>
            <Text style={styles.patientAvatarText}>{appointmentView.initials}</Text>
          </View>

          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{appointmentView.patientName}</Text>
            <Text style={styles.patientDni}>DNI: {appointmentView.patientDni}</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push(`/patients/${appointmentView.patientId}` as any)}
            >
              <Text style={styles.patientLink}>Ver ficha completa</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <Text style={styles.summaryDate}>{appointmentView.formattedDate}</Text>
            <View style={statusChipStyles.badge}>
              <Text style={statusChipStyles.text}>{appointmentView.status.charAt(0).toUpperCase() + appointmentView.status.slice(1)}</Text>
            </View>
          </View>

          <Text style={styles.summaryTime}>{appointmentView.time}</Text>

          <View style={styles.summaryDivider} />

          <Text style={styles.summaryLabel}>Motivo de la consulta</Text>
          <Text style={styles.summaryReason}>{appointmentView.reason}</Text>
        </View>

        <View style={styles.statusSectionHeader}>
          <Text style={styles.statusSectionTitle}>Actualizar estado</Text>
        </View>

        <View style={styles.statusGrid}>
          {STATUS_OPTIONS.map((option) => {
            const statusActionStyles = getStatusCardStyle(option.key);
            const isActive = appointmentView.status.toLowerCase() === option.key;

            return (
              <TouchableOpacity
                key={option.key}
                style={[statusActionStyles.card, isActive ? styles.statusActionCardActive : null]}
                activeOpacity={0.85}
                onPress={() => handleUpdateStatus(option.key)}
              >
                <Ionicons name={option.icon as any} size={20} color={statusActionStyles.iconColor} />
                <Text style={[styles.statusActionText, statusActionStyles.text]}>
                  {updatingStatus === option.key ? "Guardando..." : option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
