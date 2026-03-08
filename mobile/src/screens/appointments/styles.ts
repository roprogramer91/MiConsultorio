import { StyleSheet } from "react-native";

import { COLORS } from "../../../constants/colors";
import { PATTERNS } from "../../styles/patterns";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 16,
    zIndex: 20,
  },
  searchBox: {
    marginTop: 12,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    minHeight: 60,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },
  filtersRow: {
    gap: 10,
    paddingTop: 12,
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
  suggestionsBox: {
    marginTop: 10,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    overflow: "hidden",
    ...PATTERNS.surfaces.cardSection,
    marginHorizontal: 0,
    marginBottom: 0,
    paddingVertical: 0,
    zIndex: 20,
  },
  suggestionsScroll: {
    maxHeight: 250,
  },
  suggestionItem: {
    minHeight: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  suggestionText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  listScreen: {
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  counterText: {
    color: COLORS.textMuted,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 14,
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 22,
    ...PATTERNS.surfaces.cardSection,
    marginHorizontal: 0,
  },
  emptyText: {
    fontSize: 15,
    color: "#666",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    ...PATTERNS.surfaces.cardSection,
    marginHorizontal: 0,
  },
  dateColumn: {
    width: 84,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    borderRadius: 16,
    marginRight: 14,
    minHeight: 96,
  },
  dateColumnSuccess: {
    backgroundColor: "#e6f3e8",
  },
  dateColumnWarning: {
    backgroundColor: "#fff4db",
  },
  dateColumnDanger: {
    backgroundColor: "#fdeaea",
  },
  timeText: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 6,
  },
  timeTextSuccess: {
    color: "#2f8c3c",
  },
  timeTextWarning: {
    color: "#b98500",
  },
  timeTextDanger: {
    color: "#d32f2f",
  },
  timeTextMuted: {
    color: "#4b4b4b",
  },
  dateText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
    textAlign: "center",
    textTransform: "lowercase",
  },
  dateTextSuccess: {
    color: "#456b4b",
  },
  dateTextWarning: {
    color: "#7f6a2b",
  },
  dateTextDanger: {
    color: "#8e4d4d",
  },
  dateTextMuted: {
    color: "#5b5b5b",
  },
  cardDivider: {
    width: 1,
    backgroundColor: "#e6e6e6",
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  titleBlock: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    marginBottom: 3,
  },
  reasonText: {
    fontSize: 14,
    color: "#757575",
    fontWeight: "500",
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: "800",
  },
  statusBadgeSuccess: {
    backgroundColor: "#e6f3e8",
  },
  statusTextSuccess: {
    color: "#2f8c3c",
  },
  statusBadgeWarning: {
    backgroundColor: "#fff4db",
  },
  statusTextWarning: {
    color: "#b98500",
  },
  statusBadgeDanger: {
    backgroundColor: "#fdeaea",
  },
  statusTextDanger: {
    color: "#d32f2f",
  },
  statusTextMuted: {
    color: "#444444",
  },
  innerDivider: {
    height: 1,
    backgroundColor: "#ececec",
    marginVertical: 12,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionStatus: {
    fontSize: 15,
    fontWeight: "700",
    color: "#d2a106",
  },
  actionEdit: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },
  iconOnlyAction: {
    padding: 4,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});
