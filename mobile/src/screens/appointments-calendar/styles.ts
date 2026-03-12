import { StyleSheet } from "react-native";

import { COLORS } from "../../../constants/colors";
import { PATTERNS } from "../../styles/patterns";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  weekControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    gap: 10,
  },
  navButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  weekTitleWrap: {
    flex: 1,
  },
  weekEyebrow: {
    color: "#ffd6dc",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
    textAlign: "center",
  },
  weekTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  todayButton: {
    minWidth: 62,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  todayButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  filtersRow: {
    gap: 10,
    paddingTop: 14,
    paddingBottom: 2,
  },
  filterChip: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  filterChipActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.white,
  },
  filterChipText: {
    color: "#ffe3e8",
    fontSize: 13,
    fontWeight: "800",
  },
  filterChipTextActive: {
    color: COLORS.primary,
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
  dayCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    ...PATTERNS.surfaces.cardSection,
    marginHorizontal: 0,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 12,
  },
  dayTitle: {
    color: "#1d1815",
    fontSize: 19,
    fontWeight: "800",
    textTransform: "capitalize",
  },
  daySubtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
  dayCountBadge: {
    borderRadius: 12,
    backgroundColor: "#f4ebe6",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  dayCountText: {
    color: "#7f736b",
    fontSize: 12,
    fontWeight: "800",
  },
  appointmentItem: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#eee5de",
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#fffdfa",
  },
  appointmentTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },
  appointmentTime: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  appointmentPatient: {
    color: "#171310",
    fontSize: 17,
    fontWeight: "800",
  },
  appointmentReason: {
    color: "#756a63",
    fontSize: 14,
    lineHeight: 20,
  },
  badgesColumn: {
    alignItems: "flex-end",
    gap: 8,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  badgeProgramado: {
    backgroundColor: "#fff4db",
  },
  badgeProgramadoText: {
    color: "#b98500",
  },
  badgePendienteCierre: {
    backgroundColor: "#fdeaea",
  },
  badgePendienteCierreText: {
    color: "#d32f2f",
  },
  badgeAtendido: {
    backgroundColor: "#e6f3e8",
  },
  badgeAtendidoText: {
    color: "#2f8c3c",
  },
  badgeAusente: {
    backgroundColor: "#fdeaea",
  },
  badgeAusenteText: {
    color: "#d32f2f",
  },
  badgeCancelado: {
    backgroundColor: "#ececec",
  },
  badgeCanceladoText: {
    color: "#444444",
  },
  badgeDepositPaid: {
    backgroundColor: "#2f8c3c",
  },
  badgeDepositPending: {
    backgroundColor: COLORS.primary,
  },
  badgeDepositText: {
    color: "#ffffff",
  },
  emptyDay: {
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#eadfd8",
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  emptyDayText: {
    color: "#8b8078",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textMuted,
    fontSize: 15,
  },
});
