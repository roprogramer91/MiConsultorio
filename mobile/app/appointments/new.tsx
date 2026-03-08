import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { API_URL } from "../../constants/api";

type PatientType = {
  id: number;
  name: string;
  dni?: string;
};

export default function NewAppointmentScreen() {
  const { patientId } = useLocalSearchParams();

  const [patient, setPatient] = useState<PatientType | null>(null);
  const [patients, setPatients] = useState<PatientType[]>([]);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [showPatientSelector, setShowPatientSelector] = useState(false);

  const [appointmentDate, setAppointmentDate] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [time, setTime] = useState("");
  const [showHours, setShowHours] = useState(false);

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

  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function loadPatients() {
      if (patientId) return;

      try {
        setLoadingPatient(true);

        const response = await fetch(`${API_URL}/patients`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error("No se pudieron cargar los pacientes");
        }

        setPatients(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Error cargando pacientes para turno:", error);
        Alert.alert("Error", "No se pudo cargar la lista de pacientes");
      } finally {
        setLoadingPatient(false);
      }
    }

    async function loadPatient() {
      if (!patientId) return;

      try {
        setLoadingPatient(true);

        const response = await fetch(`${API_URL}/patients/${patientId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No se pudo cargar el paciente");
        }

        setPatient(data);
      } catch (error) {
        console.log("Error cargando paciente para turno:", error);
        Alert.alert("Error", "No se pudo cargar el paciente");
      } finally {
        setLoadingPatient(false);
      }
    }

    loadPatients();
    loadPatient();
  }, [patientId]);

  function getInitials(name?: string) {
    if (!name) return "??";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  }

  async function handleSaveAppointment() {
    try {
      if (!patient?.id) {
        Alert.alert("Error", "Debes seleccionar un paciente");
        return;
      }

      if (!appointmentDate) {
        Alert.alert("Error", "Debes seleccionar una fecha");
        return;
      }

      if (!time) {
        Alert.alert("Error", "Debes seleccionar una hora");
        return;
      }

      if (!reason.trim()) {
        Alert.alert("Error", "Debes ingresar el motivo de consulta");
        return;
      }

      const formattedDate = appointmentDate.toISOString().split("T")[0];

      const response = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: patient.id,
          date: formattedDate,
          time,
          status: "pendiente",
          notes: `${reason}${notes ? " - " + notes : ""}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.error || "No se pudo crear el turno");
        return;
      }

      Alert.alert("Turno creado", "El turno se guardó correctamente", [
        {
          text: "OK",
          onPress: () =>
            patientId
              ? router.replace(`/patients/${patient.id}` as any)
              : router.replace("/appointments" as any),
        },
      ]);
    } catch (error) {
      console.log("Error creando turno:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Nuevo Turno</Text>
      </View>

      <Text style={styles.sectionMainTitle}>DATOS DEL TURNO</Text>

      <View style={styles.section}>
        <Text style={styles.label}>
          Paciente <Text style={styles.required}>*</Text>
        </Text>

        <TouchableOpacity
          style={[
            styles.patientBox,
            patientId ? styles.patientBoxLocked : null,
          ]}
          activeOpacity={patientId ? 1 : 0.8}
          disabled={!!patientId || loadingPatient}
          onPress={() => setShowPatientSelector((prev) => !prev)}
        >
          {loadingPatient ? (
            <Text style={styles.loadingText}>Cargando paciente...</Text>
          ) : patient ? (
            <>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(patient.name)}</Text>
              </View>

              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>{patient.name}</Text>
                <Text style={styles.patientDni}>DNI: {patient.dni || "-"}</Text>
              </View>

              {patientId ? (
                <Ionicons name="lock-closed-outline" size={24} color="#bdbdbd" />
              ) : (
                <Ionicons
                  name={showPatientSelector ? "chevron-up" : "chevron-down"}
                  size={28}
                  color="#bdbdbd"
                />
              )}
            </>
          ) : (
            <Text style={styles.placeholderText}>Seleccionar paciente</Text>
          )}
        </TouchableOpacity>

        {!patientId && showPatientSelector && (
          <View style={styles.patientDropdown}>
            <ScrollView nestedScrollEnabled style={styles.patientDropdownScroll}>
              {patients.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.patientOption}
                  onPress={() => {
                    setPatient(item);
                    setShowPatientSelector(false);
                  }}
                >
                  <Text style={styles.patientOptionName}>{item.name}</Text>
                  <Text style={styles.patientOptionMeta}>DNI: {item.dni || "-"}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.row}>
        <View style={[styles.section, styles.half]}>
          <Text style={styles.label}>
            Fecha <Text style={styles.required}>*</Text>
          </Text>

          <TouchableOpacity
            style={[styles.input, styles.dateInputContent]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.inputText}>
              {appointmentDate
                ? appointmentDate.toLocaleDateString("es-AR")
                : "Seleccionar fecha"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={appointmentDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setAppointmentDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        <View style={[styles.section, styles.half]}>
          <Text style={styles.label}>
            Hora <Text style={styles.required}>*</Text>
          </Text>

          <TouchableOpacity
            style={[styles.input, styles.dateInputContent]}
            onPress={() => setShowHours(!showHours)}
          >
            <Text style={styles.inputText}>
              {time ? time : "Seleccionar hora"}
            </Text>
          </TouchableOpacity>

                  {showHours && (
            <View style={styles.hoursDropdown}>
              <ScrollView nestedScrollEnabled>
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

      <View style={styles.section}>
        <Text style={styles.label}>
          Motivo de consulta <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Control"
          value={reason}
          onChangeText={setReason}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Notas para el turno</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Estudios previos, derivación..."
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>

      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAppointment}>
          <Text style={styles.saveButtonText}>Guardar Turno</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const PRIMARY = "#c8102e";
const BG = "#efefef";
const CARD = "#ffffff";
const TEXT = "#222";
const MUTED = "#8f8f8f";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 22,
    marginBottom: 24,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  sectionMainTitle: {
    color: MUTED,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 1,
    marginHorizontal: 20,
    marginBottom: 18,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 18,
  },
  row: {
    flexDirection: "row",
    gap: 14,
    marginHorizontal: 20,
  },
  half: {
    flex: 1,
    marginHorizontal: 0,
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4a4a4a",
    marginBottom: 10,
  },
  required: {
    color: PRIMARY,
  },
  patientBox: {
    minHeight: 100,
    backgroundColor: CARD,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#d9d9d9",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  patientBoxLocked: {
    borderColor: PRIMARY,
  },
  loadingText: {
    fontSize: 16,
    color: MUTED,
  },
  placeholderText: {
    fontSize: 16,
    color: MUTED,
  },
  patientDropdown: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  patientDropdownScroll: {
    maxHeight: 240,
  },
  patientOption: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  patientOptionName: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 4,
  },
  patientOptionMeta: {
    fontSize: 14,
    color: "#777",
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 4,
  },
  patientDni: {
    fontSize: 15,
    color: "#777",
  },
  input: {
    backgroundColor: CARD,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#d9d9d9",
    minHeight: 64,
    paddingHorizontal: 18,
    fontSize: 18,
    color: TEXT,
  },
  inputText: {
    fontSize: 18,
    color: TEXT,
  },
  dateInputContent: {
    justifyContent: "center",
  },
  textarea: {
    minHeight: 120,
    paddingTop: 18,
    textAlignVertical: "top",
  },
  hoursDropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    maxHeight: 200,
    overflow: "hidden",
  },
  hourItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  hourText: {
    fontSize: 16,
    color: "#333",
  },
  footerButtons: {
    flexDirection: "row",
    gap: 14,
    marginTop: 10,
    marginHorizontal: 20,
  },
  cancelButton: {
    flex: 1,
    minHeight: 62,
    borderRadius: 18,
    backgroundColor: "#f4f4f4",
    borderWidth: 1,
    borderColor: "#d7d7d7",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#666",
  },
  saveButton: {
    flex: 2,
    minHeight: 62,
    borderRadius: 18,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
});
