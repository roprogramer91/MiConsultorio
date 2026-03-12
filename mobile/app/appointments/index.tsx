import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Pressable,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { API_URL } from "../../constants/api";
import { ScreenHeader } from "../../components/screen-header";
import { COLORS } from "../../constants/colors";
import { styles } from "../../src/screens/appointments/styles";

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

type Patient = {
  id: number;
  name: string;
};

const HISTORY_FILTERS = [
  { key: "all", label: "Todos" },
  { key: "atendido", label: "Atendidos" },
  { key: "ausente", label: "Ausentes" },
  { key: "cancelado", label: "Cancelados" },
] as const;

function getAppointmentTimestamp(date?: string, time?: string) {
  return new Date(`${date}T${time || "00:00"}:00`).getTime();
}

function isPendingReviewAppointment(appointment: Appointment) {
  const normalizedStatus = appointment.status?.toLowerCase();
  const appointmentTimestamp = getAppointmentTimestamp(appointment.date, appointment.time);

  return (
    normalizedStatus === "pendiente" &&
    !Number.isNaN(appointmentTimestamp) &&
    appointmentTimestamp < Date.now()
  );
}

function isUpcomingPendingAppointment(appointment: Appointment) {
  const normalizedStatus = appointment.status?.toLowerCase();
  const appointmentTimestamp = getAppointmentTimestamp(appointment.date, appointment.time);

  return (
    normalizedStatus === "pendiente" &&
    !Number.isNaN(appointmentTimestamp) &&
    appointmentTimestamp >= Date.now()
  );
}

function isClosedAppointment(appointment: Appointment) {
  const normalizedStatus = appointment.status?.toLowerCase();

  return normalizedStatus === "atendido" || normalizedStatus === "ausente" || normalizedStatus === "cancelado";
}

export default function AppointmentsScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<(typeof HISTORY_FILTERS)[number]["key"]>("all");

  const isHistoryMode = mode === "history";

  async function removeAppointment(appointmentId: number) {
    try {
      const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
        method: "DELETE",
      });
      const raw = await response.text();
      const data = raw ? JSON.parse(raw) : {};

      if (!response.ok) {
        Alert.alert("Error", data.error || "No se pudo eliminar el turno");
        return;
      }

      setAppointments((current) => current.filter((appointment) => appointment.id !== appointmentId));
      Alert.alert("Turno eliminado", "El turno se eliminó correctamente");
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el turno. Revisa el backend y vuelve a intentar.");
    }
  }

  function handleDeleteAppointment(appointment: Appointment) {
    Alert.alert(
      "Eliminar turno",
      `Se eliminara el turno de ${appointment.patient?.name || "este paciente"}. Esta accion no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => removeAppointment(appointment.id),
        },
      ]
    );
  }

  useFocusEffect(
    useCallback(() => {
      async function loadAppointments() {
        try {
          const patientsResponse = await fetch(`${API_URL}/patients`);
          const patientsData = await patientsResponse.json();
          const safePatients = Array.isArray(patientsData) ? patientsData : [];

          setPatients(safePatients);

          if (!isHistoryMode) {
            const appointmentsResponse = await fetch(`${API_URL}/appointments/upcoming`);
            const appointmentsData = await appointmentsResponse.json();
            const safeAppointments = Array.isArray(appointmentsData) ? appointmentsData : [];

            setAppointments(safeAppointments);

            return;
          }

          const historyResponse = await fetch(`${API_URL}/appointments/history`);
          const historyData = await historyResponse.json();

          setAppointments(Array.isArray(historyData) ? historyData : []);
        } catch (error) {
          console.log("Error cargando turnos:", error);
        } finally {
          setLoading(false);
        }
      }

      setLoading(true);
      loadAppointments();
    }, [isHistoryMode])
  );

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return appointments
      .filter((appointment) => {
        const normalizedStatus = appointment.status?.toLowerCase();

        if (isHistoryMode) {
          if (!isClosedAppointment(appointment)) {
            return false;
          }

          return historyFilter === "all" ? true : normalizedStatus === historyFilter;
        }

        return isUpcomingPendingAppointment(appointment) || isPendingReviewAppointment(appointment);
      })
      .filter((appointment) => {
        if (!query) {
          return true;
        }

        const patientName = appointment.patient?.name?.toLowerCase() || "";
        const reason = appointment.notes?.toLowerCase() || "";

        return patientName.includes(query) || reason.includes(query);
      })
      .sort((a, b) => {
        const aDate = new Date(`${a.date}T${a.time || "00:00"}:00`).getTime();
        const bDate = new Date(`${b.date}T${b.time || "00:00"}:00`).getTime();

        return isHistoryMode ? bDate - aDate : aDate - bDate;
      });
  }, [appointments, historyFilter, isHistoryMode, search]);

  const patientSuggestions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) => patient.name.toLowerCase().includes(query));
  }, [patients, search]);

  function formatDateLabel(dateString: string) {
    if (!dateString) return "-";

    const date = new Date(`${dateString}T00:00:00`);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("es-AR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  }

  function formatTime(time?: string) {
    if (!time) return "-";
    return time;
  }

  function getStatusLabel(status?: string) {
    if (!status) return "Programado";

    const normalized = status.toLowerCase();

    if (normalized === "atendido") return "Atendido";
    if (normalized === "pendiente") return "Programado";
    if (normalized === "ausente") return "Ausente";
    if (normalized === "cancelado") return "Cancelado";

    return "Programado";
  }

  function getVisualStatusLabel(appointment: Appointment) {
    if (isPendingReviewAppointment(appointment)) {
      return "Pendiente de cierre";
    }

    return getStatusLabel(appointment.status);
  }

  function getStatusStyle(status?: string) {
    const normalized = status?.toLowerCase();

    if (normalized === "atendido") {
      return {
        badge: styles.statusBadgeSuccess,
        text: styles.statusTextSuccess,
        dateBox: styles.dateColumnSuccess,
        timeText: styles.timeTextSuccess,
        dateText: styles.dateTextSuccess,
      };
    }

    if (normalized === "cancelado") {
      return {
        badge: styles.statusBadgeDanger,
        text: styles.statusTextMuted,
        dateBox: styles.dateColumnDanger,
        timeText: styles.timeTextMuted,
        dateText: styles.dateTextMuted,
      };
    }

    if (normalized === "ausente") {
      return {
        badge: styles.statusBadgeDanger,
        text: styles.statusTextDanger,
        dateBox: styles.dateColumnDanger,
        timeText: styles.timeTextDanger,
        dateText: styles.dateTextDanger,
      };
    }

    return {
      badge: styles.statusBadgeWarning,
      text: styles.statusTextWarning,
      dateBox: styles.dateColumnWarning,
      timeText: styles.timeTextWarning,
      dateText: styles.dateTextWarning,
    };
  }

  function getVisualStatusStyle(appointment: Appointment) {
    if (isPendingReviewAppointment(appointment)) {
      return {
        badge: styles.statusBadgeDanger,
        text: styles.statusTextDanger,
        dateBox: styles.dateColumnDanger,
        timeText: styles.timeTextDanger,
        dateText: styles.dateTextDanger,
      };
    }

    return getStatusStyle(appointment.status);
  }

  function getDepositStyles(appointment: Appointment) {
    if (appointment.depositPaid) {
      return {
        badge: styles.depositBadgePaid,
        text: styles.depositBadgeTextPaid,
        label: "Seña paga",
      };
    }

    return {
      badge: styles.depositBadgePending,
      text: styles.depositBadgeTextPending,
      label: "Sin seña",
    };
  }

  const headerTitle = isHistoryMode ? "Historial" : "Agenda de Turnos";
  const searchPlaceholder = isHistoryMode
    ? "Buscar en historial por paciente o motivo..."
    : "Buscar turnos programados...";
  const counterLabel = isHistoryMode ? "REGISTROS ENCONTRADOS" : "TURNOS PROGRAMADOS";
  const emptyText = isHistoryMode
    ? "No hay turnos en el historial para mostrar"
    : "No hay turnos programados para mostrar";
  const loadingText = isHistoryMode ? "Cargando historial..." : "Cargando agenda...";
  const upcomingAgendaAppointments = isHistoryMode
    ? []
    : filteredAppointments.filter((appointment) => isUpcomingPendingAppointment(appointment));
  const pendingReviewAppointments = isHistoryMode
    ? []
    : filteredAppointments.filter((appointment) => isPendingReviewAppointment(appointment));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>{loadingText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {showSuggestions ? (
        <Pressable
          style={styles.backdrop}
          onPress={() => {
            setShowSuggestions(false);
            Keyboard.dismiss();
          }}
        />
      ) : null}

      <View style={styles.header}>
        <ScreenHeader title={headerTitle} />

        <TouchableOpacity
          style={styles.searchBox}
          activeOpacity={1}
          onPress={() => setShowSuggestions(true)}
        >
          <Ionicons name="search-outline" size={28} color="#8f8f8f" />
          <TextInput
            placeholder={searchPlaceholder}
            placeholderTextColor="#9a9a9a"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            onFocus={() => setShowSuggestions(true)}
          />
        </TouchableOpacity>

        {isHistoryMode ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersRow}
          >
            {HISTORY_FILTERS.map((filter) => {
              const isActive = historyFilter === filter.key;

              return (
                <TouchableOpacity
                  key={filter.key}
                  style={[styles.filterChip, isActive ? styles.filterChipActive : null]}
                  activeOpacity={0.85}
                  onPress={() => setHistoryFilter(filter.key)}
                >
                  <Text
                    style={[styles.filterChipText, isActive ? styles.filterChipTextActive : null]}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : null}

        {showSuggestions && patientSuggestions.length > 0 ? (
          <View style={styles.suggestionsBox}>
            <ScrollView nestedScrollEnabled style={styles.suggestionsScroll}>
              {patientSuggestions.map((patient) => (
                <TouchableOpacity
                  key={patient.id}
                  style={styles.suggestionItem}
                  activeOpacity={0.85}
                  onPress={() => {
                    setSearch(patient.name);
                    setShowSuggestions(false);
                    Keyboard.dismiss();
                  }}
                >
                  <Ionicons name="person-outline" size={18} color="#777" />
                  <Text style={styles.suggestionText}>{patient.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </View>

      <ScrollView style={styles.listScreen} contentContainerStyle={styles.content}>
        <Text style={styles.counterText}>{filteredAppointments.length} {counterLabel}</Text>

        {isHistoryMode ? (
          filteredAppointments.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>{emptyText}</Text>
            </View>
          ) : (
            filteredAppointments.map((appointment) => {
              const statusStyles = getVisualStatusStyle(appointment);
              const depositStyles = getDepositStyles(appointment);

              return (
                <TouchableOpacity
                  key={appointment.id}
                  style={styles.card}
                  activeOpacity={0.92}
                  onPress={() => router.push(`/appointments/${appointment.id}` as any)}
                >
                  <View style={[styles.dateColumn, statusStyles.dateBox]}>
                    <Text style={[styles.timeText, statusStyles.timeText]}>{formatTime(appointment.time)}</Text>
                    <Text style={[styles.dateText, statusStyles.dateText]}>{formatDateLabel(appointment.date)}</Text>
                  </View>

                  <View style={styles.cardDivider} />

                  <View style={styles.cardContent}>
                    <View style={styles.cardTopRow}>
                      <View style={styles.titleBlock}>
                        <Text style={styles.patientName} numberOfLines={2} ellipsizeMode="tail">
                          {appointment.patient?.name || "Paciente sin nombre"}
                        </Text>
                        <Text style={styles.reasonText} numberOfLines={2} ellipsizeMode="tail">
                          {appointment.notes || "Sin detalle"}
                        </Text>
                      </View>

                      <View style={styles.badgesColumn}>
                        <View style={[styles.depositBadge, depositStyles.badge]}>
                          <Text style={[styles.depositBadgeText, depositStyles.text]}>
                            {depositStyles.label}
                          </Text>
                        </View>

                        <View style={[styles.statusBadge, statusStyles.badge]}>
                          <Text style={[styles.statusBadgeText, statusStyles.text]}>
                            {getVisualStatusLabel(appointment)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.innerDivider} />

                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        style={styles.actionItem}
                        activeOpacity={0.85}
                        onPress={() => router.push(`/appointments/${appointment.id}` as any)}
                      >
                        <Ionicons name="checkmark-circle-outline" size={24} color="#d2a106" />
                        <Text style={styles.actionStatus}>Estado</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionItem}
                        activeOpacity={0.85}
                        onPress={() => router.push(`/appointments/edit/${appointment.id}` as any)}
                      >
                        <Ionicons name="create-outline" size={24} color={COLORS.primary} />
                        <Text style={styles.actionEdit}>Editar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.iconOnlyAction}
                        activeOpacity={0.85}
                        onPress={() => handleDeleteAppointment(appointment)}
                      >
                        <Ionicons name="trash-outline" size={24} color="#df2f2f" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )
        ) : (
          <>
            <Text style={styles.sectionCounterTitle}>PROGRAMADOS</Text>
            {upcomingAgendaAppointments.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No hay turnos programados para mostrar</Text>
              </View>
            ) : (
              upcomingAgendaAppointments.map((appointment) => {
                const statusStyles = getVisualStatusStyle(appointment);
                const depositStyles = getDepositStyles(appointment);

                return (
                  <TouchableOpacity
                    key={appointment.id}
                    style={styles.card}
                    activeOpacity={0.92}
                    onPress={() => router.push(`/appointments/${appointment.id}` as any)}
                  >
                    <View style={[styles.dateColumn, statusStyles.dateBox]}>
                      <Text style={[styles.timeText, statusStyles.timeText]}>{formatTime(appointment.time)}</Text>
                      <Text style={[styles.dateText, statusStyles.dateText]}>{formatDateLabel(appointment.date)}</Text>
                    </View>

                    <View style={styles.cardDivider} />

                    <View style={styles.cardContent}>
                      <View style={styles.cardTopRow}>
                        <View style={styles.titleBlock}>
                        <Text style={styles.patientName} numberOfLines={2} ellipsizeMode="tail">
                          {appointment.patient?.name || "Paciente sin nombre"}
                        </Text>
                        <Text style={styles.reasonText} numberOfLines={2} ellipsizeMode="tail">
                          {appointment.notes || "Sin detalle"}
                        </Text>
                        </View>

                        <View style={styles.badgesColumn}>
                          <View style={[styles.depositBadge, depositStyles.badge]}>
                            <Text style={[styles.depositBadgeText, depositStyles.text]}>
                              {depositStyles.label}
                            </Text>
                          </View>

                          <View style={[styles.statusBadge, statusStyles.badge]}>
                            <Text style={[styles.statusBadgeText, statusStyles.text]}>
                              {getVisualStatusLabel(appointment)}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.innerDivider} />

                      <View style={styles.actionsRow}>
                        <TouchableOpacity
                          style={styles.actionItem}
                          activeOpacity={0.85}
                          onPress={() => router.push(`/appointments/${appointment.id}` as any)}
                        >
                          <Ionicons name="checkmark-circle-outline" size={24} color="#d2a106" />
                          <Text style={styles.actionStatus}>Estado</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.actionItem}
                          activeOpacity={0.85}
                          onPress={() => router.push(`/appointments/edit/${appointment.id}` as any)}
                        >
                          <Ionicons name="create-outline" size={24} color={COLORS.primary} />
                          <Text style={styles.actionEdit}>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.iconOnlyAction}
                          activeOpacity={0.85}
                          onPress={() => handleDeleteAppointment(appointment)}
                        >
                          <Ionicons name="trash-outline" size={24} color="#df2f2f" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}

            <Text style={styles.sectionCounterTitle}>PENDIENTES DE CIERRE</Text>
            {pendingReviewAppointments.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No hay turnos pendientes de cierre</Text>
              </View>
            ) : (
              pendingReviewAppointments.map((appointment) => {
                const statusStyles = getVisualStatusStyle(appointment);
                const depositStyles = getDepositStyles(appointment);

                return (
                  <TouchableOpacity
                    key={appointment.id}
                    style={styles.card}
                    activeOpacity={0.92}
                    onPress={() => router.push(`/appointments/${appointment.id}` as any)}
                  >
                    <View style={[styles.dateColumn, statusStyles.dateBox]}>
                      <Text style={[styles.timeText, statusStyles.timeText]}>{formatTime(appointment.time)}</Text>
                      <Text style={[styles.dateText, statusStyles.dateText]}>{formatDateLabel(appointment.date)}</Text>
                    </View>

                    <View style={styles.cardDivider} />

                    <View style={styles.cardContent}>
                      <View style={styles.cardTopRow}>
                        <View style={styles.titleBlock}>
                        <Text style={styles.patientName} numberOfLines={2} ellipsizeMode="tail">
                          {appointment.patient?.name || "Paciente sin nombre"}
                        </Text>
                        <Text style={styles.reasonText} numberOfLines={2} ellipsizeMode="tail">
                          {appointment.notes || "Sin detalle"}
                        </Text>
                        </View>

                        <View style={styles.badgesColumn}>
                          <View style={[styles.depositBadge, depositStyles.badge]}>
                            <Text style={[styles.depositBadgeText, depositStyles.text]}>
                              {depositStyles.label}
                            </Text>
                          </View>

                          <View style={[styles.statusBadge, statusStyles.badge]}>
                            <Text style={[styles.statusBadgeText, statusStyles.text]}>
                              {getVisualStatusLabel(appointment)}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.innerDivider} />

                      <View style={styles.actionsRow}>
                        <TouchableOpacity
                          style={styles.actionItem}
                          activeOpacity={0.85}
                          onPress={() => router.push(`/appointments/${appointment.id}` as any)}
                        >
                          <Ionicons name="checkmark-circle-outline" size={24} color="#d2a106" />
                          <Text style={styles.actionStatus}>Estado</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.actionItem}
                          activeOpacity={0.85}
                          onPress={() => router.push(`/appointments/edit/${appointment.id}` as any)}
                        >
                          <Ionicons name="create-outline" size={24} color={COLORS.primary} />
                          <Text style={styles.actionEdit}>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.iconOnlyAction}
                          activeOpacity={0.85}
                          onPress={() => handleDeleteAppointment(appointment)}
                        >
                          <Ionicons name="trash-outline" size={24} color="#df2f2f" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => router.push("/appointments/new" as any)}
      >
        <Ionicons name="add" size={34} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
