import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { useBiometricLock } from "../../src/auth/biometric-lock";
import { API_URL } from "../../constants/api";
import { styles } from "../../src/screens/home/styles";

const managementCards = [
  {
    title: "Pacientes",
    subtitle: "Registrar y administrar pacientes",
    icon: "people",
    route: "/patients",
    primary: true,
  },
  {
    title: "Agenda de Turnos",
    subtitle: "Ver y programar citas medicas",
    icon: "calendar",
    route: "/appointments?mode=agenda",
    primary: false,
  },
];

const quickActions = [
  {
    title: "Nuevo\nTurno",
    icon: "add-circle",
    route: "/appointments/new",
  },
  {
    title: "Nuevo\nPaciente",
    icon: "person-add",
    route: "/patients/new",
  },
  {
    title: "Historial",
    icon: "time",
    route: "/appointments?mode=history",
  },
];

type Appointment = {
  id: number;
  date: string;
  time: string;
  status?: string;
  notes?: string | null;
  patient?: {
    name?: string;
  };
};

export default function HomeScreen() {
  const { lockNow } = useBiometricLock();
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [now, setNow] = useState(new Date());
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [todayScheduledCount, setTodayScheduledCount] = useState(0);
  const [loadingNextAppointment, setLoadingNextAppointment] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = useMemo(
    () =>
      now.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    [now]
  );

  const formattedDay = useMemo(() => now.getDate().toString(), [now]);
  const formattedMonth = useMemo(() => (now.getMonth() + 1).toString(), [now]);
  const formattedWeekday = useMemo(
    () => now.toLocaleDateString("es-AR", { weekday: "long" }),
    [now]
  );

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function loadUpcomingAppointment() {
        try {
          setLoadingNextAppointment(true);

          const response = await fetch(`${API_URL}/appointments/upcoming`);
          const data = await response.json();

          if (cancelled) {
            return;
          }

          const now = Date.now();
          const todayKey = new Date().toISOString().split("T")[0];

          const safeAppointments = Array.isArray(data) ? data : [];

          const scheduledToday = safeAppointments.filter((item) => {
            const status = item.status?.toLowerCase();
            return status === "pendiente" && item.date === todayKey;
          }).length;

          const upcoming = safeAppointments
                .filter((item) => {
                  const status = item.status?.toLowerCase();
                  const appointmentTime = new Date(
                    `${item.date}T${item.time || "00:00"}:00`
                  ).getTime();

                  return status === "pendiente" && !Number.isNaN(appointmentTime) && appointmentTime >= now;
                })
                .sort((a, b) => {
                  const aDate = new Date(`${a.date}T${a.time || "00:00"}:00`).getTime();
                  const bDate = new Date(`${b.date}T${b.time || "00:00"}:00`).getTime();
                  return aDate - bDate;
                })[0] || null;

          setTodayScheduledCount(scheduledToday);
          setNextAppointment(upcoming);
        } catch (error) {
          if (!cancelled) {
            setTodayScheduledCount(0);
            setNextAppointment(null);
          }
        } finally {
          if (!cancelled) {
            setLoadingNextAppointment(false);
          }
        }
      }

      loadUpcomingAppointment();

      return () => {
        cancelled = true;
      };
    }, [])
  );

  function handleNavigate(route: string) {
    setShowQuickMenu(false);
    router.push(route as any);
  }

  function formatAppointmentDate(date?: string) {
    if (!date) return "Sin fecha";

    const parsed = new Date(`${date}T00:00:00`);

    if (isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }

  function getStatusLabel(status?: string) {
    const normalized = status?.toLowerCase();

    if (normalized === "atendido") return "Atendido";
    if (normalized === "ausente") return "Ausente";
    if (normalized === "cancelado") return "Cancelado";

    return "Programado";
  }

  function getStatusStyle(status?: string) {
    const normalized = status?.toLowerCase();

    if (normalized === "atendido") {
      return {
        badge: [styles.nextStatusChip, styles.nextStatusChipSuccess],
        text: [styles.nextStatusText, styles.nextStatusTextSuccess],
      };
    }

    if (normalized === "ausente") {
      return {
        badge: [styles.nextStatusChip, styles.nextStatusChipDanger],
        text: [styles.nextStatusText, styles.nextStatusTextDanger],
      };
    }

    if (normalized === "cancelado") {
      return {
        badge: [styles.nextStatusChip, styles.nextStatusChipMuted],
        text: [styles.nextStatusText, styles.nextStatusTextMuted],
      };
    }

    return {
      badge: [styles.nextStatusChip, styles.nextStatusChipWarning],
      text: [styles.nextStatusText, styles.nextStatusTextWarning],
    };
  }

  return (
    <SafeAreaView style={styles.safeScreen} edges={["top", "left", "right", "bottom"]}>
      <StatusBar style="light" backgroundColor={styles.heroHeader.backgroundColor} />
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
        >
          <View style={styles.heroHeader}>
            <View style={styles.heroHeaderRow}>
              <View>
                <Text style={styles.welcome}>Bienvenida</Text>
                <Text style={styles.userName}>Dra. Noguera</Text>
              </View>

              <TouchableOpacity style={styles.headerAction} activeOpacity={0.85} onPress={lockNow}>
                <Ionicons name="log-out-outline" size={26} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.stickyHeader}>
            <TouchableOpacity
              style={styles.searchBarCompact}
              activeOpacity={0.9}
              onPress={() => handleNavigate("/patients")}
            >
              <Ionicons name="search-outline" size={24} color="#8b8b8b" />
              <Text style={styles.searchText}>Buscar paciente por nombre o DNI...</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
          <Text style={styles.sectionTitle}>Utilidades</Text>

          <View style={styles.utilitySummaryRow}>
            <View style={styles.utilitySummaryCard}>
              <Text style={styles.utilitySummaryLabel}>Hora actual</Text>
              <Text style={styles.utilitySummaryValue}>{formattedTime}</Text>
            </View>

            <View style={styles.utilitySummaryCard}>
              <Text style={styles.utilitySummaryLabel}>Hoy es</Text>
              <Text style={styles.utilitySummaryValue}>{formattedDay}/{formattedMonth}</Text>
              <Text style={styles.utilitySummaryDay}>{formattedWeekday}</Text>
            </View>
          </View>

          <View style={styles.utilitySummarySingleCard}>
            <Text style={styles.utilitySummaryLabel}>Turnos de hoy</Text>
            <Text style={styles.utilitySummaryValue}>{todayScheduledCount}</Text>
            <Text style={styles.utilitySummaryDay}>Programados</Text>
          </View>

          <Text style={styles.sectionTitle}>Proximo turno</Text>

          {loadingNextAppointment ? (
            <View style={styles.nextAppointmentCard}>
              <Text style={styles.nextAppointmentEyebrow}>Agenda</Text>
              <Text style={styles.nextAppointmentTitle}>Cargando proximo turno...</Text>
            </View>
          ) : nextAppointment ? (
            (() => {
              const statusStyles = getStatusStyle(nextAppointment.status);

              return (
            <TouchableOpacity
              style={styles.nextAppointmentCard}
              activeOpacity={0.9}
              onPress={() => handleNavigate(`/appointments/${nextAppointment.id}`)}
            >
              <View style={styles.nextAppointmentTopRow}>
                <View style={styles.nextAppointmentTimeBox}>
                  <Text style={styles.nextAppointmentTime}>{nextAppointment.time || "--:--"}</Text>
                  <Text style={styles.nextAppointmentDate}>{formatAppointmentDate(nextAppointment.date)}</Text>
                </View>

                <View style={statusStyles.badge}>
                  <Text style={statusStyles.text}>{getStatusLabel(nextAppointment.status)}</Text>
                </View>
              </View>

              <View style={styles.nextAppointmentDivider} />

              <Text style={styles.nextAppointmentEyebrow}>Paciente</Text>
              <Text style={styles.nextAppointmentTitle}>
                {nextAppointment.patient?.name || "Paciente sin nombre"}
              </Text>
              <Text style={styles.nextAppointmentMeta}>
                {nextAppointment.notes || "Sin detalle de consulta"}
              </Text>

              <View style={styles.nextAppointmentActionRow}>
                <Text style={styles.nextAppointmentLink}>Ver detalle del turno</Text>
                <Ionicons name="arrow-forward-outline" size={20} color="#c8102e" />
              </View>
            </TouchableOpacity>
              );
            })()
          ) : (
            <TouchableOpacity
              style={styles.nextAppointmentCard}
              activeOpacity={0.9}
              onPress={() => handleNavigate("/appointments/new")}
            >
              <Text style={styles.nextAppointmentEyebrow}>Agenda</Text>
              <Text style={styles.nextAppointmentTitle}>No hay turnos proximos cargados</Text>
              <Text style={styles.nextAppointmentMeta}>
                Programa el siguiente turno desde la agenda o con el acceso rapido.
              </Text>

              <View style={styles.nextAppointmentActionRow}>
                <Text style={styles.nextAppointmentLink}>Crear nuevo turno</Text>
                <Ionicons name="add-circle-outline" size={20} color="#c8102e" />
              </View>
            </TouchableOpacity>
          )}

          <Text style={styles.sectionTitle}>Gestion del consultorio</Text>

          {managementCards.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={item.primary ? styles.primaryManagementCard : styles.secondaryManagementCard}
              activeOpacity={0.9}
              onPress={() => handleNavigate(item.route)}
            >
              <View style={item.primary ? styles.primaryManagementIcon : styles.secondaryManagementIcon}>
                <Ionicons
                  name={item.icon as any}
                  size={28}
                  color={item.primary ? "#fff" : "#c8102e"}
                />
              </View>

              <View style={styles.managementTextBox}>
                <Text style={item.primary ? styles.primaryManagementTitle : styles.secondaryManagementTitle}>
                  {item.title}
                </Text>
                <Text
                  style={
                    item.primary ? styles.primaryManagementSubtitle : styles.secondaryManagementSubtitle
                  }
                >
                  {item.subtitle}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward-outline"
                size={30}
                color={item.primary ? "#ffd3db" : "#bdbdbd"}
              />
            </TouchableOpacity>
          ))}

          <Text style={styles.sectionTitle}>Acciones rapidas</Text>

          <View style={styles.quickGrid}>
            {quickActions.map((item) => (
              <TouchableOpacity
                key={item.title}
                style={styles.quickCard}
                activeOpacity={0.9}
                onPress={() => handleNavigate(item.route)}
              >
                <Ionicons name={item.icon as any} size={34} color="#c8102e" />
                <Text style={styles.quickCardTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
          </View>
        </ScrollView>
      </View>

      {showQuickMenu && (
        <View style={styles.fabMenu}>
          <TouchableOpacity
            style={styles.fabMenuButton}
            activeOpacity={0.9}
            onPress={() => handleNavigate("/appointments/new")}
          >
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={styles.fabMenuText}>Nuevo turno</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fabMenuButton}
            activeOpacity={0.9}
            onPress={() => handleNavigate("/patients/new")}
          >
            <Ionicons name="person-add-outline" size={20} color="#fff" />
            <Text style={styles.fabMenuText}>Nuevo paciente</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => setShowQuickMenu((prev) => !prev)}
      >
        <Ionicons name={showQuickMenu ? "close" : "add"} size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
