import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { ScreenHeader } from "../../../components/screen-header";
import { API_URL } from "../../../constants/api";
import { styles } from "../../../src/screens/patients-new/styles";

export default function NewPatientScreen() {
  const { returnTo } = useLocalSearchParams();
  const suggestedDomains = [
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "live.com",
    "yahoo.com",
  ];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [dni, setDni] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  async function handleSave() {
    try {
      if (!name.trim()) {
        Alert.alert("Error", "El nombre es obligatorio");
        return;
      }

      const response = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          dni,
          phone,
          email,
          birthDate: birthDate ? birthDate.toISOString() : null,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.error || "No se pudo guardar el paciente");
        return;
      }

      Alert.alert("Paciente creado", "El paciente se guardó correctamente", [
        {
          text: "OK",
          onPress: () =>
            returnTo === "appointment"
              ? router.replace(`/appointments/new?patientId=${data.id}` as any)
              : router.replace("/patients" as any),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ScreenHeader title="Nuevo Paciente" />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 18 : 0}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="DNI"
            placeholderTextColor="#999"
            value={dni}
            onChangeText={handleDniChange}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
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
            style={styles.input}
            placeholder="Telefono"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
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
            style={[styles.input, styles.textarea]}
            placeholder="Notas"
            placeholderTextColor="#999"
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <View style={styles.footerButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar Paciente</Text>
            </TouchableOpacity>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
