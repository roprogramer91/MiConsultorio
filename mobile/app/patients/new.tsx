import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useState } from "react";
import { API_URL } from "../../constants/api";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";


export default function NewPatientScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [dni, setDni] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  async function handleSave() {
    try {
      if (!name) {
        Alert.alert("Error", "El nombre es obligatorio");
        return;
      }

      const response = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
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
          onPress: () => router.replace("/patients" as any)
        },
      ]);

    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nuevo Paciente</Text>
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="DNI"
          value={dni}
          onChangeText={setDni}
        />

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>
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
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setBirthDate(selectedDate);
              }
            }}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Notas"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Guardar Paciente</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#efefef",
    minHeight: "100%",
  },

  header: {
    backgroundColor: "#c8102e",
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 28,
  },

  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "800",
  },

  content: {
    padding: 20,
  },

  input: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },

  textarea: {
    height: 100,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#c8102e",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});