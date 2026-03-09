import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { ScreenHeader } from "../../../../components/screen-header";
import { API_URL } from "../../../../constants/api";
import { PRIMARY, styles } from "../../../../src/screens/appointment-edit/styles";

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

const availableHours = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
];

const reasonSuggestions = ["Control", "Consulta", "Seguimiento", "Resultados", "Primera vez"];

export default function EditAppointmentScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState("");
  const [showHours, setShowHours] = useState(false);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function loadAppointment() {
      try {
        const response = await fetch(`${API_URL}/appointments/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Turno no encontrado");
        }

        setAppointment(data);
        setAppointmentDate(new Date(`${data.date}T00:00:00`));
        setTime(data.time || "");

        const fullNotes = data.notes || "";
        const [reasonPart, ...notesParts] = fullNotes.split(" - ");
        setReason(reasonPart || "");
        setNotes(notesParts.join(" - "));
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar el turno");
        router.back();
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadAppointment();
    }
  }, [id]);

  const patientView = useMemo(() => {
    if (!appointment) return null;

    const initials = (appointment.patient?.name || "Paciente")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

    return {
      name: appointment.patient?.name || "Paciente sin nombre",
      dni: appointment.patient?.dni || "-",
      initials,
      status: appointment.status || "pendiente",
    };
  }, [appointment]);

  const originalDate = appointment?.date || "";
  const currentDate = appointmentDate ? appointmentDate.toISOString().split("T")[0] : "";
  const originalNotes = appointment?.notes || "";
  const currentNotes = `${reason}${notes ? " - " + notes : ""}`;

  const hasChanges =
    currentDate !== originalDate || time !== (appointment?.time || "") || currentNotes !== originalNotes;

  function getStatusLabel(status?: string) {
    if (!status) return "Programado";

    const normalized = status.toLowerCase();

    if (normalized === "atendido") return "Atendido";
    if (normalized === "ausente") return "Ausente";
    if (normalized === "cancelado") return "Cancelado";

    return "Programado";
  }

  function getStatusStyle(status?: string) {
    const normalized = status?.toLowerCase();

    if (normalized === "atendido") {
      return [styles.statusChip, styles.statusChipSuccess, styles.statusChipTextSuccess];
    }

    if (normalized === "ausente") {
      return [styles.statusChip, styles.statusChipDanger, styles.statusChipTextDanger];
    }

    if (normalized === "cancelado") {
      return [styles.statusChip, styles.statusChipMuted, styles.statusChipTextMuted];
    }

    return [styles.statusChip, styles.statusChipWarning, styles.statusChipTextWarning];
  }

  function handleCancel() {
    if (!hasChanges) {
      router.back();
      return;
    }

    Alert.alert("Descartar cambios", "Hay cambios sin guardar. Si sales ahora, se perderan.", [
      { text: "Seguir editando", style: "cancel" },
      { text: "Descartar", style: "destructive", onPress: () => router.back() },
    ]);
  }

  async function handleSave() {
    if (!appointment || !appointmentDate || !time || !reason.trim()) {
      Alert.alert("Error", "Completa fecha, hora y motivo para guardar");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/appointments/${appointment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: appointment.patientId,
          date: appointmentDate.toISOString().split("T")[0],
          time,
          status: appointment.status || "pendiente",
          notes: `${reason.trim()}${notes.trim() ? " - " + notes.trim() : ""}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.error || "No se pudo guardar el turno");
        return;
      }

      Alert.alert("Turno actualizado", "Los cambios se guardaron correctamente", [
        {
          text: "OK",
          onPress: () => router.replace(`/appointments/${appointment.id}` as any),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  }

  function handleDeleteAppointment() {
    if (!appointment) {
      return;
    }

    Alert.alert(
      "Eliminar turno",
      `Se eliminara el turno de ${patientView?.name || "este paciente"}. Esta accion no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/appointments/${appointment.id}`, {
                method: "DELETE",
              });
              const raw = await response.text();
              const data = raw ? JSON.parse(raw) : {};

              if (!response.ok) {
                Alert.alert("Error", data.error || "No se pudo eliminar el turno");
                return;
              }

              Alert.alert("Turno eliminado", "El turno se eliminó correctamente", [
                {
                  text: "OK",
                  onPress: () => router.replace("/appointments?mode=agenda" as any),
                },
              ]);
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el turno. Revisa el backend y vuelve a intentar.");
            }
          },
        },
      ]
    );
  }

  function formatLongDate(date?: Date | null) {
    if (!date) return "Seleccionar fecha";

    return date.toLocaleDateString("es-AR", {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  if (loading || !appointment || !patientView) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <ScreenHeader title="Editar Turno" />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando turno...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ScreenHeader title="Editar Turno" />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 18 : 0}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.topInfoRow}>
            <Text style={styles.referenceText}>
              Editando turno del {formatLongDate(new Date(`${appointment.date}T00:00:00`))} a las {appointment.time}
            </Text>

            <View style={getStatusStyle(appointment.status)}>
              <Text style={styles.statusChipText}>{getStatusLabel(appointment.status)}</Text>
            </View>
          </View>

          {hasChanges ? (
            <View style={styles.dirtyBanner}>
              <Ionicons name="alert-circle-outline" size={18} color="#946c20" />
              <Text style={styles.dirtyBannerText}>Hay cambios sin guardar</Text>
            </View>
          ) : null}

          <View style={styles.cardSection}>
            <View style={styles.section}>
              <Text style={styles.label}>
                Paciente <Text style={styles.required}>*</Text>
              </Text>

              <View style={styles.patientBoxLocked}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{patientView.initials}</Text>
                </View>

                <View style={styles.patientInfo}>
                  <Text style={styles.patientName}>{patientView.name}</Text>
                  <Text style={styles.patientDni}>DNI: {patientView.dni}</Text>
                </View>

                <Ionicons name="lock-closed-outline" size={22} color="#bdbdbd" />
              </View>

              <Text style={styles.lockedHint}>El paciente no puede modificarse desde esta pantalla.</Text>
            </View>
          </View>

          <View style={styles.cardSection}>
            <View style={styles.row}>
              <View style={[styles.section, styles.half, styles.sectionNoMarginBottom]}>
                <Text style={styles.label}>
                  Fecha <Text style={styles.required}>*</Text>
                </Text>

                <TouchableOpacity
                  style={[styles.input, styles.dateInputContent, currentDate !== originalDate ? styles.inputChanged : null]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.inputText}>{formatLongDate(appointmentDate)}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={appointmentDate || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    minimumDate={new Date()}
                    onChange={(_event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setAppointmentDate(selectedDate);
                      }
                    }}
                  />
                )}
              </View>

              <View style={[styles.section, styles.half, styles.sectionNoMarginBottom]}>
                <Text style={styles.label}>
                  Hora <Text style={styles.required}>*</Text>
                </Text>

                <TouchableOpacity
                  style={[styles.input, styles.dateInputContent, time !== (appointment.time || "") ? styles.inputChanged : null]}
                  onPress={() => setShowHours((prev) => !prev)}
                >
                  <Text style={styles.inputText}>{time || "Seleccionar hora"}</Text>
                </TouchableOpacity>

                {showHours && (
                  <View style={styles.hoursDropdown}>
                    <ScrollView nestedScrollEnabled style={styles.hoursDropdownScroll}>
                      {availableHours.map((hour) => (
                        <TouchableOpacity
                          key={hour}
                          style={styles.hourItem}
                          onPress={() => {
                            setTime(hour);
                            setShowHours(false);
                          }}
                        >
                          <Text style={styles.hourText}>{hour}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.cardSection}>
            <View style={styles.section}>
              <Text style={styles.label}>
                Motivo de consulta <Text style={styles.required}>*</Text>
              </Text>

              <TextInput
                style={[styles.input, reason !== (appointment.notes || "").split(" - ")[0] ? styles.inputChanged : null]}
                placeholder="Control"
                value={reason}
                onChangeText={setReason}
              />

              <View style={styles.reasonChipsRow}>
                {reasonSuggestions.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.reasonChip}
                    activeOpacity={0.85}
                    onPress={() => setReason(item)}
                  >
                    <Text style={styles.reasonChipText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.cardSection}>
            <View style={styles.section}>
              <Text style={styles.label}>Notas para el turno</Text>

              <TextInput
                style={[styles.input, styles.textarea, notes !== ((appointment.notes || "").split(" - ").slice(1).join(" - ")) ? styles.inputChanged : null]}
                placeholder="Estudios previos, derivación..."
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </View>
          </View>

          <View style={styles.footerButtons}> 
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.deleteSection}>
            <TouchableOpacity style={styles.deleteButton} activeOpacity={0.85} onPress={handleDeleteAppointment}>
              <Ionicons name="trash-outline" size={18} color="#d83030" />
              <Text style={styles.deleteButtonText}>Eliminar turno</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
