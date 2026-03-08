import { StyleSheet } from "react-native";

import { COLORS } from "../../../constants/colors";
import { PATTERNS } from "../../styles/patterns";

export const styles = StyleSheet.create({
  keyboardContainer: PATTERNS.screen.keyboardContainer,
  container: PATTERNS.screen.container,
  content: PATTERNS.screen.content,
  header: PATTERNS.screen.header,
  form: PATTERNS.form.form,
  introCard: PATTERNS.surfaces.introCard,
  introLabel: {
    fontSize: 12,
    color: "#9d6a75",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  introName: {
    fontSize: 20,
    color: "#221b17",
    fontWeight: "800",
    marginBottom: 4,
  },
  introText: {
    fontSize: 14,
    color: "#7d6d70",
  },
  dirtyBanner: PATTERNS.surfaces.dirtyBanner,
  dirtyBannerText: {
    flex: 1,
    fontSize: 13,
    color: "#946c20",
    fontWeight: "600",
  },
  input: PATTERNS.fields.input,
  inputChanged: PATTERNS.fields.inputChanged,
  inputText: {
    fontSize: 17,
    color: "#222",
  },
  placeholderText: PATTERNS.text.placeholderText,
  textarea: PATTERNS.fields.textarea,
  emailHelperBox: PATTERNS.fields.helperBox,
  emailHelperText: PATTERNS.text.helperText,
  domainChipsRow: PATTERNS.fields.chipRow,
  domainChip: PATTERNS.fields.softChip,
  domainChipText: PATTERNS.fields.softChipText,
  footerButtons: PATTERNS.form.footerButtons,
  cancelButton: PATTERNS.buttons.secondary,
  cancelButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#666",
  },
  saveButton: PATTERNS.buttons.primary,
  saveButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
  dangerZone: {
    marginTop: 28,
    marginBottom: 8,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#e7d9dc",
  },
  dangerZoneTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#9c6670",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  dangerZoneText: {
    fontSize: 13,
    color: "#8c7c80",
    lineHeight: 18,
    marginBottom: 14,
  },
  deleteButton: PATTERNS.buttons.danger,
  deleteButtonText: PATTERNS.buttons.dangerText,
});
