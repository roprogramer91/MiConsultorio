import twilio from "twilio";

let _client = null;

function getClient() {
  if (!_client) {
    _client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
  return _client;
}

function toWhatsApp(phone) {
  const digits = phone.replace(/\D/g, "");
  return `whatsapp:+${digits}`;
}

function fromEnv(varName) {
  const val = process.env[varName] || "";
  if (val.startsWith("whatsapp:")) return val;
  return toWhatsApp(val);
}

// Envía un WhatsApp de texto a Adri
export async function notifyDoctor(message) {
  const doctorPhone = process.env.ADRI_WHATSAPP_NUMBER;
  if (!doctorPhone) return;

  return getClient().messages.create({
    from: fromEnv("TWILIO_WHATSAPP_NUMBER"),
    to: toWhatsApp(doctorPhone),
    body: message,
  });
}
