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
  content: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  header: {
    backgroundColor: PRIMARY,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 22,
    marginBottom: 24,
    zIndex: 20,
  },
  sectionMainTitle: {
    color: MUTED,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
    marginHorizontal: 20,
    marginBottom: 18,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 18,
  },
  cardSection: PATTERNS.surfaces.cardSection,
  sectionOverlay: {
    zIndex: 30,
  },
  row: PATTERNS.form.row,
  half: PATTERNS.form.half,
  sectionNoMarginBottom: PATTERNS.form.sectionNoMarginBottom,
  label: PATTERNS.text.label,
  required: PATTERNS.text.required,
  patientBox: {
    minHeight: 100,
    backgroundColor: CARD,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#d9d9d9",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  patientSearchTriggerBox: {
    minHeight: 62,
    backgroundColor: CARD,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  patientSearchTriggerInput: {
    flex: 1,
    fontSize: 16,
    color: TEXT,
  },
  patientBoxLocked: {
    borderColor: PRIMARY,
  },
  loadingText: {
    fontSize: 16,
    color: MUTED,
  },
  placeholderText: {
    fontSize: 16,
    color: MUTED,
  },
  patientDropdown: PATTERNS.fields.dropdown,
  newPatientOption: {
    minHeight: 54,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff7f8",
  },
  newPatientOptionText: {
    fontSize: 15,
    fontWeight: "700",
    color: PRIMARY,
  },
  patientDropdownScroll: PATTERNS.fields.dropdownScroll,
  patientOption: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  patientOptionName: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 4,
  },
  patientOptionMeta: {
    fontSize: 14,
    color: "#777",
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 17,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 4,
  },
  patientDni: {
    fontSize: 14,
    color: "#777",
  },
  input: PATTERNS.fields.input,
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
  switchRow: {
    minHeight: 72,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e7dfd9",
    backgroundColor: "#fffaf8",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  switchInfo: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: "#7c726b",
  },
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
  shareCardHidden: {
    position: "absolute",
    left: -9999,
    top: 0,
  },
  confirmationOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  confirmationSheet: {
    maxHeight: "92%",
    backgroundColor: BG,
    borderRadius: 28,
    padding: 18,
  },
  confirmationTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 8,
  },
  confirmationText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6d625b",
    marginBottom: 16,
  },
  previewWrap: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#eadfd8",
    minHeight: 0,
  },
  confirmationPrimaryButton: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  confirmationPrimaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },
  confirmationSecondaryButton: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: "#f4f1ee",
    borderWidth: 1,
    borderColor: "#dcd3cc",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmationSecondaryButtonText: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "700",
  },
});
