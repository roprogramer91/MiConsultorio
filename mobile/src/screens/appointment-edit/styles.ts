import { StyleSheet } from "react-native";

import { COLORS } from "../../../constants/colors";
import { PATTERNS } from "../../styles/patterns";

export const PRIMARY = COLORS.primary;
const BG = COLORS.background;
const CARD = COLORS.white;
const TEXT = "#222";
const MUTED = "#8f8f8f";

export const styles = StyleSheet.create({
  keyboardContainer: PATTERNS.screen.keyboardContainer,
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  content: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  topInfoRow: {
    marginHorizontal: 20,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  referenceText: {
    flex: 1,
    fontSize: 13,
    color: "#7d7d7d",
    fontWeight: "600",
  },
  header: {
    backgroundColor: PRIMARY,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 22,
    marginBottom: 24,
  },
  dirtyBanner: {
    ...PATTERNS.surfaces.dirtyBanner,
    marginHorizontal: 20,
  },
  dirtyBannerText: {
    flex: 1,
    fontSize: 13,
    color: "#946c20",
    fontWeight: "600",
  },
  cardSection: PATTERNS.surfaces.cardSection,
  section: PATTERNS.form.section,
  row: PATTERNS.form.row,
  half: PATTERNS.form.half,
  sectionNoMarginBottom: PATTERNS.form.sectionNoMarginBottom,
  label: PATTERNS.text.label,
  statusChip: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statusChipWarning: {
    backgroundColor: "#fff4db",
  },
  statusChipTextWarning: {
    color: "#b98500",
  },
  statusChipSuccess: {
    backgroundColor: "#e6f3e8",
  },
  statusChipTextSuccess: {
    color: "#2f8c3c",
  },
  statusChipDanger: {
    backgroundColor: "#fdeaea",
  },
  statusChipTextDanger: {
    color: "#d32f2f",
  },
  statusChipMuted: {
    backgroundColor: "#ececec",
  },
  statusChipTextMuted: {
    color: "#444444",
  },
  statusChipText: {
    fontSize: 13,
    fontWeight: "800",
  },
  required: PATTERNS.text.required,
  patientBoxLocked: {
    minHeight: 62,
    backgroundColor: "#f9fafc",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 4,
  },
  patientDni: {
    fontSize: 14,
    color: "#777",
  },
  lockedHint: {
    fontSize: 12,
    color: "#8a8a8a",
    marginTop: 10,
  },
  input: PATTERNS.fields.input,
  inputChanged: PATTERNS.fields.inputChanged,
  inputText: PATTERNS.text.inputText,
  dateInputContent: {
    justifyContent: "center",
  },
  textarea: {
    minHeight: 120,
    paddingTop: 18,
    textAlignVertical: "top",
  },
  hoursDropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    maxHeight: 220,
    overflow: "hidden",
    zIndex: 20,
  },
  hoursDropdownScroll: {
    maxHeight: 220,
  },
  hourItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  hourText: {
    fontSize: 15,
    color: "#333",
  },
  reasonChipsRow: {
    ...PATTERNS.fields.chipRow,
    marginTop: 10,
  },
  reasonChip: PATTERNS.fields.softChip,
  reasonChipText: PATTERNS.fields.softChipText,
  footerButtons: {
    flexDirection: "row",
    gap: 14,
    marginTop: 10,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  cancelButton: PATTERNS.buttons.secondary,
  cancelButtonText: PATTERNS.buttons.secondaryText,
  saveButton: PATTERNS.buttons.primary,
  saveButtonText: PATTERNS.buttons.primaryText,
  deleteSection: {
    marginHorizontal: 20,
    marginBottom: 12,
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
  },
  deleteButtonText: {
    color: "#d83030",
    fontSize: 15,
    fontWeight: "800",
  },
});
