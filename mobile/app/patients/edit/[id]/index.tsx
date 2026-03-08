import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
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
import { styles } from "../../../../src/screens/patient-edit/styles";

type PatientType = {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  dni?: string;
  birthDate?: string;
};

export default function EditPatientScreen() {
  const { id } = useLocalSearchParams();
  const suggestedDomains = [
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "live.com",
    "yahoo.com",
  ];

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [dni, setDni] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [initialPatient, setInitialPatient] = useState<PatientType | null>(null);

  useEffect(() => {
    async function loadPatient() {
      try {
        const response = await fetch(`${API_URL}/patients/${id}`);
        const data: PatientType = await response.json();

        if (!response.ok) {
          throw new Error("No se pudo cargar el paciente");
        }

        setName(data.name || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
        setNotes(data.notes || "");
        setDni(data.dni || "");
        setBirthDate(data.birthDate ? new Date(data.birthDate) : null);
        setInitialPatient(data);
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar el paciente");
        router.back();
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadPatient();
    }
  }, [id]);

  function handleDniChange(value: string) {
    setDni(value.replace(/\D/g, ""));
  }

  function handlePhoneChange(value: string) {
    setPhone(value.replace(/\D/g, ""));
  }

  function applyEmailDomain(domain: string) {
    const localPart = email.split("@")[0]?.trim() || "";

    if (!localPart) {
      return;
    }

    setEmail(`${localPart}@${domain}`);
  }

  function handleCancel() {
    if (!hasChanges) {
      router.back();
      return;
    }

    Alert.alert(
      "Descartar cambios",
      "Hay cambios sin guardar. Si sales ahora, se perderan.",
      [
        { text: "Seguir editando", style: "cancel" },
        { text: "Descartar", style: "destructive", onPress: () => router.back() },
      ]
    );
  }

  function handleDeletePatient() {
    Alert.alert(
      "Eliminar paciente",
      "Esta accion no se puede deshacer.",
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

              Alert.alert("Paciente eliminado", "El paciente se eliminó correctamente", [
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

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/patients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          email,
          notes,
          dni,
          birthDate: birthDate ? birthDate.toISOString() : null,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.error || "No se pudo actualizar el paciente");
        return;
      }

      Alert.alert("Paciente actualizado", "Los cambios se guardaron correctamente", [
        {
          text: "OK",
          onPress: () => router.replace(`/patients/${id}` as any),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  }

  const initialBirthDate = initialPatient?.birthDate
    ? new Date(initialPatient.birthDate).toISOString().split("T")[0]
    : "";

  const currentBirthDate = birthDate ? birthDate.toISOString().split("T")[0] : "";

  const hasChanges =
    name !== (initialPatient?.name || "") ||
    phone !== (initialPatient?.phone || "") ||
    email !== (initialPatient?.email || "") ||
    notes !== (initialPatient?.notes || "") ||
    dni !== (initialPatient?.dni || "") ||
    currentBirthDate !== initialBirthDate;

  function isChanged(field: keyof PatientType | "birthDate") {
    if (!initialPatient) return false;

    if (field === "birthDate") {
      return currentBirthDate !== initialBirthDate;
    }

    const currentValues = {
      name,
      phone,
      email,
      notes,
      dni,
      birthDate: currentBirthDate,
    };

    return currentValues[field] !== (initialPatient[field] || "");
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <ScreenHeader title="Editar Paciente" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ScreenHeader title="Editar Paciente" />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 18 : 0}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <View style={styles.introCard}>
              <Text style={styles.introLabel}>Editando paciente</Text>
              <Text style={styles.introName}>{name || initialPatient?.name || "Paciente"}</Text>
              <Text style={styles.introText}>Actualiza los datos personales y de contacto.</Text>
            </View>

            {hasChanges ? (
              <View style={styles.dirtyBanner}>
                <Ionicons name="alert-circle-outline" size={18} color="#946c20" />
                <Text style={styles.dirtyBannerText}>Hay cambios sin guardar</Text>
              </View>
            ) : null}

            <TextInput
              style={[styles.input, isChanged("name") ? styles.inputChanged : null]}
              placeholder="Nombre completo"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={[styles.input, isChanged("dni") ? styles.inputChanged : null]}
              placeholder="DNI"
              placeholderTextColor="#999"
              value={dni}
              onChangeText={handleDniChange}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={[styles.input, isChanged("birthDate") ? styles.inputChanged : null]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={birthDate ? styles.inputText : styles.placeholderText}>
                {birthDate
                  ? birthDate.toLocaleDateString("es-AR")
                  : "Seleccionar fecha de nacimiento"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={birthDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                maximumDate={new Date()}
                onChange={(_event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setBirthDate(selectedDate);
                  }
                }}
              />
            )}

            <TextInput
              style={[styles.input, isChanged("phone") ? styles.inputChanged : null]}
              placeholder="Telefono"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
            />

            <TextInput
              style={[styles.input, isChanged("email") ? styles.inputChanged : null]}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.emailHelperBox}>
              <Text style={styles.emailHelperText}>Escribe el usuario y elige un dominio:</Text>

              <View style={styles.domainChipsRow}>
                {suggestedDomains.map((domain) => (
                  <TouchableOpacity
                    key={domain}
                    style={styles.domainChip}
                    activeOpacity={0.85}
                    onPress={() => applyEmailDomain(domain)}
                  >
                    <Text style={styles.domainChipText}>@{domain}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              style={[styles.input, styles.textarea, isChanged("notes") ? styles.inputChanged : null]}
              placeholder="Notas"
              placeholderTextColor="#999"
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            <View style={styles.footerButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Descartar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dangerZone}>
              <Text style={styles.dangerZoneTitle}>Zona sensible</Text>
              <Text style={styles.dangerZoneText}>
                La eliminacion queda separada para evitar acciones accidentales.
              </Text>

              <TouchableOpacity
                style={styles.deleteButton}
                activeOpacity={0.85}
                onPress={handleDeletePatient}
              >
                <Text style={styles.deleteButtonText}>Eliminar paciente</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
