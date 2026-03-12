import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";

type ShareAppointmentCardParams = {
  target: object;
  patientName: string;
};

export async function shareAppointmentCard({ target, patientName }: ShareAppointmentCardParams) {
  const isAvailable = await Sharing.isAvailableAsync();

  if (!isAvailable) {
    throw new Error("El dispositivo no permite compartir contenido desde la app.");
  }

  const uri = await captureRef(target, {
    format: "png",
    quality: 1,
    result: "tmpfile",
  });

  await Sharing.shareAsync(uri, {
    mimeType: "image/png",
    dialogTitle: `Compartir turno de ${patientName}`,
  });
}
