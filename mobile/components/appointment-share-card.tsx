import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../constants/colors";

type AppointmentShareCardProps = {
  patientName: string;
  dateLabel: string;
  timeLabel: string;
  reasonLabel: string;
  statusLabel: string;
  depositPaid: boolean;
  variant?: "preview" | "export";
};

export function AppointmentShareCard({
  patientName,
  dateLabel,
  timeLabel,
  reasonLabel,
  statusLabel,
  depositPaid,
  variant = "export",
}: AppointmentShareCardProps) {
  const isPreview = variant === "preview";

  return (
    <View style={[styles.canvas, isPreview ? styles.canvasPreview : null]}>
      <View style={[styles.hero, isPreview ? styles.heroPreview : null]}>
        <View style={[styles.brandRow, isPreview ? styles.brandRowPreview : null]}>
          <View style={[styles.markWrap, isPreview ? styles.markWrapPreview : null]}>
            <View style={[styles.markVertical, isPreview ? styles.markVerticalPreview : null]} />
            <View style={[styles.markHorizontal, isPreview ? styles.markHorizontalPreview : null]} />
          </View>

          <View>
            <Text style={[styles.brand, isPreview ? styles.brandPreview : null]}>Dra. Noguera</Text>
            <Text style={[styles.subtitle, isPreview ? styles.subtitlePreview : null]}>Turno confirmado</Text>
          </View>
        </View>

        <View style={[styles.badgesRow, isPreview ? styles.badgesRowPreview : null]}>
          <View style={[styles.badge, styles.statusBadge, isPreview ? styles.badgePreview : null]}>
            <Text style={[styles.statusBadgeText, isPreview ? styles.badgeTextPreview : null]}>{statusLabel}</Text>
          </View>

          <View style={[styles.badge, depositPaid ? styles.depositPaidBadge : styles.depositPendingBadge, isPreview ? styles.badgePreview : null]}>
            <Text style={[styles.depositBadgeText, isPreview ? styles.badgeTextPreview : null]}>{depositPaid ? "Seña paga" : "Sin seña"}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.sheet, isPreview ? styles.sheetPreview : null]}>
        <View style={[styles.timeCard, isPreview ? styles.cardPreview : null]}>
          <Text style={[styles.timeLabel, isPreview ? styles.infoLabelPreview : null]}>Horario</Text>
          <Text style={[styles.timeValue, isPreview ? styles.timeValuePreview : null]}>{timeLabel}</Text>
          <Text style={[styles.dateValue, isPreview ? styles.dateValuePreview : null]}>{dateLabel}</Text>
        </View>

        <View style={[styles.infoCard, isPreview ? styles.cardPreview : null]}>
          <View style={[styles.infoBlock, isPreview ? styles.infoBlockPreview : null]}>
            <Text style={[styles.infoLabel, isPreview ? styles.infoLabelPreview : null]}>Paciente</Text>
            <Text style={[styles.infoValue, isPreview ? styles.infoValuePreview : null]}>{patientName}</Text>
          </View>

          <View style={[styles.divider, isPreview ? styles.dividerPreview : null]} />

          <View style={[styles.infoBlock, isPreview ? styles.infoBlockPreview : null]}>
            <Text style={[styles.infoLabel, isPreview ? styles.infoLabelPreview : null]}>Motivo</Text>
            <Text style={[styles.reasonValue, isPreview ? styles.reasonValuePreview : null]} numberOfLines={isPreview ? 2 : undefined}>
              {reasonLabel}
            </Text>
          </View>
        </View>

        <View style={[styles.footerCard, isPreview ? styles.footerCardPreview : null]}>
          <Text style={[styles.footerTitle, isPreview ? styles.footerTitlePreview : null]}>Recordatorio</Text>
          <Text style={[styles.footerText, isPreview ? styles.footerTextPreview : null]}>
            Si necesitás reprogramar, comunicate por WhatsApp.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    width: 920,
    backgroundColor: "#f5f1ec",
    paddingBottom: 56,
  },
  canvasPreview: {
    width: "100%",
    paddingBottom: 0,
  },
  hero: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 56,
    paddingTop: 56,
    paddingBottom: 40,
  },
  heroPreview: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginBottom: 32,
  },
  brandRowPreview: {
    gap: 12,
    marginBottom: 16,
  },
  markWrap: {
    width: 78,
    height: 78,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  markWrapPreview: {
    width: 44,
    height: 44,
    borderRadius: 14,
  },
  markVertical: {
    position: "absolute",
    width: 20,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  markVerticalPreview: {
    width: 12,
    height: 26,
    borderRadius: 4,
  },
  markHorizontal: {
    width: 48,
    height: 20,
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  markHorizontalPreview: {
    width: 26,
    height: 12,
    borderRadius: 4,
  },
  brand: {
    color: "#ffffff",
    fontSize: 48,
    fontWeight: "800",
    marginBottom: 6,
  },
  brandPreview: {
    fontSize: 22,
    marginBottom: 2,
  },
  subtitle: {
    color: "#ffd8df",
    fontSize: 24,
    fontWeight: "600",
  },
  subtitlePreview: {
    fontSize: 12,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  badgesRowPreview: {
    gap: 8,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 13,
  },
  badgePreview: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusBadge: {
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  statusBadgeText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
  },
  depositPaidBadge: {
    backgroundColor: "#2f8c3c",
  },
  depositPendingBadge: {
    backgroundColor: COLORS.primaryDark,
  },
  depositBadgeText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
  },
  badgeTextPreview: {
    fontSize: 11,
  },
  sheet: {
    paddingHorizontal: 40,
    paddingTop: 34,
    gap: 18,
  },
  sheetPreview: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },
  timeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    padding: 30,
  },
  cardPreview: {
    borderRadius: 18,
    padding: 16,
  },
  timeLabel: {
    color: COLORS.textMuted,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  infoLabelPreview: {
    fontSize: 11,
    marginBottom: 0,
  },
  timeValue: {
    color: COLORS.primary,
    fontSize: 76,
    fontWeight: "800",
    marginBottom: 10,
  },
  timeValuePreview: {
    fontSize: 28,
    marginBottom: 4,
  },
  dateValue: {
    color: "#5f5550",
    fontSize: 32,
    fontWeight: "600",
  },
  dateValuePreview: {
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    padding: 30,
  },
  infoBlockPreview: {
    gap: 6,
  },
  infoBlock: {
    gap: 10,
  },
  infoLabel: {
    color: COLORS.textMuted,
    fontSize: 22,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  infoValue: {
    color: "#181310",
    fontSize: 50,
    fontWeight: "800",
  },
  infoValuePreview: {
    fontSize: 18,
  },
  reasonValue: {
    color: "#514843",
    fontSize: 38,
    lineHeight: 48,
    fontWeight: "600",
  },
  reasonValuePreview: {
    fontSize: 16,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "#ece4dd",
    marginVertical: 24,
  },
  dividerPreview: {
    marginVertical: 12,
  },
  footerCard: {
    backgroundColor: "#fff6f8",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#f3d4dc",
  },
  footerCardPreview: {
    borderRadius: 18,
    padding: 16,
  },
  footerTitle: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  footerTitlePreview: {
    fontSize: 14,
    marginBottom: 6,
  },
  footerText: {
    color: "#6b6059",
    fontSize: 26,
    lineHeight: 36,
    fontWeight: "500",
  },
  footerTextPreview: {
    fontSize: 13,
    lineHeight: 18,
  },
});
