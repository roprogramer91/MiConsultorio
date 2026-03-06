const API_URL = "http://localhost:3000";

let patientsCache = [];

const datePicker = document.getElementById("datePicker");
const agendaDiv = document.getElementById("agenda");
const upcomingDiv = document.getElementById("upcoming");

const today = new Date().toISOString().split("T")[0];
datePicker.value = today;


function renderAppointmentCard(appt) {
  return `
    <div class="card">
      <h3>${appt.date} - ${appt.time} - ${appt.patient.name}</h3>
      <p><strong>Teléfono:</strong> ${appt.patient.phone || "-"}</p>

      <p>
        <strong>Estado:</strong>
        <select id="status-${appt.id}">
          <option value="pendiente" ${appt.status === "pendiente" ? "selected" : ""}>pendiente</option>
          <option value="pagado" ${appt.status === "pagado" ? "selected" : ""}>pagado</option>
          <option value="reservado" ${appt.status === "reservado" ? "selected" : ""}>reservado</option>
          <option value="cancelado" ${appt.status === "cancelado" ? "selected" : ""}>cancelado</option>
          <option value="atendido" ${appt.status === "atendido" ? "selected" : ""}>atendido</option>
        </select>

        <button onclick="saveStatus(${appt.id})">Guardar</button>
      </p>

      <p><strong>Notas:</strong> ${appt.notes || "-"}</p>
    </div>
  `;
}


async function loadAppointments() {

  const selectedDate = datePicker.value;

  if (!selectedDate) {
    alert("Elegí una fecha");
    return;
  }

  try {

    const response = await fetch(`${API_URL}/appointments?date=${selectedDate}`);
    const appointments = await response.json();

    if (!appointments.length) {
      agendaDiv.innerHTML = "<p>No hay turnos para esta fecha.</p>";
      return;
    }

    agendaDiv.innerHTML = appointments.map(renderAppointmentCard).join("");

  } catch (error) {

    console.error("Error cargando agenda:", error);
    agendaDiv.innerHTML = "<p>Error al cargar la agenda.</p>";

  }

}

async function loadUpcomingAppointments() {

  try {

    const response = await fetch(`${API_URL}/appointments/upcoming`);
    const appointments = await response.json();

    if (!appointments.length) {
      upcomingDiv.innerHTML = "<p>No hay próximos turnos.</p>";
      return;
    }

    upcomingDiv.innerHTML = appointments.map(renderAppointmentCard).join("");

  } catch (error) {

    console.error("Error cargando próximos turnos:", error);
    upcomingDiv.innerHTML = "<p>Error al cargar próximos turnos.</p>";

  }

}

async function updateStatus(id, status) {
  try {
    const response = await fetch(`${API_URL}/appointments/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error("No se pudo actualizar el estado");
    }

    await loadAppointments();
    await loadUpcomingAppointments();
    alert("Estado actualizado correctamente");

  } catch (error) {
    console.error("Error actualizando estado:", error);
    alert("No se pudo actualizar el estado");
  }
}


async function saveStatus(id) {
  const select = document.getElementById(`status-${id}`);
  const status = select.value;
  await updateStatus(id, status);
}


async function createPatient() {
  try {
    const name = document.getElementById("patientName").value.trim();
    const phone = document.getElementById("patientPhone").value.trim();
    const email = document.getElementById("patientEmail").value.trim();
    const notes = document.getElementById("patientNotes").value.trim();

    if (!name) {
      alert("El nombre es obligatorio");
      return;
    }

    const response = await fetch(`${API_URL}/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        phone,
        email,
        notes
      })
    });

    if (!response.ok) {
      throw new Error("No se pudo crear el paciente");
    }

    document.getElementById("patientName").value = "";
    document.getElementById("patientPhone").value = "";
    document.getElementById("patientEmail").value = "";
    document.getElementById("patientNotes").value = "";

    alert("Paciente creado correctamente");

  } catch (error) {
    console.error("Error creando paciente:", error);
    alert("No se pudo crear el paciente");
  }
}

async function loadPatientsForSelect() {
  try {

    const response = await fetch(`${API_URL}/patients`);
    const patients = await response.json();

    patientsCache = patients;

    const select = document.getElementById("appointmentPatient");

    select.innerHTML = `<option value="">Seleccionar paciente</option>`;

    patients.forEach((patient) => {
      select.innerHTML += `<option value="${patient.id}">${patient.name}</option>`;
    });

  } catch (error) {

    console.error("Error cargando pacientes:", error);

  }
}

async function createAppointment() {
  try {
    const patientId = document.getElementById("appointmentPatient").value;
    const date = document.getElementById("appointmentDate").value;
    const time = document.getElementById("appointmentTime").value;
    const notes = document.getElementById("appointmentNotes").value.trim();

    if (!patientId || !date || !time) {
      alert("Paciente, fecha y hora son obligatorios");
      return;
    }

    const response = await fetch(`${API_URL}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        patientId: Number(patientId),
        date,
        time,
        status: "pendiente",
        notes
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "No se pudo crear el turno");
    }

    document.getElementById("appointmentPatient").value = "";
    document.getElementById("appointmentDate").value = "";
    document.getElementById("appointmentTime").value = "";
    document.getElementById("appointmentNotes").value = "";

    await loadAppointments();
    await loadUpcomingAppointments();

    alert("Turno creado correctamente");

  } catch (error) {
    console.error("Error creando turno:", error);
    alert(error.message);
  }
}


function showSelectedPatient() {

  const select = document.getElementById("appointmentPatient");
  const patientId = Number(select.value);

  const infoDiv = document.getElementById("selectedPatientInfo");

  const patient = patientsCache.find(p => p.id === patientId);

  if (!patient) {
    infoDiv.innerHTML = "";
    return;
  }

  infoDiv.innerHTML = `
    Tel: ${patient.phone || "-"} | Email: ${patient.email || "-"}
  `;
}


loadAppointments();
loadUpcomingAppointments();
loadPatientsForSelect();