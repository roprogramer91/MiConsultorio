import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";

import { ScreenHeader } from "../../../components/screen-header";
import { API_URL } from "../../../constants/api";
import { COLORS } from "../../../constants/colors";
import { styles } from "../../../src/screens/appointments-calendar/styles";

type Appointment = {
  id: number;
  patientId: number;
  date: string;
  time: string;
  status: string;
  depositPaid?: boolean;
  notes?: string | null;
  patient?: {
    id: number;
    name: string;
  };
};

const FILTERS = [
  { key: "pendiente", label: "Programados" },
  { key: "pending-review", label: "Pend. cierre" },
  { key: "atendido", label: "Atendidos" },
  { key: "ausente", label: "Ausentes" },
  { key: "cancelado", label: "Cancelados" },
  { key: "all", label: "Todos" },
] as const;

function getStartOfWeek(baseDate: Date) {
  const date = new Date(baseDate);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatIsoDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function getAppointmentTimestamp(item: Appointment) {
  return new Date(`${item.date}T${item.time || "00:00"}:00`).getTime();
}

function isPendingReview(item: Appointment) {
  return item.status?.toLowerCase() === "pendiente" && getAppointmentTimestamp(item) < Date.now();
}

function getStatusLabel(item: Appointment) {
  const status = item.status?.toLowerCase();

  if (isPendingReview(item)) return "Pendiente de cierre";
  if (status === "atendido") return "Atendido";
  if (status === "ausente") return "Ausente";
  if (status === "cancelado") return "Cancelado";
  return "Programado";
}

function getStatusStyles(item: Appointment) {
  const status = item.status?.toLowerCase();

  if (isPendingReview(item)) {
    return {
      badge: styles.badgePendienteCierre,
      text: styles.badgePendienteCierreText,
    };
  }

  if (status === "atendido") {
    return {
      badge: styles.badgeAtendido,
      text: styles.badgeAtendidoText,
    };
  }

  if (status === "ausente") {
    return {
      badge: styles.badgeAusente,
      text: styles.badgeAusenteText,
    };
  }

  if (status === "cancelado") {
    return {
      badge: styles.badgeCancelado,
      text: styles.badgeCanceladoText,
    };
  }

  return {
    badge: styles.badgeProgramado,
    text: styles.badgeProgramadoText,
  };
}

export default function WeeklyCalendarScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<(typeof FILTERS)[number]["key"]>("pendiente");

  const weekStart = useMemo(() => {
    const today = new Date();
    const shifted = new Date(today);
    shifted.setDate(today.getDate() + weekOffset * 7);
    return getStartOfWeek(shifted);
  }, [weekOffset]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      return date;
    });
  }, [weekStart]);

  const from = formatIsoDate(weekDays[0]);
  const to = formatIsoDate(weekDays[6]);

  useFocusEffect(
    useCallback(() => {
      async function loadWeekAppointments() {
        try {
          setLoading(true);
          const response = await fetch(`${API_URL}/appointments/calendar/range?from=${from}&to=${to}`);
          const data = await response.json();
          setAppointments(Array.isArray(data) ? data : []);
        } catch (error) {
          console.log("Error cargando calendario semanal:", error);
          setAppointments([]);
        } finally {
          setLoading(false);
        }
      }

      loadWeekAppointments();
    }, [from, to])
  );

  const groupedDays = useMemo(() => {
    return weekDays.map((date) => {
      const iso = formatIsoDate(date);

      const dayAppointments = appointments
        .filter((item) => item.date === iso)
        .filter((item) => {
          if (selectedFilter === "all") return true;
          if (selectedFilter === "pending-review") return isPendingReview(item);
          if (selectedFilter === "pendiente") return item.status?.toLowerCase() === "pendiente" && !isPendingReview(item);
          return item.status?.toLowerCase() === selectedFilter;
        })
        .sort((a, b) => getAppointmentTimestamp(a) - getAppointmentTimestamp(b));

      return {
        iso,
        date,
        appointments: dayAppointments,
      };
    });
  }, [appointments, selectedFilter, weekDays]);

  const weekTitle = `${weekDays[0].toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  })} - ${weekDays[6].toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  })}`;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando calendario...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ScreenHeader title="Calendario" />

        <View style={styles.weekControls}>
          <TouchableOpacity style={styles.navButton} activeOpacity={0.85} onPress={() => setWeekOffset((current) => current - 1)}>
            <Ionicons name="chevron-back" size={22} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.weekTitleWrap}>
            <Text style={styles.weekEyebrow}>Semana visible</Text>
            <Text style={styles.weekTitle}>{weekTitle}</Text>
          </View>

          <TouchableOpacity style={styles.todayButton} activeOpacity={0.85} onPress={() => setWeekOffset(0)}>
            <Text style={styles.todayButtonText}>Hoy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} activeOpacity={0.85} onPress={() => setWeekOffset((current) => current + 1)}>
            <Ionicons name="chevron-forward" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
          {FILTERS.map((filter) => {
            const isActive = selectedFilter === filter.key;

            return (
              <TouchableOpacity
                key={filter.key}
                style={[styles.filterChip, isActive ? styles.filterChipActive : null]}
                activeOpacity={0.85}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Text style={[styles.filterChipText, isActive ? styles.filterChipTextActive : null]}>{filter.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {groupedDays.map((day) => (
          <View key={day.iso} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <View>
                <Text style={styles.dayTitle}>
                  {day.date.toLocaleDateString("es-AR", { weekday: "long" })}
                </Text>
                <Text style={styles.daySubtitle}>
                  {day.date.toLocaleDateString("es-AR", { day: "numeric", month: "long" })}
                </Text>
              </View>

              <View style={styles.dayCountBadge}>
                <Text style={styles.dayCountText}>{day.appointments.length} turnos</Text>
              </View>
            </View>

            {day.appointments.length === 0 ? (
              <View style={styles.emptyDay}>
                <Text style={styles.emptyDayText}>No hay turnos para este filtro</Text>
              </View>
            ) : (
              day.appointments.map((appointment) => {
                const statusStyles = getStatusStyles(appointment);

                return (
                  <TouchableOpacity
                    key={appointment.id}
                    style={styles.appointmentItem}
                    activeOpacity={0.9}
                    onPress={() => router.push(`/appointments/${appointment.id}` as any)}
                  >
                    <View style={styles.appointmentTopRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.appointmentTime}>{appointment.time}</Text>
                        <Text style={styles.appointmentPatient}>{appointment.patient?.name || "Paciente sin nombre"}</Text>
                      </View>

                      <View style={styles.badgesColumn}>
                        <View style={[styles.badge, appointment.depositPaid ? styles.badgeDepositPaid : styles.badgeDepositPending]}>
                          <Text style={[styles.badgeText, styles.badgeDepositText]}>
                            {appointment.depositPaid ? "Seña paga" : "Sin seña"}
                          </Text>
                        </View>

                        <View style={[styles.badge, statusStyles.badge]}>
                          <Text style={[styles.badgeText, statusStyles.text]}>{getStatusLabel(appointment)}</Text>
                        </View>
                      </View>
                    </View>

                    <Text style={styles.appointmentReason} numberOfLines={2} ellipsizeMode="tail">
                      {appointment.notes || "Sin detalle"}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
