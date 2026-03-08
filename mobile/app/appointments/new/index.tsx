import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { API_URL } from "../../../constants/api";
import { ScreenHeader } from "../../../components/screen-header";
import { PRIMARY, styles } from "../../../src/screens/appointments-new/styles";

type PatientType = {
  id: number;
  name: string;
  dni?: string;
};

export default function NewAppointmentScreen() {
  const { patientId } = useLocalSearchParams();
  const reasonSuggestions = [
    "Control",
    "Consulta",
    "Seguimiento",
    "Resultados",
    "Primera vez",
  ];

  const [patient, setPatient] = useState<PatientType | null>(null);
  const [patients, setPatients] = useState<PatientType[]>([]);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [showPatientSelector, setShowPatientSelector] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");

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

  const filteredPatients = patients.filter((item) => {
    const query = patientSearch.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return item.name.toLowerCase().includes(query) || (item.dni || "").includes(query);
  });

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
        setPatientSearch(data.name || "");
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
          onPress: () => router.replace(`/appointments/${data.id}` as any),
        },
      ]);
    } catch (error) {
      console.log("Error creando turno:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ScreenHeader title="Nuevo Turno" />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 18 : 0}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionMainTitle}>DATOS DEL TURNO</Text>

            <View style={[styles.cardSection, showPatientSelector ? styles.sectionOverlay : null]}>
            <View style={styles.section}>
            <Text style={styles.label}>
              Paciente <Text style={styles.required}>*</Text>
            </Text>

            {patientId ? (
              <View
                style={[
                  styles.patientBox,
                  styles.patientBoxLocked,
                ]}
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

                    <Ionicons name="lock-closed-outline" size={22} color="#bdbdbd" />
                  </>
                ) : (
                  <Text style={styles.loadingText}>Cargando paciente...</Text>
                )}
              </View>
            ) : (
              <View style={styles.patientSearchTriggerBox}>
                <TextInput
                  placeholder="Seleccionar paciente"
                  placeholderTextColor="#999"
                  style={styles.patientSearchTriggerInput}
                  value={patientSearch}
                  onFocus={() => setShowPatientSelector(true)}
                  onChangeText={(value) => {
                    setPatientSearch(value);
                    setPatient(null);
                    setShowPatientSelector(true);
                  }}
                />
              </View>
            )}

            {!patientId && showPatientSelector && (
              <View style={styles.patientDropdown}>
                <TouchableOpacity
                  style={styles.newPatientOption}
                  activeOpacity={0.85}
                  onPress={() => router.push("/patients/new?returnTo=appointment" as any)}
                >
                  <Ionicons name="person-add-outline" size={20} color={PRIMARY} />
                  <Text style={styles.newPatientOptionText}>Nuevo paciente</Text>
                </TouchableOpacity>

                <ScrollView nestedScrollEnabled style={styles.patientDropdownScroll}>
                  {filteredPatients.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.patientOption}
                      onPress={() => {
                        setPatient(item);
                        setPatientSearch(item.name);
                        setShowPatientSelector(false);
                        Keyboard.dismiss();
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
          </View>

          <View style={styles.cardSection}>
          <View style={styles.row}> 
            <View style={[styles.section, styles.half, styles.sectionNoMarginBottom]}>
          <Text style={styles.label}>
            Fecha <Text style={styles.required}>*</Text>
          </Text>

          <TouchableOpacity
            style={[styles.input, styles.dateInputContent]}
            onPress={() => {
              setShowPatientSelector(false);
              Keyboard.dismiss();
              setShowDatePicker(true);
            }}
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
            style={[styles.input, styles.dateInputContent]}
            onPress={() => {
              setShowPatientSelector(false);
              Keyboard.dismiss();
              setShowHours(!showHours);
            }}
          >
            <Text style={styles.inputText}>
              {time ? time : "Seleccionar hora"}
            </Text>
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
              style={styles.input}
              placeholder="Control"
              value={reason}
              onFocus={() => setShowPatientSelector(false)}
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
              style={[styles.input, styles.textarea]}
              placeholder="Estudios previos, derivación..."
              value={notes}
              onFocus={() => setShowPatientSelector(false)}
              onChangeText={setNotes}
              multiline
            />
          </View>
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
      </KeyboardAvoidingView>
    </View>
  );
}
