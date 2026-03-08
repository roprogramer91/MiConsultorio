import { StyleSheet } from "react-native";

import { COLORS } from "../../../constants/colors";
import { PATTERNS } from "../../styles/patterns";

export const PRIMARY = COLORS.primary;
const BG = COLORS.background;
const CARD = COLORS.white;
const MUTED = "#8f8f8f";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY,
  },
  content: {
    paddingBottom: 30,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  hero: {
    backgroundColor: PRIMARY,
    paddingTop: 8,
    paddingHorizontal: 0,
    paddingBottom: 16,
  },
  topBar: {
    paddingHorizontal: 22,
    marginBottom: 12,
  },
  headerDivider: {
    height: 1,
    backgroundColor: "rgba(154, 0, 32, 0.55)",
    marginBottom: 20,
  },
  avatar: {
    width: 98,
    height: 98,
    borderRadius: 49,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor: "rgba(255,255,255,0.18)",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  name: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 18,
    flexWrap: "wrap",
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 30,
    paddingVertical: 7,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  badgeLabel: {
    color: "#ffd6dc",
    fontSize: 13,
    fontWeight: "700",
  },
  badgeValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 22,
  },
  actionButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.28)",
    backgroundColor: "rgba(255,255,255,0.12)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  sheet: {
    backgroundColor: BG,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    padding: 20,
    minHeight: 700,
    marginTop: 8,
  },
  card: {
    backgroundColor: CARD,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    ...PATTERNS.surfaces.cardSection,
    marginHorizontal: 0,
  },
  sectionTitle: {
    color: MUTED,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 14,
  },
  infoTextBox: {
    flex: 1,
  },
  infoLabel: {
    color: "#b0b0b0",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  infoValue: {
    color: "#111",
    fontSize: 17,
    fontWeight: "500",
  },
  noteBox: {
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY,
    backgroundColor: "#f7f7f7",
    borderRadius: 16,
    padding: 16,
  },
  noteText: {
    fontSize: 16,
    color: "#333",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  historyCount: {
    color: "#c0c0c0",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyHistoryText: {
    color: "#777",
    fontSize: 16,
  },
  historyItem: {
    marginBottom: 16,
  },
  historyTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    gap: 12,
  },
  historyMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  historyDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#2e9e44",
  },
  historyMetaText: {
    fontSize: 13,
    color: "#8c8c8c",
    fontWeight: "500",
  },
  historyContent: {
    paddingLeft: 20,
  },
  historyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
  },
  statusBadge: {
    backgroundColor: "#dff0df",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  statusBadgeWarning: {
    backgroundColor: "#fff4db",
  },
  statusBadgeDanger: {
    backgroundColor: "#fdeaea",
  },
  statusBadgeMuted: {
    backgroundColor: "#ececec",
  },
  statusText: {
    color: "#3b8d3e",
    fontWeight: "700",
    fontSize: 15,
  },
  statusTextWarning: {
    color: "#b98500",
  },
  statusTextDanger: {
    color: "#d32f2f",
  },
  statusTextMuted: {
    color: "#444444",
  },
  historyDivider: {
    height: 1,
    backgroundColor: "#ececec",
    marginTop: 16,
  },
});
