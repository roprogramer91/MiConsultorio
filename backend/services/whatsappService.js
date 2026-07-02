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

// Envía un WhatsApp de texto a Adri
export async function notifyDoctor(message) {
  const doctorPhone = process.env.ADRI_WHATSAPP_NUMBER;
  if (!doctorPhone) return;

  const digits = doctorPhone.replace(/\D/g, "");

  return getClient().messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to: `whatsapp:+${digits}`,
    body: message,
  });
}
