import { StyleSheet } from "react-native";

import { COLORS } from "../../../constants/colors";
import { PATTERNS } from "../../styles/patterns";

export const styles = StyleSheet.create({
  container: PATTERNS.screen.container,
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  editFab: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  patientCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    ...PATTERNS.surfaces.cardSection,
    marginHorizontal: 0,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  patientAvatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#222",
    marginBottom: 4,
  },
  patientDni: {
    fontSize: 13,
    color: "#7d7d7d",
    marginBottom: 6,
  },
  patientLink: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "700",
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    ...PATTERNS.surfaces.cardSection,
    marginHorizontal: 0,
  },
  summaryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  summaryDate: {
    flex: 1,
    fontSize: 14,
    color: "#6f6f6f",
  },
  summaryTime: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 14,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#ececec",
    marginBottom: 14,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#9a9a9a",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  summaryReason: {
    fontSize: 16,
    color: "#222",
  },
  statusChip: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusChipInfo: {
    backgroundColor: "#fff4db",
  },
  statusChipTextInfo: {
    color: "#b98500",
    fontSize: 14,
    fontWeight: "800",
  },
  statusChipSuccess: {
    backgroundColor: "#e6f3e8",
  },
  statusChipTextSuccess: {
    color: "#2f8c3c",
    fontSize: 14,
    fontWeight: "800",
  },
  statusChipWarning: {
    backgroundColor: "#fff4db",
  },
  statusChipTextWarning: {
    color: "#c98b00",
    fontSize: 14,
    fontWeight: "800",
  },
  statusChipDanger: {
    backgroundColor: "#fdeaea",
  },
  statusChipTextDanger: {
    color: "#d32f2f",
    fontSize: 14,
    fontWeight: "800",
  },
  statusChipTextMuted: {
    color: "#444444",
    fontSize: 14,
    fontWeight: "800",
  },
  statusSectionHeader: {
    marginBottom: 12,
  },
  statusSectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statusGrid: {
    flexDirection: "row",
    gap: 10,
  },
  statusActionCard: {
    flex: 1,
    minHeight: 90,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderStyle: "dashed",
    backgroundColor: "#fff",
  },
  statusActionCardActive: {
    backgroundColor: "#fafafa",
  },
  statusActionCardInfo: {
    borderColor: "#2f7ed8",
  },
  statusActionCardSuccess: {
    borderColor: "#2f8c3c",
  },
  statusActionCardWarning: {
    borderColor: "#f28a0c",
  },
  statusActionCardDanger: {
    borderColor: "#d32f2f",
  },
  statusActionText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  statusActionTextInfo: {
    color: "#2f7ed8",
  },
  statusActionTextSuccess: {
    color: "#2f8c3c",
  },
  statusActionTextWarning: {
    color: "#f28a0c",
  },
  statusActionTextDanger: {
    color: "#d32f2f",
  },
  statusActionTextMuted: {
    color: "#444444",
  },
  deleteButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: "#fff7f7",
    borderWidth: 1,
    borderColor: "#f0c9c9",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
    marginBottom: 8,
  },
  deleteButtonText: {
    color: "#d83030",
    fontSize: 15,
    fontWeight: "800",
  },
});
